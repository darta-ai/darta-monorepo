/// <reference types="cypress" />

describe('Gallery Sign Up Flow', () => {
  it('should navigate from the home page to the sign up flow', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid=header-link-gallery]').click();

    cy.url().should('include', '/Galleries/Home');

    cy.get('[data-testid=header-navigation-createAccount-button]').click();
    cy.url().should('include', '/CreateAccount/Galleries');

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
