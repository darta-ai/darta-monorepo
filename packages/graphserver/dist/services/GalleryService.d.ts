import { IGalleryProfileData } from '@darta/types';
import { Database } from 'arangojs';
import { ImageController } from '../controllers/ImageController';
import { Gallery } from '../models/GalleryModel';
import { Node } from '../models/models';
import { IEdgeService, IGalleryService, INodeService } from './interfaces';
export declare class GalleryService implements IGalleryService {
    private readonly db;
    private readonly imageController;
    private readonly edgeService;
    private readonly nodeService;
    constructor(db: Database, imageController: ImageController, edgeService: IEdgeService, nodeService: INodeService);
    createGalleryProfile({ galleryName, isValidated, signUpWebsite, userEmail, }: any): Promise<any>;
    readGalleryProfileFromUID(uid: string): Promise<Gallery | null>;
    readGalleryProfileFromGalleryId({ galleryId, }: {
        galleryId: string;
    }): Promise<Gallery | null>;
    editGalleryProfile({ user, data, }: {
        user: any;
        data: IGalleryProfileData;
    }): Promise<Gallery | null>;
    deleteGalleryProfile(): Promise<void>;
    verifyQualifyingGallery(email: string): Promise<boolean>;
    getGalleryIdFromUID({ uid }: {
        uid: string;
    }): Promise<string>;
    getGalleryLogo({ id }: {
        id: string;
    }): Promise<any>;
    checkDuplicateGalleries({ userEmail, }: {
        userEmail: string;
    }): Promise<Node>;
    createGalleryAdminNode({ galleryId, email, }: {
        galleryId: string;
        email: string;
    }): Promise<any>;
    generateGalleryUserId({ galleryId }: {
        galleryId: string;
    }): string;
    generateGalleryId({ galleryId }: {
        galleryId: string;
    }): string;
    private normalizeGalleryName;
    private normalizeGalleryWebsite;
    private normalizeGalleryDomain;
}
