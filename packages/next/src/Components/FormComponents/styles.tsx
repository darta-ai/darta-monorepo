import {PRIMARY_BLUE, PRIMARY_GREY} from '../../../styles';

export const formStyles = {
  inputTextContainer: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '1.5fr 8fr 0.5fr',
  },
  toolTipContainer: {
    display: 'grid',
    placeItems: 'center',
    gridTemplateColumns: '1fr 1.5fr',
  },
  helpIcon: {
    color: PRIMARY_GREY,
    height: '15px',
    '@media (min-width: 800px)': {
      height: '20px',
    },
  },
  formTextField: {
    width: '100%',
    margin: 2,
    fontSize: '2rem',
  },
  helpIconTiny: {
    color: PRIMARY_GREY,
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
};
