import {PRIMARY_DARK_GREY, PRIMARY_GREY, PRIMARY_MILK} from '.';
import {PRIMARY_600, PRIMARY_700} from '@darta-styles'

export const galleryStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '2vh',
    minHeight: '100vh',
    minWidth: '100%',
    mt: 3,
    alignSelf: 'center',
  },
  pageNavigationContainer: {
    borderTopLeftRadius: '0px',
    width: '100%',
    minHeight: '90vh',
    borderTop: `0px`,
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '2vw',
    borderLeft: `0px`,
    '@media (min-width: 1080px)': {
      borderTop: `1px solid ${PRIMARY_GREY}`,
    },
  },
  navigationHeader: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-start',
    gap: '2vh',
    '@media (min-width: 1080px)': {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  },
  navigationButtonContainer: {
    display: 'flex',
    width: '100 %',
    flexDirection: 'row',
    gap: '3vw',
    justifyContent: 'space-between',
    '@media (min-width: 1080px)': {
      width: '50%',
    },
  },
  artworkDisplayValues: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    gap: '2vh',
    alignSelf: 'center',
  },
  uploadImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '5%',
    alignItems: 'center',
  },
  typographyTitle: {
    fontFamily: 'Nunito Sans',
    color: PRIMARY_700,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width: 1080px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  artworkHeader: {
    fontFamily: 'Nunito Sans',
    color: PRIMARY_600,
    fontSize: '1.5rem',
    my: '3vh',
    '@media (min-width: 1080px)': {
      fontSize: '2rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'Nunito Sans',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (minWidth: 1080px)': {
      fontSize: '1.3rem',
    },
    cursor: 'default',
  },
  button: {
    color: PRIMARY_600,
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createNewButton: {
    backgroundColor: PRIMARY_600,
    color: PRIMARY_MILK,
    // width: '50%',
    alignSelf: 'center',
  },
  formTextField: {
    width: '100%',
  },
  divider: {width: '50%', alignSelf: 'center', margin: '4'},
  headingDivider: {width: '100%', alignSelf: 'center', margin: '4'},
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: '4vh',
    width: '100%',
    '@media (min-width: 1080px)': {
      fontSize: '1.3rem',
      flexDirection: 'row',
    },
  },
};
