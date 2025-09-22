
describe('SauceDemo Products Tests with UI + Simulated API', () => {
  beforeEach(() => {
    // Login first
    cy.visit('https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    // Verify inventory page
    cy.url().should('include', '/inventory.html');
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


  it('Verify all products are listed', () => {
    // UI: Inventory items count
    cy.get('.inventory_item').should('have.length.greaterThan', 0);

    // UI: Check first product details
    cy.get('.inventory_item').first().within(() => {
      cy.get('.inventory_item_name').should('be.visible');
      cy.get('.inventory_item_desc').should('be.visible');
      cy.get('.inventory_item_price').should('be.visible');
      cy.get('.btn_inventory').should('be.visible').and('contain.text', 'Add to cart');
    });
  });

  it('Add a product to cart - UI + simulated API', () => {
    // Simulate API call for adding product
    cy.log('Simulated API: POST /cart triggered for adding first product');

    cy.get('#add-to-cart-sauce-labs-backpack').click();

    // UI verification: Cart badge updates
    cy.get('.shopping_cart_badge').should('contain.text', '1');

    // UI verification: Product added in cart page
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.cart_item .inventory_item_name').should('contain.text', 'Sauce Labs Backpack');
  });

  it('Remove a product from cart - UI + simulated API', () => {
    // Add product first
    cy.get('#add-to-cart-sauce-labs-backpack').click();
    cy.get('.shopping_cart_link').click();

    // Simulate API call for removing product
    cy.log('Simulated API: POST /cart triggered for removing product');

    cy.get('#remove-sauce-labs-backpack').click();

    // UI verification: Cart should be empty
    cy.get('.cart_item').should('have.length', 0);
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('Verify product details page - UI', () => {
    cy.get('.inventory_item').first().within(() => {
      cy.get('.inventory_item_name').click();
    });

    // UI verification on product details page
    cy.get('.inventory_details_name').should('be.visible');
    cy.get('.inventory_details_price').should('be.visible');
    cy.get('.inventory_details_desc').should('be.visible');
    cy.get('.btn_inventory').should('be.visible').and('contain.text', 'Add to cart');

    // Go back to inventory page
    cy.get('.inventory_details_back_button').click();
    cy.url().should('include', '/inventory.html');
  });
});

