import {PRIMARY_600} from '@darta-styles'


export const styles = {
  footerBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: '5vh',
  },
  typography: {
    color: PRIMARY_600,
    fontSize: '1rem',
    '@media (min-width:800px)': {
      fontSize: '1.1em',
    },
    cursor: 'default',
  },
};
