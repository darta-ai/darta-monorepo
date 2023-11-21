import * as Colors from '@darta-styles'

import {
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
    backgroundColor: Colors.PRIMARY_900,
  },
  '@keyframes fadeInAnimation': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  headerNavigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1%',
    width: '100%',
    height: '100%',
    animation: 'fadeInAnimation ease 1s',
    backgroundColor: Colors.PRIMARY_100,
    animationIterationCount: 1,
    animationFillMode: 'forwards',
    animationDuration: '0.5s',
    '@media (min-width:750px)': {
      width: '100%',
    },
  },
  subNavigatorText:{
    visibility: 'visible',
    '@media (min-width: 750px)': {
      visibility: 'hidden',
      display: 'none',
    },
  },
  headerLogo: {
    width: '100px',
    height: '100px',
    margin: 0,
    padding: 0,
  },
  typography: {
    color: Colors.PRIMARY_50,
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
    backgroundColor: Colors.PRIMARY_50,
    color: Colors.PRIMARY_900,
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
    maxHeight: '5vh',
    maxWidth: '30vw'
  },
  dartaImageBox: {
    height: '5vh',
  },
  dartaHeaderBox: {
    height: '8vh'
  }
};
