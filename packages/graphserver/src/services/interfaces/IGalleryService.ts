import {Gallery} from '../../models/GalleryModel'
import {GalleryBase, IGalleryProfileData} from '@darta/types'

export interface IGalleryService {

    createGalleryProfile({} : any): Promise<IGalleryProfileData>;
    checkDuplicateGalleries({galleryName, signUpWebsite, userEmail} : {galleryName: string, signUpWebsite: string, userEmail: string | undefined}): Promise<Node | boolean>
    readGalleryProfileFromUUID(uuid: string): Promise<Gallery | null>;
    readGalleryProfileFromGalleryId({galleryId} : {galleryId: string}): Promise<Gallery | null>
    editGalleryProfile({user, data} : {user: any, data: IGalleryProfileData}): Promise<Gallery | null>;
    deleteGalleryProfile(): Promise<void>;
    verifyQualifyingGallery(domain: string): Promise<boolean>
    getGalleryId({uuid}: {uuid:string}): Promise<string>
  }
  