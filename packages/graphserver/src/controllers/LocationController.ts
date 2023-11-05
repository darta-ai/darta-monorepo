import {Request, Response} from 'express';
import {inject} from 'inversify';
import {
  controller,
  httpGet,
  // httpPost,
  request,
  response,
} from 'inversify-express-utils';

import {IExhibitionService} from '../services/interfaces';

@controller('/location')
export class LocationController {
  constructor(
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
  ) {}

  @httpGet('/exhibitionPinsByCity')
  public async exhibitionPinsByCity(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.cityName) {
      res.status(400).send("galleryId query parameter is required");
      return;
  }
    try {
      const results = await this.exhibitionService.listActiveExhibitionsByCity({cityName: req.query.cityName as any})
      res.json(results);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
