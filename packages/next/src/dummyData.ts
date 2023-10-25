import {ArtworkObject, Exhibition} from '@darta-types';
import dayjs from 'dayjs';

export const artwork1: ArtworkObject = {
  '5f92586d-b127-497e-ae96-20dc8c93ae1b': {
    artworkCategory: {value: "painting"},
    published: false,
    artworkId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    exhibitionId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    artistName: {
      value: 'AMARA LAVELLE',
    },
    artworkCreatedYear: {
      value: '2022',
    },
    artworkCurrency: {
      value: 'USD',
    },
    artworkDescription: {
      value:
        'AMARA LAVELLE’s painting waiting room for real life depicts a poetically disorienting, dystopian scene in which figures occupy a liminal space of placelessness, and the sense of the seemingly unending passage of time is marked by a clock. Despite this endlessness, the painting is anything but stagnant; instead, it points to a larger imagined narrative of the possibilities that lay beyond the waiting room – what came before, and what comes after. The work’s title points to simultaneously childlike and existential wondering of what “real life” might look like in the future, even though we are always already there.',
    },
    artworkDimensions: {
      depthIn: {value: '2'},
      heightIn: {value: '60'},
      text: {value: '50 x 40in; 127 x 101.6cm'},
      displayUnit: {value: 'in'},
      widthIn: {value: '50'},
      heightCm: {value: '152.4'},
      widthCm: {value: '127'},
      depthCm: {value: '5.08'},
    },
    artworkImage: {
      value:
        'https://d3rf6j5nx5r04a.cloudfront.net/wg7u_ZZYWgaeE-kSFR1Dcv5Jk8o=/1120x0/product/3/f/a52b267b7db74360b55dcc95cc9f6505_opt.jpeg',
    },
    artworkImagesArray: [
      {
        value: [],
      },
    ],
    artworkMedium: {
      value: 'Oil on canvas',
    },
    artworkPrice: {
      isPrivate: false,
      value: '',
    },
    artworkTitle: {
      value: 'Uncertain',
    },
    canInquire: {
      value: 'Yes',
    },
    slug: {
      value: 'rachel-marino-a-hard-time-at-the-beach',
    },
    createdAt: '2023-02-24T18:00:00.000Z',
    updatedAt: '2023-02-24T18:00:00.000Z',
    exhibitionOrder: 2,
  },
};

export const artwork2: ArtworkObject = {
  'baac18b5-b40d-42fa-b2dc-a996758df0cd': {
    artworkCategory: {value: "painting"},
    published: true,
    artistName: {
      value: 'AMARA LAVELLE',
    },
    artworkCreatedYear: {value: '2024'},
    exhibitionId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    artworkCurrency: {value: 'USD'},
    artworkDescription: {
      value:
        'My Beautiful BFF reference what they call.',
    },
    artworkDimensions: {
      depthIn: {value: '2'},
      heightIn: {value: '60'},
      text: {value: '80 x 72in; 203.2 x 182.9cm'},
      displayUnit: {value: 'in'},
      widthIn: {value: '50'},
      heightCm: {value: '152.4'},
      widthCm: {value: '127'},
      depthCm: {value: '5.08'},
    },
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    artworkImage: {
      value:
        'https://d3rf6j5nx5r04a.cloudfront.net/gu-JZC23qhQjRkRGq8jdf9PmFl4=/1120x0/product/b/1/0b6268166ad54bd0aca7629ff21acd08_opt.jpg',
    },
    artworkImagesArray: [],
    artworkMedium: {value: 'Oil on canvas'},
    artworkPrice: {value: '', isPrivate: false},
    artworkTitle: {value: 'From the Tower Window'},
    canInquire: {value: 'No'},
    slug: {value: 'sabrina-ring-my-beautiful-bff'},
    createdAt: '2021-08-24T18:00:00.000Z',
    updatedAt: '2021-08-24T18:00:00.000Z',
    exhibitionOrder: 1,
  },
};

export const artwork3: ArtworkObject = {
  'a7b6a571-b961-4b27-883b-ad1a91fc7ad3': {
    artworkCategory: {value: "painting"},
    artistName: {value: 'AMARA LAVELLE'},
    artworkCreatedYear: {value: '2024'},
    artworkCurrency: {value: 'USD'},
    exhibitionId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    artworkDescription: {
      value:
        'Grigoriadis devised her methodical approach during… These ideas to her own experiments on\nthe canvas. ',
    },
    artworkDimensions: {
      depthIn: {value: '2'},
      heightIn: {value: '60'},
      text: {value: '48 x 64in; 121.9 x 162.6cm'},
      displayUnit: {value: 'in'},
      widthIn: {value: '50'},
      heightCm: {value: '152.4'},
      widthCm: {value: '127'},
      depthCm: {value: '5.08'},
    },
    artworkMedium: {value: 'Oil and acrylic on canvas'},
    artworkPrice: {value: '', isPrivate: false},
    artworkTitle: {value: 'Through the Gate'},
    canInquire: {value: 'Yes'},
    artworkId: 'a7b6a571-b961-4b27-883b-ad1a91fc7ad3',
    published: false,
    slug: {value: 'mary-grigoriadis-isfahan'},
    artworkImage: {
      value:
        'https://d3rf6j5nx5r04a.cloudfront.net/HyWbzr6u_El7aXSs9iSBWP4m2N0=/1120x0/product/e/5/ab72b29d85774fe1a490e5850775f4b0_opt.jpg',
    },
    artworkImagesArray: [],
    createdAt: '2022-08-24T18:00:00.000Z',
    updatedAt: '2022-08-24T18:00:00.000Z',
    exhibitionOrder: 0,
  },
};

