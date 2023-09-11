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
import {IGalleryService} from '../services/interfaces/IGalleryService';

@controller('/gallery')
export class GalleryController {
  constructor(
    @inject('IGalleryService') private galleryService: IGalleryService,
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

  @httpPost('/createProfile', verifyToken)
  public async createProfile(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {email} = user;
    const {galleryName} = req.body;
    try {
      const isValidated = await this.galleryService.verifyQualifyingGallery(
        email,
      );
      const gallery = await this.galleryService.createGalleryProfile({
        galleryName,
        isValidated,
      });
      res.json(gallery);
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
