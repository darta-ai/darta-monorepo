import { Request, Response } from 'express';
import { IUserService, IGalleryService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middleware/accessTokenVerify';


@controller('/users')
export class UserController {
  constructor(
    @inject('IUserService') private userService: IUserService,
    @inject('IGalleryService') private galleryService: IGalleryService,
    ) {}

  @httpPost('/newGallery', verifyToken)
  public async newGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const {galleryName, signUpWebsite, phoneNumber} = req.body
    try {
        const verifyGallery = await this.galleryService.checkDuplicateGalleries({userEmail: user.email})
        if (verifyGallery){
          // TO-DO: create a new user node/edge
          res.status(200).send(verifyGallery)
          return
        }
        const isValidated = await this.galleryService.verifyQualifyingGallery(user.email)

        let {_id, ...gallery} = await this.galleryService.createGalleryProfile({
          galleryName, 
          isValidated, 
          signUpWebsite, 
          userEmail: user.email
        });
        await this.userService.createGalleryUserAndEdge({
          uid: user.uid, 
          galleryId: _id!, 
          email: user.email, 
          phoneNumber, 
          gallery: galleryName, 
          relationship: 'ADMIN', 
          validated: true 
        })
        
        res.json(gallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
