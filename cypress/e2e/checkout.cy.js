
describe('SauceDemo Checkout Tests with UI + Simulated API', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');

    cy.get('#add-to-cart-sauce-labs-bike-light').click();
    cy.get('.shopping_cart_link').click();
    cy.get('#checkout').click();
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

  it('Form validation - missing First Name', () => {
    cy.get('#last-name').type('Doe');
    cy.get('#postal-code').type('12345');
    cy.get('#continue').click();

    cy.get('[data-test="error"]').should('contain.text', 'First Name is required');
  });

  it('Finish purchase successfully - UI + simulated API', () => {
    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.get('#postal-code').type('12345');

    // Simulated API
    cy.log('Simulated API: POST /checkout-step-one payload {firstName, lastName, postalCode}');

    cy.get('#continue').click();

    cy.url().should('include', 'checkout-step-two.html');
    cy.get('.summary_info').should('be.visible');

    cy.get('#finish').click();

    // Simulated API
    cy.log('Simulated API: POST /checkout-complete payload {cartItems, paymentInfo}');

    cy.url().should('include', 'checkout-complete.html');
    cy.get('.complete-header').should('have.text', 'THANK YOU FOR YOUR ORDER!');
  });

  it('Cancel checkout - UI only', () => {
    cy.get('#cancel').click();
    cy.url().should('include', '/cart.html');

    cy.log('Simulated API: Checkout canceled - UI verification only');
  });

  it('Cannot checkout with empty cart', () => {
  cy.log('🔹 Test Start: Cannot checkout with empty cart');

  // Open cart and remove all items
  cy.get('.shopping_cart_link').click();
  cy.get('.cart_item').each(($el) => {
    cy.wrap($el).find('[data-test^="remove"]').click();
  });
  cy.get('.cart_item').should('have.length', 0);
  cy.log('✅ Cart is empty');

  // Verify that checkout button is disabled
  cy.get('#checkout').should('be.disabled');
  cy.log('⚠️ Checkout button is disabled as expected for empty cart');

  // Verify URL stays on cart page
  cy.url().should('eq', 'https://www.saucedemo.com/cart.html');
  cy.log('🔹 Test End: User stays on cart page with empty cart');
});
});
