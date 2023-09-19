import { Database } from 'arangojs';
import { Client } from 'minio';
import { IAdminService } from './interfaces';
export declare class AdminService implements IAdminService {
    private readonly db;
    private readonly minio;
    constructor(db: Database, minio: Client);
    validateAndCreateCollectionsAndEdges(): Promise<void>;
    addApprovedGallerySDL(sdl: string): Promise<string>;
    private ensureCollectionExists;
    private ensureEdgeExists;
}
