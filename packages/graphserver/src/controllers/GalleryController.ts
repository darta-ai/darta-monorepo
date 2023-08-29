import { Request, Response } from 'express';
import { IGalleryService } from '../services/IGalleryService';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/accessTokenVerify';

@controller('/gallery')
export class GalleryController {
  constructor(@inject('IGalleryService') private service: IGalleryService) {}

  @httpGet('/galleryProfile', verifyToken)
  public async getGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
        let gallery;
        gallery = await this.service.readGalleryProfile(user.user_id);
      if (!gallery){
        res.status(404).send("cannot find gallery")
      }
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/createProfile', verifyToken)
  public async createProfile(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const email = user.email;
    const {galleryName, signUpWebsite, primaryOwnerPhone, primaryOwnerEmail} = req.body
    try{
    const isValidated = await this.service.verifyQualifyingGallery(email)
    const gallery = await this.service.createGalleryProfile({primaryUUID: user.user_id, primaryOwnerPhone, primaryOwnerEmail, galleryName, signUpWebsite, isValidated})
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/updateProfile', verifyToken)
  public async updateProfile(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const email = user?.email;
    try{
      const gallery = await this.service.createGalleryProfile(req.body)
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
