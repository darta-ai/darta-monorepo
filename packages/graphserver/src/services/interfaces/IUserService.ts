import { Images } from '@darta-types/dist';

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
    localStorageUid
  }: {
    localStorageUid: string;
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
  readGalleryUser({uid}: {uid: string}): Promise<Node | null>;
  
  readGalleryEdgeRelationship({uid}: {uid: string}): Promise<string | boolean>;
  editGalleryEdge({
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
  }: {
    profilePicture?: Images;
    userName?: string;
    email?: string;
    legalFirstName?: string;
    legalLastName?: string;
    uid?: string;
  }): Promise<any>
  checkIfGalleryUserExists({uid}: {uid: string}): Promise<boolean>;
  deleteDartaUser(): Promise<boolean>;
  deleteGalleryUser(): Promise<boolean>;
}
