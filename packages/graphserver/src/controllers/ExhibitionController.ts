import { Request, Response } from 'express';
import { IArtworkService, IExhibitionService, IGalleryService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/accessTokenVerify';


@controller('/exhibition')
export class ExhibitionController {
  constructor(
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
    @inject('IGalleryService') private galleryService: IGalleryService,
    @inject('IArtworkService') private artworkService: IArtworkService,  ) {}


  @httpPost('/create', verifyToken)
  public async createCollection(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const {exhibition} = req.body
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const newCollection = await this.exhibitionService.createExhibition({exhibition, galleryId, userId: user.uid})
      res.json(newCollection);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/readForGallery', verifyToken)
  public async getCollectionFromGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const results = this.exhibitionService.listExhibitionForGallery({galleryId})
      console.log(results)
      res.json(null);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  @httpGet('/readForUser', verifyToken)
  public async readCollectionForGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {

      res.json(null);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/edit', verifyToken)
  public async editCollection(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const {exhibition} = req.body
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const results = this.exhibitionService.editExhibition({exhibition, galleryId})
      res.json(null);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpGet('/listForGallery', verifyToken)
  public async listForGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const results = await this.exhibitionService.listExhibitionForGallery({galleryId})
      res.json(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


}
