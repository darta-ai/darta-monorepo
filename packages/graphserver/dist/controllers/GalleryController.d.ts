import { Request, Response } from 'express';
import { IExhibitionService, IGalleryService } from '../services/interfaces';
export declare class GalleryController {
    private galleryService;
    private exhibitionService;
    constructor(galleryService: IGalleryService, exhibitionService: IExhibitionService);
    getGallery(req: Request, res: Response): Promise<void>;
    getGalleryForUser(req: Request, res: Response): Promise<void>;
    listGalleryExhibitionsForUser(req: Request, res: Response): Promise<void>;
    listGalleryExhibitionPreviewForUser(req: Request, res: Response): Promise<void>;
    editProfile(req: Request, res: Response): Promise<void>;
}
