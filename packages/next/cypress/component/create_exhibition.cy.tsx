// /// <reference types="cypress" />

// import React from 'react';
// import {CreateExhibition} from 'src/Components/Exhibitions';
// import {createExhibitionErrors} from 'src/Components/Exhibitions/CreateExhibition';

// import {Exhibition} from '../../globalTypes';
// import {newExhibitionShell} from '../../src/common/templates';
// import {exhibitionPressReleaseToolTip} from '../../src/common/ToolTips/toolTips';

// describe('EditProfileGallery.cy.tsx', () => {
//   beforeEach(() => {
//     cy.mount(
//       <CreateExhibition
//         newExhibition={newExhibitionShell as Exhibition}
//         cancelAction={cy.stub().as('cancelAction')}
//         saveExhibition={cy.stub().as('saveExhibition')}
//         handleDelete={cy.stub().as('handleDelete')}
//         galleryLocations={['51 Mott Street']}
//       />,
//     );
//     cy.viewport('macbook-11');
//   });

//   it('should render properly', () => {
//     // exhibitionTitle

//     cy.get('[data-testid=exhibitionTitle-tooltip-button]').click();
//     cy.get('[data-testid=exhibitionTitle-tooltip-text]').contains(
//       exhibitionPressReleaseToolTip.exhibitionTitle,
//     );
//     cy.get('body').type('{esc}');
//     cy.get('[data-testid=exhibitionTitle-input-adornment-string]').contains(
//       'Title',
//     );

//     // exhibitionPressRelease
//     cy.get(
//       '[data-testid=exhibitionPressRelease-input-adornment-string]',
//     ).contains('Description');
//     cy.get('[data-testid=exhibitionPressRelease-tooltip-button]').click();
//     cy.get('[data-testid=exhibitionPressRelease-tooltip-text]').contains(
//       exhibitionPressReleaseToolTip.exhibitionPressRelease,
//     );
//     cy.get('body').type('{esc}');

//     // privateLocation
//     cy.get('[data-testid=privateLocation-input-adornment-string]').contains(
//       'Location Visibility',
//     );
//     cy.get('[data-testid=privateLocation-tooltip-button]').click();
//     cy.get('[data-testid=privateLocation-tooltip-text]').contains(
//       // exhibitionPressReleaseToolTip.privateLocation,
//     );
//     cy.get('body').type('{esc}');

//     // exhibitionLocation
//     cy.get(
//       '[data-testid=exhibitionLocation-exhibitionLocationString-tooltip-button]',
//     ).click();
//     cy.get(
//       '[data-testid=exhibitionLocation-exhibitionLocationString-tooltip-text]',
//     ).contains('Required. Please select the location of your opening.');
//     cy.get('body').type('{esc}');

//     // isOngoing
//     cy.get('[data-testid=exhibitionDuration-tooltip-button]').click();
//     cy.get('[data-testid=exhibitionDuration-tooltip-text]').contains(
//       // exhibitionPressReleaseToolTip.exhibitionDuration,
//     );
//     cy.get('body').type('{esc}');

//     // exhibitionStartDate
//     cy.get('[data-testid=exhibitionStartDate-tooltip-button]').click();
//     cy.get('[data-testid=exhibitionStartDate-tooltip-text]').contains(
//       // exhibitionPressReleaseToolTip.exhibitionStartDate,
//     );
//     cy.get('body').type('{esc}');

//     // exhibitionEndDate
//     cy.get('[data-testid=exhibitionEndDate-tooltip-button]').click();
//     cy.get('[data-testid=exhibitionEndDate-tooltip-text]').contains(
//       // exhibitionPressReleaseToolTip.exhibitionEndDate,
//     );
//     cy.get('body').type('{esc}');

//     // hasReception
//     cy.get('[data-testid=hasReception-input-adornment-string]').contains(
//       'Has Reception?',
//     );
//     cy.get('[data-testid=hasReception-tooltip-button]').click();
//     cy.get('[data-testid=hasReception-tooltip-text]').contains(
//       // exhibitionPressReleaseToolTip.hasReception,
//     );
//     cy.get('body').type('{esc}');

//     // receptionStartTime
//     cy.get('[data-testid=receptionStartTime-tooltip-button]').click();
//     cy.get('[data-testid=receptionStartTime-tooltip-text]').contains(
//       // exhibitionPressReleaseToolTip.receptionStartTime,
//     );
//     cy.get('body').type('{esc}');

//     // receptionEndTime
//     cy.get('[data-testid=receptionEndTime-tooltip-button]').click();
//     cy.get('[data-testid=receptionEndTime-tooltip-text]').contains(
//       exhibitionPressReleaseToolTip.receptionEndTime,
//     );
//     cy.get('body').type('{esc}');

//     // buttons
//     cy.get('[data-testid=delete-exhibition-button]').should('exist');
//     cy.get('[data-testid=save-exhibition-button]').should('exist');
//     cy.get('[data-testid=create-exhibition-cancel-button]').should('exist');

