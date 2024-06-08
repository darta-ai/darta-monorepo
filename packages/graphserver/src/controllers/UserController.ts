import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpGet, httpPost, request, response} from 'inversify-express-utils';

import { standardConsoleLog } from '../config/templates';
import {verifyToken} from '../middleware/accessTokenVerify';
import { Gallery } from '../models/GalleryModel';
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
      const verifyGallery: Gallery | null = await this.galleryService.getGalleryFromDomain({
        userEmail: user.email,
      });
      if (!verifyGallery) {
        // const isValidated = await this.galleryService.verifyQualifyingGallery(
        //   user.email,
        // );
        const {_id, ...gallery} =
          await this.galleryService.createGalleryProfile({
            galleryName,
            isValidated: false,
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
          validated: false,
        });
        res.status(200).send(gallery);
          
      } else if (verifyGallery._id) {
        await this.userService.editGalleryToUserEdge({
          galleryId: verifyGallery._id,
          uid: user.uid,
          relationship: 'USER',
        });
        res.status(200).send(verifyGallery);
      } else {
        throw new Error('!! no gallery _id !!')
      }
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'users/newGallery'})
      if (!res.headersSent) {
        res.status(500).send('unable to create gallery');
      }
    }
  }
  
  // eslint-disable-next-line class-methods-use-this
  @httpPost('/createNewDartaUser')
  public async newDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {uid} = req.body;
    try {
      await this.userService.createDartaUser({
        uid,
      });
      
      res.status(200).send(uid);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'users/createNewDartaUser'})
      if (!res.headersSent){
        res.status(500).send('unable to create user');
      }
    }
  }

  @httpPost('/createDartaUserFollowGallery')
  public async dartaUserFollowGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.body.uid || !req.body.galleryId) {
      res.status(400).send("uid or galleryId query parameter is required");
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
      standardConsoleLog({message: error.message, data: req?.body, request: 'users/createDartaUserFollowGallery'})
      if (!res.headersSent){
        res.status(500).send('unable to create user gallery connection');
      }
    }
  }

  @httpGet('/getDartaUser')
  public async getDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {uid} = req.query;
      if (!uid) {
        throw new Error('Missing required fields');
      }
      const results = await this.userService.readDartaUser({
        uid: uid as string,
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.query, request: 'users/getDartaUser'})
      if (!res.headersSent){
        res.status(500).send('unable to get user');
      }
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
        uid,
        expoPushToken
      } = req.body;
      if (!uid) {
        throw new Error('Missing required fields');
      }

      const results = await this.userService.editDartaUser({
        profilePicture: profilePicture as any,
        userName: userName as string,
        legalFirstName: legalFirstName as string,
        legalLastName: legalLastName as string,
        email: email as string, 
        uid: uid as string,
        expoPushToken: expoPushToken as string
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'users/editDartaUser'})
      if (!res.headersSent){
        res.status(500).send('unable to edit user');
      }
    }
  }

  @httpPost('/deleteDartaUser')
  public async deleteDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {
        uid
      } = req.body;
      if (!uid) {
        throw new Error('Missing required fields');
      }
      const results = await this.userService.deleteDartaUser({
        uid: uid as string,
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.body, request: 'users/deleteDartaUser'})
      if (!res.headersSent){
        res.status(500).send('unable to delete user');
      }
    }
  }

  @httpPost('/deleteDartaUserFollowGallery', verifyToken)
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
      standardConsoleLog({message: error.message, data: req.body, request: 'deleteDartaUserFollowGallery/dartaUserUnFollowGallery'})
      if (!res.headersSent){
        res.status(500).send('unable to create user gallery connection');
      }
    }
  }

  @httpGet('/listDartaUserFollowsGallery')
  public async listDartaUserFollowsGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.uid) {
      res.status(400).send("uid query parameter is required");
      return;
    }
    try {

      const results = await this.userService.listDartaUserFollowsGallery({
        uid: req.query.uid as string
      });
      res.json(results);
      
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.query, request: 'users/listDartaUserFollowsGallery'})
      if (!res.headersSent){
        res.status(500).send('unable to get user gallery connections');
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @httpGet('/incrementRouteGeneration', verifyToken)
  public async incrementRouteGeneration(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      if (!user.uid) {
        throw new Error('Missing required fields');
      };
      if (user.uid === 'GL1yalS1PQQjbOUu9dnpT7nKAEy1') {
        res.status(200).send(0);
      } else {
        const results = await this.userService.incrementRouteGeneratedCount({
          uid: user.uid as string
        });
        res.json(results);
      }
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.query, request: 'users/listDartaUserFollowsGallery'})
      if (!res.headersSent){
        res.status(500).send('unable to get user gallery connections');
      }
    }
  }
}
