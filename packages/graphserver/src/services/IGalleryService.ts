import {Gallery} from '../models/GalleryModel'

export interface IGalleryService {
    createGalleryProfile(uuid: string, isApproved: boolean): Promise<void>;
    readGalleryProfile(uuid: string): Promise<Gallery | null>;
    editGalleryProfile(): Promise<void>;
    deleteGalleryProfile(): Promise<void>;
    verifyQualifyingGallery(domain: string): Promise<boolean>
  }
  