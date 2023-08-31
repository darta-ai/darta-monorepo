import {Gallery} from '../../models/GalleryModel'


export type BatchImages = {
  fileBuffer: Buffer, 
  fileName: string
}

export interface IImageService {
    uploadImage(fileBuffer: ArrayBuffer | string, fileName: string, bucketName: string): Promise<any>;
    fetchImage({bucketName, fileName} : {bucketName: string, fileName: string}):Promise<any>
    uploadBatchImages(arg0: BatchImages[]): Promise<Gallery | null>;
    deleteImage(arg0: BatchImages[]): Promise<Gallery | null>;
    deleteBatchImages(): Promise<void>;
  }
  