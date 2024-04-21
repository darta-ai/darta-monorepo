import {Artwork, Dimensions, Exhibition} from '@darta-types';

import { convertInchesToCentimeters } from './utils/unitConverter';

// function fractionToDecimal(str: string) {
//   if (!str) return null;
//   if (!str.includes('/')) return str;
//   const parts = str.split(' ');

//   let i = 0;
//   while (parts[i] === '') {
//     i+=1;
//   }
//   const wholeNumber = parts[i];
//   const fraction = parts[i + 1];

//   if (fraction) {
//     const [numerator, denominator] = fraction.split('/');
//     const decimal = parseInt(numerator, 10) / parseInt(denominator, 10);
//     return (parseFloat(wholeNumber) + decimal).toString();
//   } 
//     return wholeNumber;
  
// }

type AddressComponents = {
  long_name: string;
  short_name: string;
  types: string[];
};

const findLocality = (addressComponents: AddressComponents[]) => addressComponents
    .filter(component => component.types.includes('locality'))
    .map(component => component.long_name)[0];

const findSubLocality = (addressComponents: AddressComponents[]) => addressComponents
    .filter(component => component.types.includes('sublocality'))
    .map(component => component.long_name)[0];

export const createDimensionsString = ({
  depthIn,
  heightIn,
  widthIn,

}: {
  depthIn: string;
  heightIn: string;
  widthIn: string;
}) => {
  const heightCm = convertInchesToCentimeters(heightIn);
  const widthCm = convertInchesToCentimeters(widthIn);
  const depthCm = convertInchesToCentimeters(depthIn);
  if (Number(depthIn)) {
    return `${heightIn} x ${widthIn} x ${depthIn}in; ${heightCm} x ${widthCm} x ${depthCm}cm`;
  } 
    return `${heightIn} x ${widthIn}in; ${heightCm} x ${widthCm}cm`;
  
};

const parseBusinessHours = (
  exampleArray: {
    close: {day: number; time: string; hours: number; minutes: number};
    open: {day: number; time: string; hours: number; minutes: number};
  }[],
): {[key: string]: {open: {value: string}; close: {value: string}}} => {
  const convertTo12Hour = (time: string): string => {
    if (!time) {
      return 'Closed';
    }
    const hours = parseInt(time?.substring(0, 2), 10);
    const minutes = time?.substring(2);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours > 12 ? hours - 12 : hours;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  const dayMapping: {[key: number]: string} = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  const parsedObject: {
    [key: string]: {open: {value: string}; close: {value: string}};
  } = {};

  exampleArray?.forEach(item => {
    const day = dayMapping[item?.open?.day];
    const open = convertTo12Hour(item?.open?.time);
    const close = convertTo12Hour(item?.close?.time);

    parsedObject[day] = {open: {value: open}, close: {value: close}};
  });

  Object.values(dayMapping).forEach(day => {
    if (!parsedObject[day]) {
      parsedObject[day] = {open: {value: 'Closed'}, close: {value: 'Closed'}};
    }
  });

  return parsedObject;
};

export const googleMapsParser = (data: any) => {
  const galleryAddress = data?.formatted_address;
  const lat = data?.geometry?.location.lat();
  const lng = data?.geometry?.location.lng();
  const mapsUrl = data?.geometry?.url;
  const galleryName = data?.name;
  const city = findLocality(data?.address_components);
  const locality = findSubLocality(data?.address_components);
  const galleryWebsite = data?.website;
  const galleryPhone = data?.formatted_phone_number;
  const openHours = parseBusinessHours(data?.opening_hours?.periods);
  const addressObj = {
    galleryAddress,
    lat,
    lng,
    mapsUrl,
    galleryName,
    galleryWebsite,
    galleryPhone,
    openHours,
    city,
    locality,
  };
  return addressObj;
};

const parseDimensions = (item: any): Dimensions => {

  const heightIn = item?.heightIn ? item?.heightIn : "0"
  const widthIn = item?.widthIn ? item?.widthIn : "0"
  const depthIn = item?.depthIn ? item?.depthIn : "0"

  const stringPayload = {
    depthIn,
    widthIn,
    heightIn,
  };

  const text = createDimensionsString(stringPayload);
  return { 
    heightIn: {
      value: heightIn
    }, 
    widthIn: {
      value: widthIn
    },
    depthIn: {
      value: depthIn
    },
    text : {
      value: text
    },
    heightCm: {
      value: convertInchesToCentimeters(heightIn)
    },
    widthCm: {
      value: convertInchesToCentimeters(widthIn)
    },
    depthCm: {
      value: convertInchesToCentimeters(depthIn)
    },
    displayUnit: {
      value: 'in'
    }
  };
};

export const parseExcelArtworkData = ({rows, exhibitionId} : {
  rows: any[],
  exhibitionId: string,
}): Artwork[] | null => {
  if (!rows) {
    return null;
  }

  return rows.map(item => ({
      exhibitionId,
      artworkTitle: {value: item?.artworkTitle},
      artworkImage: {value: ''},
      artistName: {value: item?.artistName},
      canInquire: {value: item?.canInquire},
      artworkDimensions: parseDimensions(item),
      artworkPrice: {value: item?.Price, isPrivate: false},
      artworkCurrency: {value: item.artworkCurrency},
      artworkCreatedYear: {value: item?.artworkCreatedYear},
      artworkCategory: {value: item?.artworkCategory},
      artworkMedium: {value: item?.artworkMedium},
      editionStatus: {value: item?.editionStatus},
      editionNumber: {value: item?.editionNumber},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
};


export const parseExcelExhibitionData = (
  data: any[],
): Exhibition | null => {
  if (!data) {
    return null;
  }
  const exhibitionObject: Exhibition = {} as Exhibition;
  data.forEach(item => {
    // const newId = crypto.randomUUID();
    const exhibitionStartDate = new Date(item?.exhibitionStartDate);
    const exhibitionEndDate = new Date(item?.exhibitionEndDate);
    const exhibitionStartDateString = exhibitionStartDate ? exhibitionStartDate?.toISOString() : "";
    const exhibitionEndDateString = exhibitionEndDate ? exhibitionEndDate?.toISOString() : "";
    const hasReception = item?.receptionStartTime && item?.receptionEndTime ? 'Yes' : 'No';
    const receptionStart = item?.receptionStartTime !== undefined ? new Date(item?.receptionStartTime).toISOString() : "";
    const receptionEnd = item?.receptionEndTime !== undefined ? new Date(item?.receptionEndTime).toISOString() : "";
    exhibitionObject.exhibitionArtist = {value: item?.exhibitionArtist};
    exhibitionObject.exhibitionDates = {
      exhibitionStartDate: {
        value: exhibitionStartDateString,
        isOngoing: false
      },
      exhibitionEndDate: {
        value: exhibitionEndDateString,
        isOngoing: false
      },
      exhibitionDuration: {value: 'Temporary'},
    };
    exhibitionObject.receptionDates = {
      hasReception: {value: hasReception},
      receptionStartTime: {value: receptionStart},
      receptionEndTime: {value: receptionEnd},
    }
    exhibitionObject.exhibitionType = {value: item?.exhibitionType};
    exhibitionObject.exhibitionTitle = {value: item?.exhibitionTitle};
    exhibitionObject.exhibitionPressRelease = {value: item?.exhibitionPressRelease};
    exhibitionObject.exhibitionArtistStatement = {value: item?.exhibitionArtistStatement};
  });
  return exhibitionObject;
};