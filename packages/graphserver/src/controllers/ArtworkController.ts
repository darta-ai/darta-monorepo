import { Request, Response, NextFunction } from 'express';
import { IArtworkService, IGalleryService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/';
import _ from 'lodash'


@controller('/artwork')
export class ArtworkController {
  constructor(
    @inject('IArtworkService') private artworkService: IArtworkService,
    @inject('IGalleryService') private galleryService: IGalleryService
    ) {}

  @httpPost('/create', verifyToken)
  public async createArtwork(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const {artwork} = req.body
    try {
        const galleryId = await this.galleryService.getGalleryId({uuid: user.user_id})
        const newArtwork = await this.artworkService.createArtwork({artwork, galleryId});
        res.json(newArtwork);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

@httpGet('/readArtwork')
  public async readArtwork(@request() req: Request, @response() res: Response, next: NextFunction): Promise<void> {
    console.log('in read Artwork')
    const {artworkId} = req.body
    try {
        const artwork = await this.artworkService.readArtwork(artworkId)
        const results = this.filterOutPrivateRecordsObject(artwork)
        res.json(results)
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

@httpGet('/readArtworkAndGallery')
public async readArtworkAndGallery(@request() req: Request, @response() res: Response): Promise<void> {
  const {artworkId} = req.body
  try {
      const artwork = await this.artworkService.readArtwork(artworkId)
      res.json(artwork);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

@httpPost('/edit', verifyToken)
public async editArtwork(@request() req: Request, @response() res: Response): Promise<void> {
  const user = (req as any).user;
  const {artwork} = req.body
  try {
    const galleryId = await this.galleryService.getGalleryId({uuid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge(artwork.artworkId, galleryId)
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

@httpPost('/delete', verifyToken)
public async deleteArtwork(@request() req: Request, @response() res: Response): Promise<void> {
  const user = (req as any).user;
  const {artworkId} = req.body
  try {
    const galleryId = await this.galleryService.getGalleryId({uuid: user.user_id})
    const isVerified = await this.artworkService.confirmGalleryArtworkEdge(artworkId, galleryId)
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

@httpGet('/listGalleryArtworks', verifyToken)
public async getGalleryArtworks(@request() req: Request, @response() res: Response): Promise<void> {
  const user = (req as any).user;
  try {
    const galleryId = await this.galleryService.getGalleryId({uuid: user.user_id})
    const galleryArtwork = await this.artworkService.listArtworksByGallery({galleryId});
    res.json(galleryArtwork);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

private filterOutPrivateRecordsObject(obj: any): any {
  
  const revisedObject = _.cloneDeep(obj)

  

  return obj
}

}
