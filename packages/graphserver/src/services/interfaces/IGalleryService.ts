import {Gallery} from '../../models/GalleryModel'
import {GalleryBase, IGalleryProfileData} from '@darta/types'

export interface IGalleryService {
    createGalleryProfile({} : GalleryBase): Promise<void>;
    readGalleryProfile(uuid: string): Promise<Gallery | null>;
    editGalleryProfile({user, data} : {user: any, data: IGalleryProfileData}): Promise<Gallery | null>;
    deleteGalleryProfile(): Promise<void>;
    verifyQualifyingGallery(domain: string): Promise<boolean>
  }
  