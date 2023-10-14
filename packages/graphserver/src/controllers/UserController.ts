import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpGet, httpPost, request, response} from 'inversify-express-utils';

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
  @httpPost('/createNewDartaUser')
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

  @httpPost('/createDartaUserFollowGallery')
  public async dartaUserFollowGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.body.uid || !req.body.galleryId) {
      res.status(400).send("localStorageUid or galleryId query parameter is required");
      return;
    }
    try {
      const {uid, galleryId} = req.body

      await this.userService.createDartaUserGalleryRelationship({
        uid,
        galleryId
      });

      res.status(200).send("created user gallery connection");
    } catch (error: any) {
      // console.log(error);
      res.status(500).send(error.message);
    }
  }

  @httpGet('/getDartaUser')
  public async getDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {localStorageUid} = req.query;
      if (!localStorageUid) {
        throw new Error('Missing required fields');
      }
      const results = await this.userService.readDartaUser({
        localStorageUid: localStorageUid as string,
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/editDartaUser')
  public async editDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const { profilePicture,
        userName,
        legalFirstName,
        legalLastName,
        email, 
        localStorageUid,
        uid
      } = req.body;
      if (!localStorageUid) {
        throw new Error('Missing required fields');
      }
      const results = await this.userService.editDartaUser({
        profilePicture: profilePicture as any,
        userName: userName as string,
        legalFirstName: legalFirstName as string,
        legalLastName: legalLastName as string,
        email: email as string, 
        localStorageUid: localStorageUid as string,
        uid: uid as string
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteDartaUser')
  public async deleteDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {
        localStorageUid
      } = req.body;
      if (!localStorageUid) {
        throw new Error('Missing required fields');
      }
      const results = await this.userService.deleteDartaUser({
        localStorageUid: localStorageUid as string,
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteDartaUserFollowGallery')
  public async dartaUserUnFollowGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.body.uid || !req.body.galleryId) {
      res.status(400).send("uid query parameter is required");
      return;
    }
    try {
      const {uid, galleryId} = req.body

      await this.userService.deleteDartaUserGalleryRelationship({
        uid,
        galleryId
      });

      res.status(200).send("created user gallery connection");
    } catch (error: any) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listDartaUserFollowsGallery')
  public async listDartaUserFollowsGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.uid) {
      res.status(400).send("localStorageUid query parameter is required");
      return;
    }
    try {

      const results = await this.userService.listDartaUserFollowsGallery({
        uid: req.query.uid as string
      });
      res.json(results);
      
    } catch (error: any) {
      // console.log(error);
      res.status(500).send(error.message);
    }
  }
}
