/// <reference types="cypress" />

describe('Gallery Sign Up Flow', () => {
  it('should navigate from the home page to the sign up flow', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="/Authenticate/Galleries"]').click();

    // The new url should include "/about"
    cy.url().should('include', '/Authenticate');
    cy.get('[data-testid=intro-container]').should('be.visible');
    cy.get('[data-testid=text-container]').should('be.visible');
    cy.get('[data-testid=header-container]').should('be.visible');
    cy.get('[data-testid=header]').should('be.visible');

    // The new page should contain an h1 with "About page"
    cy.get('[data-testid=header]').contains('Welcome back to darta');

    cy.get('a[href*="/CreateAccount/Galleries"]').click();
    cy.url().should('include', '/CreateAccount');

    cy.get('[data-testid=intro-container]').should('be.visible');
    cy.get('[data-testid=text-container]').should('be.visible');
    cy.get('[data-testid=header-container]').should('be.visible');
    cy.get('[data-testid=header]').should('be.visible');

    cy.get('[data-testid=header]').contains('Join darta today');

    cy.get('[data-testid=emailInput]').should('be.visible');
    cy.get('[data-testid=phoneNumberInput]').should('be.visible');
    cy.get('[data-testid=passwordInput]').should('be.visible');
    cy.get('[data-testid=passwordToggleButton]').should('be.visible');
    cy.get('[data-testid=confirmPasswordInput]').should('be.visible');
    cy.get('[data-testid=confirmPasswordToggleButton]').should('be.visible');
    cy.get('[data-testid=confirmPasswordInput]').should('be.visible');
    cy.get('[data-testid=websiteInput]').should('be.visible');
    cy.get('[data-testid=signUpButton]').should('be.visible');
    cy.get('[data-testid=alreadyHaveAccount]').should('be.visible');
  });
});
