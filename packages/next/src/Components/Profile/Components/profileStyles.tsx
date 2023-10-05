import {
  PRIMARY_DARK_GREY,
} from '../../../../styles';

import {PRIMARY_600, PRIMARY_50, PRIMARY_900} from '@darta-styles'


export const profileStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '2vh',
    width: '70vw',
    borderRadius: 5,
    alignSelf: 'center',
    background: PRIMARY_50,
  },
  profile: {
    galleryInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      gap: '5%',
      width: '90%',
      alignSelf: 'center',
      '@media (max-width: 1080px)': {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center', 
      },
    },
    imageBox: {
      height: '35%',
      width: '35%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignSelf: 'center',
      textAlign: 'center',
      '@media (max-width: 1080px)': {
        height: '100%',
        width: '100%',
      },
    },
    image: {
      width: '10vw',
      maxHeight: '30vh',
      height: 'unset',
      alignSelf: 'center',
    },
    galleryDetails: {
      alignText: 'center',
      alignSelf: 'center',
      width: '60%',
      my: 5,
      '@media (max-width: 1080px)': {
        width: '95%',
      },
    },
    galleryContactInfo: {
      alignText: 'center',
      alignSelf: 'center',
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "5vh",
      width: '90%',
      my: 5,
      '@media (max-width: 1080px)': {
        width: '95%',
      },
    },
    editButtonProfile: {
      color: PRIMARY_900,
      alignSelf: 'flex-end',
    },
    galleryHeaderContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '5%',
      margin: '3vh',
      alignContent: 'center',
      height: '50%',
      width: '90%',
      '@media (max-width: 1080px)': {
        flexDirection: 'column',
      },
    },
    galleryContactContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      gap: '10%',
      width: '90%',
      '@media (max-width: 1080px)': {
        flexDirection: 'column',
      },
    },
    hoursOfOperationText: {
      width: '100%',
      textAlign: 'center',
      fontSize: '0.9rem',
      '@media (max-width: 700px)': {
        fontSize: '0.8rem',
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
      width: '100%',
      alignItems: 'center',
      alignSelf: 'right',
      alignText: 'center',
    },
    galleryBioStyles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      textAlign: 'center',
      color: PRIMARY_DARK_GREY,
    },
    defaultImage: {
      margin: 'none',
      height: '100%',
      width: '100%',
      '@media (max-width: 1080px)': {
        margin: '4em',
        height: '25vh',
        width: '25vw',
      },
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
      color: PRIMARY_900,
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
      '@media (min-width: 1080px)': {
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
      color: PRIMARY_900,
      alignSelf: 'center',
      m: 10,
    },
  },
};
