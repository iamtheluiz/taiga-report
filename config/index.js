const fs = require('fs')
const path = require('path')

const config = {
    outdir: process.env.REPORT_OUTPUT,
    htmlFilePath: path.join(process.env.REPORT_OUTPUT, `report-${process.env.REPORT_BUILD_NAME}.html`),
    pdfFilePath: path.join(process.env.REPORT_OUTPUT, `report-${process.env.REPORT_BUILD_NAME}.pdf`),
    style: fs.readFileSync(path.join(__dirname, '../assets/styles.css')).toString(),
    sonar: fs.readFileSync(process.env.REPORT_SONAR_FILE).toString(),
    gitLog: fs.readFileSync(process.env.REPORT_GIT_LOG_FILE).toString(),
    testsXML: fs.readFileSync(process.env.REPORT_TESTS_FILE, 'utf8')
}

module.exports = config