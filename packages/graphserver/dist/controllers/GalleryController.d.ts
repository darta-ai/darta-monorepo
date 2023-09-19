import { Request, Response } from 'express';
import { IGalleryService } from '../services/interfaces/IGalleryService';
export declare class GalleryController {
    private galleryService;
    constructor(galleryService: IGalleryService);
    getGallery(req: Request, res: Response): Promise<void>;
    editProfile(req: Request, res: Response): Promise<void>;
}
