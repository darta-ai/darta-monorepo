import { Database } from 'arangojs';
import { Node } from '../models/models';
import { IEdgeService, IGalleryService, INodeService, IUserService } from './interfaces';
export declare class UserService implements IUserService {
    private readonly db;
    private readonly edgeService;
    private readonly nodeService;
    private readonly galleryService;
    constructor(db: Database, edgeService: IEdgeService, nodeService: INodeService, galleryService: IGalleryService);
    createGalleryUserAndEdge({ uid, galleryId, email, phoneNumber, gallery, relationship, validated, }: {
        uid: string;
        galleryId: string;
        email: string;
        phoneNumber: string;
        gallery: string;
        relationship: string;
        validated: boolean;
    }): Promise<any>;
    createGalleryUser({ email, uid, phoneNumber, gallery, }: {
        email: string;
        uid: string;
        phoneNumber: string;
        gallery: string;
        validated: boolean;
    }): Promise<boolean>;
    readGalleryUser({ uid }: {
        uid: string;
    }): Promise<Node | null>;
    deleteGalleryUser(): Promise<boolean>;
    createGalleryEdge({ galleryId, uid, relationship, }: {
        galleryId: string;
        uid: string;
        relationship: string;
    }): Promise<boolean>;
    readGalleryEdgeRelationship({ uid, }: {
        uid: string;
    }): Promise<string | boolean>;
    editGalleryEdge({ galleryId, uid, relationship, }: {
        galleryId: string;
        uid: string;
        relationship: string;
    }): Promise<any>;
    private generateUserId;
}
