/// <reference types="cypress" />

import React from 'react';

import {EditProfileGallery} from '../../src/Components/Profile/EditProfileGallery';

describe('EditProfileGallery.cy.tsx', () => {
  beforeEach(() => {
    cy.mount(
      <EditProfileGallery
        isEditingProfile={false}
        setIsEditingProfile={cy.stub().as('setIsEditingProfile')}
        setGalleryProfileData={cy.stub().as('setGalleryProfileData')}
        galleryProfileData={{galleryName: {value: 'Test Gallery'}}}
      />,
    );
  });

  it('should render properly', () => {
    // Search
    cy.get('[data-testid=gallerySearch-tooltip-button]').click();
    cy.get('[data-testid=gallerySearch-tooltip-text]').contains(
      'Search for your gallery',
    );
    cy.get('body').type('{esc}');
    cy.get('[data-testid=gallerySearch-input-adornment-string]').contains(
      'Search',
    );

    // Gallery Name
    cy.get('[data-testid=galleryName-input-adornment-string]').contains('Name');
    cy.get('[data-testid=galleryName-tooltip-button]').click();
    cy.get('[data-testid=galleryName-tooltip-text]').contains(
      'Your gallery name',
    );
    cy.get('body').type('{esc}');

    // Gallery Bio
    cy.get('[data-testid=galleryBio-input-adornment-string]').contains('Bio');
    cy.get('[data-testid=galleryBio-tooltip-button]').click();
    cy.get('[data-testid=galleryBio-tooltip-text]').contains(
      'A short bio about your gallery',
    );
    cy.get('body').type('{esc}');

    // primaryContact
    cy.get('[data-testid=primaryContact-input-adornment-string]').contains(
      'Email',
    );
    cy.get('[data-testid=primaryContact-tooltip-button]').click();
    cy.get('[data-testid=primaryContact-tooltip-text]').contains(
      'A primary email address lets users reach out directly with questions.',
    );
    cy.get('body').type('{esc}');

    // galleryPhone
    cy.get('[data-testid=galleryPhone-input-adornment-string]').contains(
      'Phone',
    );
    cy.get('[data-testid=galleryPhone-tooltip-button]').click();
    cy.get('[data-testid=galleryPhone-tooltip-text]').contains(
      'A phone number allows users to reach out directly with questions.',
    );
    cy.get('body').type('{esc}');

    // gallery phone toggle private
    cy.get('[data-testid=galleryPhone-privacy-display]').contains('Public');
    cy.get('[data-testid=galleryPhone-privacy-switch]').click();
    cy.get('[data-testid=galleryPhone-privacy-display]').contains('Private');

    // galleryWebsite
    cy.get('[data-testid=galleryWebsite-input-adornment-string]').contains(
      'Website',
    );
    cy.get('[data-testid=galleryWebsite-tooltip-button]').click();
    cy.get('[data-testid=galleryWebsite-tooltip-text]').contains(
      'A website allows users to learn more about your gallery.',
    );
    cy.get('body').type('{esc}');

    // galleryInstagram
    cy.get('[data-testid=galleryInstagram-input-adornment-string]').contains(
      'Instagram',
    );
    cy.get('[data-testid=galleryInstagram-tooltip-button]').click();
    cy.get('[data-testid=galleryInstagram-tooltip-text]').contains(
      'Your instagram handle will be displayed on your profile.',
    );
    cy.get('body').type('{esc}');

    // galleryLocation
    cy.get(
      '[data-testid=galleryLocation0-locationString-input-adornment-string]',
    ).contains('Location');
    cy.get(
      '[data-testid=galleryLocation0-locationString-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=galleryLocation0-locationString-tooltip-text]',
    ).contains('The primary location of your gallery.');
    cy.get('body').type('{esc}');

    // galleryHours
    cy.get(
      '[data-testid=galleryLocation0-businessHours-input-adornment-string]',
    ).contains('Hours');
    cy.get(
      '[data-testid=galleryLocation0-businessHours-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=galleryLocation0-businessHours-tooltip-text]',
    ).contains('The hours of operation for your primary gallery location.');
    cy.get('body').type('{esc}');
  });

  // Assuming there's an Edit button that sets isEditingProfile to true
  it('All fields can be typed into', () => {
    // Gallery Name
    cy.get('[data-testid=galleryName-input-field]').type('Gallery Name');

    // Gallery Bio
    cy.get('[data-testid=galleryBio-input-field]').type('Gallery Bio');

    // primaryContact
    cy.get('[data-testid=primaryContact-input-field]').type('Gallery Contact');

    // galleryPhone
    cy.get('[data-testid=galleryPhone-input-field]').type('Gallery Phone');

    // galleryWebsite
    cy.get('[data-testid=galleryWebsite-input-field]').type('Gallery Website');

    // galleryInstagram
    cy.get('[data-testid=galleryInstagram-input-field]').type(
      'Gallery Instagram',
    );

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
  });
  it('Handles common errors', () => {
    // Gallery Name
    cy.get('[data-testid=galleryName-input-field]').type('Gallery Name');

    // When
    cy.get('[data-testid=save-profile-edit-button]').click();

    // Gallery Bio
    cy.get('[data-testid=galleryBio-text-error-field]').contains(
      'Please include a short bio ',
    );

    // primaryContact
    cy.get('[data-testid=primaryContact-input-field]').type('Gallery Contact');
    cy.get('[data-testid=save-profile-edit-button]').click();
    cy.get('[data-testid=primaryContact-input-field]').contains(
      'A valid email address is required',
    );
    cy.get('[data-testid=primaryContact-input-field]')
      .click()
      .type(
        '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}',
      );
    cy.get('[data-testid=primaryContact-input-field]').type(
      'Gallery@Contact.com',
    );
    cy.get('[data-testid=primaryContact-text-error-field]').should('not.exist');

    // galleryPhone
    cy.get('[data-testid=galleryPhone-input-field]').type('1234564313');
    cy.get('[data-testid=save-profile-edit-button]').click();
    cy.get('[data-testid=galleryPhone-text-error-field]').should('not.exist');
    cy.get('[data-testid=galleryPhone-input-field]').clear();

    cy.get('[data-testid=galleryPhone-input-field]').type('123464313');
    cy.get('[data-testid=galleryPhone-text-error-field]').contains(
      'A valid phone number is required',
    );

    // galleryWebsite
    cy.get('[data-testid=galleryWebsite-input-field]').type(
      'https://www.darta.works',
    );
    cy.get('[data-testid=save-profile-edit-button]').click();
    cy.get('[data-testid=galleryWebsite-text-error-field]').should('not.exist');

    cy.get('[data-testid=galleryWebsite-input-field]').clear();
    cy.get('[data-testid=galleryWebsite-input-field]').type('Gallery Website');
    cy.get('[data-testid=galleryWebsite-input-field]').contains(
      'Invalid URL. Please enter a valid URL (i.e., begins with http://www).',
    );

    // galleryInstagram
    cy.get('[data-testid=galleryInstagram-input-field]').type('@darta.works');
    cy.get('[data-testid=save-profile-edit-button]').click();
    cy.get('[data-testid=galleryInstagram-text-error-field]').should(
      'not.exist',
    );

    cy.get('[data-testid=galleryInstagram-input-field]').clear();
    cy.get('[data-testid=galleryInstagram-input-field]').type(
      'Gallery Instagram',
    );
    cy.get('[data-testid=save-profile-edit-button]').click();

    cy.get('[data-testid=galleryInstagram-input-field]').contains(
      'Please include a valid Instagram handle, such as',
    );
  });
});
