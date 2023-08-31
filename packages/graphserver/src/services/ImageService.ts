import { injectable, inject } from 'inversify';
import {Client} from 'minio'
import { IImageService, BatchImages } from './interfaces/IImageService';

@injectable()
export class ImageUploadService implements IImageService {
  constructor(
    @inject('MinioClient') private readonly minio: Client
    ) {}
    public async uploadImage({bucketName, fileName, fileBuffer} : {bucketName: string, fileName: string, fileBuffer: any}): Promise<any> {
      try {
          let bucketExists = await this.checkBucketExists(bucketName);
          if(!bucketExists) {
              
              await this.createBucket(bucketName);
          }
  
          let etag = await this.putObjectToBucket({bucketName, fileName, fileBuffer});
          return {
              fileName: fileName,
              etag: etag
          };
      } catch (err) {
          console.log(err);
          throw err; // Or handle it more gracefully
      }
  }
  
  private checkBucketExists(bucketName: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
          this.minio.bucketExists(bucketName, (err, exists) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(exists);
              }
          });
      });
  }
  
  private createBucket(bucketName: string): Promise<void> {
      return new Promise((resolve, reject) => {
          this.minio.makeBucket(bucketName, (err) => {
              if (err) {
                  reject(err);
              } else {
                  resolve();
              }
          });
      });
  }
  private putObjectToBucket({bucketName, fileName, fileBuffer}: {bucketName: string, fileName: string, fileBuffer: any}): Promise<any> {
  
    const matches = fileBuffer.match(/^data:(image\/[A-z]*);base64,/);
    if (!matches) {
        return Promise.reject(new Error('Invalid base64 format'));
    }
    
    const mimeType = matches[1];
    const base64String = fileBuffer.replace(matches[0], '');
    const imageBuffer = Buffer.from(base64String, 'base64');

    return new Promise((resolve, reject) => {
        const metadata = {
            'Content-type': mimeType,
        };
        
        this.minio.putObject(bucketName, fileName, imageBuffer, 400, metadata, (err, etag) => {
            if (err) {
                reject(err);
            } else {
                resolve(etag);
            }
        });
    });
}

  
    public uploadBatchImages(arg0: BatchImages[]): Promise<any>{
      return new Promise(() => true)
    }
    public deleteImage(arg0: BatchImages[]): Promise<any>{
      return new Promise(() => true)
    }
    public deleteBatchImages(): Promise<any>{
      return new Promise(() => true)
    }
    public fetchImage({fileName, bucketName} : {fileName: string, bucketName: string}):Promise<any>{
      return new Promise((resolve, reject) => {
        this.minio.presignedGetObject(bucketName, fileName, (err, url) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
    }

}


