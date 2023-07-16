import {
  PRIMARY_BLUE,
  PRIMARY_DARK_GREY,
  PRIMARY_MILK,
} from '../../../../styles';

export const profileStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '2vh',
    maxWidth: '85vw',
    alignSelf: 'center',
    background: PRIMARY_MILK,
  },
  profile: {
    galleryInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '5%',
      minWidth: '80vw',
      alignSelf: 'center',
      '@media (max-width: 800px)': {
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
    },
    imageBox: {
      height: 400,
      width: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignSelf: 'center',
      textAlign: 'center',
      '@media (max-width: 800px)': {
        height: 200,
        width: 200,
      },
    },
    image: {
      width: `100%`,
      height: 'unset',
      alignSelf: 'center',
    },
    galleryDetails: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      alignSelf: 'center',
      width: '60%',
      my: 5,
      '@media (max-width: 790px)': {
        width: '95%',
      },
    },
    editButtonProfile: {
      color: PRIMARY_BLUE,
      alignSelf: 'flex-end',
    },
    galleryHeaderContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignSelf: 'flex-start',
      height: '40%',
      width: '95%',
      '@media (max-width: 790px)': {
        flexDirection: 'column',
      },
    },
    galleryContactContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      gap: '5%',
      width: '95%',
      '@media (max-width: 790px)': {
        flexDirection: 'column',
      },
    },
    hoursOfOperationText: {
      fontSize: '0.9rem',
      '@media (max-width: 700px)': {
        flexDirection: '0.7rem',
      },
    },
    galleryContactHeadline: {
      textAlign: 'center',
    },
    galleryBioContainer: {
      display: 'flex',
      m: 3,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      height: '0%',
    },

    galleryAddressContainer: {
      display: 'column',
      flexDirection: 'row',
      width: '95%',
      alignItems: 'center',
      alignText: 'center',
    },
    galleryBioStyles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      textAlign: 'center',
      color: PRIMARY_DARK_GREY,
    },
    defaultImage: {
      marginTop: '1em',
      maxWidth: '100%',
      borderWidth: 30,
    },
    addressText: {
      alignText: 'center',
      color: PRIMARY_DARK_GREY,
      fontSize: '1.2rem',
    },
    imageSize: {
      minWidth: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  edit: {
    backButton: {
      color: PRIMARY_BLUE,
      alignSelf: 'flex-start',
    },
    inputTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1vh',
      mt: 10,
      alignItems: 'center',
      minHeight: '10vh',
      width: '100%',
    },
    imageContainer: {
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      gap: '5vh',
      alignItems: 'space-between',
      maxHeight: '40vh',
      mt: 7,
      width: '100%',
    },
    defaultImageEdit: {
      marginTop: '1em',
      width: '25vw',
      alignSelf: 'center',
      my: 12,
      borderWidth: 30,
      minWidth: '10vw',
      '@media (min-width: 700px)': {
        minWidth: '60vw',
      },
    },
    inputText: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '10vh',
      width: '80%',
    },
    saveButton: {
      color: PRIMARY_BLUE,
      alignSelf: 'center',
      m: 10,
    },
  },
};
