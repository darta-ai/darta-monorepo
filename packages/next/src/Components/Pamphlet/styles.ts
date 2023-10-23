import * as Colors from '@darta-styles'

import {PRIMARY_DARK_GREY} from '../../../styles';

export const splashStyles = {
  container: {
    minWidth: '100vw',
    backgroundColor: Colors.PRIMARY_500,
    height: '150vh',
    display: 'flex',
    marginTop: '3%',
    flexDirection: 'column',
    gap: '0%',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (min-width:800px)': {
      padding: '5%',
      height: '80vh',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'space-around',
    alignSelf: 'center',
    minWidth: '60%',
    height: '80vh',
    '@media (min-width:1050px)': {
      // alignItems: 'flex-start',
    },
  },
  typographyTitleContainer: {
    minHeight: '20%',
    '@media (min-width:1050px)': {
      height: '30%',
    },
  },
  typographyTitle: {
    // fontFamily: 'Avenir Next',
    color: Colors.PRIMARY_100,
    my: 2,
    alignText: 'center',
    cursor: 'default',
    fontSize: '3rem',
    '@media (min-width:1050px)': {
      fontSize: '4.5rem',
    },
  },
  subheader: {
    color: Colors.PRIMARY_100,
    width: '100%',
    fontFamily: 'Avenir Next',
    cursor: 'default',
    fontSize: '1.25rem',
    '@media (min-width:1050px)': {
      fontSize: '2.25rem',
    },
  },
  subheaderContainer: {
    minHeight: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '@media (min-width:1050px)': {
      height: '40%',
    },
  },
  typography: {
    color: Colors.PRIMARY_100,
    width: '100%',
    fontFamily: 'Avenir Next',
    cursor: 'default',
    fontSize: '1rem',
    '@media (min-width:1050px)': {
      fontSize: '1.25rem',
    },
  },
  downloadFromAppStoreContainer: {
    height: '30%',
    width: '100%',
    display: 'flex',
  },
  phonePreviewContainer: {
    height: '70vh',
    width: '100%',
    margin: '10%',
    alignSelf: 'center',
    '@media (min-width:1050px)': {
      height: '80vh',
      minWidth: '30%',
    },
  }
}

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
    color: Colors.PRIMARY_600,
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
