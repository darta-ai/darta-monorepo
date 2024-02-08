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

  @httpGet('/getGalleryForAdmin', verifyToken, verifyUserIsAdmin)
  public async getGalleryForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.query.galleryId) {
        throw new Error('galleryId is required');
      }
      const results = await this.adminService.getGalleryForAdmin({galleryId: req.query.galleryId.toString()});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/createExhibitionForAdmin', verifyToken, verifyUserIsAdmin)
  public async createExhibitionForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.galleryId) {
        throw new Error('galleryId is required');
      }
      const {user} = req as any;
      const results = await this.adminService.createExhibitionForAdmin({galleryId: req.body.galleryId, userId: user.user_id});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/updateExhibitionForAdmin', verifyToken, verifyUserIsAdmin)
  public async updateExhibitionForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.galleryId || !req.body.exhibition) {
        throw new Error('galleryId or exhibition is required');
      }
      const results = await this.adminService.editExhibitionForAdmin({exhibition: req.body.exhibition, galleryId: req.body.galleryId});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listGalleryExhibitionsForAdmin', verifyToken, verifyUserIsAdmin)
  public async listGalleryExhibitionsForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.query.galleryId) {
        throw new Error('galleryId is required');
      }
      const results = await this.adminService.listGalleryExhibitionsForAdmin({galleryId: req.query.galleryId.toString()});
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
