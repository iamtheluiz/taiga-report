module.exports = function createSonarSection(sonar) {
    let sectionContent = `
    <section>
      <h2>Sonar</h2>
      ${sonar}
    </section>
    `;
  
    return sectionContent;
}