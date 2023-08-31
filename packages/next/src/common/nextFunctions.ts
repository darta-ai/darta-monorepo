import {Artwork, Dimensions} from '../../globalTypes';

function fractionToDecimal(str: string) {
  if (!str) return null;
  if (!str.includes('/')) return str;
  const parts = str.split(' ');

  let i = 0;
  while (parts[i] === '') {
    i++;
  }
  const wholeNumber = parts[i];
  const fraction = parts[i + 1];

  if (fraction) {
    const [numerator, denominator] = fraction.split('/');
    const decimal = parseInt(numerator, 10) / parseInt(denominator, 10);
    return (parseFloat(wholeNumber) + decimal).toString();
  } else {
    return wholeNumber;
  }
}

type AddressComponents = {
  long_name: string, 
  short_name: string,
  types: string[]
}

const findLocality = (addressComponents: AddressComponents[]) => {
  return addressComponents
  .filter(component => component.types.includes('locality'))
  .map(component => component.long_name)[0];

}

export const createDimensionsString = ({
  depthIn,
  depthCm,
  widthIn,
  heightIn,
  widthCm,
  heightCm,
}: {
  depthIn: string;
  depthCm: string;
  widthIn: string;
  heightIn: string;
  widthCm: string;
  heightCm: string;
}) => {
  if (Number(depthIn) && Number(depthCm)) {
    return `${heightIn} x ${widthIn} x ${depthIn}in; ${heightCm} x ${widthCm} x ${depthCm}cm`;
  } else {
    return `${heightIn} x ${widthIn}in; ${heightCm} x ${widthCm}cm`;
  }
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
  const city = findLocality(data?.address_components)
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
    city
  };
  return addressObj;
};

type ReturnArtworkObject = {
  [key: string]: Artwork;
};

const parseDimensions = (dimensions: string): Dimensions => {
  const removedSlashR = dimensions.replace(/\r/g, '');
  const slicedArray = removedSlashR.split(';');
  const inches = slicedArray[0].replace('in', '');
  const cms = slicedArray[1].replace('cm', '');
  const slicedInches = inches.split('x');
  const slicedCm = cms.split('x');
  const heightIn = fractionToDecimal(slicedInches[0])!;
  const widthIn = fractionToDecimal(slicedInches[1])!;
  const depthIn = fractionToDecimal(slicedInches[2])!;
  const heightCm = fractionToDecimal(slicedCm[0])!;
  const widthCm = fractionToDecimal(slicedCm[1])!;
  const depthCm = fractionToDecimal(slicedCm[2])!;

  const stringPayload = {
    depthIn,
    depthCm,
    widthIn,
    heightIn,
    widthCm,
    heightCm,
  };

  const text = createDimensionsString(stringPayload);

  if (slicedInches && slicedCm) {
    return {
      heightIn: {value: heightIn},
      widthIn: {value: widthIn},
      depthIn: {value: depthIn ?? 0},
      displayUnit: {value: 'in'},
      text: {value: text},
      heightCm: {value: heightCm},
      widthCm: {value: widthCm},
      depthCm: {value: depthCm ?? 0},
    };
  } else if (slicedInches) {
    return {
      heightIn: {value: heightIn},
      widthIn: {value: widthIn},
      depthIn: {value: depthIn ?? 0},
      displayUnit: {value: 'in'},
      text: {value: text},
      heightCm: {value: ''},
      widthCm: {value: ''},
      depthCm: {value: ''},
    };
  } else if (slicedCm) {
    return {
      heightIn: {value: ''},
      widthIn: {value: ''},
      displayUnit: {value: 'cm'},
      text: {value: text},
      heightCm: {value: heightCm},
      widthCm: {value: widthCm},
      depthCm: {value: depthCm ?? 0},
    };
  } else {
    return {
      heightIn: {value: ''},
      widthIn: {value: ''},
      displayUnit: {value: 'in'},
      text: {value: ''},
      heightCm: {value: ''},
      widthCm: {value: ''},
    };
  }
};

export const parseExcelArtworkData = (
  data: any[],
): ReturnArtworkObject | null => {
  if (!data) {
    return null;
  }
  const artworkObject: ReturnArtworkObject = {};
  data.forEach(item => {
    const newId = crypto.randomUUID();
    artworkObject[newId] = {
      artworkId: newId,
      artworkImage: {value: item['Main image URL (large)']},
      artworkTitle: {value: item?.Title},
      artistName: {value: item?.Artist},
      artworkMedium: {value: item?.Medium},
      canInquire: {value: 'Yes'},
      artworkDimensions: parseDimensions(item?.Dimensions),
      artworkPrice: {value: item?.Price, isPrivate: false},
      artworkCurrency: {value: 'USD'},
      artworkCreatedYear: {value: item?.Year},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  return artworkObject;
};
