import {Request, Response} from 'express';
import {inject} from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';

import { standardConsoleLog } from '../config/templates';
import {verifyToken} from '../middleware/accessTokenVerify';
import {IExhibitionService, IGalleryService} from '../services/interfaces';

@controller('/exhibition')
export class ExhibitionController {
  constructor(
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
    @inject('IGalleryService') private galleryService: IGalleryService,
  ) {}

  @httpPost('/create', verifyToken)
  public async createCollection(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const newCollection = await this.exhibitionService.createExhibition({
        galleryId,
        userId: user.uid,
      });
      res.json(newCollection);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/create', request: null})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/readForGallery', verifyToken)
  public async getCollectionFromGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      const {exhibitionId} = req.body;
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });

      const isVerified =
        await this.exhibitionService.verifyGalleryOwnsExhibition({
          exhibitionId,
          galleryId,
        });
      if (!isVerified) {
        throw new Error('unable to verify exhibition is owned by gallery');
      }
      const results = await this.exhibitionService.readExhibitionForGallery({
        exhibitionId,
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/readForGallery', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpGet('/readForUser')
  public async readCollectionForGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.exhibitionId) {
      res.status(400).send("exhibitionId query parameter is required");
      return;
  }
    try {
      const exhibitionId = <string>req.query.exhibitionId;
      const results = await this.exhibitionService.readGalleryExhibitionForUser({
        exhibitionId,
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/readForUser', request: req?.query})
      res.status(500).send(error.message);
    }
  }

  @httpGet('/readMostRecentGalleryExhibitionForUser')
  public async readMostRecentExhibitionForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      if (!req.query?.locationId) {
        res.status(400).send("exhibitionId query parameter is required");
        return;
    }
      const results = await this.exhibitionService.readMostRecentGalleryExhibitionForUser({locationId: req.query.locationId as string});
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/readMostRecentGalleryExhibitionForUser', request: req?.query})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/edit', verifyToken)
  public async editCollection(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const {exhibition} = req.body;
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const results = await this.exhibitionService.editExhibition({
        exhibition,
        galleryId,
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/edit', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/reOrderExhibitionArtwork', verifyToken)
  public async reOrderExhibitionArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      if (!user) {
        throw new Error('no user found');
      }
      const {exhibitionId, artworkId, desiredIndex, currentIndex} = req.body;

      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });

      const isVerified =
        await this.exhibitionService.verifyGalleryOwnsExhibition({
          exhibitionId,
          galleryId,
        });
      if (!isVerified) {
        throw new Error('unable to verify exhibition is owned by gallery');
      }
      await this.exhibitionService.reOrderExhibitionArtwork({
        exhibitionId,
        artworkId,
        desiredIndex,
        currentIndex,
      });
      const results = await this.exhibitionService.listAllExhibitionArtworks({
        exhibitionId,
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/reOrderExhibitionArtwork', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteExhibitionOnly', verifyToken)
  public async deleteExhibitionOnly(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const {exhibitionId} = req.body;
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const results = await this.exhibitionService.deleteExhibition({
        exhibitionId,
        galleryId,
      });
      if (results) {
        res.send(true);
      } else {
        res.status(500).send('unable to delete exhibition');
      }
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/deleteExhibitionOnly', request: req?.body})
      res.status(500).send(error.message);
    }
  }


  @httpPost('/galleryPublishExhibition', verifyToken)
  public async galleryPublishExhibition(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {exhibitionId, isPublished} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const isVerified =
        await this.exhibitionService.verifyGalleryOwnsExhibition({
          exhibitionId,
          galleryId,
        });
      if (!isVerified) {
        throw new Error('unable to verify exhibition is owned by gallery');
      }
      const results = await this.exhibitionService.publishExhibition({
        exhibitionId,
        galleryId,
        isPublished
      });
      if (results) {
        res.send(results);
      } else {
        throw new Error('unable to delete exhibition');
      }
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/deleteExhibitionAndArtwork', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteExhibitionAndArtwork', verifyToken)
  public async deleteExhibitionAndArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {exhibitionId} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const results = await this.exhibitionService.deleteExhibition({
        exhibitionId,
        galleryId,
        deleteArtworks: true,
      });
      if (results) {
        res.send(true);
      } else {
        throw new Error('unable to delete exhibition');
      }
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/deleteExhibitionAndArtwork', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listForGallery', verifyToken)
  public async listForGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const { user } = req as any;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const results = await this.exhibitionService.listExhibitionForGallery({
        galleryId,
      });
      return res.json(results);
    } catch (error: any) {
      standardConsoleLog({
        message: error?.message,
        data: 'exhibition/listForGallery',
        request: user?.user_id,
      });
        return res.status(500).send(error.message);
    }
  }  

  @httpGet('/listAllExhibitionsPreviewsForUser')
  public async listAllExhibitionsPreviewsForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.limit) {
      res.status(400).send("limit query parameter is required");
      return;
  }
    try {
      const limit = <number>parseInt(req.query.limit.toString(), 10);
      const results = await this.exhibitionService.listExhibitionsPreviewsForUserByLimit({
        limit
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/listForGallery', request: req?.query})
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listExhibitionsPreviewsCurrentForUserByLimit', verifyToken)
  public async listExhibitionsPreviewsCurrentForUserByLimit(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {

    if (!req.query.limit) {
      res.status(400).send("limit query parameter is required");
      return;
  }
    try {
      const { user } = req as any;
      const limit = <number>parseInt(req.query.limit.toString(), 10);
      const results = await this.exhibitionService.listExhibitionsPreviewsCurrentForUserByLimit({
        limit,
        uid: user?.uid
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/listExhibitionsPreviewsCurrentForUserByLimit', request: req?.query})
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listExhibitionsPreviewsForthcomingForUserByLimit', verifyToken)
  public async listExhibitionsPreviewsForthcomingForUserByLimit(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.limit) {
      res.status(400).send("limit query parameter is required");
      return;
  }
    try {
      const { user } = req as any;
      const limit = <number>parseInt(req.query.limit.toString(), 10);
      const results = await this.exhibitionService.listExhibitionsPreviewsForthcomingForUserByLimit({
        limit, 
        uid: user?.uid
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/listExhibitionsPreviewsForthcomingForUserByLimit', request: req?.query})
      res.status(500).send(error.message);
    }
  }


  @httpGet('/listExhibitionsPreviewsUserFollowingForUserByLimit')
  public async listExhibitionsPreviewsUserFollowingForUserByLimit(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.limit || !req.query.uid) {
      res.status(400).send("limit and uid query parameter is required");
      return;
    }
    try {
      const limit = <number>parseInt(req.query.limit.toString(), 10);
      const results = await this.exhibitionService.listExhibitionsPreviewsUserFollowingForUserByLimit({
        limit, 
        uid: req.query.uid as string
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/listExhibitionsPreviewsUserFollowingForUserByLimit', request: req?.query})
      res.status(500).send(error.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @httpPost('/userViewedExhibition', verifyToken)
  public async userViewedExhibition(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const { user } = req as any;
      const {exhibitionId} = req.body;
      const results = await this.exhibitionService.setViewedExhibition({
        exhibitionId,
        uid: user?.uid
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/userViewedExhibition', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpGet('/getUnViewedExhibitionsForUser', verifyToken)
  public async getUnViewedExhibitionsForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const { user } = req as any;
      if (!user.user_id){
        throw new Error('no user found');
      }
      const results = await this.exhibitionService.getUnViewedExhibitionsForUser({uid: user.user_id});
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/userViewedExhibition', request: req?.body})
      res.status(500).send(error.message);
    }
  }
}
