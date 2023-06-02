/// <reference types="cypress" />

export const e2eEmail = 'cypress.test@darta.works'
export const e2ePass = '(cypress.test)'

describe('Gallery Sign In Flow', () => {
    it('should navigate from the home page to gallery sign in and sign in', () => {
      cy.visit('http://localhost:3000/');
  
      cy.get('a[href*="/Authenticate/Galleries"]').click();
  
      cy.url().should('include', '/Authenticate');
  
      cy.get('[data-testid=header]').contains('Welcome back to darta');

      cy.get('[data-testid=signin-email-input]').type(e2eEmail);
      cy.get('[data-testid=signin-password-input]').type(e2ePass);
      cy.get('[data-testid=signin-button]').click();
      cy.url().should('include', '/Home');

      cy.get('[data-testid=header-signout-button]').should('be.visible')
      cy.get('[data-testid=header-signout-button]').click()
      cy.url().should('not.include', '/Authenticate');
    });
  });
  