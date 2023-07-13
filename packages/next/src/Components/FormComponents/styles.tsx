import {PRIMARY_BLUE, PRIMARY_GREY} from '../../../styles';

export const formStyles = {
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '50%',
    gap: '1vw',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    '@media (min-width: 780px)': {
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '1.5fr 8fr 0.5fr',
    },
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
    '@media (min-width: 780px)': {
      display: 'grid',
      gridTemplateColumns: '1.5fr 8fr 0.5fr',
    },
  },
  toolTipContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    color: PRIMARY_GREY,
    height: '15px',
    '@media (min-width: 800px)': {
      height: '20px',
    },
  },
  formTextField: {
    width: '90%',
    margin: 2,
    fontSize: '2rem',
    alignItems: 'center',
    alignSelf: 'center',
  },
  helpIconTiny: {
    color: PRIMARY_GREY,
    height: '10px',
    '@media (min-width: 800px)': {
      height: '15px',
    },
  },
  makePrivateContainer: {
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    gridTemplateColumns: '1fr 1fr',
  },
  makePrivate: {
    color: PRIMARY_BLUE,
    fontSize: 15,
  },
  toolTip: {
    fontSize: 10,
    textAlign: 'center',
    '@media (min-width: 800px)': {
      fontSize: 15,
    },
  },
  rawToolTip: {
    fontSize: 10,
    textAlign: 'center',
    '@media (min-width: 800px)': {
      fontSize: 15,
    },
  },
  hoursOfOperationContainer: {
    display: 'grid',
    width: '100%',
    '@media (min-width: 800px)': {
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: 'repeat(1, 1fr)',
    },
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
  },
  hoursOfOperationInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    m: 1,
    gap: '1vh',
    alignItems: 'center',
  },
  datePicker: {
    width: '60vw',
    '@media (min-width: 800px)': {
      width: '20vw',
    },
  },
  dropDownTextContainer: {
    width: '100%',
    alignSelf: 'center',
    '@media (min-width: 800px)': {
      width: '100%',
    },
  },
  autocompleteTextContainer: {
    width: '100%',
    my: 2,
    '@media (min-width: 750px)': {
      width: 'auto',
    },
  },
  dropDown: {
    width: '60vw',
    '@media (min-width: 800px)': {
      width: '50vw',
    },
  },
  autoComplete: {
    width: '60vw',
    my: 2,
    '@media (min-width: 800px)': {
      width: 'auto',
    },
  },
  hiddenOnMobile: {
    '@media (max-width: 780px)': {
      display: 'none',
    },
  },
};
