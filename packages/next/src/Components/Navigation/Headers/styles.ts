import {
  PRIMARY_BLUE,
  PRIMARY_MILK,
  PRIMARY_LIGHTBLUE,
} from '../../../../styles';

export const headerStyles = {
  headerBox: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1%',
    backgroundColor: PRIMARY_BLUE,
  },
  headerLogo: {
    width: '100px',
    height: '100px',
    margin: 0,
    padding: 0,
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_MILK,
    fontSize: '1.2rem',
    '@media (min-width:800px)': {
      fontSize: '1.2rem',
    },
    '&:hover': {
      backgroundColor: PRIMARY_LIGHTBLUE,
      opacity: [0.9, 0.9, 0.9],
    },
    cursor: 'default',
  },
  signOutButton: {
    backgroundColor: PRIMARY_MILK,
    color: PRIMARY_BLUE,
    fontSize: '0.8rem',
    '@media (min-width:750px)': {
      fontSize: '1rem',
    },
  },
};
