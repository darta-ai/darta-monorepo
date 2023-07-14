/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// cypress/support/commands.js

export const e2eEmail = 'cypress.test@darta.works';
export const e2ePass = '(cypress.test)';

Cypress.Commands.add('login' as any, () => {
  cy.visit('http://localhost:1169/');

  cy.get('[data-testid=header-link-gallery]').click();

  cy.url().should('include', '/Galleries/Home');
  cy.get('[data-testid=header-navigation-signIn-button]').click();

  cy.get('[data-testid=header]').contains('Welcome back to darta');

  cy.get('[data-testid=signin-email-input]').type(e2eEmail);
  cy.get('[data-testid=signin-password-input]').type(e2ePass);
  cy.get('[data-testid=signin-button]').click();

  cy.wait(1000);

  cy.url().should('not.include', '/Authenticate');

  cy.get('[data-testid=loading-profile-text]').contains('Loading Profile');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}
