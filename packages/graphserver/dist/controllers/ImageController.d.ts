import { Request, Response } from 'express';
import { IImageService } from '../services/interfaces/IImageService';
export declare class ImageController {
    private imageService;
    constructor(imageService: IImageService);
    processUploadImage({ fileBuffer, fileName, bucketName, }: {
        fileBuffer: ArrayBuffer | string;
        fileName: string;
        bucketName: string;
    }): Promise<{
        success: boolean;
        fileName: any;
        bucketName: string;
        value: any;
    }>;
    uploadImage(req: Request, res: Response): Promise<void>;
    processGetFile({ fileName, bucketName, }: {
        fileName: string;
        bucketName: string;
    }): Promise<any>;
    getFile(req: Request, res: Response): Promise<void>;
    processDeleteImage({ fileName, bucketName, }: {
        fileName: string;
        bucketName: string;
    }): Promise<any>;
}
