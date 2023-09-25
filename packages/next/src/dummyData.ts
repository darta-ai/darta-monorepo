import {ArtworkObject, Exhibition, IGalleryProfileData} from '@darta-types';

export const galleryProfileRawData: IGalleryProfileData = {
  galleryName: {value: 'Pat Kirts Gallery 2000'},
  galleryBio: {
    value:
      "Pat Kirts opened a gallery because he's a baller and that's what ballers do.",
  },
  galleryLogo: {
    value:
      'data:image/png;base64,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',
  },
  galleryLocation0: {
    businessHours: {
      hoursOfOperation: {
        Monday: {open: {value: null}, close: {value: null}},
        Tuesday: {open: {value: null}, close: {value: null}},
        Wednesday: {open: {value: null}, close: {value: null}},
        Thursday: {open: {value: null}, close: {value: null}},
        Friday: {open: {value: null}, close: {value: null}},
        Saturday: {open: {value: null}, close: {value: null}},
        Sunday: {open: {value: null}, close: {value: null}},
      },
      isPrivate: false,
    },
    locationString: {value: '', isPrivate: false},
    coordinates: {
      latitude: {value: null},
      longitude: {value: null},
      googleMapsPlaceId: {value: null},
    },
    locationId: '2ce62a12-a2b2-47b1-86b1-a396f30cb2b2',
  },
};

export const artwork1: ArtworkObject = {
  '5f92586d-b127-497e-ae96-20dc8c93ae1b': {
    published: false,
    artworkId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    exhibitionId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    artistName: {
      value: 'RACHEL SIMONE MARINO',
    },
    artworkCreatedYear: {
      value: '2022',
    },
    artworkCurrency: {
      value: 'USD',
    },
    artworkDescription: {
      value:
        'Natalie Raskin’s painting waiting room for real life depicts a poetically disorienting, dystopian scene in which figures occupy a liminal space of placelessness, and the sense of the seemingly unending passage of time is marked by a clock. Despite this endlessness, the painting is anything but stagnant; instead, it points to a larger imagined narrative of the possibilities that lay beyond the waiting room – what came before, and what comes after. The work’s title points to simultaneously childlike and existential wondering of what “real life” might look like in the future, even though we are always already there.',
    },
    artworkDimensions: {
      depthIn: {value: '2'},
      heightIn: {value: '60'},
      text: {value: '60in x 50in x 2in'},
      displayUnit: {value: 'in'},
      widthIn: {value: '50'},
      heightCm: {value: '152.4'},
      widthCm: {value: '127'},
      depthCm: {value: '5.08'},
    },
    artworkImage: {
      value:
        'https://img.artlogic.net/w_1600,h_864,c_limit/exhibit-e/5b6b5f6d6aa72c4f430fcc53/ee82e13df905dd7acba7872af3e2b616.jpeg',
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
      value: 'A hard time at the beach',
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
    published: true,
    artistName: {
      value: 'SABRINA RING',
    },
    artworkCreatedYear: {value: '2024'},
    exhibitionId: '5f92586d-b127-497e-ae96-20dc8c93ae1b',
    artworkCurrency: {value: 'USD'},
    artworkDescription: {
      value:
        'Sabrina Ring’s My Beautiful BFF reference what they call “early 2000s little girl’s media” to challenge its embedded cis-hetero-normativity and eurocentricity by blending it with queer and trans aesthetics.',
    },
    artworkDimensions: {
      depthIn: {value: '2'},
      heightIn: {value: '60'},
      text: {value: '60in x 50in x 2in'},
      displayUnit: {value: 'in'},
      widthIn: {value: '50'},
      heightCm: {value: '152.4'},
      widthCm: {value: '127'},
      depthCm: {value: '5.08'},
    },
    artworkId: 'baac18b5-b40d-42fa-b2dc-a996758df0cd',
    artworkImage: {
      value:
        'https://dim.mcusercontent.com/cs/3fe7b9b4437e2d24806c132f1/images/8069de0c-8d29-c153-62d3-9a50ce1ddebf.jpg?w=294&dpr=2',
    },
    artworkImagesArray: [],
    artworkMedium: {value: 'Oil on canvas on panel'},
    artworkPrice: {value: '2500', isPrivate: false},
    artworkTitle: {value: 'My Beautiful BFF'},
    canInquire: {value: 'Yes'},
    slug: {value: 'sabrina-ring-my-beautiful-bff'},
    createdAt: '2021-08-24T18:00:00.000Z',
    updatedAt: '2021-08-24T18:00:00.000Z',
    exhibitionOrder: 1,
  },
};

export const artwork3: ArtworkObject = {
  'a7b6a571-b961-4b27-883b-ad1a91fc7ad3': {
    artistName: {value: 'MARY GRIGORIADIS'},
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
      text: {value: '60in x 50in x 2in'},
      displayUnit: {value: 'in'},
      widthIn: {value: '50'},
      heightCm: {value: '152.4'},
      widthCm: {value: '127'},
      depthCm: {value: '5.08'},
    },
    artworkMedium: {value: 'Oil and acrylic on canvas'},
    artworkPrice: {value: '5500', isPrivate: false},
    artworkTitle: {value: 'Isfahan'},
    canInquire: {value: 'Yes'},
    artworkId: 'a7b6a571-b961-4b27-883b-ad1a91fc7ad3',
    published: false,
    slug: {value: 'mary-grigoriadis-isfahan'},
    artworkImage: {
      value:
        'https://img.artlogic.net/w_1600,h_864,c_limit/exhibit-e/599f12405a4091c6048b4568/f2eee0b92bbbe41f28861a5b20f01436.jpeg',
    },
    artworkImagesArray: [],
    createdAt: '2022-08-24T18:00:00.000Z',
    updatedAt: '2022-08-24T18:00:00.000Z',
    exhibitionOrder: 0,
  },
};

