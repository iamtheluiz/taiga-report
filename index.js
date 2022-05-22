#! /usr/bin/env node
require('dotenv').config()
const fs = require('fs')
const pdf = require('html-pdf')
const path = require('path')
const { xml2json } = require('xml-js')

const createSonarSection = require('./utils/createSonarSection')
const createTestsSection = require('./utils/createTestsSection')
const createGitLogSection = require('./utils/createGitLogSection')

const outdir = process.env.REPORT_OUTPUT
const htmlFilePath = path.join(outdir, `report-${process.env.REPORT_BUILD_NAME}.html`)
const pdfFilePath = path.join(outdir, `report-${process.env.REPORT_BUILD_NAME}.pdf`)

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir)
}

const style = fs.readFileSync(path.join(__dirname, 'assets/styles.css')).toString()
const sonar = fs.readFileSync(process.env.REPORT_SONAR_FILE).toString()
const gitLog = fs.readFileSync(process.env.REPORT_GIT_LOG_FILE).toString()
const testsXML = fs.readFileSync(process.env.REPORT_TESTS_FILE, 'utf8')

const tests = JSON.parse(xml2json(testsXML, { compact: true, spaces: 2 }))

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
    <img src="${process.env.REPORT_LOGO}" />
    <div class="details">
      <h1>${process.env.REPORT_APPLICATION}</h1>
      <span>${process.env.REPORT_DESCRIPTION}</span>
    </div>
  </header>
  ${createSonarSection(sonar)}
  ${createTestsSection(tests)}
  ${createGitLogSection(gitLog)}
</body>
</html>
`

try {
  fs.writeFileSync(htmlFilePath, html)

  const options = {
    type: 'pdf',
    format: 'A4',
    orientation: 'portrait'
  }

  pdf.create(html, options).toBuffer((err, buffer) => {
    if(err) return console.log(err)
    
    fs.writeFileSync(pdfFilePath, buffer)
  })
} catch (error) {
  console.log(error)
}