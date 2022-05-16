require('dotenv').config()
const fs = require('fs')
const pdf = require('html-pdf')
const path = require('path')
const { xml2json } = require('xml-js')

const outdir = path.relative(__dirname, process.env.REPORT_OUTPUT)

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir)
}

const style = fs.readFileSync('./assets/styles.css').toString()
const sonar = fs.readFileSync(process.env.REPORT_SONAR_FILE).toString()
const gitLog = fs.readFileSync(process.env.REPORT_GIT_LOG_FILE).toString()
const testsXML = fs.readFileSync(process.env.REPORT_TESTS_FILE, 'utf8')

let gitLogHTML = ''

gitLog.split(/\r?\n/).forEach(line => gitLogHTML += `${line}<br />\n`)

const tests = JSON.parse(xml2json(testsXML, { compact: true, spaces: 2 }))

let testsHTML = ''

tests.testsuites.testsuite.forEach(testsuite => {
  const testcases = Array.isArray(testsuite.testcase) ? testsuite.testcase : Array(testsuite.testcase);

  testsHTML += `
    <div class="suite">
      <table>
        <tbody>
          <tr>
            <td>${parseInt(testsuite['_attributes'].failures) > 0 ? `<div class="status failed">F</div>` : `<div class="status success">S</div>`}</td>
            <td style="padding-left: 8px;">
              <strong style="font-size: 18px;">${testsuite['_attributes'].name}</strong><br />
              <span>${testsuite['_attributes'].tests} Suite Tests</span><br />
              <span>${testsuite['_attributes'].failures} Suite Failures</span>
            </td>
          </tr>
        </tbody>
      </table><br />
      <strong>Test Cases:</strong>
      <ul>`

      testcases.forEach(testcase => testsHTML += `
        <li>${testcase['_attributes'].name}
          ${testcase.failure && testcase.failure._text ? `
            <ul>
              <li>${testcase.failure._text}</li>
            </ul>
          ` : ''}
        </li>
      `)

  testsHTML += `
      </ul>
    </div>
  `
})

// Gerar um HTML
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Build Report - ${process.env.REPORT_APPLICATION}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <style>${style}</style>
</head>
<body>
  <h1>Build Report - ${process.env.REPORT_BUILD_NAME}</h1>
  <header>
    <img src="https://github.com/iamtheluiz/taiga/blob/master/.github/icon.jpg?raw=true" />
    <div class="details">
      <h1>${process.env.REPORT_APPLICATION}</h1>
      <span>${process.env.REPORT_DESCRIPTION}</span>
    </div>
  </header>
  <section>
    <h2>Sonar</h2>
    ${sonar}
  </section>
  
  <section>
    <h2>Tests</h2>
    
    <div class="summary">
      <div class="info">
        <strong>${tests.testsuites['_attributes'].tests}</strong><br />
        <span>Total tests</span>
      </div>
      <div class="info" style="padding-left: 0px;">
        <div style="width: 32px; height: 120px;">
          <div style="background: #6fdb6f; width: 100%; height: ${((parseInt(tests.testsuites['_attributes'].tests) - parseInt(tests.testsuites['_attributes'].failures))/parseInt(tests.testsuites['_attributes'].tests)*100)}%;"></div>
          <div style="background: #F15854; width: 100%; height: ${100 - ((parseInt(tests.testsuites['_attributes'].tests) - parseInt(tests.testsuites['_attributes'].failures))/parseInt(tests.testsuites['_attributes'].tests)*100)}%;"></div>
        </div>
      </div>
      <div class="info" style="padding-left: 0px;">
        <ul class="key">
          <li>
            <span class="percent green">16</span>
            <span class="choice">Success</span>
          </li>
          <li>
            <span class="percent red">3</span>
            <span class="choice">Failed</span>
          </li>
        </ul>
      </div>
      <div class="info">
        <strong>${parseFloat((parseInt(tests.testsuites['_attributes'].tests) - parseInt(tests.testsuites['_attributes'].failures))/parseInt(tests.testsuites['_attributes'].tests)*100).toFixed(2)}%</strong><br />
        <span>Pass percentage</span>
      </div>
      <div class="info">
        <strong>${tests.testsuites['_attributes'].time}s</strong><br />
        <span>Run Duration</span>
      </div>
    </div>
    
    ${testsHTML}
  </section>
  
  <section>
    <h2>GIT Complete Log</h2>
    <div class="codeContent">
      <code>
        ${gitLogHTML}
      </code>
    </div>
  </section>
</body>
</html>
`

fs.writeFileSync(path.join(outdir, './report.html'), html)

const options = {
  type: 'pdf',
  format: 'A4',
  orientation: 'portrait'
}

pdf.create(html, options).toBuffer((err, buffer) => {
  if(err) return res.status(500).json(err)
  
  fs.writeFileSync(path.join(outdir, './report.pdf'), buffer)
})