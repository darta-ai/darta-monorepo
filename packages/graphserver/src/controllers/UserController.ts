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
      let verifyGallery: Node | any;
      if (!user.email.includes('darta.art')) {
        verifyGallery =
          await this.galleryService.checkDuplicateGalleries({
            userEmail: user.email,
          });
      }
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
        galleryId: verifyGallery._id,
        uid: user.uid,
        relationship: 'USER',
      });
      res.status(200).send(verifyGallery);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
  
  // eslint-disable-next-line class-methods-use-this
  @httpPost('/newDartaUser')
  public async newDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {localStorageUid} = req.body;
    try {
      await this.userService.createDartaUser({
        localStorageUid,
      });
      
      res.status(200).send(localStorageUid);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/editDartaUser')
  public async editDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {profilePicture,
      userName,
      legalFirstName,
      legalLastName,
      uid} = req.body;
    try {
      if (!profilePicture || !userName || !legalFirstName || !legalLastName || !uid) {
        throw new Error('Missing required fields');
      }
      const results = await this.userService.editDartaUser({
        profilePicture,
        userName,
        legalFirstName,
        legalLastName,
        uid
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
