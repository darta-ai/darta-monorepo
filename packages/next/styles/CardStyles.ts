import {PRIMARY_DARK_MILK, PRIMARY_MILK} from './index';

export const cardStyles = {
  root: {
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '20vh',
    width: '75vw',
    margin: 'auto',
    border: '1px solid darkgrey',
    backgroundColor: PRIMARY_MILK,
  },
  exhibitionRoot: {
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '20vh',
    width: '85vw',
    margin: 'auto',
    border: '1px solid darkgrey',
    backgroundColor: PRIMARY_DARK_MILK,
  },
  media: {
    minHeight: '15vh',
    '@media (min-width: 800px)': {
      minHeight: '50vh',
    },
  },
  mediaExhibition: {
    maxHeight: '15vh',
    maxWidth: '40vw',
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
    backgroundColor: PRIMARY_MILK,
    border: `1px solid ${PRIMARY_MILK}`,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1vh',
    borderRadius: '0.5vw',
    m: '1vh',
    border: '1px solid #eaeaea',
    width: '95%',
    alignItems: 'center',
    backgroundColor: PRIMARY_MILK,
    '@media (min-width: 800px)': {
      flexDirection: 'row',
      width: '75vw',
      minHeight: '15vh',
    },
  },
  informationContainer: {
    alignSelf: 'center',
    width: '70vw',
    textOverflow: 'ellipsis',
    textAlign: 'start',
    '@media (min-width: 800px)': {
      width: '35vw',
    },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '@media (min-width: 800px)': {
      flexDirection: 'column',
    },
  },
};
