import { Request, Response } from 'express';
import { IGalleryService } from '../services/IGalleryService';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/accessTokenVerify';

@controller('/gallery')
export class GalleryController {
  constructor(@inject('IGalleryService') private service: IGalleryService) {}

  @httpGet('/galleryProfile', verifyToken)
  public async getGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const email = user.email;
    const domain = email.substring(email.lastIndexOf("@") + 1);
    console.log(domain)
    try {
        let gallery;
        gallery = await this.service.readGalleryProfile(user.user_id);
      if (!gallery){
        const isApproved = await this.service.verifyQualifyingGallery(domain)
        console.log({isApproved})
        gallery = await this.service.createGalleryProfile(user.user_id, isApproved)
      }
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
