import {PRIMARY_BLUE} from '../../../../styles';

export const styles = {
  footerBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: '5vh',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '0.75rem',
    '@media (min-width:800px)': {
      fontSize: '1.2em',
    },
    cursor: 'default',
  },
};
