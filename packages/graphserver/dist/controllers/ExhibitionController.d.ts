import { Request, Response } from 'express';
import { IExhibitionService, IGalleryService } from '../services/interfaces';
export declare class ExhibitionController {
    private exhibitionService;
    private galleryService;
    constructor(exhibitionService: IExhibitionService, galleryService: IGalleryService);
    createCollection(req: Request, res: Response): Promise<void>;
    getCollectionFromGallery(req: Request, res: Response): Promise<void>;
    readCollectionForGallery(req: Request, res: Response): Promise<void>;
    editCollection(req: Request, res: Response): Promise<void>;
    deleteExhibitionOnly(req: Request, res: Response): Promise<void>;
    deleteExhibitionAndArtwork(req: Request, res: Response): Promise<void>;
    listForGallery(req: Request, res: Response): Promise<void>;
    reOrderExhibitionArtwork(req: Request, res: Response): Promise<void>;
}
