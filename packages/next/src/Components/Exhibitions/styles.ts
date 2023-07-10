import {PRIMARY_BLUE} from '../../../styles';

export const createArtworkStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    m: '2vh',
    border: '1px solid #eaeaea',
    alignSelf: 'center',
    borderRadius: '0.5vw',
    alignContent: 'center',
  },
  backButton: {
    color: PRIMARY_BLUE,
    alignSelf: 'flex-start',
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: '2vh',
    alignItems: 'center',
    alignContent: 'center',
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
    '@media (max-width: 780px)': {
      height: '50vh',
    },
  },
  defaultImageEdit: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40vw',
    height: '30vh',
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
    width: '100%',
  },
  saveButtonContainer: {
    alignSelf: 'center',
    m: 2,
    display: 'flex',
    gap: '2vw',
  },
  multiLineContainer: {
    my: 2,
    gap: '3vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: '10vh',
    width: '100%',
    '@media (max-width: 780px)': {
      flexDirection: 'column',
    },
  },
};
