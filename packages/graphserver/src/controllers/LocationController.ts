import {Request, Response} from 'express';
import {inject} from 'inversify';
import {
  controller,
  httpGet,
  // httpPost,
  request,
  response,
} from 'inversify-express-utils';

import { standardConsoleLog } from '../config/templates';
import {IExhibitionService, IListService} from '../services/interfaces';

@controller('/location')
export class LocationController {
  constructor(
    @inject('IExhibitionService') private exhibitionService: IExhibitionService,
    @inject('IListService') private listService: IListService,
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
      standardConsoleLog({message: error.message, data: req?.body, request: 'location/exhibitionPinsByCity'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }

  @httpGet('/listExhibitionPinsByListId')
  public async listExhibitionPinsByListId(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    if (!req.query.listId) {
      res.status(400).send("listId query parameter is required");
      return;
  }
    try {
      const results = await this.listService.listExhibitionPinsByListId({listId: req.query.listId as any})
      res.json(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'location/listExhibitionPinsByListId'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }

  
}
