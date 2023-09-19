export interface IAdminService {
  validateAndCreateCollectionsAndEdges(): Promise<void>;
  addApprovedGallerySDL(sdl: string): Promise<string>;
}
