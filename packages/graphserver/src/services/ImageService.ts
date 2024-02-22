import {inject, injectable} from 'inversify';
import {Client} from 'minio';
import sharp from 'sharp';

import {IImageService, ImageData} from './interfaces/IImageService';

const sizes = [
  { name: 'largeImage', width: 1024, height: 1024 },
  { name: 'mediumImage', width: 512, height: 512 },
  { name: 'smallImage', width: 256, height: 256 }
];

@injectable()
export class ImageService implements IImageService {
  constructor(@inject('MinioClient') private readonly minio: Client) {}

  public async uploadImage({
    bucketName,
    fileName,
    fileBuffer,
  }: {
    bucketName: string;
    fileName: string;
    fileBuffer: any;
  }): Promise<any> {
    try {
      const bucketExists = await this.checkBucketExists(bucketName);
      if (!bucketExists) {
        await this.createBucket(bucketName);
      }

      const etag = await this.putObjectToBucket({
        bucketName,
        fileName,
        fileBuffer,
      });
      return {
        fileName,
        etag,
      };
    } catch (err: any) {
      // eslint-disable-next-line no-console
      throw new Error(err.message);
    }
  }


  // eslint-disable-next-line class-methods-use-this
  public async compressImage({fileBuffer}: {fileBuffer: any}): Promise<any> {
    try{
      return sharp(fileBuffer)
      .resize({ 
          width: 800, 
          height: 600, 
          fit: sharp.fit.inside // or sharp.fit.cover to fill the area, cropping if necessary
      })
      .toBuffer();
    } catch(error: any){
      throw new Error(error.message);
    }
 
  }

  // Updated method to handle multiple sizes
public async resizeAndUploadImages({
  bucketName,
  fileName,
  fileBuffer,
}: {
  bucketName: string;
  fileName: string;
  fileBuffer: any;
}): Promise<ImageData[]> {
  try {
    const resizedImages = await Promise.all(
      sizes.map(async (size) => {
        try{

          const matches = fileBuffer.match(/^data:(image\/[A-z]*);base64,/);
          if (!matches) {
            return Promise.reject(new Error('Invalid base64 format'));
          }
      
          const mimeType = matches[1];
          const base64String = fileBuffer.replace(matches[0], '');

          // Convert the base64 string to a Buffer
          const imageBuffer = Buffer.from(base64String, 'base64');


          const resizedBuffer = await sharp(imageBuffer)
          .resize({
            width: size.width,
            height: size.height,
            fit: 'contain',
          })
          .toBuffer()
          .catch((error: any) => {
            throw new Error(error.message);
          });


        const resizedFileName = `${size.name}-${fileName}`;
        const res: {
          etag: string,
          versionId: string | null
        } = await new Promise((resolve, reject) => {
          const metadata = {
            'Content-type': mimeType,
            CacheControl: 'no-cache',
          };
    
          this.minio.putObject(
            bucketName,
            resizedFileName,
            resizedBuffer,
            600,
            metadata,
            (err, etag) => {
              if (err) {
                reject(err);
              } else {
                resolve(etag);
              }
            },
          );
        });
        return { [size.name] : {etag: res?.etag, fileName: resizedFileName}}
      } catch(error: any){
        throw new Error(error.message);
      }
    })
    );
    return resizedImages as any;
  } catch (error: any) {
    throw new Error(error.message);
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
      this.minio.makeBucket(bucketName, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private putObjectToBucket({
    bucketName,
    fileName,
    fileBuffer,
  }: {
    bucketName: string;
    fileName: string;
    fileBuffer: any;
  }): Promise<any> {
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
        CacheControl: 'no-cache',
      };

      this.minio.putObject(
        bucketName,
        fileName,
        imageBuffer,
        600,
        metadata,
        (err, etag) => {
          if (err) {
            reject(err);
          } else {
            resolve(etag);
          }
        },
      );
    });
  }

  getPresignedUrl({
    bucketName,
    fileName,
  }: {
    bucketName: string;
    fileName: string;
  }): Promise<any>{
    return new Promise((resolve, reject) => {
      this.minio.presignedGetObject(bucketName, fileName,  (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

  public deleteImage({
    bucketName,
    fileName,
  }: {
    bucketName: string;
    fileName: string;
  }): Promise<any> {
    return this.minio.removeObjects(bucketName, [fileName]);
  }

  public fetchImage({
    fileName,
    bucketName,
  }: {
    fileName: string;
    bucketName: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.minio.presignedGetObject(bucketName, fileName,  (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldRegenerateUrl({url}: {url: string}): boolean {
    const urlObj = new URL(url);
  
    // Extract necessary parameters
    const amzDate = urlObj.searchParams.get("X-Amz-Date");
    const expiresStr = urlObj.searchParams.get("X-Amz-Expires");
  
    if (amzDate && expiresStr) {
      const amzExpires = parseInt(expiresStr, 10);
  
      // Parse the date
      const creationDate = new Date(
        Date.UTC(
          parseInt(amzDate.substring(0, 4), 10),
          parseInt(amzDate.substring(4, 6), 10) - 1,
          parseInt(amzDate.substring(6, 8), 10),
          parseInt(amzDate.substring(9, 11), 10),
          parseInt(amzDate.substring(11, 13), 10),
          parseInt(amzDate.substring(13, 15), 10)
        )
      );
  
      // Calculate expiration date
      const expirationDate = new Date(creationDate.getTime() + amzExpires * 1000);
  
      // Calculate the difference between now and expiration date in days
      const now = new Date();
      const timeDiff = Number(expirationDate) - Number(now);
      const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
      // Return true if the difference is less than or equal to 1 day
      return dayDiff <= 1;
    }
  
    return true;
  }
  
}
