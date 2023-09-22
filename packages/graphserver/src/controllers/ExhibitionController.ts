import {Request, Response} from 'express';
import {inject} from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';

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
      res.status(500).send(error.message);
    }
  }

  // TO-DO!!!
  @httpGet('/readForUser', verifyToken)
  public async readCollectionForGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    // const {user} = req as any;
    try {
      await this.galleryService.checkDuplicateGalleries({
        userEmail: 'fake',
      });
      res.json(null);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/edit', verifyToken)
  public async editCollection(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {exhibition} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const results = await this.exhibitionService.editExhibition({
        exhibition,
        galleryId,
      });
      res.json(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteExhibitionOnly', verifyToken)
  public async deleteExhibitionOnly(
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
      });
      if (results) {
        res.send(true);
      } else {
        res.status(500).send('unable to delete exhibition');
      }
    } catch (error: any) {
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
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listForGallery', verifyToken)
  public async listForGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const results = await this.exhibitionService.listExhibitionForGallery({
        galleryId,
      });
      res.json(results);
    } catch (error: any) {
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
      res.status(500).send(error.message);
    }
  }
}
