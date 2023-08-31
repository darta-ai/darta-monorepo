import { Request, Response } from 'express';
import { IImageService } from '../services/interfaces/IImageService';
import { controller, httpGet, httpPost, request, response,  } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import { upload } from 'src/middlewares/upload';


@controller('/image')
export class ImageController {
  constructor(@inject('IImageService') private imageService: IImageService) {}

  public async processUploadImage({fileBuffer, fileName, bucketName} : {fileBuffer: ArrayBuffer | string, fileName: string, bucketName: string}) {
    if (fileBuffer && fileName) {
      const metadata = await this.imageService.uploadImage({fileBuffer, fileName, bucketName});
      const url = await this.processGetFile({fileName: metadata.fileName, bucketName})
      return { success: true, fileName: metadata.fileName, bucketName, value: url };
    } else {
      throw new Error("Did not receive a fileBuffer or fileName");
    }
  }

  @httpPost('/uploadImage', upload.single('galleryLogo'))
  public async uploadImage(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
      const fileBuffer = req?.file?.buffer;
      const fileName = req?.file?.originalname;
      
      if(fileBuffer && fileName){
        const result = await this.processUploadImage({fileBuffer, fileName, bucketName: 'default'});
        res.send(result);
      } else{
        res.status(404).send({success: false, message: 'cannot read fileBuffer or fileName'})
      }

    } catch (error: any) {
      res.status(500).send({ success: false, message: error.message });
    }
  }

  public async processGetFile({fileName, bucketName} : {fileName: string, bucketName: string}) {
    try {
      const metadata = await this.imageService.fetchImage({fileName, bucketName});
      return metadata
    } catch (error: any) {
      console.log(error)
      throw new Error(`received an error from minio ${error?.message}`);
    }
  }

  @httpGet('/uploadImage', upload.single('galleryLogo'))
  public async getFile(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
      const fileBuffer = req?.file?.buffer;
      const fileName = req?.file?.originalname;
      
      if(fileBuffer && fileName){
        const result = await this.processUploadImage({fileBuffer, fileName, bucketName: 'default'});
        res.send(result);
      } else{
        res.status(404).send({success: false, message: 'cannot read fileBuffer or fileName'})
      }

    } catch (error: any) {
      res.status(500).send({ success: false, message: error.message });
    }
  }
}
