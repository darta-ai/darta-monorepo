import { FirebaseUser } from '@darta-types/dist';
import {Request, Response} from 'express';
import {inject} from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';

import {verifyToken} from '../middleware/accessTokenVerify';
import {IExhibitionService, IGalleryService} from '../services/interfaces';

@controller('/gallery')
export class GalleryController {
  constructor(
    @inject('IGalleryService') private galleryService: IGalleryService,
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
  ) {}

  @httpGet('/galleryProfile', verifyToken)
  public async getGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const gallery = await this.galleryService.readGalleryProfileFromUID(
        user.user_id,
      );
      if (!gallery) {
        res.status(404).send('Cannot find gallery');
        return;
      }
      res.json(gallery);
      
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/galleryProfileForUser')
  public async getGalleryForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.galleryId) {
      res.status(400).send("galleryId query parameter is required");
      return;
  }
    try {
      const gallery = await this.galleryService.readGalleryProfileFromGalleryIdForUser(
        {galleryId: req.query.galleryId as string}
      );
      if (!gallery) {
        res.status(404).send('Cannot find gallery');
        return;
      }
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listGalleryExhibitionsForUser')
  public async listGalleryExhibitionsForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.galleryId) {
      res.status(400).send("galleryId query parameter is required");
      return;
  }
    try {
      const gallery = await this.exhibitionService.listGalleryExhibitionsForUser(
        {galleryId: req.query.galleryId as string}
      );
      if (!gallery) {
        res.status(404).send('Cannot find gallery');
        return;
      }
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listGalleryExhibitionPreviewForUser', verifyToken)
  public async listGalleryExhibitionPreviewForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.galleryId) {
      res.status(400).send("galleryId query parameter is required");
      return;
    }
    try {
      const {user} : {user: FirebaseUser} = req as any;
      const exhibitions = await this.exhibitionService.listGalleryExhibitionPreviewsForUser(
        {galleryId: req.query.galleryId as string, userId: user.uid}
      );
      if (!exhibitions) {
        res.status(404).send('Cannot find exhibitions');
        return;
      }
      res.json(exhibitions);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/editProfile', verifyToken)
  public async editProfile(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const value = req.body.data?.galleryName?.value;

      const gallery = await this.galleryService.editGalleryProfile({
        user,
        data: {...req.body.data, value},
      });
      res.json(gallery);
    } catch (error: any) {
      // console.log(error);
      res.status(500).send(error.message);
    }
  }

}
