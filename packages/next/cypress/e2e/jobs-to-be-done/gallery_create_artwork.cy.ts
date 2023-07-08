/// <reference types="cypress" />

const artworkData = {
  artworkName: 'Madonna',
  artistName: 'Andy Warhol',
  artworkDescription: 'Artwork description',
  artworkMedium: 'heyyy gobba gool',
  artworkCreatedYear: '2023',
  artworkPrice: '2000',
  artworkHeightIn: '50',
  artworkWidthIn: '25',
  artworkDepthIn: '2',
};

describe('Gallery Create Profile', () => {
  it('Should be able to add and remove artwork', () => {
    // GIVEN (setup)
    cy.login();
    cy.get('[data-testid=gallery-navigation-artwork-button]', {
      timeout: 2000,
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
  it('Edited artwork should populate a card', () => {
    // GIVEN (setup)
    cy.login();
    cy.get('[data-testid=gallery-navigation-artwork-button]', {
      timeout: 2000,
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
    cy.get('[data-testid=artwork-card-edit-button]').click();
    cy.get('[data-testid=cropping-matters-modal]').should('exist');
    cy.get('[data-testid=dismiss-cropping-matters-modal]').click();

    // USER INPUTS
    cy.get('[data-testid=artworkTitle-input-field]').type(
      artworkData.artworkName,
    );
    cy.get('[data-testid=artistName-input-field]').type(artworkData.artistName);
    cy.get('[data-testid=artworkDescription-input-field]').type(
      artworkData.artworkDescription,
    );
    cy.get('[data-testid=artworkMedium-input-field]').type(
      artworkData.artworkMedium,
    );
    cy.get('[data-testid=artworkCreatedYear-input-field]').type(
      artworkData.artworkCreatedYear,
    );
    cy.get('[data-testid=artworkPrice-input-field]').type(
      artworkData.artworkPrice,
    );
    cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type(
      artworkData.artworkHeightIn,
    );
    cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type(
      artworkData.artworkWidthIn,
    );
    cy.get('[data-testid=artworkDimensions-depthIn-input-field]').type(
      artworkData.artworkDepthIn,
    );
    cy.get('[data-testid=imageDropZone]').selectFile(
      'public/static/images/dartahouse.png',
      {
        force: true,
      },
    );
    cy.get('[data-testid=canInquire-input-Yes]').click();

    // WHEN
    cy.get('[data-testid=save-artwork-button]').click();

    // THEN
    cy.get('[data-testid=artwork-card-artist-name]').contains(
      artworkData.artistName,
    );
    cy.get('[data-testid=artwork-card-artwork-title]').contains(
      artworkData.artworkName,
    );
    cy.get('[data-testid=artwork-card-medium]').contains(
      artworkData.artworkMedium,
    );
    cy.get('[data-testid=artwork-card-price]').contains(
      Number(artworkData.artworkPrice).toLocaleString(),
    );
    cy.get('[data-testid=artwork-card-can-inquire]').contains('Yes');
  });
});
