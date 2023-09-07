import { Request, Response } from 'express';
import { IExhibitionService, IGalleryService } from '../services/interfaces';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { verifyToken } from 'src/middlewares/accessTokenVerify';


@controller('/collection')
export class ExhibitionController {
  constructor(
    @inject('IExhibitionService') private collectionService: IExhibitionService,
    @inject('IGalleryService') private galleryService: IGalleryService
  ) {}


  @httpPost('/create', verifyToken)
  public async createCollection(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    const {exhibition} = req.body
    try {
      const galleryId = await this.galleryService.getGalleryIdFromUID({uid: user.user_id})
      const newCollection = await this.collectionService.createCollection({exhibition, galleryId, userId: user.uid,})
      res.json(newCollection);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpGet('/readForGallery', verifyToken)
  public async getCollectionFromGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {
      
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
    try {

      res.json(null);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


  @httpPost('/listForGallery', verifyToken)
  public async listForGallery(@request() req: Request, @response() res: Response): Promise<void> {
    const user = (req as any).user;
    try {

      res.json(null);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }


}
