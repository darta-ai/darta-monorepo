import {PRIMARY_BLUE, PRIMARY_DARK_GREY, PRIMARY_MILK} from '.';

export const galleryStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '2vh',
    minHeight: '100vh',
    minWidth: '70vw',
    alignSelf: 'center',
    '@media (minWidth: 800px)': {
      paddingTop: '7vh',
    },
  },
  uploadImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '5%',
    alignItems: 'center',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width:800px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (minWidth: 800px)': {
      fontSize: '1.3rem',
    },
    cursor: 'default',
  },
  button: {
    color: PRIMARY_BLUE,
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createNewButton: {
    backgroundColor: PRIMARY_BLUE,
    color: PRIMARY_MILK,
    width: '50%',
    alignSelf: 'center',
  },
  formTextField: {
    width: '100%',
  },
};
