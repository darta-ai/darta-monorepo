import {PRIMARY_BLUE} from '../../../styles';

export const createArtworkStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid #eaeaea',
    alignSelf: 'center',
    borderRadius: '0.5vw',
    gap: '2vh',
    alignContent: 'center',
    '@media (min-width: 800px)': {
      width: '80vw',
    },
  },
  backButton: {
    color: PRIMARY_BLUE,
    alignSelf: 'flex-start',
    m: 2,
  },
  imageArtworkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    minWidth: '50%',
    my: 2,
    '@media (min-width: 700px)': {
      width: '85vw',
      flexDirection: 'row',
    },
  },
  artworkDetailsContainer: {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    gap: '2rem',
    '@media (min-width: 780px)': {
      maxWidth: '50%',
    },
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    maxWidth: '40vw',
    minHeight: '100%',
    '@media (min-width: 780px)': {
      minHeight: '45vh',
    },
  },
  defaultImageEdit: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '40vw',
    '@media (min-width: 780px)': {
      minHeight: '45vh',
    },
    alignSelf: 'center',
  },
  defaultImage: {
    marginTop: '1em',
    width: '100%',
    maxHeight: '39vh',
    alignSelf: 'center',
    borderWidth: 30,
  },
  inputText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  saveButtonContainer: {
    alignSelf: 'center',
    m: 2,
    display: 'flex',
    gap: '2vw',
    width: '90%',
    justifyContent: 'space-between',
  },
  multiLineContainer: {
    my: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: '10vh',
    width: '90%',
    '@media (max-width: 780px)': {
      flexDirection: 'column',
    },
  },
};
