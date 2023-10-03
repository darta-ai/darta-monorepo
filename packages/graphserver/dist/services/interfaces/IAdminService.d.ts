export interface IAdminService {
    validateAndCreateCollectionsAndEdges(): Promise<void>;
    addApprovedGallerySDL(sdl: string): Promise<string>;
    addMinioBucker(bucketName: string): Promise<string>;
}
