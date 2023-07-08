/// <reference types="cypress" />

export const e2eEmail = 'cypress.test@darta.works';
export const e2ePass = '(cypress.test)';

describe('Gallery Sign In Flow', () => {
  it('should navigate from the home page to gallery sign in and sign in', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid=header-link-gallery]').click();

    cy.url().should('include', '/Galleries/Home');

    cy.get('[data-testid=header-navigation-signIn-button]').click();

    cy.url().should('include', '/Authenticate');

    cy.get('[data-testid=header]').contains('Welcome back to darta');

    cy.get('[data-testid=signin-email-input]').type(e2eEmail);
    cy.get('[data-testid=signin-password-input]').type(e2ePass);
    cy.get('[data-testid=signin-button]').click();
    cy.url().should('include', '/Galleries/LoadProfile');
    cy.url().should('not.include', '/Authenticate');
  });
  it('should navigate be able to navigate to between Profile, Collections, Artwork, Home', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid=header-link-gallery]').click();

    cy.url().should('include', '/Galleries/Home');
    cy.get('[data-testid=header-navigation-signIn-button]').click();

    cy.get('[data-testid=header]').contains('Welcome back to darta');

    cy.get('[data-testid=signin-email-input]').type(e2eEmail);
    cy.get('[data-testid=signin-password-input]').type(e2ePass);
    cy.get('[data-testid=signin-button]').click();

    cy.url().should('include', '/Galleries/LoadProfile');
    cy.url().should('not.include', '/Authenticate');

    cy.get('[data-testid=loading-profile-text]').contains('Loading Profile');

    cy.wait(1500);
    cy.get('[data-testid=gallery-navigation-exhibitions-button]', {
      timeout: 4000,
    }).click();
    cy.url().should('include', '/Exhibitions');

    cy.get('[data-testid=gallery-navigation-profile-button]').click();
    cy.url().should('include', '/Profile');

    cy.get('[data-testid=gallery-navigation-artwork-button]').click();
    cy.url().should('include', '/Artwork');
  });
});
