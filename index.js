#! /usr/bin/env node
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { xml2json } = require('xml-js')
const convertHTMLToPDF = require("pdf-puppeteer");

const { outdir, testsXML, style, sonar, gitLog, htmlFilePath, pdfFilePath } = require('./config')

const createSonarSection = require('./lib/createSonarSection')
const createTestsSection = require('./lib/createTestsSection')
const createGitLogSection = require('./lib/createGitLogSection')

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir)
}

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

const options = {
  format: 'A4',
  printBackground: true
}

convertHTMLToPDF(html, (pdf) => {
  fs.writeFileSync(pdfFilePath, pdf)
}, options);