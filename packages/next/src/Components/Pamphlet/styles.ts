import {PRIMARY_600} from '@darta-styles'

import {PRIMARY_DARK_GREY} from '../../../styles';

export const styles = {
  container: {
    height: 'auto',
    marginBottom: '15%',
    width: '95%',
    '@media (min-width:800px)': {
      width: '60vw',
      height: '30vh',
      flexDirection: 'row',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5%',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3,
    minWidth: '60%',
    alignContent: 'center',
    alignItems: 'center',
    '@media (min-width:800px)': {
      alignItems: 'flex-start',
    },
  },
  imageContainer: {
    minWidth: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    '@media (min-width:800px)': {
      height: '200px',
      width: '150px',
    },
  },
  imageSize: {
    minWidth: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: `100%`,
    height: 'unset',
    alignSelf: 'center',
  },
  videoContainer: {
    minWidth: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    '@media (min-width:800px)': {
      height: '100%',
      minWidth: '20%',
    },
  },
  videoStyle: {
    width: `60%`,
    height: 'unset',
  },
  typographyTitle: {
    fontFamily: 'Nunito Sans',
    color: PRIMARY_600,
    my: 2,
    fontSize: '1.8rem',
    alignText: 'center',
    '@media (min-width:800px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    width: '100%',
    '@media (min-width:800px)': {
      fontSize: '1.2rem',
    },
    cursor: 'default',
  },
  pamphletRightTopDisplay: {
    flex: 1,
    width: '60vw',
    display: 'flex',
    '@media (min-width:800px)': {
      display: 'none',
    },
  },
  pamphletRightBottomDisplay: {
    flex: 1,
    width: '60vw',
    display: 'none',
    '@media (min-width:800px)': {
      display: 'flex',
    },
  },
};