type GalleryInquiryStats =
  | 'inquired'
  | 'responded'
  | 'negotiation'
  | 'accepted'
  | 'purchase_agreement_sent'
  | 'payment_received'
  | 'declined'
  | 'archived';

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
    status: 'responded',
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

export const soteGalleryProfile: IGalleryProfileData = {
  galleryBio: {value: 'Sprit of the Earth BABYYYYY'},
  galleryInstagram: {value: '', isPrivate: false},
  galleryLocation0: {
    businessHours: {
      isPrivate: false,
      hoursOfOperation: {
        Friday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Monday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Saturday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Sunday: {close: {value: '5:00 PM'}, open: {value: '12:00 PM'}},
        Thursday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Tuesday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Wednesday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
      },
    },
    coordinates: {
      latitude: {value: '35.687528'},
      longitude: {value: '-105.9405632'},
      googleMapsPlaceId: {
        value:
          'EiUyOCBHYWxpc3RlbyBTdHJlZXQsIFNhbnRhIEZlLCBOTSwgVV…BQGIcRWycIkJE4v5QQHCoUChIJ9ffZ545QGIcRsr3W8PTupg4',
      },
    },
    locationString: {
      value: '28 Galisteo St, Santa Fe, NM 87501, USA',
      isPrivate: false,
    },
    locationId: '2ce62a12-a2b2-47b1-86b1-a396f30cb2b2',
  },
  galleryLocation1: {
    businessHours: {
      isPrivate: false,
      hoursOfOperation: {
        Friday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Monday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Saturday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Sunday: {close: {value: '5:00 PM'}, open: {value: '12:00 PM'}},
        Thursday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Tuesday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
        Wednesday: {close: {value: '6:00 PM'}, open: {value: '11:00 AM'}},
      },
    },
    coordinates: {
      latitude: {value: '40.715851'},
      longitude: {value: '-73.9981815'},
      googleMapsPlaceId: {value: 'ChIJi1uKBSdawokRkpa4_J0ZOm0'},
    },
    locationString: {
      isPrivate: false,
      value: '58 Mott St, New York, NY 10013, USA',
    },
    locationId: '35aa9f8b-71e9-4c49-a6ae-3bc0df7bb30e',
  },
  galleryLogo: {
    value:
      'https://s3.amazonaws.com/files.collageplatform.com.prod/application/599f12405a4091c6048b4568/f1a52b7879c8792b9f00686cca0b86f1.png',
  },
  galleryName: {value: 'SOTE | Spirit of the Earth'},
  galleryPhone: {value: '5059889558', isPrivate: false},
  galleryWebsite: {value: 'http://www.spiritoftheearth.com/', isPrivate: false},
  isValidated: true,
  primaryContact: {value: '', isPrivate: false},
};

export const dummyExhibition: Exhibition = {
  artworks: {...artwork1, ...artwork2, ...artwork3},
  exhibitionDates: {
    exhibitionEndDate: {
      isOngoing: false,
      value: 'Fri Jul 28 2023 00:00:00 GMT-0400 (Eastern Daylight Time)',
    },
    exhibitionStartDate: {
      isOngoing: false,
      value: 'Fri Jul 14 2023 00:00:00 GMT-0400 (Eastern Daylight Time)',
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
  exhibitionPressRelease: {value: 'This is a description of the opening'},

  exhibitionTitle: {value: 'Americana'},
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
      'https://dim.mcusercontent.com/cs/3fe7b9b4437e2d24806c132f1/images/c35fb2db-532b-101a-0eb2-775b2f222515.jpg?w=281&dpr=2',
  },
  published: false,
  createdAt: 'Fri Jul 14 2023 21:00:00 GMT-0400 (Eastern Daylight Time)',
};
