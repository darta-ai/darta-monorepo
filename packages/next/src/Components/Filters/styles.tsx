import {PRIMARY_300,PRIMARY_600} from '@darta-styles'

export const filterStyles = {
  inputTextContainer: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '1.5fr 8fr 0.5fr',
  },
  toolTipContainer: {
    display: 'grid',
    placeItems: 'center',
    gridTemplateColumns: '0.5fr 0.5fr',
  },
  helpIcon: {
    color: PRIMARY_300,
    height: '15px',
    '@media (min-width: 800px)': {
      height: '20px',
    },
  },
  formTextField: {
    width: '100%',
    margin: 2,
    fontSize: '2rem',
    border: '1px solid #E0E0E0',
  },
  helpIconTiny: {
    color: PRIMARY_300,
    height: '0px',
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
    color: PRIMARY_600,
    fontSize: 15,
  },
  toolTip: {
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
};
