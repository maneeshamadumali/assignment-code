describe('SauceDemo Login Tests', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('#login_button_container').should('be.visible');
  });
afterEach(function () {
    if (this.currentTest.state === 'failed') {
      const bugReport = {
        title: `Automated Bug: ${this.currentTest.title}`,
        description: this.currentTest.err.message,
        stepsToReproduce: `Run the test "${this.currentTest.fullTitle()}" in Cypress`,
        expected: 'Expected behavior according to test case',
        actual: 'Actual behavior captured by Cypress',
        severity: 'Medium',
        timestamp: new Date().toISOString()
      };

      // Save the bug report using a Node task
      cy.task('saveBugReport', { report: bugReport });
      cy.log(`⚠️ Bug report saved: ${bugReport.title}`);
    }
  });


  it('Valid login with correct credentials', () => {
    cy.get('#user-name').should('be.visible').type('standard_user');
    cy.get('#password').should('be.visible').type('secret_sauce');
    cy.get('#login-button').click();

    cy.url().should('include', '/inventory.html');
    cy.get('.inventory_list').should('be.visible');
  });

  it('Invalid login with wrong password', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('wrong_pass');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username and password do not match');
  });

  it('Login with empty fields', () => {
    cy.get('#login-button').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username is required');
  });

  it('Login with empty password', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#login-button').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Password is required');
  });
});
