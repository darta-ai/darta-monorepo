import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../../styles';

export const styles = {
  container: {
    height: 'auto',
    marginBottom: '15%',
    width: '95%',
    '@media (min-width:600px)': {
      height: 'auto',
      width: '85%',
    },
    bottomBorderWidth: '1px',
    bottomBorderColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    gap: '5%',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3,
    minWidth: '60%'
  },
  imageSize: {
    minWidth: '100%',
    height: 'auto',
    padding: 0,
    margin: 0,
    display:'flex',
    alignItems: 'center',
  },
  image : {
    width: `100%`,
    height: 'unset',
    alignSelf: 'center',
  },
  videoContainer:{
    height: '150px',
    minWidth: '30%',
    '@media (min-width:600px)': {
      height: '200px',
      width: '150px',
    }
  },
  videoStyle:{
    width: `90%`,
    height: 'unset',
    alignSelf: 'center',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:600px)': {
      fontSize: '1.2rem',
    },
    cursor: 'none',
  },

};