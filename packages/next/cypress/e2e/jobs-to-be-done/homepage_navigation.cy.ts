/// <reference types="cypress" />

describe('Homepage navigation', () => {
  it('should navigate from the Home page to the Contact page', () => {
    // Start from the index page
    cy.visit('http://localhost:1169');

    // Find a link with an href attribute containing "about" and click it

    cy.get('[data-testid=about-link]').click();

    cy.url().should('include', '/About');

    cy.get('[data-testid=headline]').should('be.visible');
    cy.get('[data-testid=values-list]').should('be.visible');
    cy.get('[data-testid=beliefs-box]').should('be.visible');
    cy.get('[data-testid=who-we-are-box]').should('be.visible');
    cy.get('[data-testid=dartaHouseBlue]').click();
    cy.url().should('not.include', '/About');
  });
  it('should navigate from the Home page to the About page', () => {
    // Start from the index page
    cy.visit('http://localhost:1169');

    cy.get('[data-testid=contact-link]').click();
    cy.url().should('include', '/Contact');

    cy.get('[data-testid=contact-title]').should('be.visible');
    cy.get('[data-testid=contact-links-container]').should('be.visible');
    cy.get('[data-testid=contact-element-support]').should('be.visible');
    cy.get('[data-testid=contact-element-support]').contains('support');
    cy.get('[data-testid=contact-element-collaborate]').contains('collaborate');
    cy.get('[data-testid=contact-element-press]').contains('press');

    cy.get('[data-testid=dartaHouseBlue]').click();
    cy.url().should('not.include', '/Contact');
  });
  it('should navigate from the Home page to the Gallery Sign In page', () => {
    // Start from the index page
    cy.visit('http://localhost:1169');

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="/Darta/Contact"]').click();
    cy.url().should('include', '/Contact');

    cy.get('[data-testid=contact-title]').should('be.visible');
    cy.get('[data-testid=contact-links-container]').should('be.visible');
    cy.get('[data-testid=contact-element-support]').should('be.visible');
    cy.get('[data-testid=contact-element-support]').contains('support');
    cy.get('[data-testid=contact-element-collaborate]').contains('collaborate');
    cy.get('[data-testid=contact-element-press]').contains('press');

    cy.get('[data-testid=dartaHouseBlue]').click();
    cy.url().should('not.include', '/Contact');
  });
});
