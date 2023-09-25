import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpPost, request, response} from 'inversify-express-utils';

import {verifyAdmin} from '../middleware/adminVerify';
import {IAdminService} from '../services/interfaces';

@controller('/admin')
export class AdminController {
  constructor(@inject('IAdminService') private service: IAdminService) {}

  @httpPost('/validateCollections', verifyAdmin)
  public async validateCollection(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      await this.service.validateAndCreateCollectionsAndEdges();
      res.status(200);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/addApprovedGallery', verifyAdmin)
  public async galleryApproval(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {approvedURL} = req.body;
    try {
      const results = await this.service.addApprovedGallerySDL(approvedURL);
      res.status(200).send(results);
    } catch (error: any) {
      // console.log(error);
      res.status(500).send(error.message);
    }
  }

  @httpPost('/addMinioBucket', verifyAdmin)
  public async addMinioBucket(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {bucketName} = req.body;
    try {
      const results = await this.service.addMinioBucker(bucketName);
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