type GalleryInquiryStats =
  | 'inquired'
  | 'gallery_responded'
  | 'negotiation'
  | 'accepted'
  | 'payment_received'
  | 'gallery_declined'
  | 'gallery_archived';

export type InquiryArtworkData = {
  id: string;
  user: string;
  userContactEmail?: string;
  status: GalleryInquiryStats;
  artworkId: string;
  inquiredAt: string;
  updatedAt: string;
};

type InputArtworkDataObject = {
  [key: string]: InquiryArtworkData;
};

export const galleryInquiriesDummyData: InputArtworkDataObject = {
  '0': {
    id: '1',
    user: 'Hannah Chinn',
    userContactEmail: 'JohnDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-12-10',
    updatedAt: '2021-11-10',
  },
  '1': {
    id: '2',
    user: 'John Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-10-10',
    updatedAt: '2021-10-10',
  },
  '2': {
    id: '3',
    user: 'Dave Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: 'a7b6a571-b961-4b27-883b-ad1a91fc7ad3',
    inquiredAt: '2021-10-10',
    updatedAt: '2023-08-10',
  },
  '3': {
    id: '4',
    user: 'This is a really long name for testing cell sizes',
    userContactEmail: 'This is a really long name for testing cell size',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2022-10-10',
    updatedAt: '2023-03-10',
  },
  '4': {
    id: '5',
    user: 'Jolene Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: 'a7b6a571-b961-4b27-883b-ad1a91fc7ad3',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '5': {
    id: '6',
    user: 'Jimmathy Doe',
    userContactEmail: 'JimmaythyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '6': {
    id: '7',
    user: 'Johnny Doe',
    userContactEmail: 'JohnnyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '7': {
    id: '8',
    user: 'Silly Doe',
    userContactEmail: 'SillyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '8': {
    id: '9',
    user: 'JP Doe',
    userContactEmail: 'SillyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '9': {
    id: '10',
    user: 'A Doe',
    userContactEmail: 'SillyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '10': {
    id: '11',
    user: 'Bordoux Doe',
    userContactEmail: 'SillyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '11': {
    id: '12',
    user: 'Jolean Doe',
    userContactEmail: 'SillyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '12': {
    id: '13',
    user: 'Jake Doe',
    userContactEmail: 'SillyDoe@gmail.com',
    status: 'inquired',
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
};

const endDate = new Date(Date.now() + 12096e5).toISOString()
const startDate = new Date().toISOString()

export const dummyExhibition: Exhibition = {
  artworkCategory: {value: "Painting"},
  exhibitionArtist: {value: 'AMARA LAVELLE'},
  artworks: {...artwork1, ...artwork2, ...artwork3},
  exhibitionDates: {
    exhibitionEndDate: {
      isOngoing: false,
      value: endDate,
    },
    exhibitionStartDate: {
      isOngoing: false,
      value: startDate,
    },
    exhibitionDuration: {value: 'Temporary'},
  },
  exhibitionId: '02003454-b638-44a6-bb38-d418d8390729',
  exhibitionLocation: {
    exhibitionLocationString: {
      value: '28 Galisteo St, Santa Fe, NM 87501, USA',
    },
    isPrivate: false,
  },
  exhibitionPressRelease: {value: `Gossamer & Echoes: A Delicate Dance of Transient Beauty
  
New York, NY - Henrietta Caldwell Fine Arts is thrilled to present its latest exhibition, "Gossamer & Echoes," opening on ${dayjs(startDate).format('dddd, MMMM D')} and running through ${dayjs(endDate).format('dddd, MMMM D')}. This captivating collection offers a unique exploration of the fragile and fleeting, drawing attendees into a realm where the ephemeral touches the eternal.
`},
  exhibitionTitle: {value: 'Gossamer & Echoes'},
  receptionDates: {
    hasReception: {value: 'Yes'},
    receptionEndTime: {
      value: 'Fri Jul 14 2023 21:00:00 GMT-0400 (Eastern Daylight Time)',
    },
    receptionStartTime: {
      value: 'Fri Jul 14 2023 19:00:00 GMT-0400 (Eastern Daylight Time)',
    },
  },
  exhibitionPrimaryImage: {
    value:
      'https://www.artnews.com/wp-content/uploads/2022/04/AR-Penck-AR-Penck-Paintings-19741990-White-Cube-Masons-Yard-9-March-14-April-2022-medium-res-9.jpg?w=1200',
  },
  published: false,
  createdAt: 'Fri Jul 14 2023 21:00:00 GMT-0400 (Eastern Daylight Time)',
};
