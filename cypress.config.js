import fs from 'fs';
import path from 'path';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      on('task', {
        saveBugReport({ report }) {
          const filePath = path.join('cypress', 'reports', 'ai-bug-reports.json');

          // Ensure folder exists
          if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
          }

          // Load existing reports
          let existingReports = [];
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            try {
              existingReports = JSON.parse(data);
            } catch (err) {
              console.log('Error parsing JSON:', err);
            }
          }

          // Filter duplicates by title only (or title+description if you prefer)
          const isDuplicate = existingReports.some(r => r.title === report.title);

          if (!isDuplicate) {
            existingReports.push(report);
            fs.writeFileSync(filePath, JSON.stringify(existingReports, null, 2), 'utf-8');
            console.log('✅ Bug report saved:', report.title);
          } else {
            console.log('⚠️ Duplicate bug ignored:', report.title);
          }

          return null;
        }
      });
    }
  }
});
