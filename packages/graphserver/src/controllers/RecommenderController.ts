import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpGet, request, response} from 'inversify-express-utils';

import { standardConsoleLog } from '../config/templates';
import {IRecommenderService} from '../services/interfaces';

@controller('/recommendations')
export class RecommenderController {
  constructor(
    @inject('IRecommenderService') private readonly recommenderService: IRecommenderService,
  ) {}

  @httpGet('/getDartaUserRecommendations')
  public async getDartaUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {startNumber, endNumber, uid} = req.query;
      if (!startNumber || !endNumber || !uid) {
        throw new Error('Missing required fields');
      }
      const results = await this.recommenderService.generateArtworkToRecommend({
        uid: uid as string,
        startNumber: Number(startNumber), 
        endNumber: Number(endNumber),
      });
      
      res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.query, request: 'getDartaUserRecommendations/getDartaUser'});
      res.status(500).send(error.message);
    }
  }

}
