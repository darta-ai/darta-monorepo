/// <reference types="cypress" />

export const e2eEmail = 'cypress.test@darta.works';
export const e2ePass = '(cypress.test)';

describe('Gallery Create Profile', () => {
  it('Should be able to add and remove artwork', () => {
    // GIVEN (setup)
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

    cy.get('[data-testid=gallery-navigation-artwork-button]', {
      timeout: 4000,
    }).click();
    cy.url().should('include', '/Galleries/Artwork');
    cy.get('[data-testid=artwork-card]').should('not.exist');

    // WHEN USER CREATES NEW ARTWORK
    cy.get('[data-testid=create-new-artwork-button]').click();

    // THEN
    cy.get('[data-testid=artwork-card]').should('exist');
    cy.get('[data-testid=artwork-card-additional-information-warning]').should(
      'exist',
    );

    // WHEN USER CLICKS EDIT FOR THE FIRST TIME
    cy.get('[data-testid=artwork-card-edit-button]').click();

    // THEN THE CROPPING MATTERS MODAL EXISTS
    cy.get('[data-testid=cropping-matters-modal]').should('exist');
    cy.get('[data-testid=dismiss-cropping-matters-modal]').click();

    // WHEN USER CLICKS DELETE
    cy.get('[data-testid=delete-artwork-button]').click();

    // THEN THE CONFIRM DELETE MODAL POPS UP
    cy.get('[data-testid=confirm-delete-artwork-modal]').should('exist');

    // WHEN THE USER CONFIRMS DELETE
    cy.get('[data-testid=confirm-delete-artwork-button]').click();

    // THEN THE CARD SHOULD NO LONGER EXIST
    cy.get('[data-testid=artwork-card]').should('not.exist');
    cy.get('[data-testid=artwork-card-additional-information-warning]').should(
      'not.exist',
    );
  });
  it.only('Edited artwork should populate a card', () => {
    cy.visit('http://localhost:3000/Galleries/Artwork');

    // WHEN USER CREATES NEW ARTWORK
    cy.get('[data-testid=create-new-artwork-button]').click();

    // THEN
    cy.get('[data-testid=artwork-card]').should('exist');
    cy.get('[data-testid=artwork-card-additional-information-warning]').should(
      'exist',
    );

    // WHEN USER CLICKS EDIT FOR THE FIRST TIME
    cy.get('[data-testid=artwork-card-edit-button]').click();

    // THEN THE CROPPING MATTERS MODAL EXISTS
    cy.get('[data-testid=cropping-matters-modal]').should('exist');
    cy.get('[data-testid=dismiss-cropping-matters-modal]').click();

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

    cy.wait(3500);

    cy.get('[data-testid=gallery-navigation-profile-button]').click();
    cy.url().should('include', '/Profile');
    cy.get('[data-testid=edit-profile-button]').click();

    // Gallery Name
    cy.get('[data-testid=galleryName-input-field]').type('Gallery Name');

    // Gallery Bio
    cy.get('[data-testid=galleryBio-input-field]').type('Gallery Bio');

    // primaryContact
    cy.get('[data-testid=primaryContact-input-field]').type('TJ@darta.works');

    // galleryPhone
    cy.get('[data-testid=galleryPhone-input-field]').type('4156137221');

    // galleryWebsite
    cy.get('[data-testid=galleryWebsite-input-field]').type(
      'https://www.Gallery.Website',
    );

    // galleryInstagram
    cy.get('[data-testid=galleryInstagram-input-field]').type('@darta.works');

    // galleryLocation
    cy.get('[data-testid=galleryLocation0-locationString-input-field]').type(
      'Location',
    );

    // Hours
    cy.get('[data-testid=galleryLocation0-businessHours-Monday-open]').type(
      '1 PM',
    );
    cy.get('[data-testid=galleryLocation0-businessHours-Sunday-close]').type(
      '6 PM',
    );

    // When
    cy.get('[data-testid=save-profile-edit-button]').click();

    // THEN
    // Gallery Name
    cy.get('[data-testid=gallery-name-display]').contains('Gallery Name');

    // Gallery Bio
    cy.get('[data-testid=gallery-bio-display]').contains('Gallery Bio');

    // primaryContact
    cy.get('[data-testid=profile-contact-email]').contains('TJ@darta.works');

    // galleryPhone
    cy.get('[data-testid=profile-contact-phone]').contains('+1 (415) 613 7221');

    // galleryWebsite
    cy.get('[data-testid=profile-contact-website]').contains('Gallery.Website');

    // galleryInstagram
    cy.get('[data-testid=profile-contact-instagram]').contains('@darta.works');

    // Hours
    cy.get('[data-testid=galleryLocation0-hours-monday-open]').contains('1 PM');
    cy.get('[data-testid=galleryLocation0-hours-sunday-close]').contains(
      '6 PM',
    );
  });
});
