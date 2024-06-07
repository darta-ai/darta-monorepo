/* eslint-disable max-len */
/* eslint-disable no-undef */
import { ExhibitionPreview } from '@darta-types/dist';
import { Database } from 'arangojs';
import { Expo } from 'expo-server-sdk';
import { inject, injectable} from 'inversify';

import { CollectionNames, EdgeNames } from '../config/collections';
import { expoClient } from '../config/config';
import { remoteConfig } from '../config/firebase';
import { standardConsoleLog } from '../config/templates';
import { ImageController } from '../controllers';
import {
  IEdgeService,
  IExhibitionService,
  IGalleryService,
  INodeService,
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
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
    @inject('IExhibitionService') private readonly exhibitionService: IExhibitionService,
    @inject('ImageController')
    private readonly imageController: ImageController,
  ) {}

  // public async generatePushNotificationsFollowing(): Promise<void> {
  //   const usersWithPushTokens = await this.getExpoPushTokens();
  
  //   const headerParameterKey = 'FOLLOWING_HEADER';
  //   const parameterGroup = 'Push Notifications';
  
  //   let header = '';
  
  //   const template = await remoteConfig.getTemplate();
  //   const parameter = template.parameterGroups[parameterGroup];
  //   const newHeader = parameter.parameters[headerParameterKey].defaultValue as unknown as { [key: string]: string };
  //   header = newHeader.value;
  
  //   const messagesPromises = usersWithPushTokens.map(async (pushToken) => {
  //     if (!Expo.isExpoPushToken(pushToken.expoPushToken)) {
  //       standardConsoleLog({ message: `Push token ${pushToken} is not a valid Expo push token`, data: 'error', request: null });
  //       return [];
  //     }
  
  //     let upcomingExhibitions: ExhibitionPreview[] = await this.getUpcomingExhibitionsFollowing({ uid: pushToken._id });
  
  //     if (upcomingExhibitions.length === 0) {
  //       upcomingExhibitions = await this.getUpcomingExhibitionsNotFollowing();
  //     } 
      
  //     const messagesPerUser = await Promise.all(
  //       upcomingExhibitions.map(async (exhibition) => {
  //         const gallery = await this.galleryService.readGalleryProfileFromGalleryId({ galleryId: exhibition.galleryId! });
  //         if (!gallery && !exhibition.openingDate.value) {
  //           return null;
  //         }
  //         const exhibitionStartDate = new Date(exhibition.openingDate.value!).toLocaleDateString();
  
  //         const body = `${gallery?.galleryName.value} has a new exhibition opening on ${exhibitionStartDate}`;
  
  //         return {
  //           to: pushToken.expoPushToken,
  //           sound: null,
  //           body,
  //           title: header,
  //           data: { withSome: 'data' },
  //         };
  //       })
  //     );
  
  //     return messagesPerUser;
  //   });
  
  //   const messages = (await Promise.all(messagesPromises)).flat();

  
  //   const chunks = expoClient.chunkPushNotifications(messages);
  
  //   const tickets: Array<any> = [];
  
  //   await Promise.allSettled(
  //     chunks.map(async (chunk) => {
  //       try {
  //         const ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
  //         tickets.push(...ticketChunk);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     })
  //   );
  
  //   return;
  // }
  
  public async generatePushNotificationsFollowing(): Promise<void> {
    const usersWithPushTokens = await this.getExpoPushTokens();
  
    const headerParameterKey = 'FOLLOWING_HEADER';
    const sendPushNotification = 'sendPushNotification';
    const parameterGroup = 'Push Notifications';
  
  
    const template = await remoteConfig.getTemplate();
    const parameter = template.parameterGroups[parameterGroup];
    const isSendingPushNotification = parameter.parameters[sendPushNotification].defaultValue as unknown as { [key: string]: string };

    // eslint-disable-next-line no-extra-boolean-cast
    if (isSendingPushNotification.value === 'false') {
      return;
    }
    const newHeader = parameter.parameters[headerParameterKey].defaultValue as unknown as { [key: string]: string };
    const title = newHeader.value;

    console.log({usersWithPushTokens})

    const tempArr = [{expoPushToken: 'ExponentPushToken[ebqY1jFWieVWr2YG8NIGjX]', _id: 'DartaUsers/GL1yalS1PQQjbOUu9dnpT7nKAEy1'}]

    const messagesPromises = tempArr.map(async (pushToken) => {
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
        .sort((a, b) => a.exhibitionStartDate.getTime() - b.exhibitionStartDate.getTime());
  
      if (filteredExhibitions.length === 0) {
        return null;
      }
  
      const mostRecentExhibition = filteredExhibitions[0];
      const exhibitionsOnSameDate = filteredExhibitions.filter(
        (exhibition) => exhibition.exhibitionStartDate.toDateString() === mostRecentExhibition.exhibitionStartDate.toDateString()
      );
  
      const { body, data } = this.formatExhibitionsMessage(exhibitionsOnSameDate);
      console.log({body, data})
  
      return {
        to: pushToken.expoPushToken,
        sound: null,
        body,
        title,
        data,
      };
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
  }
  
  
  // eslint-disable-next-line class-methods-use-this
  private formatExhibitionsMessage(exhibitions: PushExhibition[]): { body: string, data: any } {
    const withOpenings: PushExhibition[] = [];
    const withoutOpenings: PushExhibition[] = [];
  
    exhibitions.forEach((exhibition) => {
      if (exhibition.hasOpening) {
        withOpenings.push(exhibition);
      } else {
        withoutOpenings.push(exhibition);
      }
    });
  
    if (withOpenings.length !== 0) {
      const uniqueGalleries = withOpenings.sort((a, b) => a.exhibitionStartDate.getTime() - b.exhibitionStartDate.getTime());
      switch (uniqueGalleries.length) {
        case 0:
          throw new Error('No gallery names found');
        case 1: {
          return {
            body: `${uniqueGalleries[0].galleryName} has an opening reception for "${uniqueGalleries[0].exhibitionTitle}" this ${this.getDayOfTheWeek(exhibitions[0].receptionOpening)}`,
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
    } else if (withoutOpenings.length > 0) {
      const uniqueWithoutOpenings = withoutOpenings.sort((a, b) => a.exhibitionStartDate.getTime() - b.exhibitionStartDate.getTime()).filter((exhibition, index, array) => {
        if (index === 0) {
          return true;
        }
        return exhibition.exhibitionStartDate.toDateString() === array[0].exhibitionStartDate.toDateString();
      });
      switch (uniqueWithoutOpenings.length) {
        case 0:
          throw new Error('No gallery names found');
        case 1: {
          return {
            body: `${uniqueWithoutOpenings[0].galleryName} has a new show "${uniqueWithoutOpenings[0].exhibitionTitle}" opening this week`,
            data: { showUpcomingScreen: false, exhibitionId: uniqueWithoutOpenings[0].exhibitionId, galleryId: uniqueWithoutOpenings[0].galleryId }
          };
        }
        case 2: {
          return {
            body: `${uniqueWithoutOpenings[0].galleryName} and ${uniqueWithoutOpenings[1].galleryName} have new shows opening this week`,
            data: { showUpcomingScreen: true }
          };
        }
        case 3: {
          const [first, second, third] = uniqueWithoutOpenings;
          return {
            body: `${first.galleryName}, ${second.galleryName}, and ${third.galleryName} have new shows opening this week`,
            data: { showUpcomingScreen: true }
          };
        }
        default: {
          const [first, second, ...rest] = uniqueWithoutOpenings;
          return {
            body: `${first.galleryName}, ${second.galleryName}, and ${rest.length} others have shows opening this week`,
            data: { showUpcomingScreen: true }
          };
        }
      }
    } else {
      throw new Error('No exhibitions found');
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
  
  private async getGalleriesFollowing({userId} : {userId: string}): Promise<string[]> {

    const userFollowsGalleryEdges = await this.edgeService.getAllEdgesFromNode(
      {edgeName: EdgeNames.FROMDartaUserTOGalleryFOLLOWS, from: userId}
    )
    
    if (userFollowsGalleryEdges.length === 0){
      return []
    } 
      return userFollowsGalleryEdges.map((edge) => edge._to)
    
  }

  private async getUpcomingExhibitionsFollows({userId} : {userId: string}): Promise<string[]> {

    const userFollowsGalleryEdges = await this.edgeService.getAllEdgesFromNode(
      {edgeName: EdgeNames.FROMDartaUserTOGalleryFOLLOWS, from: userId}
    )
    
    if (userFollowsGalleryEdges.length === 0){
      return []
    } 
      return userFollowsGalleryEdges.map((edge) => edge._to)
  }


  private async getUpcomingExhibitionsFollowing({uid} : {uid: string}): Promise<ExhibitionPreview[]> {
    const results = await this.exhibitionService.listExhibitionsPreviewsForthcomingGalleryFollowingForUserByLimit({limit: 10, uid });
    if (!results) {
      return [];
    }
    return Object.values(results);
  }

  private async getUpcomingExhibitionsNotFollowing(): Promise<ExhibitionPreview[]> {
    const results = await this.exhibitionService.listExhibitionsPreviewsForthcomingForUserByLimit({limit: 3, uid: null});
    if (!results) {
      return [];
    }
    return Object.values(results);
  }

  // eslint-disable-next-line class-methods-use-this
  private getDayOfTheWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
}