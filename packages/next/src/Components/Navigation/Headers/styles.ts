import {
  PRIMARY_LIGHTBLUE,
} from '../../../../styles';
import {PRIMARY_600, PRIMARY_700, PRIMARY_50, PRIMARY_900} from '@darta-styles'


export const headerStyles = {
  headerBox: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1%',
    backgroundColor: PRIMARY_900,
  },
  '@keyframes fadeInAnimation': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  headerLogo: {
    width: '100px',
    height: '100px',
    margin: 0,
    padding: 0,
  },
  typography: {
    color: PRIMARY_50,
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
  button: {
    backgroundColor: PRIMARY_50,
    color: PRIMARY_900,
    fontSize: '0.8rem',
    '@media (min-width:750px)': {
      fontSize: '1rem',
    },
  },
  imageBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignImages: 'center',
    justifyContent: 'space-around',
    width: '40vw',
    gap: '1vw',
    '@media (min-width:750px)': {
      width: '18vw',
    },
  },
  imageBox: {
    height: '5vh',
  },
  dartaImageBox: {
    height: '5vh',
  },
  dartaHeaderBox: {
    height: '8vh'
  }
};
