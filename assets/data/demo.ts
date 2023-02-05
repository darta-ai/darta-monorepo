import { DataT } from "../../types";
import Continental_Drift from "../images/Continental_Drift.jpg";
import The_End from "../images/The_End.jpg";

const data: DataT[] = [
  { 
  artist: "Robert Bordo", 
  canInquire: true,
  category: "Painting",
  createdAt: "2011-01-21T10:19:21+00:00",
  date: "August-1991",
  dimensionsInches: {height: 13.625, depth: 0, text: '13 5/8 × 12 33/40 in', width: 12.825, diameter: null},
  gallery: { 
    name: 'Bookstein Projects', 
    region: 'North America', 
    email: 'info@booksteinprojects.com', 
    slug: 'bookstein-projects', 
    id: '4d8b92c64eb68a1b2c00051f'
  },
  geneName: ['Contemporary', 'Art of the 1980s', 'Art of the 1990s', 'Abstract Art', 'Abstract Landscape'],
  genes :[
    {displayName: 'Contemporary', name: '1970–present', id: '4d90d18fdcdd5f44a5000025'},
    {name: '1980s', displayName: 'Art of the 1980s', id: '51b6618e8b3b8102b90001cc'},
    {id: '51b6617a275b243b16000023', name: '1990s', displayName: 'Art of the 1990s'},
    {id: '504fb4584ed2d60002000344', displayName: null, name: 'Abstract Art'},
    {displayName: null, id: '5040d8322c14de0002000123', name: 'Abstract Landscape'}
  ],
  iconicity: 26.27784170473129,
  id: "4d8b94774eb68a1b2c002a78",
  image: Continental_Drift,
  labels:  ['Cloud', 'Sky', 'Azure', 'Moon', 'Cumulus', 'Astronomical object', 'Landscape', 'Horizon', 'Meteorological phenomenon'],
  medium : "Oil paint on panel",
  price: "Contact for price",
  slug: "helen-miranda-wilson-continental-drift-for-robert-bordo-wellfleet-ma",
  sold : false,
  title :  "Continental Drift, for Robert Bordo, Wellfleet, MA",
},
{
  artist: "Clare Woods",
  canInquire: true,
  category: "Painting",
  createdAt: "2014-01-18T12:14:05+00:00",
  date: "2012",
  dimensionsInches :{
    depth: null,
    diameter: null,
    height: 19.7,
    text: "19 7/10 × 27 3/5 in",
    width: 27.6
  },
  gallery:{
    email: "info@buchmanngalerie.com",
    id: "4f9af2ca054530000100047c",
    name: "Buchmann Galerie",
    region: "Europe",
    slug: "buchmann-galerie",
  },
  geneName: [
    "Contemporary","21st Century Art", "Abstract Art", "Abstract Landscape", "Aluminum"
  ],
  genes: [
    {id: '4d90d18fdcdd5f44a5000025', name: '1970–present', displayName: 'Contemporary'},
    {displayName: '21st Century Art', name: '21st Century', id: '51b6616c275b245661000048'},
    {name: 'Abstract Art', id: '504fb4584ed2d60002000344', displayName: null},
    {name: 'Abstract Landscape', id: '5040d8322c14de0002000123', displayName: null},
    {id: '508d444eedee4b0002000db0', name: 'Aluminum', displayName: null}
  ],
  iconicity: 32.40036685573582,
  id: "52da700d139b21128d0001a6",
  image: The_End,
  labels :['Rectangle', 'Sleeve', 'Font', 'Feather', 'Visual arts'],
  medium: "Oil on aluminum",
  price: "Contact for price",
  slug: "clare-woods-the-end",
  sold: false,
  title: "The End"
},
{
  artist: "Clare Woods",
  canInquire: true,
  category: "Painting",
  createdAt: "2014-01-18T12:14:05+00:00",
  date: "2012",
  dimensionsInches :{
    depth: null,
    diameter: null,
    height: 30,
    text: "30 × 15 in",
    width: 15
  },
  gallery:{
    email: "info@buchmanngalerie.com",
    id: "4f9af2ca054530000100047c",
    name: "Buchmann Galerie",
    region: "Europe",
    slug: "buchmann-galerie",
  },
  geneName: [
    "Contemporary","21st Century Art", "Abstract Art", "Abstract Landscape", "Aluminum"
  ],
  genes: [
    {id: '4d90d18fdcdd5f44a5000025', name: '1970–present', displayName: 'Contemporary'},
    {displayName: '21st Century Art', name: '21st Century', id: '51b6616c275b245661000048'},
    {name: 'Abstract Art', id: '504fb4584ed2d60002000344', displayName: null},
    {name: 'Abstract Landscape', id: '5040d8322c14de0002000123', displayName: null},
    {id: '508d444eedee4b0002000db0', name: 'Aluminum', displayName: null}
  ],
  iconicity: 32.40036685573582,
  id: "52da700d139b21128d0001a6",
  image: "https://d32dm0rphc51dk.cloudfront.net/sKI1NlJdyGH7p36Mu00v-w/larger.jpg",
  labels :['Rectangle', 'Sleeve', 'Font', 'Feather', 'Visual arts'],
  medium: "Oil on aluminum",
  price: "Contact for price",
  slug: "clare-woods-the-end",
  sold: false,
  title: "The End"
}
];

export default data;
