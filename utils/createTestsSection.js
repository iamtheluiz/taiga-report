module.exports = function createTestsSection(tests) {
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

  let sectionContent = `
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
            <span class="percent green">${parseInt(tests.testsuites['_attributes'].tests) - parseInt(tests.testsuites['_attributes'].failures)}</span>
            <span class="choice">Success</span>
          </li>
          <li>
            <span class="percent red">${parseInt(tests.testsuites['_attributes'].failures)}</span>
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
  `;

  return sectionContent;
}