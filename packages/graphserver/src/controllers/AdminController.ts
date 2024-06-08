import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpGet, httpPost, request, response} from 'inversify-express-utils';

import { standardConsoleLog } from '../config/templates';
import { verifyToken } from '../middleware';
import { verifyUserIsAdmin } from '../middleware/adminTokenVerify';
import {verifyAdmin} from '../middleware/adminVerify';
import { IAdminService, IScrapeService } from '../services/interfaces';

@controller('/admin')
export class AdminController {
  constructor(
    @inject('IAdminService') private adminService: IAdminService,
    @inject('IScrapeService') private scrapeService: IScrapeService,
    ) {}

  @httpPost('/validateCollections', verifyAdmin)
  public async validateCollection(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      await this.adminService.validateAndCreateCollectionsAndEdges();
      res.status(200);
    } catch (error: any) {
      if (!res.headersSent) {  
        res.status(500).send('unable to validate collections'); 
      }
    }
  }

  @httpGet('/listAllExhibitionsForAdmin', verifyToken, verifyUserIsAdmin)
  public async listAllExhibitionsForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
    try {
      const results = await this.adminService.listAllExhibitionsForAdmin();
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/getGalleryForAdmin', verifyToken, verifyUserIsAdmin)
  public async getGalleryForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.query.galleryId) {
        throw new Error('galleryId is required');
      }
      const results = await this.adminService.getGalleryForAdmin({galleryId: req.query.galleryId.toString()});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/createExhibitionForAdmin', verifyToken, verifyUserIsAdmin)
  public async createExhibitionForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.galleryId) {
        throw new Error('galleryId is required');
      }
      const {user} = req as any;
      const results = await this.adminService.createExhibitionForAdmin({galleryId: req.body.galleryId, userId: user.user_id});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/updateExhibitionForAdmin', verifyToken, verifyUserIsAdmin)
  public async updateExhibitionForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.galleryId || !req.body.exhibition) {
        throw new Error('galleryId or exhibition is required');
      }
      const results = await this.adminService.editExhibitionForAdmin({exhibition: req.body.exhibition, galleryId: req.body.galleryId});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/createExhibitionArtworkForAdmin', verifyToken, verifyUserIsAdmin)
  public async createExhibitionArtworkForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.galleryId || !req.body.exhibitionId) {
        throw new Error('galleryId or exhibition is required');
      }
      const artwork = await this.adminService.createArtworkForAdmin({galleryId: req.body.galleryId, exhibitionId: req.body.exhibitionId});
      if (!artwork || !artwork._id) {
        throw new Error('Unable to create artwork');
      }
      const exhibitionOrder = await this.adminService.createExhibitionToArtworkEdgeWithExhibitionOrder(
        {exhibitionId: req.body.exhibitionId, artworkId: artwork._id});
      res.status(200).send({artwork: {...artwork, exhibitionOrder: Number(exhibitionOrder)}});
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/editExhibitionArtworkForAdmin', verifyToken, verifyUserIsAdmin)
  public async editExhibitionArtworkForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.artwork) {
        throw new Error('galleryId or exhibition is required');
      }
      const artwork = await this.adminService.editArtworkForAdmin({artwork: req.body.artwork});
      res.status(200).send(artwork);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/deleteExhibitionArtworkForAdmin', verifyToken, verifyUserIsAdmin)
  public async deleteExhibitionArtworkForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.body.artworkId || !req.body.exhibitionId) {
        throw new Error('artworkId or exhibitionId is required');
      }
      const results = await this.adminService.deleteExhibitionArtworkForAdmin({artworkId: req.body.artworkId, exhibitionId: req.body.exhibitionId});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  
  @httpPost('/reOrderExhibitionArtwork', verifyToken, verifyUserIsAdmin)
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

      if (!exhibitionId || !artworkId) {
        throw new Error(`incomplete data is required ${exhibitionId} ${artworkId} ${desiredIndex} ${currentIndex}`);
      }
      await this.adminService.reOrderExhibitionArtworkForAdmin({
        exhibitionId,
        artworkId,
        desiredIndex,
        currentIndex,
      });
      const results = await this.adminService.listAllExhibitionArtworksForAdmin({
        exhibitionId,
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/reOrderExhibitionArtwork', request: req?.body})
      res.status(500).send(error.message);
    }
  }


  
  @httpPost('/deleteExhibitionForAdmin', verifyToken, verifyUserIsAdmin)
  public async deleteExhibitionForAdmin(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {exhibitionId, galleryId} = req.body;

      if (!exhibitionId) {
        throw new Error(`incomplete data is required ${exhibitionId}`);
      }
      const results = await this.adminService.deleteExhibitionForAdmin({
        exhibitionId,
        galleryId
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/reOrderExhibitionArtwork', request: req?.body})
      res.status(500).send(error.message);
    }
  }


  @httpPost('/publishExhibitionForAdmin', verifyToken, verifyUserIsAdmin)
  public async publishExhibitionForAdmin(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {exhibitionId, galleryId, isPublished} = req.body;

      if (!exhibitionId || !galleryId) {
        throw new Error(`incomplete data is required ${exhibitionId} ${galleryId}`);
      }

      const results = await this.adminService.publishExhibitionForAdmin({
        exhibitionId,
        galleryId,
        isPublished,
      });
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error?.message, data: 'exhibition/reOrderExhibitionArtwork', request: req?.body})
      res.status(500).send(error.message);
    }
  }


  @httpGet('/listGalleryExhibitionsForAdmin', verifyToken, verifyUserIsAdmin)
  public async listGalleryExhibitionsForAdmin(
    @request() req: Request,
    @response() res: Response,
    ): Promise<void> {
      try {
      if (!req.query.galleryId) {
        throw new Error('galleryId is required');
      }
      const results = await this.adminService.listGalleryExhibitionsForAdmin({galleryId: req.query.galleryId.toString()});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }



  @httpPost('/addApprovedGallery', verifyAdmin)
  public async galleryApproval(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {approvedURL} = req.body;
    try {
      const results = await this.adminService.addApprovedGallerySDL(approvedURL);
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/addMinioBucket', verifyAdmin)
  public async addMinioBucket(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {bucketName} = req.body;
    try {
      const results = await this.adminService.addMinioBucker(bucketName);
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  // @httpPost('/scrapeFromArtLogic', verifyToken, verifyUserIsAdmin)
  // public async scrapeFromArtLogic(
  //   @request() req: Request,
  //   @response() res: Response,
  // ): Promise<void> {
  //   try {
  //     const {artLogicUrl : url, galleryId} = req.body;
  //     const {user} = req as any;
  //     const results = await this.scrapeService.scrapeFromArtLogic({url, galleryId, userId: user.user_id });
  //     res.status(200).send(results);
  //   } catch (error: any) {
  //     res.status(500).send(error.message);
  //   }
  // }

  @httpPost('/generateArtworksFromArtLogicUrl', verifyToken, verifyUserIsAdmin)
  public async generateArtworksFromArtLogicUrl(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {artworksUrl : url, galleryId, exhibitionId} = req.body;
      const {user} = req as any;
      const results = await this.scrapeService.generateArtworksFromArtLogicUrl({url, galleryId, userId: user.user_id, exhibitionId});
      res.status(200).send(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
