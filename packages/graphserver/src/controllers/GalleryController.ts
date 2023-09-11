import { Request, Response } from 'express';
import { IGalleryService } from '../services/interfaces/IGalleryService';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middleware/accessTokenVerify';


@controller('/gallery')
export class GalleryController {
  constructor(@inject('IGalleryService') private galleryService: IGalleryService) {}

  @httpGet('/galleryProfile', verifyToken)
  public async getGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
        const gallery = await this.galleryService.readGalleryProfileFromUID(user.user_id);
      if (!gallery){
        res.status(404).send("Cannot find gallery")
        return
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
    const {galleryName} = req.body
    try{
    const isValidated = await this.galleryService.verifyQualifyingGallery(email)
    const gallery = await this.galleryService.createGalleryProfile({galleryName, isValidated})
      res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/editProfile', verifyToken)
  public async editProfile(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try{
      const value = req.body.data?.galleryName?.value

      const gallery = await this.galleryService.editGalleryProfile({user, data: {...req.body.data, value}})
      res.json(gallery);
    } catch (error: any) {
      console.log(error)
      res.status(500).send(error.message);
    }
  }
}
