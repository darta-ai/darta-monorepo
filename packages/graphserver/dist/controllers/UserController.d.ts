import { Request, Response } from 'express';
import { IGalleryService, IUserService } from '../services/interfaces';
export declare class UserController {
    private userService;
    private galleryService;
    constructor(userService: IUserService, galleryService: IGalleryService);
    newGallery(req: Request, res: Response): Promise<void>;
}
