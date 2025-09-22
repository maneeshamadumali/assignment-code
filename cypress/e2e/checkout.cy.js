describe('SauceDemo Checkout Tests with UI + Simulated API', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
  });

  // Capture bug if test fails
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
      cy.task('saveBugReport', { report: bugReport });
    }
  });

  it('Form validation - missing First Name', () => {
    cy.get('#add-to-cart-sauce-labs-bike-light').click();
    cy.get('.shopping_cart_link').click();
    cy.get('#checkout').click();

    cy.get('#last-name').type('Doe');
    cy.get('#postal-code').type('12345');
    cy.get('#continue').click();

    cy.get('[data-test="error"]').should('contain.text', 'First Name is required');
  });

  it('Finish purchase successfully - UI + simulated API', () => {
    cy.get('#add-to-cart-sauce-labs-bike-light').click();
    cy.get('.shopping_cart_link').click();
    cy.get('#checkout').click();

    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.get('#postal-code').type('12345');
    cy.get('#continue').click();

    cy.url().should('include', 'checkout-step-two.html');
    cy.get('.summary_info').should('be.visible');

    cy.get('#finish').click();
    cy.url().should('include', 'checkout-complete.html');
    cy.get('.complete-header').should('have.text', 'THANK YOU FOR YOUR ORDER!');
  });

  it('Cancel checkout - UI only', () => {
    cy.get('#add-to-cart-sauce-labs-bike-light').click();
    cy.get('.shopping_cart_link').click();
    cy.get('#checkout').click();

    cy.get('#cancel').click();
    cy.url().should('include', '/cart.html');
  });

  it('Cannot checkout with empty cart', () => {
    // Do NOT add item for this test
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 0);
    cy.get('#checkout').click();
    cy.url().should('not.include', 'checkout-step-one.html');
  });

});
