import { Request, Response, NextFunction } from 'express';
import { IArtworkService, IGalleryService, IExhibitionService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken, filterOutPrivateRecordsSingleObject } from 'src/middleware';
import _ from 'lodash'


@controller('/artwork')
export class ArtworkController {
  constructor(
    @inject('IArtworkService') private artworkService: IArtworkService,
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
    @inject('IGalleryService') private galleryService: IGalleryService
    ) {}

  @httpGet('/create', verifyToken)
  public async createArtwork(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const newArtwork = await this.artworkService.createArtwork({galleryId});
      res.json(newArtwork);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/createArtworkForExhibition', verifyToken)
  public async createArtworkForExhibition(@request() req: Request, @response() res: Response): Promise<void>{
    const user = (req as any).user
    const {exhibitionId, exhibitionOrder} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const artwork = await this.artworkService.createArtwork({galleryId, exhibitionOrder, exhibitionId})
      await this.exhibitionService.createExhibitionToArtworkEdge({exhibitionId, artworkId : artwork.artworkId!})
      res.json(artwork)
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpPost('/createAndEditArtworkForExhibition', verifyToken)
  public async createAndEditArtworkForExhibition(@request() req: Request, @response() res: Response): Promise<void>{
    const user = (req as any).user
    const {exhibitionId, exhibitionOrder, artwork} = req.body;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const createdArtwork = await this.artworkService.createArtwork({galleryId, exhibitionId})
      artwork.artworkId = createdArtwork.artworkId
      await this.exhibitionService.createExhibitionToArtworkEdge({exhibitionId, artworkId : artwork.artworkId!})
      const results = await this.artworkService.editArtwork({artwork})
      res.json(results)
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


// OPEN Endpoint
@httpGet('/readArtwork')
  public async readArtwork(@request() req: Request, @response() res: Response, next: NextFunction): Promise<void> {
    const {artworkId} = req.body
    try {
        const artwork = await this.artworkService.readArtwork(artworkId)
        // removing anything that isPrivate 
        const artworkResults = filterOutPrivateRecordsSingleObject(artwork)
        res.json(artworkResults)
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

// OPEN Endpoint
@httpGet('/readArtworkAndGallery')
public async readArtworkAndGallery(@request() req: Request, @response() res: Response): Promise<void> {
  const {artworkId} = req.body
  try {
      const results = await this.artworkService.readArtworkAndGallery(artworkId)
      // removing anything that isPrivate 
      const artworkResults = filterOutPrivateRecordsSingleObject(results)
      res.json(results);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}


@httpPost('/edit', verifyToken)
public async editArtwork(@request() req: Request, @response() res: Response): Promise<void> {
  const user = (req as any).user;
  const {artwork} = req.body
  try {
    const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge({artworkId: artwork.artworkId, galleryId})
    if (!isVerified) {
      res.status(403).send('Unauthorized');
      return;  
    }
    const newArtwork = await this.artworkService.editArtwork({artwork});
    res.json(newArtwork);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

@httpPost('/editArtworkForExhibition', verifyToken)
public async editArtworkForExhibition(@request() req: Request, @response() res: Response): Promise<void>{
  const user = (req as any).user
  const {artwork} = req.body;
  try {
    const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge({artworkId: artwork.artworkId, galleryId})
    if (!isVerified) {
      res.status(403).send('Unauthorized');
      return;  
    }
    const results = await this.artworkService.editArtwork({artwork})
    res.json(results)
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}


@httpPost('/delete', verifyToken)
public async deleteArtwork(@request() req: Request, @response() res: Response): Promise<void> {
  const user = (req as any).user;
  const {artworkId} = req.body
  try {
    const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge({artworkId, galleryId})
    if (!isVerified) {
      res.status(403).send('Unauthorized');
      return;  
    }
    const deleteArtwork = await this.artworkService.deleteArtwork({artworkId});
    res.json({success : deleteArtwork});
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}


@httpPost('/removeArtworkFromExhibition', verifyToken)
public async removeArtworkFromExhibition(@request() req: Request, @response() res: Response): Promise<void>{
  const user = (req as any).user
  const {artworkId, exhibitionId} = req.body;
  try {
    const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge({artworkId, galleryId})
    if (!isVerified) {
      res.status(403).send('Unauthorized');
      return;  
    }
    await this.exhibitionService.deleteExhibitionToArtworkEdge({exhibitionId, artworkId})
    const results = await this.exhibitionService.readExhibitionForGallery({exhibitionId, galleryId})
    res.json(results)
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

@httpPost('/deleteExhibitionArtwork', verifyToken)
public async deleteExhibitionArtwork(@request() req: Request, @response() res: Response): Promise<void>{
  const user = (req as any).user
  const {artworkId, exhibitionId} = req.body;
  try {
    const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge({artworkId, galleryId})
    if (!isVerified) {
      res.status(403).send('Unauthorized');
      return;  
    }
    await this.artworkService.deleteArtwork({artworkId})
    await this.exhibitionService.deleteExhibitionToArtworkEdge({exhibitionId, artworkId})
    const results = await this.exhibitionService.readExhibitionForGallery({exhibitionId, galleryId})
    res.json(results)
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

@httpGet('/listGalleryArtworks', verifyToken)
public async getGalleryArtworks(@request() req: Request, @response() res: Response): Promise<void> {
  const user = (req as any).user;
  try {
    const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
    console.log(galleryId)
    const galleryArtwork = await this.artworkService.listArtworksByGallery({galleryId});
    res.json(galleryArtwork);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}


}
