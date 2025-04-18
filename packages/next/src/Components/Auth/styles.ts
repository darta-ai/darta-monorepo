import * as Colors from '@darta-styles'

import {PRIMARY_DARK_GREY} from '../../../styles';

export const authStyles = {
  signInContainer: {
    flex: 3,
    border: '1px solid',
    borderColor: Colors.PRIMARY_400,
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    height: '80vh',
    '@media (min-width:1080px)': {
      height: '100%',
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
    gap: '2vh',
    alignContent: 'center',
  },
  typographyTitle: {
    alignText: 'center',
    alignSelf: 'center',
    color: PRIMARY_DARK_GREY,
    fontSize: '1.5rem',
    '@media (min-width:1080px)': {
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
    '@media (min-width:1080px)': {
      padding: '10vh',
      flexDirection: 'row',
      height: '100vh',
    },
    boarderRadius: '30px',
  },
  introContainer: {
    flex: 4,
    height: '30vh',
    display: "none",
    backgroundColor: Colors.PRIMARY_500,
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    '@media (min-width:1080px)': {
      display: "inline-block",
      borderTopLeftRadius: '30px',
      borderBottomLeftRadius: '30px',
      borderTopRightRadius: '0px',
      height: '100%',
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
    height: '100%',
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
    fontFamily: 'Nunito Sans',
    alignText: 'center',
    color: Colors.PRIMARY_50,
    fontSize: '1.5rem',
    alignSelf: 'center',
    '@media (min-width:1080px)': {
      fontSize: '1.8rem',
    },
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
  },
  typographyTitle: {
    color: Colors.PRIMARY_50,
    fontSize: '1.1rem',
    alignSelf: 'center',
    '@media (min-width:1080px)': {
      fontSize: '1.4rem',
    },
  },
  typography: {
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:1080px)': {
      fontSize: '1.2rem',
    },
  },
  actionArrow: {
    color: Colors.PRIMARY_50,
    height: '100%',
  },
  footerText: {
    color: Colors.PRIMARY_50,
    fontSize: '1rem',
    textAlign: 'center',
    my: 2,
    '@media (min-width:1080px)': {
      fontSize: '1.2rem',
    },
  },
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  displayTextContainer: {
    flexDirection: 'row',
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  icon: {
    color: 'blue',
    transition: 'color 3s',
    'icon.white': {
      color: 'white',
    },
  },
};
