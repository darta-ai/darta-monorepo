import {Images} from './galleries';

export type MobileUser =  {
    profilePicture?: Images;
    userName?: string;
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    uid?: string;
    localStorageUid?: string;
    routeGenerationCount?: {
      routeGeneratedCountWeekly: number;
    }
}


export type FirebaseUser = {
  provider_id: string,
  iss: string,
  aud: string,
  auth_time: number,
  user_id: string,
  sub: string,
  iat: number,
  exp: number,
  firebase: { [key: string] : string },
  uid: string,
}
type GalleryInquiryStats =
  | 'inquired'
  | 'gallery_responded'
  | 'negotiation'
  | 'accepted'
  | 'payment_received'
  | 'artwork_sent'
  | 'closed'
  | 'gallery_declined'
  | 'gallery_archived';


export type InquiryArtworkData = {
    edge_id: string;
    artwork_id: string;
    createdAt: string;
    legalFirstName: string;
    legalLastName: string;
    email: string;
    status: GalleryInquiryStats;
    updatedAt: string;
  };