//     cy.get('[data-testid=create-exhibition-image-back-button]').should('exist');
//     cy.get('body').contains('Back');
//     cy.get('[data-testid=create-exhibition-image-back-button]').click();
//     cy.get('body').contains('Edit Image');
//   });

//   it.only('Handles common errors', () => {
//     // When
//     cy.get('[data-testid=save-exhibition-button]').click();

//     // exhibitionTitle
//     cy.get('[data-testid=exhibitionTitle-text-error-field]').contains(
//       createExhibitionErrors.exhibitionTitle,
//     );
//     cy.get('[data-testid=exhibitionTitle-input-field]').type(
//       'Exhibition title',
//     );
//     cy.get('[data-testid=exhibitionTitle-text-error-field]').should(
//       'not.exist',
//     );

//     // exhibitionPressRelease
//     cy.get('[data-testid=exhibitionPressRelease-text-error-field]').contains(
//       createExhibitionErrors.exhibitionPressRelease,
//     );
//     cy.get('[data-testid=exhibitionPressRelease-input-field]').type(
//       'Exhibition Press Release',
//     );
//     cy.get('[data-testid=exhibitionPressRelease-text-error-field]').should(
//       'not.exist',
//     );

//     // exhibitionLocation
//     cy.get(
//       '[data-testid=exhibitionLocation-exhibitionLocationString-text-error-field]',
//     ).contains(createExhibitionErrors.exhibitionLocationString);
//     cy.get(
//       '[data-testid=exhibitionLocation-exhibitionLocationString-select-field]',
//     ).click();
//     cy.get('body').type('{enter}');
//     cy.get(
//       '[data-testid=exhibitionLocation-exhibitionLocationString-text-error-field]',
//     ).should('not.exist');

//     // artwork create year
//     cy.get('[data-testid=artworkCreatedYear-text-error-field]').contains(
//       'Must be a valid year.',
//     );
//     cy.get('[data-testid=artworkCreatedYear-input-field]').type('1994');
//     cy.get('[data-testid=artworkCreatedYear-text-error-field]').should(
//       'not.exist',
//     );

//     // canInquire
//     cy.get('[data-testid=canInquire-text-error-field]').contains(
//       'Do you want users to be able to inquire about the art?',
//     );
//     cy.get('[data-testid=canInquire-input-Yes]').click();
//     cy.get('[data-testid=artworkCreatedYear-text-error-field]').should(
//       'not.exist',
//     );

//     // dimensions
//     cy.get('[data-testid=dimensions-text-error-field]').contains(
//       'Artwork height must be a positive number and is required.',
//     );
//     cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type('cats');
//     cy.get('[data-testid=dimensions-text-error-field]').contains(
//       'Artwork height must be a positive number and is required.',
//     );
//     cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type(
//       '{backspace}{backspace}{backspace}{backspace} 14',
//     );
//     cy.get('[data-testid=save-artwork-button]').click();
//     cy.get('[data-testid=dimensions-text-error-field]').contains(
//       'Artwork width must be a positive number and is required.',
//     );
//     cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type('cats');
//     cy.get('[data-testid=dimensions-text-error-field]').contains(
//       'Artwork width must be a positive number and is required.',
//     );
//     cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type(
//       '{backspace}{backspace}{backspace}{backspace} 22',
//     );
//     cy.get('[data-testid=save-artwork-button]').click();
//     cy.get('[data-testid=artworkCreatedYear-text-error-field]').should(
//       'not.exist',
//     );

//     cy.get('[data-testid=artwork-image-error]').contains(
//       'An artwork image is required.',
//     );
//     cy.get('[data-testid=imageDropZone]').selectFile(
//       'public/static/images/dartahouse.png',
//       {
//         force: true,
//       },
//     );
//     cy.get('[data-testid=save-artwork-button]').click();
//     cy.get('[data-testid=artwork-image-error]').should('not.exist');
//   });

//   it('Will calculate inches to centimeters and vice versa', () => {
//     // dimensions
//     cy.get('[data-testid=artworkDimensions-heightIn-input-field]').type('10');
//     cy.get('[data-testid=artworkDimensions-widthIn-input-field]').type('1');

//     // switch to CM's
//     cy.get('[data-testid=measurement-change]').click();

//     // Switches to displaying CM's
//     cy.get('[data-testid=artwork-dimensions-heading]').contains('cm');
//     cy.get(
//       '[data-testid=artworkDimensions-heightCm-text-input-adornment]',
//     ).contains('cm');
//     cy.get(
//       '[data-testid=artworkDimensions-widthCm-text-input-adornment]',
//     ).contains('cm');
//     cy.get(
//       '[data-testid=artworkDimensions-depthCm-text-input-adornment]',
//     ).contains('cm');
//   });
// });
