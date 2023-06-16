import {PRIMARY_BLUE, PRIMARY_GREY} from '../../../styles';

export const formStyles = {
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'row',
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
    width: '50vw',
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
  toolTipContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
