import {Artwork, Dimensions} from '../../globalTypes';

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
  };
  return addressObj;
};

type ReturnArtworkObject = {
  [key: string]: Artwork;
};

const parseDimensions = (dimensions: string): Dimensions => {
  const removedSlashR = dimensions.replace(/\r/g, '');
  const matches = removedSlashR.match(
    /((\d+\s)?(\d+\/\d+)?\s*x\s*(\d+\s)?(\d+\/\d+)?) in\s*;\s*((\d+(\.\d+)?) x (\d+(\.\d+)?)) cm/,
  );
  console.log('matches', matches, removedSlashR);
  if (matches) {
    return {
      heightIn: {value: matches[1]},
      widthIn: {value: matches[3]},
      displayUnit: {value: 'cm'},
      text: {value: removedSlashR},
      heightCm: {value: matches[8]},
      widthCm: {value: matches[10]},
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
      artworkCreatedYear: {value: item?.Year},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  return artworkObject;
};
