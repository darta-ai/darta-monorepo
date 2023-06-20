import {PRIMARY_BLUE} from '../../../styles';

export const createArtworkStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    mt: '10vh',
    alignSelf: 'center',
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
    height: '50vh',
  },
  defaultImageEdit: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40vh',
    height: '40vh',
    alignSelf: 'center',
  },
  defaultImage: {
    marginTop: '1em',
    width: '100%',
    height: '39vh',
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
  saveButton: {
    color: PRIMARY_BLUE,
    alignSelf: 'center',
    m: 2,
  },
  multiLineContainer: {
    my: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: '10vh',
    width: '100%',
    '@media (max-width: 780px)': {
      flexDirection: 'column',
    },
  },
};
