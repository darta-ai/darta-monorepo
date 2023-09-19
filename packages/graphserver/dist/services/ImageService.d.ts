import { Client } from 'minio';
import { IImageService } from './interfaces/IImageService';
export declare class ImageService implements IImageService {
    private readonly minio;
    constructor(minio: Client);
    uploadImage({ bucketName, fileName, fileBuffer, }: {
        bucketName: string;
        fileName: string;
        fileBuffer: any;
    }): Promise<any>;
    private checkBucketExists;
    private createBucket;
    private putObjectToBucket;
    deleteImage({ bucketName, fileName, }: {
        bucketName: string;
        fileName: string;
    }): Promise<any>;
    fetchImage({ fileName, bucketName, }: {
        fileName: string;
        bucketName: string;
    }): Promise<any>;
}
