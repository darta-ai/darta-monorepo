import {buttonSizes, EST_TIMEZONE} from './constants';
import {createUser} from '../api/userRoutes'
import auth from '@react-native-firebase/auth';
import { BusinessHours } from '@darta-types/dist';
import { toZonedTime } from 'date-fns-tz'
import { Linking, Platform } from 'react-native';



 
export const getUserUid = async () => {
  // await AsyncStorage.setItem(USER_UID_KEY, "")
  
    try {
        let uid = auth().currentUser?.uid
        if (!uid) {
            const user = await auth().signInAnonymously()
            if(user.user?.uid) {
              await createUser({uid: user.user?.uid})
            }
        }
        return uid;
    } catch (error) {
        console.error('Failed to get user UID:', error);
        return null;
    }
}

// listAllExhibitionsForUser
/**
 * @deprecated This function should be substituted with the below
 */
export function customLocalDateString(date: Date) {
  date = toZonedTime(new Date(date), EST_TIMEZONE);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${dayName}, ${monthName} ${dayOfMonth} ${year}`;
}

export function customLocalDateStringStart({date, isUpperCase} : {date: Date, isUpperCase: boolean}) {
  date = toZonedTime(new Date(date), EST_TIMEZONE);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const monthName = isUpperCase ? months[date.getMonth()] : months[date.getMonth()]

  const dayOfMonth = date.getDate();

  return `${monthName} ${dayOfMonth}`;
}

export function customLocalDateStringEnd({date, isUpperCase} : {date: Date, isUpperCase: boolean}) {
  date = toZonedTime(new Date(date), EST_TIMEZONE);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const monthName = isUpperCase ? months[date.getMonth()] : months[date.getMonth()]
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${monthName} ${dayOfMonth}, ${year}`;
}


export function customLocalDateStringStartShort({date, isUpperCase} : {date: Date, isUpperCase: boolean}) {
  date = toZonedTime(new Date(date), EST_TIMEZONE);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthName = isUpperCase ? months[date.getMonth()] : months[date.getMonth()]

  const dayOfMonth = date.getDate();

  return `${monthName} ${dayOfMonth}`;
}

export function customLocalDateStringEndShort({date, isUpperCase} : {date: Date, isUpperCase: boolean}) {
  date = toZonedTime(new Date(date), EST_TIMEZONE);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthName = isUpperCase ? months[date.getMonth()] : months[date.getMonth()]
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${monthName} ${dayOfMonth}, ${year}`;
}

export function customDateString(date: Date) {
  date = toZonedTime(new Date(date), EST_TIMEZONE);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${monthName} ${dayOfMonth}, ${year}`;
}

export function customFormatTimeString(date: Date): string {
  date = toZonedTime(new Date(date), EST_TIMEZONE);

  let hours: number | string = date.getHours();
  const minutes: string = ('0' + date.getMinutes()).slice(-2);
  const amPm: string = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  console

  return `${hours}:${minutes} ${amPm}`;
} 

// listAllExhibitionsForUser
/**
 * @deprecated This function should be substituted with the below
 */
export function simplifyAddress(address: string | undefined | null) {
  if (!address) {
      return '';
  }
  const parts = address.split(',');

  const addr = parts[0];
  const city = parts[1];
  const state = parts[2].split(' ')[1];

  // Join back and return
  return `${addr},${city}, ${state}`;
}

export function simplifyAddressMailing(address: string | undefined | null) {
  if (!address) {
      return '';
  }
  const parts = address.split(',');

  const addr = parts[0].trim();

  return `${addr}`;
}

export function simplifyAddressCity(address: string | undefined | null) {
  if (!address) {
      return '';
  }
  const parts = address.split(',');

  const city = parts[1]?.trim();
  const state = parts[2].split(' ')[1].trim();

  const results = `${city}, ${state}`;
  return results;
}

export function modifyHoursOfOperation(time: string | undefined | null): string {
  if (!time) {
      return '';
  }
  return time.toLowerCase().replace('closed', 'Closed').replace('open', 'Open').replace(':00', '').replace(" ", '');
}

export function getStoreHours(hoursObject: BusinessHours | undefined) {
  if (!hoursObject) {
      return;
  }
  const currentDayIndex = new Date().getDay();
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = weekdayNames[currentDayIndex];
  const closingTime = hoursObject[currentDayName]?.close.value;

  if (closingTime === 'Closed') {
      return 'Closed today';
  } else if (closingTime) {
    return `Open until ${closingTime}`;
  } else {
    return 
  }
}


export const getButtonSizes = (hp: number) => {
  const baseHeight = 926;
  // { extraSmall: 15, small: 20, medium: 30, large: 40 }
  return {
    extraSmall: Math.floor((hp / baseHeight) * buttonSizes.extraSmall),
    small: Math.floor((hp / baseHeight) * buttonSizes.small),
    mediumSmall: Math.floor((hp / baseHeight) * buttonSizes.mediumSmall),
    medium: Math.floor((hp / baseHeight) * buttonSizes.medium),
    large: Math.floor((hp / baseHeight) * buttonSizes.large),
  };
};

export function formatUSPhoneNumber(number: number | string) {
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

// utils/mapUtils.js
export const calculateZoomLevel = (minLat, maxLat, minLong, maxLong) => {
  const latDelta = Math.abs(maxLat - minLat);
  const longDelta = Math.abs(maxLong - minLong);

  // Simplified zoom level calculation (customize as needed)
  const zoomLevel = Math.log2(360 / Math.max(latDelta, longDelta));
  return zoomLevel;
};


export const openInMaps = (address: string) => {
  if (!address) return;

  const formattedAddress = encodeURIComponent(address);
  const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
  const url = scheme + formattedAddress;


  Linking.canOpenURL(url)
  .then((supported) => {
    if (supported) {
      return Linking.openURL(url);
    } else {
      const browserUrl = 'https://www.google.com/maps/search/?api=1&query=' + formattedAddress;
      return Linking.openURL(browserUrl);
    }
  })
  .catch((err) => console.error('Error opening maps app:', err));
};  
