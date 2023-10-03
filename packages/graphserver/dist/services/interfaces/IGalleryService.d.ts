import { IGalleryProfileData } from '@darta-types';
import { Gallery } from '../../models/GalleryModel';
import { Node } from '../../models/models';
export interface IGalleryService {
    createGalleryProfile({}: any): Promise<IGalleryProfileData>;
    checkDuplicateGalleries({ userEmail, }: {
        userEmail: string | undefined;
    }): Promise<Node>;
    readGalleryProfileFromUID(uid: string): Promise<Gallery | null>;
    readGalleryProfileFromGalleryId({ galleryId, }: {
        galleryId: string;
    }): Promise<Gallery | null>;
    readGalleryProfileFromGalleryIdForUser({ galleryId, }: {
        galleryId: string;
    }): Promise<Gallery | null>;
    editGalleryProfile({ user, data, }: {
        user: any;
        data: IGalleryProfileData;
    }): Promise<Gallery | null>;
    deleteGalleryProfile(): Promise<void>;
    verifyQualifyingGallery(domain: string): Promise<boolean>;
    getGalleryIdFromUID({ uid }: {
        uid: string;
    }): Promise<string>;
    getGalleryLogo({ id }: {
        id: string;
    }): Promise<any>;
    generateGalleryUserId({ galleryId }: {
        galleryId: string;
    }): string;
    generateGalleryId({ galleryId }: {
        galleryId: string;
    }): string;
}
