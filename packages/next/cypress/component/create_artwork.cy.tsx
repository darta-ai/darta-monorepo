/// <reference types="cypress" />

import {Artwork} from '@darta-types';
import React from 'react';

import {newArtworkShell} from '../../src/common/templates';
import {
  createArtworkDimensionsToolTip,
  createArtworkToolTips,
} from '../../src/common/ToolTips/toolTips';
import {CreateArtwork} from '../../src/Components/Artwork/CreateArtwork';

describe('EditProfileGallery.cy.tsx', () => {
  beforeEach(() => {
    cy.mount(
      <CreateArtwork
        newArtwork={newArtworkShell as Artwork}
        cancelAction={cy.stub().as('cancelAction') as any}
        handleSave={cy.stub().as('saveArtwork') as any}
        handleDelete={cy.stub().as('handleDelete') as any}
        croppingModalOpen={false}
        setCroppingModalOpen={cy.stub().as('setCroppingModalOpen')}
        saveSpinner={false}
        deleteSpinner={false}
      />,
    );
    cy.viewport('macbook-11');
  });

  it('should render properly', () => {
    // artworkTitle

    cy.get('[data-testid=artworkTitle-tooltip-button]').click();
    cy.get('[data-testid=artworkTitle-tooltip-text]').contains(
      createArtworkToolTips.artworkTitle,
    );
    cy.get('body').type('{esc}');
    cy.get('[data-testid=artworkTitle-input-adornment-string]').contains(
      'Title',
    );

    // artistName
    cy.get('[data-testid=artistName-input-adornment-string]').contains(
      'Artist',
    );
    cy.get('[data-testid=artistName-tooltip-button]').click();
    cy.get('[data-testid=artistName-tooltip-text]').contains(
      createArtworkToolTips.artistName,
    );
    cy.get('body').type('{esc}');

    // artworkDescription
    cy.get('[data-testid=artworkDescription-input-adornment-string]').contains(
      'Info',
    );
    cy.get('[data-testid=artworkDescription-tooltip-button]').click();
    cy.get('[data-testid=artworkDescription-tooltip-text]').contains(
      createArtworkToolTips.artworkDescription,
    );
    cy.get('body').type('{esc}');

    // artworkMedium
    cy.get('[data-testid=artworkMedium-input-adornment-string]').contains(
      'Medium',
    );
    cy.get('[data-testid=artworkMedium-tooltip-button]').click();
    cy.get('[data-testid=artworkMedium-tooltip-text]').contains(
      createArtworkToolTips.artworkMedium,
    );
    cy.get('body').type('{esc}');

    // artworkCreatedYear
    cy.get('[data-testid=artworkCreatedYear-input-adornment-string]').contains(
      'Year Created',
    );
    cy.get('[data-testid=artworkCreatedYear-tooltip-button]').click();
    cy.get('[data-testid=artworkCreatedYear-tooltip-text]').contains(
      createArtworkToolTips.artworkCreatedYear,
    );
    cy.get('body').type('{esc}');

    // artworkPrice
    cy.get('[data-testid=artworkPrice-input-adornment-string]').contains(
      'Price',
    );
    cy.get('[data-testid=artworkPrice-tooltip-button]').click();
    cy.get('[data-testid=artworkPrice-tooltip-text]').contains(
      createArtworkToolTips.artworkPrice,
    );
    cy.get('[data-testid=artworkPrice-privacy-switch]').click();
    cy.get('[data-testid=artworkPrice-privacy-display]').contains('Private');
    cy.get('body').type('{esc}');

    // canInquire
    cy.get('[data-testid=canInquire-input-adornment-string]').contains(
      'Can Inquire',
    );
    cy.get('[data-testid=canInquire-tooltip-button]').click();
    cy.get('[data-testid=canInquire-tooltip-text]').contains(
      createArtworkToolTips.canInquire,
    );
    cy.get('body').type('{esc}');

    cy.get('[data-testid=artwork-dimensions-heading]').contains('in');

    // artworkDimensionsHeightIn
    cy.get(
      '[data-testid=artworkDimensions-heightIn-input-adornment-string]',
    ).contains('height');
    cy.get(
      '[data-testid=artworkDimensions-heightIn-text-input-adornment]',
    ).contains('in');
    cy.get('[data-testid=artworkDimensions-heightIn-tooltip-button]').click();
    cy.get('[data-testid=artworkDimensions-heightIn-tooltip-text]').contains(
      createArtworkDimensionsToolTip['artworkDimensions.heightIn'],
    );
    cy.get('body').type('{esc}');

    // artworkDimensionsWidthIn
    cy.get(
      '[data-testid=artworkDimensions-widthIn-input-adornment-string]',
    ).contains('width');
    cy.get(
      '[data-testid=artworkDimensions-widthIn-text-input-adornment]',
    ).contains('in');
    cy.get('[data-testid=artworkDimensions-widthIn-tooltip-button]').click();
    cy.get('[data-testid=artworkDimensions-widthIn-tooltip-text]').contains(
      createArtworkDimensionsToolTip['artworkDimensions.widthIn'],
    );
    cy.get('body').type('{esc}');

    // artworkDimensionsDepthIn
    cy.get(
      '[data-testid=artworkDimensions-depthIn-input-adornment-string]',
    ).contains('depth');
    cy.get(
      '[data-testid=artworkDimensions-depthIn-text-input-adornment]',
    ).contains('in');
    cy.get('[data-testid=artworkDimensions-depthIn-tooltip-button]').click();
    cy.get('[data-testid=artworkDimensions-depthIn-tooltip-text]').contains(
      createArtworkDimensionsToolTip['artworkDimensions.depthIn'],
    );
    cy.get('body').type('{esc}');
  });

  it('Handles common errors', () => {
    // When
    cy.get('[data-testid=save-artwork-button]').click();

    // artwork title
    cy.get('[data-testid=artworkTitle-text-error-field]').contains(
      'An artwork title is required.',
    );
    cy.get('[data-testid=artworkTitle-input-field]').type('Artwork title');
    cy.get('[data-testid=artworkTitle-text-error-field]').should('not.exist');

    // artist name
    cy.get('[data-testid=artistName-text-error-field]').contains(
      'An artist name is required.',
    );
    cy.get('[data-testid=artistName-input-field]').type('Artist name');
    cy.get('[data-testid=artistName-text-error-field]').should('not.exist');

    // artwork medium
    cy.get('[data-testid=artworkMedium-text-error-field]').contains(
      'The medium of the artwork is required.',
    );
    cy.get('[data-testid=artworkMedium-input-field]').type('Artwork medium');
    cy.get('[data-testid=artworkMedium-text-error-field]').should('not.exist');

    // artwork create year
    cy.get('[data-testid=artworkCreatedYear-text-error-field]').contains(
      'Must be a valid year.',
    );
    cy.get('[data-testid=artworkCreatedYear-input-field]').type('1994');
    cy.get('[data-testid=artworkCreatedYear-text-error-field]').should(
      'not.exist',
    );

    // canInquire
    cy.get('[data-testid=canInquire-text-error-field]').contains(
      'Do you want users to be able to inquire about the art?',
    );
    cy.get('[data-testid=canInquire-input-Yes]').click();
    cy.get('[data-testid=artworkCreatedYear-text-error-field]').should(
      'not.exist',
    );

    // dimensions
    cy.get('[data-testid=dimensions-text-error-field]').contains(
      'Artwork height must be a positive number and is required.',
    );
    cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type('cats');
    cy.get('[data-testid=dimensions-text-error-field]').contains(
      'Artwork height must be a positive number and is required.',
    );
    cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type(
      '{backspace}{backspace}{backspace}{backspace} 14',
    );
    cy.get('[data-testid=save-artwork-button]').click();
    cy.get('[data-testid=dimensions-text-error-field]').contains(
      'Artwork width must be a positive number and is required.',
    );
    cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type('cats');
    cy.get('[data-testid=dimensions-text-error-field]').contains(
      'Artwork width must be a positive number and is required.',
    );
    cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type(
      '{backspace}{backspace}{backspace}{backspace} 22',
    );
    cy.get('[data-testid=save-artwork-button]').click();
    cy.get('[data-testid=artworkCreatedYear-text-error-field]').should(
      'not.exist',
    );

    cy.get('[data-testid=artwork-image-error]').contains(
      'An artwork image is required.',
    );
    cy.get('[data-testid=imageDropZone]').selectFile(
      'public/static/images/dartahouse.png',
      {
        force: true,
      },
    );
    cy.get('[data-testid=save-artwork-button]').click();
    cy.get('[data-testid=artwork-image-error]').should('not.exist');
  });

  it('Will calculate inches to centimeters and vice versa', () => {
    // dimensions
    cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type('10');
    cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type('1');

    // switch to CM's
    cy.get('[data-testid=measurement-change]').click();

    // Switches to displaying CM's
    cy.get('[data-testid=artwork-dimensions-heading]').contains('cm');
    cy.get(
      '[data-testid=artworkDimensions-heightCm-text-input-adornment]',
    ).contains('cm');
    cy.get(
      '[data-testid=artworkDimensions-widthCm-text-input-adornment]',
    ).contains('cm');
    cy.get(
      '[data-testid=artworkDimensions-depthCm-text-input-adornment]',
    ).contains('cm');
  });
});
