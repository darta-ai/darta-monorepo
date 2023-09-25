/// <reference types="cypress" />

import {Exhibition} from '@darta-types';
import React from 'react';

import {newExhibitionShell} from '../../src/common/templates';
import {exhibitionPressReleaseToolTip} from '../../src/common/ToolTips/toolTips';
import {CreateExhibition} from '../../src/Components/Exhibitions';
import {createExhibitionErrors} from '../../src/Components/Exhibitions/CreateExhibition';

describe('EditProfileGallery.cy.tsx', () => {
  beforeEach(() => {
    cy.mount(
      <CreateExhibition
        newExhibition={newExhibitionShell as Exhibition}
        cancelAction={cy.stub().as('cancelAction')}
        saveExhibition={cy.stub().as('saveExhibition')}
        handleDelete={cy.stub().as('handleDelete')}
        galleryLocations={['51 Mott Street']}
        galleryName="All Street"
        isEditingExhibition={false}
      />,
    );
    cy.viewport('macbook-11');
  });

  it('should render properly', () => {
    // exhibitionTitle

    cy.get('[data-testid=exhibitionTitle-tooltip-button]').click();
    cy.get('[data-testid=exhibitionTitle-tooltip-text]').contains(
      exhibitionPressReleaseToolTip.exhibitionTitle,
    );
    cy.get('body').type('{esc}');
    cy.get('[data-testid=exhibitionTitle-input-adornment-string]').contains(
      'Title',
    );

    // exhibitionPressRelease
    cy.get(
      '[data-testid=exhibitionPressRelease-input-adornment-string]',
    ).contains('Description');
    cy.get('[data-testid=exhibitionPressRelease-tooltip-button]').click();
    cy.get('[data-testid=exhibitionPressRelease-tooltip-text]').contains(
      exhibitionPressReleaseToolTip.exhibitionPressRelease,
    );
    cy.get('body').type('{esc}');

    // privateLocation
    cy.get(
      '[data-testid=exhibitionLocation-isPrivate-input-adornment-string]',
    ).contains('Location Visibility');
    cy.get('[data-testid=exhibitionLocation-isPrivate-tooltip-button]').click();
    cy.get('[data-testid=exhibitionLocation-isPrivate-tooltip-text]').contains(
      exhibitionPressReleaseToolTip['exhibitionLocation.isPrivate'],
    );
    cy.get('body').type('{esc}');

    // exhibitionLocation
    cy.get(
      '[data-testid=exhibitionLocation-locationString-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=exhibitionLocation-locationString-tooltip-text]',
    ).contains(
      'The location of the exhibition will help guide users to your openings.',
    );
    cy.get('body').type('{esc}');

    // isOngoing
    cy.get(
      '[data-testid=exhibitionDates-exhibitionDuration-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=exhibitionDates-exhibitionDuration-tooltip-text]',
    ).contains(
      exhibitionPressReleaseToolTip['exhibitionDates.exhibitionDuration'],
    );
    cy.get('body').type('{esc}');

    // exhibitionStartDate
    cy.get(
      '[data-testid=exhibitionDates-exhibitionStartDate-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=exhibitionDates-exhibitionStartDate-tooltip-text]',
    ).contains(
      exhibitionPressReleaseToolTip['exhibitionDates.exhibitionStartDate'],
    );

    cy.get('body').type('{esc}');

    // exhibitionEndDate
    cy.get(
      '[data-testid=exhibitionDates-exhibitionEndDate-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=exhibitionDates-exhibitionEndDate-tooltip-text]',
    ).contains(
      exhibitionPressReleaseToolTip['exhibitionDates.exhibitionEndDate'],
    );
    cy.get('body').type('{esc}');

    // hasReception
    cy.get(
      '[data-testid=receptionDates-hasReception-input-adornment-string]',
    ).contains('Has Reception?');
    cy.get('[data-testid=receptionDates-hasReception-tooltip-button]').click();
    cy.get('[data-testid=receptionDates-hasReception-tooltip-text]').contains(
      exhibitionPressReleaseToolTip['receptionDates.hasReception'],
    );
    cy.get('body').type('{esc}');

    // receptionStartTime
    cy.get(
      '[data-testid=receptionDates-receptionStartTime-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=receptionDates-receptionStartTime-tooltip-text]',
    ).contains(
      exhibitionPressReleaseToolTip['receptionDates.receptionStartTime'],
    );
    cy.get('body').type('{esc}');

    // receptionEndTime
    cy.get(
      '[data-testid=receptionDates-receptionEndTime-tooltip-button]',
    ).click();
    cy.get(
      '[data-testid=receptionDates-receptionEndTime-tooltip-text]',
    ).contains(
      exhibitionPressReleaseToolTip['receptionDates.receptionEndTime'],
    );
    cy.get('body').type('{esc}');

    // buttons
    cy.get('[data-testid=delete-exhibition-button]').should('exist');
    cy.get('[data-testid=save-exhibition-button]').should('exist');
    cy.get('[data-testid=create-exhibition-cancel-button]').should('exist');

    cy.get('[data-testid=create-exhibition-image-back-button]').should('exist');
    cy.get('body').contains('Back');
    cy.get('[data-testid=create-exhibition-image-back-button]').click();
    cy.get('body').contains('Edit Image');
  });

  it.skip('Handles common errors', () => {
    // When
    cy.get('[data-testid=save-exhibition-button]').click();

    // exhibitionTitle
    cy.get('[data-testid=exhibitionTitle-text-error-field]').contains(
      createExhibitionErrors.exhibitionTitle,
    );
    cy.get('[data-testid=exhibitionTitle-input-field]').type(
      'Exhibition title',
    );
    cy.get('[data-testid=exhibitionTitle-text-error-field]').should(
      'not.exist',
    );

    // exhibitionPressRelease
    cy.get('[data-testid=exhibitionPressRelease-text-error-field]').contains(
      createExhibitionErrors.exhibitionPressRelease,
    );
    cy.get('[data-testid=exhibitionPressRelease-input-field]').type(
      'Exhibition Press Release',
    );
    cy.get('[data-testid=exhibitionPressRelease-text-error-field]').should(
      'not.exist',
    );

    // exhibitionLocation
    cy.get(
      '[data-testid=exhibitionLocation-locationString-text-error-field]',
    ).contains(createExhibitionErrors.exhibitionLocationString);
    cy.get(
      '[data-testid=exhibitionLocation-locationString-select-field]',
    ).click();
    cy.get('body').type('{enter}');
    cy.get('[data-testid=save-exhibition-button]').click();

    /// / HEREEEE

    // canInquire
    cy.get('[data-testid=exhibitionDates-text-error-field]').contains(
      createExhibitionErrors.exhibitionStartDate,
    );
  });
});
