import { Request, Response } from 'express';
import { IArtworkService, IExhibitionService, IGalleryService } from '../services/interfaces';
export declare class ArtworkController {
    private artworkService;
    private exhibitionService;
    private galleryService;
    constructor(artworkService: IArtworkService, exhibitionService: IExhibitionService, galleryService: IGalleryService);
    createArtwork(req: Request, res: Response): Promise<void>;
    createArtworkForExhibition(req: Request, res: Response): Promise<void>;
    createAndEditArtworkForExhibition(req: Request, res: Response): Promise<void>;
    readArtwork(req: Request, res: Response): Promise<void>;
    readArtworkAndGallery(req: Request, res: Response): Promise<void>;
    editArtwork(req: Request, res: Response): Promise<void>;
    editArtworkForExhibition(req: Request, res: Response): Promise<void>;
    swapArtworkOrder(req: Request, res: Response): Promise<void>;
    deleteArtwork(req: Request, res: Response): Promise<void>;
    removeArtworkFromExhibition(req: Request, res: Response): Promise<void>;
    deleteExhibitionArtwork(req: Request, res: Response): Promise<void>;
    getGalleryArtworks(req: Request, res: Response): Promise<void>;
}
