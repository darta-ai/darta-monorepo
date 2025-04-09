import { GalleryPreview, Images, MobileUser } from '@darta-types';

import {Node} from '../../models/models';

export interface IUserService {
  createGalleryUserAndEdge({
    uid,
    galleryId,
    email,
    phoneNumber,
    gallery,
    relationship,
    validated,
  }: {
    uid: string;
    galleryId: string;
    email: string;
    phoneNumber: string;
    gallery: string;
    relationship: string;
    validated: boolean;
  }): Promise<any>;
  createGalleryUser({
    email,
    uid,
  }: {
    email: string;
    uid: string;
  }): Promise<boolean>;
  createDartaUser({
    uid
  }: {
    uid: string;
  }): Promise<boolean>;
  createGalleryEdge({
    galleryId,
    uid,
    relationship,
  }: {
    galleryId: string;
    uid: string;
    relationship: string;
  }): Promise<boolean>;
  createDartaUserGalleryRelationship({uid, galleryId} : {uid: string, galleryId: string}): Promise<void>

  readGalleryUser({uid}: {uid: string}): Promise<Node | null>;
  
  readGalleryEdgeRelationship({uid}: {uid: string}): Promise<string | boolean>;

  readDartaUser({uid}: {uid: string}): Promise<MobileUser| null>;
  editGalleryToUserEdge({
    galleryId,
    uid,
    relationship,
  }: {
    galleryId: string;
    uid: string;
    relationship: string;
  }): Promise<any>;
  editDartaUser({
    profilePicture,
    userName,
    email,
    legalFirstName,
    legalLastName,
    uid,
    expoPushToken,
    recommendationArtworkIds,
  }: {
    profilePicture?: Images;
    userName?: string;
    email?: string;
    legalFirstName?: string;
    legalLastName?: string;
    uid?: string;
    expoPushToken?: string;
    recommendationArtworkIds?: string[];
  }): Promise<any>
  checkIfGalleryUserExists({uid}: {uid: string}): Promise<boolean>;
  deleteGalleryUser(): Promise<boolean>;
  deleteDartaUser({uid} : {uid: string}): Promise<boolean>;
  deleteDartaUserGalleryRelationship({uid, galleryId} : {uid: string, galleryId: string}): Promise<void>
  
  listDartaUserFollowsGallery({uid} : {uid: string}): Promise<GalleryPreview[]>
  generateGalleryUserId({uid}: {uid: string}): string
  generateDartaUserId({uid}: {uid: string}): string
  readAllUsers(): Promise<void>
  resetAllUsersRouteGenerationCount(): Promise<void>
  incrementRouteGeneratedCount({uid}: {uid: string}): Promise<number>
  saveExpoPushToken({uid, expoPushToken}: {uid: string, expoPushToken: string}): Promise<void>
}
