
describe('SauceDemo Cart Tests with UI + Simulated API', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
  });
   // After each test, capture bug if failed
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

      // Call the Node task
      cy.task('saveBugReport', { report: bugReport });
    }
  });


  it('Add product to cart - UI + simulated API', () => {
    cy.get('#add-to-cart-sauce-labs-bike-light').click();

    // Simulated API
    cy.log('Simulated API: POST /cart triggered for adding item');

    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.cart_item .inventory_item_name').should('contain.text', 'Sauce Labs Bike Light');
  });

  it('Remove product from cart - UI + simulated API', () => {
    cy.get('#add-to-cart-sauce-labs-bike-light').click();
    cy.get('.shopping_cart_link').click();

    cy.get('#remove-sauce-labs-bike-light').click();

    // Simulated API
    cy.log('Simulated API: POST /cart triggered for removing item');

    cy.get('.cart_item').should('have.length', 0);
  });
});
