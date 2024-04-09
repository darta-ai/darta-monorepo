import {GalleryForList, IGalleryProfileData} from '@darta-types';

import {Gallery} from '../../models/GalleryModel';
import {Node} from '../../models/models';

export interface IGalleryService {
  // eslint-disable-next-line no-empty-pattern
  createGalleryProfile({}: any): Promise<IGalleryProfileData>;
  checkDuplicateGalleries({
    userEmail,
  }: {
    userEmail: string | undefined;
  }): Promise<Node>;
  readGalleryProfileFromUID(uid: string): Promise<Gallery | null>;
  readGalleryProfileFromGalleryId({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<Gallery | null>;
  readGalleryProfileFromGalleryIdForUser({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<Gallery | null>;
  readGalleryForList({artworkId} : {artworkId: string}): Promise<GalleryForList>;
  editGalleryProfile({
    user,
    data,
  }: {
    user: any;
    data: IGalleryProfileData;
  }): Promise<Gallery | null>;
  deleteGalleryProfile(): Promise<void>;
  verifyQualifyingGallery(domain: string): Promise<boolean>;
  getGalleryFromDomain({userEmail}: {userEmail: string}): Promise<Gallery | null>;
  getGalleryIdFromUID({uid}: {uid: string}): Promise<string>;
  getGalleryLogo({id}: {id: string}): Promise<any>;
  generateGalleryUserId({galleryId}: {galleryId: string}): string;
  generateGalleryId({galleryId}: {galleryId: string}): string;
  readAllGalleries(): Promise<void>;
  getGalleryByExhibitionId({exhibitionId}: {exhibitionId: string}): Promise<Gallery | null>;
}
