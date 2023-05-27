import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../../styles';

export const styles = {
  container: {
    height: 'auto',
    marginBottom: '15%',
    width: '95%',
    '@media (min-width:600px)': {
      width: '80%',
      height: '45vh',
    },
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5%',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3,
    minWidth: '60%',
  },
  imageContainer: {
    minWidth: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    '@media (min-width:600px)': {
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
    '@media (min-width:600px)': {
      height: '100%',
      minWidth: '20%',
    },
  },
  videoStyle: {
    width: `90%`,
    height: 'unset',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    '@media (min-width:600px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:600px)': {
      fontSize: '1.2rem',
    },
    cursor: 'default',
  },
};
