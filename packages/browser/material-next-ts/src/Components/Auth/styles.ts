import {PRIMARY_MILK, PRIMARY_DARK_GREY, PRIMARY_BLUE} from '../../../styles';

export const authStyles = {
  signInContainer: {
    flex: 3,
    border: '1px solid',
    borderColor: PRIMARY_BLUE,
    height: '100%',
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    '@media (min-width:800px)': {
      borderTopRightRadius: '30px',
      borderBottomRightRadius: '30px',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
  },
  signInFieldContainer: {
    margin: '10px',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: '3vh',
    alignContent: 'center',
    '@media (min-width:800px)': {
      gap: '2vh',
    },
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    alignText: 'center',
    color: PRIMARY_MILK,
    fontSize: '1.5rem',
    '@media (min-width:800px)': {
      fontSize: '1.5rem',
    },
  },
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  warningText: {
    alignSelf: 'left',
    fontSize: 12,
    color: 'red',
  },
  warningTextLarge: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
  },
};

export const welcomeStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '180vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:800px)': {
      padding: '10vh',
      flexDirection: 'row',
      height: '100vh',
    },
    boarderRadius: '30px',
  },
  introContainer: {
    flex: 4,
    height: '100%',
    backgroundColor: PRIMARY_BLUE,
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    '@media (min-width:800px)': {
      borderTopLeftRadius: '30px',
      borderBottomLeftRadius: '30px',
      borderTopRightRadius: '0px',
    },
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
    bottomBorder: '1px solid white',
  },
  textContainer: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: '5%',
  },
  welcomeBackContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
  },
  header: {
    fontFamily: 'EB Garamond',
    alignText: 'center',
    color: PRIMARY_MILK,
    fontSize: '2rem',
    alignSelf: 'center',
    '@media (min-width:800px)': {
      fontSize: '2rem',
    },
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    alignText: 'center',
    color: PRIMARY_MILK,
    fontSize: '1.5rem',
    '@media (min-width:800px)': {
      fontSize: '1.5rem',
    },
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:800px)': {
      fontSize: '1.2rem',
    },
  },
  actionArrow: {
    transform: 'scale(1.5)',
    color: PRIMARY_MILK,
  },
  footerText: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_MILK,
    fontSize: '1rem',
    '@media (min-width:800px)': {
      fontSize: '1.2rem',
    },
  },
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  checkBoxes: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    gap: '2%',
  },
  icon: {
    color: 'blue',
    transition: 'color 3s',
    'icon.white': {
      color: 'white',
    },
  },
};
