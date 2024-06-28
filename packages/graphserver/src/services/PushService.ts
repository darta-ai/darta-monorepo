/* eslint-disable max-len */
/* eslint-disable no-undef */
import { ExhibitionPreview } from '@darta-types/dist';
import { Database } from 'arangojs';
import { Expo } from 'expo-server-sdk';
import { inject, injectable} from 'inversify';

import { CollectionNames } from '../config/collections';
import { expoClient } from '../config/config';
import { remoteConfig } from '../config/firebase';
import { standardConsoleLog } from '../config/templates';
import {
  IExhibitionService,
  IGalleryService,
  IPushService
} from './interfaces';

type PushTokenResponse = {
  _id: string;
  expoPushToken: string;
};

type PushExhibition = { 
  galleryName: string | undefined; 
  exhibitionStartDate: Date, 
  exhibitionTitle: string, 
  receptionOpening: Date, 
  exhibitionId: string, 
  galleryId: string,
  hasOpening: boolean
};

@injectable()
export class PushService implements IPushService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
    @inject('IExhibitionService') private readonly exhibitionService: IExhibitionService,
  ) {}
  
  public async runDailyPushNotifications(): Promise<number> {
    const usersWithPushTokens = await this.getExpoPushTokens();

    const headerParameterKey = 'FOLLOWING_HEADER';
    const sendPushNotification = 'sendPushNotification';
    const parameterGroup = 'Push Notifications';
  
  
    const template = await remoteConfig.getTemplate();
    const parameter = template.parameterGroups[parameterGroup];
    const isSendingPushNotification = parameter.parameters[sendPushNotification].defaultValue as unknown as { [key: string]: string };

    // eslint-disable-next-line no-extra-boolean-cast
    if (isSendingPushNotification.value === 'false') {
      return 0;
    }

    const newHeader = parameter.parameters[headerParameterKey].defaultValue as unknown as { [key: string]: string };
    const title = newHeader.value;

    const messagesPromises = usersWithPushTokens.map(async (pushToken) => {
      if (!Expo.isExpoPushToken(pushToken.expoPushToken)) {
        standardConsoleLog({ message: `Push token ${pushToken} is not a valid Expo push token`, data: 'error', request: null });
        return null;
      }
  
      const upcomingExhibitions: ExhibitionPreview[] = await this.getUpcomingExhibitionsFollowing({ uid: pushToken._id });
      
      if (upcomingExhibitions.length === 0) {
        return null;
      }

      // filter out exhibitions less than 2 days away
      const exhibitionsWithinTwoDays = upcomingExhibitions.filter((exhibition) => {
        const exhibitionStartDate = new Date(exhibition.openingDate.value!);
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
        return exhibitionStartDate.getTime() >= twoDaysFromNow.getTime();
      });

      const populatedExhibitions = await Promise.all(
        exhibitionsWithinTwoDays.map(async (exhibition) => {
          if (exhibition.galleryName && exhibition.galleryId){
            return {
              galleryName: exhibition.galleryName.value,
              exhibitionStartDate: new Date(exhibition.openingDate.value!),
              hasOpening: !!exhibition.receptionDates.receptionStartTime.value,
              receptionOpening: exhibition.receptionDates.receptionStartTime.value ? new Date(exhibition.receptionDates.receptionStartTime.value) : new Date(),
              exhibitionTitle: exhibition.exhibitionTitle.value,
              exhibitionId: exhibition.exhibitionId,
              galleryId: exhibition.galleryId
            }
          }
          const gallery = await this.galleryService.readGalleryProfileFromGalleryId({ galleryId: exhibition.galleryId! });
          if (!gallery || !exhibition.openingDate?.value || !gallery.galleryName?.value) {
            return null
          }
          return {
            galleryName: gallery?.galleryName?.value,
            exhibitionStartDate: new Date(exhibition.openingDate.value!),
            hasOpening: !!exhibition.receptionDates.receptionStartTime.value,
            receptionOpening: exhibition.receptionDates.receptionStartTime.value ? new Date(exhibition.receptionDates.receptionStartTime.value) : new Date(),
            exhibitionTitle: exhibition.exhibitionTitle.value,
            exhibitionId: exhibition.exhibitionId,
            galleryId: exhibition.galleryId ?? gallery._id
          };
        })
      );
    
      const filteredExhibitions = populatedExhibitions
      .filter((exhibition): exhibition is { galleryName: string; exhibitionStartDate: Date; exhibitionTitle: string, receptionOpening: Date, hasOpening: boolean, exhibitionId: string, galleryId: string } => exhibition !== null)
    

      const withOpenings: PushExhibition[] = [];
      const withoutOpenings: PushExhibition[] = [];

      filteredExhibitions.forEach((exhibition) => {
          if (exhibition.hasOpening) {
            withOpenings.push(exhibition);
          } else {
            withoutOpenings.push(exhibition);
          }
        });

        if (withOpenings.length > 0) {
          withOpenings.sort((a, b) => a.receptionOpening.getTime() - b.receptionOpening.getTime());
          const firstExhibition = withOpenings[0];
          const exhibitionsWithSameOpening = withOpenings.filter(
            (exhibition) => exhibition.receptionOpening.getTime() === firstExhibition.receptionOpening.getTime()
          );
          const { body, data } = this.formatExhibitionsMessageWithOpenings(exhibitionsWithSameOpening);
          return {
            to: pushToken.expoPushToken,
            sound: null,
            body,
            title,
            data,
          };
        }
        if (withoutOpenings.length > 0) {
          withoutOpenings.sort((a, b) => a.exhibitionStartDate.getTime() - b.exhibitionStartDate.getTime());
          const firstExhibition = withoutOpenings[0];
          const exhibitionsWithSameStartDate = withoutOpenings.filter(
            (exhibition) => exhibition.exhibitionStartDate.getTime() === firstExhibition.exhibitionStartDate.getTime()
          );
          const { body, data } = this.formatExhibitionsMessageWithoutOpenings(exhibitionsWithSameStartDate);
          return {
            to: pushToken.expoPushToken,
            sound: null,
            body,
            title,
            data,
          };
        }
        return null;
    });

    const messages = (await Promise.all(messagesPromises)).filter((message): message is any => message !== null);
      
    const chunks = expoClient.chunkPushNotifications(messages);
  
    const tickets: Array<any> = [];
  
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        try {
          const ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          // standardConsoleLog(error);
        }
      })
    );
    return tickets.length;
  }

  public async runWeeklyPushNotifications(): Promise<number> {
    const usersWithPushTokens = await this.getExpoPushTokens();
  
    const headerParameterKey = 'FOLLOWING_HEADER';
    const sendPushNotification = 'sendPushNotification';
    const parameterGroup = 'Push Notifications';
  
  
    const template = await remoteConfig.getTemplate();
    const parameter = template.parameterGroups[parameterGroup];
    const isSendingPushNotification = parameter.parameters[sendPushNotification].defaultValue as unknown as { [key: string]: string };

    // eslint-disable-next-line no-extra-boolean-cast
    if (isSendingPushNotification.value === 'false') {
      return 0;
    }
    const newHeader = parameter.parameters[headerParameterKey].defaultValue as unknown as { [key: string]: string };
    const title = newHeader.value;

    // const tempArr = [{expoPushToken: 'ExponentPushToken[x0682HC0BbtBDXYihAi6CZ]', _id: 'DartaUsers/W8R8F92xrLZSD5rqhSgR5ZCCzhy2'}]

    const messagesPromises = usersWithPushTokens.map(async (pushToken) => {
      if (!Expo.isExpoPushToken(pushToken.expoPushToken)) {
        standardConsoleLog({ message: `Push token ${pushToken} is not a valid Expo push token`, data: 'error', request: null });
        return null;
      }
  
      let upcomingExhibitions: ExhibitionPreview[] = [];
      upcomingExhibitions = await this.getUpcomingExhibitionsFollowing({ uid: pushToken._id });
      
      if (upcomingExhibitions.length === 0) {
        upcomingExhibitions = await this.getUpcomingExhibitionsNotFollowing();
      }
  
      const exhibitions = await Promise.all(
        upcomingExhibitions.map(async (exhibition) => {
          if (exhibition.galleryName && exhibition.galleryId){
            return {
              galleryName: exhibition.galleryName.value,
              exhibitionStartDate: new Date(exhibition.openingDate.value!),
              hasOpening: !!exhibition.receptionDates.receptionStartTime.value,
              receptionOpening: exhibition.receptionDates.receptionStartTime.value ? new Date(exhibition.receptionDates.receptionStartTime.value) : new Date(),
              exhibitionTitle: exhibition.exhibitionTitle.value,
              exhibitionId: exhibition.exhibitionId,
              galleryId: exhibition.galleryId
            }
          }
          const gallery = await this.galleryService.readGalleryProfileFromGalleryId({ galleryId: exhibition.galleryId! });
          if (!gallery || !exhibition.openingDate?.value || !gallery.galleryName?.value) {
            return null
          }
          return {
            galleryName: gallery?.galleryName?.value,
            exhibitionStartDate: new Date(exhibition.openingDate.value!),
            hasOpening: !!exhibition.receptionDates.receptionStartTime.value,
            receptionOpening: exhibition.receptionDates.receptionStartTime.value ? new Date(exhibition.receptionDates.receptionStartTime.value) : new Date(),
            exhibitionTitle: exhibition.exhibitionTitle.value,
            exhibitionId: exhibition.exhibitionId,
            galleryId: exhibition.galleryId ?? gallery._id
          };
        })
      );
      
  
      const filteredExhibitions = exhibitions
        .filter((exhibition): exhibition is { galleryName: string; exhibitionStartDate: Date; exhibitionTitle: string, receptionOpening: Date, hasOpening: boolean, exhibitionId: string, galleryId: string } => exhibition !== null)
      
      const withOpenings: PushExhibition[] = [];
      const withoutOpenings: PushExhibition[] = [];

      filteredExhibitions.forEach((exhibition) => {
          if (exhibition.hasOpening) {
            withOpenings.push(exhibition);
          } else {
            withoutOpenings.push(exhibition);
          }
        });

        if (withOpenings.length > 0) {
          withOpenings.sort((a, b) => a.receptionOpening.getTime() - b.receptionOpening.getTime());
          const firstExhibition = withOpenings[0];
          const exhibitionsWithSameOpening = withOpenings.filter(
            (exhibition) => exhibition.receptionOpening.getTime() === firstExhibition.receptionOpening.getTime()
          );
          const { body, data } = this.formatExhibitionsMessageWithOpenings(exhibitionsWithSameOpening);
          return {
            to: pushToken.expoPushToken,
            sound: null,
            body,
            title,
            data,
          };
        }
        if (withoutOpenings.length > 0) {
          withoutOpenings.sort((a, b) => a.exhibitionStartDate.getTime() - b.exhibitionStartDate.getTime());
          const firstExhibition = withoutOpenings[0];
          const exhibitionsWithSameStartDate = withoutOpenings.filter(
            (exhibition) => exhibition.exhibitionStartDate.getTime() === firstExhibition.exhibitionStartDate.getTime()
          );
          const { body, data } = this.formatExhibitionsMessageWithoutOpenings(exhibitionsWithSameStartDate);
          return {
            to: pushToken.expoPushToken,
            sound: null,
            body,
            title,
            data,
          };
        }
        return null;
    });
  
    const messages = (await Promise.all(messagesPromises)).filter((message): message is any => message !== null);
      
    const chunks = expoClient.chunkPushNotifications(messages);
  
    const tickets: Array<any> = [];
  
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        try {
          const ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          // standardConsoleLog(error);
        }
      })
    );

    return tickets.length;
  }
  
  
  // eslint-disable-next-line class-methods-use-this
  private formatExhibitionsMessageWithOpenings(exhibitions: PushExhibition[]): { body: string, data: any } {
      const uniqueGalleries = exhibitions.sort((a, b) => a.exhibitionStartDate.getTime() - b.exhibitionStartDate.getTime());
      switch (uniqueGalleries.length) {
        case 0:
          throw new Error('No gallery names found');
        case 1: {
          return {
            body: `${uniqueGalleries[0].galleryName} has an opening reception for "${uniqueGalleries[0].exhibitionTitle}" ${this.getDayOfTheWeek(exhibitions[0].receptionOpening)}`,
            data: { showUpcomingScreen: false, exhibitionId: uniqueGalleries[0].exhibitionId, galleryId: uniqueGalleries[0].galleryId }
          };
        }
        case 2: {
          return {
            body: `${uniqueGalleries[0].galleryName} and ${uniqueGalleries[1].galleryName} have opening receptions for new exhibitions this ${this.getDayOfTheWeek(exhibitions[0].receptionOpening)}`,
            data: { showUpcomingScreen: true }
          };
        }
        case 3: {
          const [first, second, third] = uniqueGalleries;
          return {
            body: `${first.galleryName}, ${second.galleryName}, and ${third.galleryName} have opening receptions for new exhibitions this ${this.getDayOfTheWeek(exhibitions[0].receptionOpening!)}`,
            data: { showUpcomingScreen: true }
          };
        }
        default: {
          const [first, second, ...rest] = uniqueGalleries;
          return {
            body: `${first.galleryName}, ${second.galleryName}, and ${rest.length} others have opening receptions for new exhibitions this ${this.getDayOfTheWeek(exhibitions[0].receptionOpening!)}`,
            data: { showUpcomingScreen: true }
          };
        }
      }
    }

  // eslint-disable-next-line class-methods-use-this
  private formatExhibitionsMessageWithoutOpenings(exhibitions: PushExhibition[]): { body: string, data: any } {
    switch (exhibitions.length) {
      case 0:
        throw new Error('No gallery names found');
      case 1: {
        return {
          body: `${exhibitions[0].galleryName} has a new show "${exhibitions[0].exhibitionTitle}" opening this week`,
          data: { showUpcomingScreen: false, exhibitionId: exhibitions[0].exhibitionId, galleryId: exhibitions[0].galleryId }
        };
      }
      case 2: {
        return {
          body: `${exhibitions[0].galleryName} and ${exhibitions[1].galleryName} have new shows opening this week`,
          data: { showUpcomingScreen: true }
        };
      }
      case 3: {
        const [first, second, third] = exhibitions;
        return {
          body: `${first.galleryName}, ${second.galleryName}, and ${third.galleryName} have new shows opening this week`,
          data: { showUpcomingScreen: true }
        };
      }
      default: {
        const [first, second, ...rest] = exhibitions;
        return {
          body: `${first.galleryName}, ${second.galleryName}, and ${rest.length} others have shows opening this week`,
          data: { showUpcomingScreen: true }
        };
      }
    }
  }
    


  private async getExpoPushTokens(): Promise<PushTokenResponse[]> {
    const query = `
      WITH ${CollectionNames.DartaUsers}
      FOR user IN ${CollectionNames.DartaUsers}
      FILTER user.expoPushToken != null
      RETURN {
        _id: user._id,
        expoPushToken: user.expoPushToken
      }
    `;
    const cursor = await this.db.query(query);
    return cursor.all();
  }

  private async getUpcomingExhibitionsFollowing({uid} : {uid: string}): Promise<ExhibitionPreview[]> {
    const results = await this.exhibitionService.listExhibitionsPreviewsForthcomingGalleryFollowingForUserByLimit({limit: 5, uid });
    if (!results) {
      return [];
    }
    return Object.values(results);
  }

  private async getUpcomingExhibitionsNotFollowing(): Promise<ExhibitionPreview[]> {
    const results = await this.exhibitionService.listExhibitionsPreviewsForthcomingForUserByLimit({limit: 5, uid: null});
    if (!results) {
      return [];
    }
    return Object.values(results);
  }

  // eslint-disable-next-line class-methods-use-this
  private getDayOfTheWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday =  days[date.getDay()];
    const weeksInAdvance = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7));

    if (weeksInAdvance === 0) {
      return `this ${weekday}`;
    }
    if (weeksInAdvance === 1) {
      return `next ${weekday}`;
    }
    return `in ${weeksInAdvance} weeks on ${weekday}`;
  }
}