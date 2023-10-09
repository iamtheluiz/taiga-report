module.exports = function createGitLogSection(gitLog) {
    let gitLogHTML = ''
  
    gitLog.split(/\r?\n/).forEach(line => gitLogHTML += `${line}<br />\n`)
  
    let sectionContent = `
    <section>
      <h2>GIT Complete Log</h2>
      <div class="codeContent">
        <code>
          ${gitLogHTML}
        </code>
      </div>
    </section>
    `;
  
    return sectionContent;
  }