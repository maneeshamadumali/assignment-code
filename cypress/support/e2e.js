// cypress/support/e2e.js
/*import fs from 'fs';
import path from 'path';

Cypress.on('fail', (err, runnable) => {
  const bugReport = {
    title: `Automated Bug: ${runnable.title}`,
    description: err.message,
    stepsToReproduce: `Run the test "${runnable.fullTitle()}" in Cypress`,
    expected: 'Expected behavior according to test case',
    actual: 'Actual behavior captured by Cypress',
    severity: 'Medium',
    timestamp: new Date().toISOString()
  };

  // Save to file
  const filePath = path.join('cypress', 'reports', 'ai-bug-reports.json');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Read existing reports to prevent duplicates
  let existingReports = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    if (content.length) {
      existingReports = content
        .split(/\},\s*\n\{/)
        .map((s, i, arr) => {
          if (i === 0) return JSON.parse(s + '}');
          if (i === arr.length - 1) return JSON.parse('{' + s);
          return JSON.parse('{' + s + '}');
        });
    }
  }

  // Only add if not duplicate
  const isDuplicate = existingReports.some(
    r => r.title === bugReport.title && r.description === bugReport.description
  );

  if (!isDuplicate) {
    fs.appendFileSync(filePath, JSON.stringify(bugReport, null, 2) + ',\n');
    console.log('✅ AI-generated bug report saved:', bugReport.title);
  }

  throw err; // still fail the test
});
*/
console.log('✅ e2e.js loaded');