import {Request, Response} from 'express';
import {inject} from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';

import {upload} from '../middleware/upload';
import {IImageService } from '../services/interfaces/IImageService';

export interface ProcessUploadImageResults {
  size: "largeImage" | "mediumImage" | "smallImage";
  fileName: string;
  bucketName: string;
  value: string;
} 

@controller('/image')
export class ImageController {
  constructor(@inject('IImageService') private imageService: IImageService) {}

  public async processUploadImage({
    fileBuffer,
    fileName,
    bucketName,
  }: {
    fileBuffer: ArrayBuffer | string;
    fileName: string;
    bucketName: string;
  }): Promise<ProcessUploadImageResults[]> {
    if (fileBuffer && fileName) {
      try{
        const images = await this.imageService.resizeAndUploadImages({
          fileBuffer,
          fileName,
          bucketName,
        });
        const promises = images.map(async (data) => {
          const shortFileName = Object.values(data)[0].fileName
          const url = await this.processGetFile({
            fileName: shortFileName,
            bucketName,
          });
          return {
            size: Object.keys(data)[0],
            fileName: shortFileName,
            bucketName,
            value: url,
          };
        })
        return await Promise.all(promises) as any
      } catch(error: any){
        throw new Error(error.message);
      }
    } else {
        throw new Error('Did not receive a fileBuffer or fileName');
      }
    
  }

  public async compressImage({fileBuffer}: {fileBuffer: any}): Promise<any> {
    return this.imageService.compressImage({fileBuffer});
  }

  @httpPost('/uploadImage', upload.single('galleryLogo'))
  public async uploadImage(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    // const {user} = req as any;
    try {
      const fileBuffer = req?.file?.buffer;
      const fileName = req?.file?.originalname;

      if (fileBuffer && fileName) {
        const result = await this.processUploadImage({
          fileBuffer,
          fileName,
          bucketName: 'default',
        });
        res.send(result);
      } else {
        res.status(404).send({
          success: false,
          message: 'cannot read fileBuffer or fileName',
        });
      }
    } catch (error: any) {
      res.status(500).send({success: false, message: error.message});
    }
  }

  public async processGetFile({
    fileName,
    bucketName,
  }: {
    fileName: string;
    bucketName: string;
  }): Promise<string> {
    try {
      const url = await this.imageService.getPresignedUrl({
        fileName,
        bucketName,
      });
      return url;
    } catch (error: any) {
      throw new Error(`received an error from minio ${error?.message}`);
    }
  }

  @httpGet('/getImage', upload.single('galleryLogo'))
  public async getFile(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    // const {user} = req as any;
    try {
      const fileBuffer = req?.file?.buffer;
      const fileName = req?.file?.originalname;

      if (fileBuffer && fileName) {
        const result = await this.processUploadImage({
          fileBuffer,
          fileName,
          bucketName: 'default',
        });
        res.send(result);
      } else {
        res.status(404).send({
          success: false,
          message: 'cannot read fileBuffer or fileName',
        });
      }
    } catch (error: any) {
      res.status(500).send({success: false, message: error.message});
    }
  }

  public async processDeleteImage({
    fileName,
    bucketName,
  }: {
    fileName: string;
    bucketName: string;
  }) {
    try {
      const metadata = await this.imageService.deleteImage({
        fileName,
        bucketName,
      });
      return metadata;
    } catch (error: any) {
      throw new Error(`received an error from minio ${error?.message}`);
    }
  }

  public async shouldRegenerateUrl({
    url
  }: {
    url: string;
  }) {
    return this.imageService.shouldRegenerateUrl({url});
  }
}
