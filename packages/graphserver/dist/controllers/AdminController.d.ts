import { Request, Response } from 'express';
import { IAdminService } from '../services/interfaces';
export declare class AdminController {
    private service;
    constructor(service: IAdminService);
    validateCollection(req: Request, res: Response): Promise<void>;
    galleryApproval(req: Request, res: Response): Promise<void>;
}
