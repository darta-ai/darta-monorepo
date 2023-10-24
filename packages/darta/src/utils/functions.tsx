import {Image} from 'react-native';

import {buttonSizes} from './constants';
import {createUser} from '../api/userRoutes'
import auth from '@react-native-firebase/auth';

 
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

export const imagePrefetch = async (imageUrls: string[]) => {
  const imagePrefetchResults: boolean[] = await Promise.all(
    imageUrls.map(
      async (imageUrl: string): Promise<boolean> =>
        Image.prefetch(imageUrl).catch((e: Error) => {
          throw new Error(`No image exists for id ${imageUrl}, ${e}`);
        }),
    ),
  );
  return imagePrefetchResults;
};

export function customLocalDateString(date: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${dayName}, ${monthName} ${dayOfMonth} ${year}`;
}

export function customDateString(date: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${monthName} ${dayOfMonth}, ${year}`;
}

export function customFormatTimeString(date: Date): string {
  
  let hours: number | string = date.getHours();
  const minutes: string = ('0' + date.getMinutes()).slice(-2);
  const amPm: string = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  console

  return `${hours}:${minutes} ${amPm}`;
} 


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