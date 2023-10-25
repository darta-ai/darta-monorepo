import * as Colors from '@darta-styles'

import {PRIMARY_GREY} from '../../../styles';

export const formStyles = {
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (min-width: 1280px)': {
      display: 'grid',
      gridTemplateColumns: '10vw 10vw 2fr',
    },
  },
  inputTextContainerTwoColumns: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100%',
    gap: '1vw',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (min-width: 1280px)': {
      display: 'grid',
      minHeight: '10vh',
      minWidth: '100%',
      gridTemplateColumns: '10vw 2fr',
    },
  },
  dartaLocationContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50vh',
    justifyContent: 'center',
    alignContent: 'center',
  },
  underHeadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1vw',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    mx: 2,
    justifyContent: 'center',
  },
  dropDownContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gridTemplateColumns: '1fr',
    '@media (min-width: 1280px)': {
      display: 'grid',
      gridTemplateColumns: '1.5fr 8fr 0.5fr',
    },
  },
  toolTipContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '8vw',
  },
  helpIcon: {
    color: PRIMARY_GREY,
    height: '15px',
    '@media (min-width: 800px)': {
      height: '15px',
    },
  },
  formTextField: {
    minWidth: '50vw',
    fontSize: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    '@media (min-width: 1280px)': {
      minWidth: '100%',
    },
  },
  helpIconTiny: {
    color: PRIMARY_GREY,
    height: '10px',
    '@media (min-width: 800px)': {
      height: '15px',
    },
  },
  makePrivateContainerMobile: {
    display: 'none',
    '@media (min-width: 1280px)': {
      display: 'flex',
    },
  },
  makePrivateContainerDesktop: {
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    gridTemplateColumns: '1fr 1fr',
    '@media (min-width: 1280px)': {
      display: 'none',
    },
  },
  makePrivate: {
    color: Colors.PRIMARY_600,
    fontSize: 15,
  },
  toolTip: {
    fontSize: 10,
    textAlign: 'center',
    '@media (min-width: 1080px)': {
      fontSize: 15,
    },
  },
  rawToolTip: {
    fontSize: 10,
    textAlign: 'center',
    '@media (min-width: 1280px)': {
      fontSize: 15,
    },
  },
  hoursOfOperationContainer: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    '@media (min-width: 1280px)': {
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: 'repeat(1, 1fr)',
    },
  },
  hoursOfOperationInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    m: 1,
    gap: '1vh',
    alignItems: 'center',
  },
  datePickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    width: '60vw',
    '@media (min-width: 1280px)': {
      width: '25vw',
    },
  },
  dropDownTextContainer: {
    width: '100%',
    alignSelf: 'center',
    '@media (min-width: 1080px)': {
      width: '100%',
    },
  },
  autocompleteTextContainer: {
    width: '100%',
    my: 2,
    '@media (min-width: 1280px)': {
      width: 'auto',
    },
  },
  dropDown: {
    width: '60vw',
    '@media (min-width: 1280px)': {
      width: '100%'
    },
  },
  autoComplete: {
    width: '60vw',
    my: 2,
    '@media (min-width: 1280px)': {
      width: 'auto',
    },
  },
  hiddenOnMobile: {
    '@media (max-width: 780px)': {
      display: 'none',
    },
  },
  dartaRadioText: {
    fontSize: '0.7rem',
    '& .MuiTypography-root': {
      fontFamily: 'Nunito Sans',
      fontWeight: 'normal',
      fontSize: '1rem',
      '@media (max-width: 780px)': {
        fontSize: '0.8rem',
      },
    },
  },
  inputAdornmentStyle:{
    overflowX: 'clip',
    width: '100%',
    height: '100%',
    '@media (min-width: 1280px)': {
      width: 'auto',
    },
  }
};
