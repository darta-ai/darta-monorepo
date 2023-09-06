import { Request, Response } from 'express';
import { IUserService, IGalleryService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/accessTokenVerify';


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
    console.log(galleryName, signUpWebsite)
    try {
        const verifyGallery = await this.galleryService.checkDuplicateGalleries({galleryName: galleryName?.value, signUpWebsite, userEmail: user.email})
        if (verifyGallery){
          // TO-DO: create a new user node/edge
          console.log('verified')
          res.status(200).send(verifyGallery)
          return
        }
        console.log('firing off gallery Service')
        let {_id, _key, ...gallery} = await this.galleryService.createGalleryProfile({
          galleryName, 
          isValidated: verifyGallery, 
          signUpWebsite, 
          userEmail: user.email
        });
        console.log('got it', _id, user.uid, user.email)
        await this.userService.createGalleryUserAndEdge({uid: user.uid, 
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
