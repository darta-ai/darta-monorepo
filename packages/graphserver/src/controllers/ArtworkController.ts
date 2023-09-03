import { Request, Response } from 'express';
import { IArtworkService, IGalleryService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/accessTokenVerify';


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
    const newArtwork = await this.artworkService.editArtwork({artwork, galleryId});
    res.json(newArtwork);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

}
