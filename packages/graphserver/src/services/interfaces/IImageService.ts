import {Gallery} from '../../models/GalleryModel'


export interface BatchImages {
  fileBuffer: Buffer, 
  fileName: string
}

export interface ImageNeeds {
  fileBuffer: ArrayBuffer | string, 
  fileName: string, 
  bucketName: string
}

export interface IImageService {
    uploadImage({} : ImageNeeds): Promise<any>;
    fetchImage({bucketName, fileName} : {bucketName: string, fileName: string}):Promise<any>
    uploadBatchImages(arg0: BatchImages[]): Promise<Gallery | null>;
    deleteImage(arg0: BatchImages[]): Promise<Gallery | null>;
    deleteBatchImages(): Promise<void>;
  }
  