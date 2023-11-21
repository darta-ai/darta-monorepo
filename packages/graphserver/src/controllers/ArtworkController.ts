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
import {filterOutPrivateRecordsSingleObject, verifyToken} from '../middleware';
import {
  IArtworkService,
  IExhibitionService,
  IGalleryService,
} from '../services/interfaces';

@controller('/artwork')
export class ArtworkController {
  constructor(
    @inject('IArtworkService') private artworkService: IArtworkService,
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
    @inject('IGalleryService') private galleryService: IGalleryService,
  ) {}

  @httpGet('/create', verifyToken)
  public async createArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const newArtwork = await this.artworkService.createArtwork({galleryId});
      res.json(newArtwork);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/create', request: user?.user_id})
      if (!res.headersSent) {
        res.status(500).send('unable to create artwork');
      }
    }
  }

  @httpPost('/createArtworkForExhibition', verifyToken)
  public async createArtworkForExhibition(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {exhibitionId} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const artwork = await this.artworkService.createArtwork({
        galleryId,
        exhibitionId,
      });
      const exhibitionOrder =
        await this.exhibitionService.createExhibitionToArtworkEdgeWithExhibitionOrder(
          {
            exhibitionId,
            artworkId: artwork.artworkId!,
          },
        );
      res.json({
        artwork: {...artwork, exhibitionOrder: Number(exhibitionOrder)},
      });
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/createArtworkForExhibition', request: user?.user_id})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/createAndEditArtworkForExhibition', verifyToken)
  public async createAndEditArtworkForExhibition(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {exhibitionId, artwork} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const createdArtwork = await this.artworkService.createArtwork({
        galleryId,
        exhibitionId,
      });
      artwork.artworkId = createdArtwork.artworkId;
      await this.exhibitionService.createExhibitionToArtworkEdgeWithExhibitionOrder(
        {
          exhibitionId,
          artworkId: artwork.artworkId!,
        },
      );
      const results = await this.artworkService.editArtwork({artwork});
      if (results) {
        // results.exhibitionOrder = exhibitionOrder;
        res.json(results);
      } else {
        res
          .status(500)
          .send('unable to create and edit artwork for exhibition');
      }
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/createUserArtworkRelationship')
  public async createUserArtworkRelationship(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {uid, action, artworkId}  = req.body;
    if (!uid || !action || !artworkId) {
      res.status(500).send('missing uid or action');
      return;
    }
    try {
      await this.artworkService.createUserArtworkRelationship({
        uid,
        action,
        artworkId,
      });
      res.status(200).send("successfully created user artwork relationship");
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/createUserArtworkRelationship', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteUserArtworkRelationship')
  public async deleteUserArtworkRelationship(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {uid, action, artworkId}  = req.body;
    if (!uid || !action || !artworkId) {
      res.status(500).send('missing uid or action');
      return;
    }
    try {
      await this.artworkService.deleteUserArtworkRelationship({
        uid,
        action,
        artworkId,
      });
      res.status(200).send("successfully created user artwork relationship");
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/deleteUserArtworkRelationship', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  // OPEN Endpoint
  @httpGet('/readArtworkForUser')
  public async readArtworkForUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {artworkId} = req.query;
      const artwork = await this.artworkService.readArtwork(artworkId as string);
      // removing anything that isPrivate
      const artworkResults = filterOutPrivateRecordsSingleObject(artwork);
      res.json(artworkResults);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/readArtworkForUser', request: req?.query})
      res.status(500).send(error.message);
    }
  }

  // OPEN Endpoint
  @httpGet('/readArtworkAndGallery')
  public async readArtworkAndGallery(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {artworkId} = req.body;
    try {
      const results = await this.artworkService.readArtworkAndGallery(
        artworkId,
      );
      // removing anything that isPrivate
      await filterOutPrivateRecordsSingleObject(results);
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/readArtworkAndGallery', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/edit', verifyToken)
  public async editArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {artwork} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const isVerified = await this.artworkService.confirmGalleryArtworkEdge({
        artworkId: artwork.artworkId,
        galleryId,
      });
      if (!isVerified) {
        res.status(403).send('Unauthorized');
        return;
      }
      const newArtwork = await this.artworkService.editArtwork({artwork});
      res.json(newArtwork);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/edit', request: req?.body})
      res.status(500).send(error.message);
    }
  }

  @httpPost('/editArtworkForExhibition', verifyToken)
  public async editArtworkForExhibition(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {artwork} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const isVerified = await this.artworkService.confirmGalleryArtworkEdge({
        artworkId: artwork.artworkId,
        galleryId,
      });
      if (!isVerified) {
        res.status(403).send('Unauthorized');
        return;
      }
      const results = await this.artworkService.editArtwork({artwork});
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/editArtworkForExhibition', request: req?.body})
      res.status(500).send(error.message);
    }
  }


  @httpPost('/editArtworkInquiry', verifyToken)
  public async editArtworkInquiry(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    // eslint-disable-next-line camelcase
    const {edge_id, status} = req.body
    try {
      const inquiry = await this.artworkService.editArtworkInquiry({
        // eslint-disable-next-line camelcase
        edgeId: edge_id, status,
      });
      res.json(inquiry);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/listArtworkInquires', request: req?.body})
      res.status(500).send(error.message);
    }
  }


  @httpPost('/swapArtworkOrder', verifyToken)
  public async swapArtworkOrder(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {artworkId, order} = req.body;
    try {
      const results = await this.artworkService.swapArtworkOrder({
        artworkId,
        order,
      });
      res.json(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/delete', verifyToken)
  public async deleteArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {artworkId} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const isVerified = await this.artworkService.confirmGalleryArtworkEdge({
        artworkId,
        galleryId,
      });
      if (!isVerified) {
        res.status(403).send('Unauthorized');
        return;
      }
      const deleteArtwork = await this.artworkService.deleteArtwork({
        artworkId,
      });
      res.json({success: deleteArtwork});
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/removeArtworkFromExhibition', verifyToken)
  public async removeArtworkFromExhibition(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {artworkId, exhibitionId} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const isVerified = await this.artworkService.confirmGalleryArtworkEdge({
        artworkId,
        galleryId,
      });
      if (!isVerified) {
        res.status(403).send('Unauthorized');
        return;
      }
      await this.exhibitionService.deleteExhibitionToArtworkEdge({
        exhibitionId,
        artworkId,
      });
      const results = await this.exhibitionService.readExhibitionForGallery({
        exhibitionId,
      });
      res.json(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/deleteExhibitionArtwork', verifyToken)
  public async deleteExhibitionArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    const {artworkId, exhibitionId} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const isVerified = await this.artworkService.confirmGalleryArtworkEdge({
        artworkId,
        galleryId,
      });
      if (!isVerified) {
        res.status(403).send('Unauthorized');
        return;
      }
      await this.artworkService.deleteArtwork({artworkId});
      const results = await this.exhibitionService.readExhibitionForGallery({
        exhibitionId,
      });
      res.json(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listGalleryArtworks', verifyToken)
  public async getGalleryArtworks(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const galleryArtwork = await this.artworkService.listArtworksByGallery({
        galleryId,
      });
      res.json(galleryArtwork);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/listArtworkInquires', verifyToken)
  public async listArtworkInquires(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({
        uid: user.user_id,
      });
      const inquires = await this.artworkService.listArtworkInquiresByGallery({
        galleryId,
      });
      res.json(inquires);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/listArtworkInquires', request: user?.user_id})
      res.status(500).send(error.message);
    }
  }


  @httpGet('/listUserArtworkRelationships')
  public async listUserLikedArtwork(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {uid, limit, action} = req.query;
      if (!uid || !limit || !action) {
        res.status(500).send('missing uid or limit or action');
        return;
      }
      const galleryArtwork = await this.artworkService.listUserRelationshipArtworkByLimit({
        uid: uid.toString(), limit: Number(limit), action: action.toString(),
      });
      res.json(galleryArtwork);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'artwork/listUserArtworkRelationships', request: req?.query})
      res.status(500).send(error.message);
    }
  }
}
