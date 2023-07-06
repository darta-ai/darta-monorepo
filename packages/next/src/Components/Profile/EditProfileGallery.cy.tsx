import React from 'react'
import { EditProfileGallery } from './EditProfileGallery'

describe('<EditProfileGallery />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<EditProfileGallery />)
  })
})