const parseBusinessHours = (
  exampleArray: {
    close: {day: number; time: string; hours: number; minutes: number};
    open: {day: number; time: string; hours: number; minutes: number};
  }[],
): {[key: string]: {open: {value: string}; close: {value: string}}} => {
  const convertTo12Hour = (time: string): string => {
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
