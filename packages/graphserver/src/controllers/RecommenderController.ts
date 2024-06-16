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

      const savedArtworks = await this.recommenderService.readArtworksToRecommend({uid: uid as string, startNumber: Number(startNumber)});
      
      if(Object.values(savedArtworks)?.length > 0){
        res.status(200).send(savedArtworks);
        await this.recommenderService.generateAndSaveArtworkToRecommend(
          {uid: uid as string, startNumber: Number(startNumber), endNumber: Number(endNumber)}
        );
        return;
      } 

      const results = await this.recommenderService.executeRecommendationQuery({
        uid: uid as string,
        startNumber: Number(startNumber), 
        endNumber: Number(endNumber),
      });
      res.status(200).send(results);
      await this.recommenderService.generateNewArtworksToRecommendBackfill({uid: uid as string, generatedArtworks: results})
    
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.query, request: 'getDartaUserRecommendations/getDartaUser'});
      res.status(500).send(error.message);
    }
  }

  @httpGet('/getRecommendationsRandomSampling')
  public async getRecommendationsRandomSampling(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {startNumber, endNumber, uid} = req.query;
      if (!startNumber || !endNumber || !uid) {
        throw new Error('Missing required fields');
      }

      const {artworkIds} = req.query;

      const savedArtworks = await this.recommenderService.readArtworksToRecommend({uid: uid as string, startNumber: Number(startNumber)});

      if(Object.values(savedArtworks)?.length > 0){
        res.status(200).send(savedArtworks);
        await this.recommenderService.generateAndSaveArtworkToRecommend(
          {uid: uid as string, startNumber: Number(startNumber), endNumber: Number(endNumber)}
        );
        return;
      }

      const results = await this.recommenderService.getRecommendationsRandomSampling({
        uid: uid as string,
        startNumber: Number(startNumber), 
        endNumber: Number(endNumber),
        artworkIds: artworkIds as string[]
      });
      
      res.status(200).send(results);

      await this.recommenderService.generateNewArtworksToRecommendBackfill({uid: uid as string, generatedArtworks: results})

    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req.query, request: 'getDartaUserRecommendations/getRecommendationsRandomSampling'});
      res.status(500).send(error.message);
    }
  }

}
