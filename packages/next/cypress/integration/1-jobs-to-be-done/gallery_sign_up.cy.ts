/* eslint-disable no-undef */
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

    cy.get('[data-testid=galleryNameInput]').should('be.visible');
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
  it('should handle common sign-in errors', () => {
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

    cy.get('[data-testid=emailInput]').type('fakeEmail.gmail.com');
    cy.get('[data-testid=phoneNumberInput]').type('fake phone');
    cy.get('[data-testid=confirmPasswordInput]').type('123456789');
    cy.get('[data-testid=signUpButton]').click();

    cy.get('[data-testid=galleryName-helper-text]').contains(
      'please include a gallery name to speed up the approval process',
    );
    cy.get('[data-testid=emailInput-helper-text]').contains(
      'email must be a valid email',
    );
    cy.get('[data-testid=phoneNumber-helper-text]').contains(
      'please double check your phone number',
    );
    cy.get('[data-testid=password-confirm-helper-text]').contains(
      'passwords must match',
    );
    cy.get('[data-testid=password-helper-text]').contains(
      'password must be at least 8 characters',
    );

    cy.get('[data-testid=emailInput]').clear();
    cy.get('[data-testid=emailInput]').type('fakeEmail@gmail.com');

    cy.get('[data-testid=signUpButton]').click();

    cy.get('[data-testid=emailInput-helper-text]').contains(
      'Using an @gmail account to register an account will require longer to approve. If you have a business email address related to this gallery we recommend you use that.',
    );
  });
});
