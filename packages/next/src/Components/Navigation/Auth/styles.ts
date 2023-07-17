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
    color: PRIMARY_BLUE,
    fontSize: '1rem',
    '@media (min-width:800px)': {
      fontSize: '1.1em',
    },
    cursor: 'default',
  },
};
