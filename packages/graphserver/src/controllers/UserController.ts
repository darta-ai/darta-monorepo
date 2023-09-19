import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpPost, request, response} from 'inversify-express-utils';

import {verifyToken} from '../middleware/accessTokenVerify';
import {Node} from '../models/models';
import {IGalleryService, IUserService} from '../services/interfaces';

@controller('/users')
export class UserController {
  constructor(
    @inject('IUserService') private userService: IUserService,
    @inject('IGalleryService') private galleryService: IGalleryService,
  ) {}

  @httpPost('/newGallery', verifyToken)
  public async newGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {galleryName, signUpWebsite, phoneNumber} = req.body;
    try {
      const verifyGallery: Node =
        await this.galleryService.checkDuplicateGalleries({
          userEmail: user.email,
        });
      if (!verifyGallery) {
        const isValidated = await this.galleryService.verifyQualifyingGallery(
          user.email,
        );

        const {_id, ...gallery} =
          await this.galleryService.createGalleryProfile({
            galleryName,
            isValidated,
            signUpWebsite,
            userEmail: user.email,
          });
        await this.userService.createGalleryUserAndEdge({
          uid: user.uid,
          galleryId: _id!,
          email: user.email,
          phoneNumber,
          gallery: galleryName,
          relationship: 'ADMIN',
          validated: isValidated,
        });
        res.status(200).send(gallery);
      }

      await this.userService.editGalleryEdge({
        galleryId: verifyGallery._id!,
        uid: user.uid,
        relationship: 'USER',
      });
      res.status(200).send(verifyGallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
