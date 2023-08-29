import {Gallery} from '../models/GalleryModel'
import {GalleryBase} from '@darta/types'

export interface IGalleryService {
    createGalleryProfile({} : GalleryBase): Promise<void>;
    readGalleryProfile(uuid: string): Promise<Gallery | null>;
    editGalleryProfile(): Promise<void>;
    deleteGalleryProfile(): Promise<void>;
    verifyQualifyingGallery(domain: string): Promise<boolean>
  }
  