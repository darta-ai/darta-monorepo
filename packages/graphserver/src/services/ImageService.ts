import { injectable, inject } from 'inversify';
import {Client} from 'minio'
import { IImageService, BatchImages } from './interfaces/IImageService';

@injectable()
export class ImageUploadService implements IImageService {
  constructor(
    @inject('MinioClient') private readonly minio: Client
    ) {}
    public async uploadImage(fileBuffer: Buffer, fileName: string, bucketName: string): Promise<any> {
      return new Promise((resolve, reject) => {

          // Check if bucket exists
          let bucketExists;
          this.minio.bucketExists(bucketName, function(err, exists) {
            if (err) {
                console.log(err);
                return;
            } else if (exists){
              bucketExists = exists
            }
          });

          if(!bucketExists) {
            this.minio.makeBucket(bucketName, function(err) {
              if (err) console.log(err);
            });
        }

        this.minio.putObject(bucketName, fileName, fileBuffer, function(err, etag) {
          if (err) {
              reject(err);
          } else {
            console.log("safe")
              resolve({
                  fileName: fileName,
                  etag: etag
              });
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


