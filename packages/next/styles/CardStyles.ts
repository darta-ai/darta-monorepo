import {PRIMARY_50,PRIMARY_100} from '@darta-styles'

export const cardStyles = {
  root: {
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '25vh',
    border: '1px solid darkgrey',
    width: '100%',
    borderRadius: 'auto',
    margin: 'auto',
    padding: '1vh',
    backgroundColor: PRIMARY_50,
  },
  exhibitionRoot: {
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '20vh',
    width: '85vw',
    margin: 'auto',
    border: '1px solid darkgrey',
    backgroundColor: PRIMARY_100,
  },
  media: {
    minHeight: '15vh',
    '@media (min-width: 1080px)': {
      minHeight: '50vh',
    },
  },
  mediaExhibition: {
    height: '100%',
    width: '100%',
    padding: '5vh',
  },
  artworkMedia: {
    height: '80%',
    width: '80%',
    padding: '5vh',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  textAreaAutosize: {
    width: '30vw',
    fontSize: '1rem',
    fontFamily: 'Nunito Sans',
    backgroundColor: PRIMARY_50,
    border: `1px solid ${PRIMARY_50}`,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '1vh',
    borderRadius: '0.5vw',
    m: '2vh',
    border: '1px solid #eaeaea',
    width: '100%',
    alignItems: 'center',
    backgroundColor: PRIMARY_50,
    '@media (min-width: 1080px)': {
      flexDirection: 'row',
      justifyContent: 'center',
      minWidth: '75vw',
      minHeight: '15vh',
    },
  },
  informationContainer: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    textOverflow: 'ellipsis',
    textAlign: 'start',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media (min-width: 800px)': {
      width: '50%',
      height: '100%',
    },
    '@media (min-width: 1080px)': {
      width: '90%',
      height: '100%',
    },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '@media (min-width: 1080px)': {
      flexDirection: 'column',
    },
  },
};
