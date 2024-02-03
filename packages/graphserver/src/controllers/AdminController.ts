import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpGet, httpPost, request, response} from 'inversify-express-utils';

import { verifyToken } from '../middleware';
import { verifyUserIsAdmin } from '../middleware/adminTokenVerify';
import {verifyAdmin} from '../middleware/adminVerify';
import {IAdminService} from '../services/interfaces';

@controller('/admin')
export class AdminController {
  constructor(
    @inject('IAdminService') private adminService: IAdminService,
    ) {}

  @httpPost('/validateCollections', verifyAdmin)
  public async validateCollection(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      await this.adminService.validateAndCreateCollectionsAndEdges();
      res.status(200);
    } catch (error: any) {
      if (!res.headersSent) {  
        res.status(500).send('unable to validate collections'); 
      }
    }
  }

  @httpGet('/listAllExhibitionsForAdmin', verifyToken, verifyUserIsAdmin)
  public async listAllExhibitionsForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
    try {
      const results = await this.adminService.listAllExhibitionsForAdmin();
      res.status(200).send(results);
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
      const results = await this.adminService.addApprovedGallerySDL(approvedURL);
      res.status(200).send(results);
    } catch (error: any) {
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
      const results = await this.adminService.addMinioBucker(bucketName);
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

}
