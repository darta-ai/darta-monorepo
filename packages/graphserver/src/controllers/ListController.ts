import {Request, Response} from 'express';
import {inject} from 'inversify';
import {controller, httpGet, httpPost, request, response} from 'inversify-express-utils';

import { standardConsoleLog } from '../config/templates';
import {verifyToken} from '../middleware/accessTokenVerify';
import {IListService} from '../services/interfaces';

@controller('/lists')
export class ListController {
  constructor(
    @inject('IListService') private listService: IListService,
  ) {}

  @httpPost('/createList', verifyToken)
  public async createList(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      const {newList, artworkId} = req.body;
      if (!newList || !artworkId) {
        throw new Error('!! no newList or artworkId !!');
      }
      const results = await this.listService.createList({
          newList, 
          artworkId,
          uid: user.uid,
        });
        res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'lists/createList'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }

  @httpGet('/readList', verifyToken)
  public async readList(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {listId} = req.query;
      if (!listId) {
        throw new Error('!! no listId !!');
      }
      const listIdString = listId.toString()
      const results = await this.listService.getFullList({
          listId: listIdString,
        });
        res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'lists/readList'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }

  @httpPost('/addArtworkToList', verifyToken)
  public async addArtworkToList(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      const {listId, artworkId} = req.body;
      if (!listId || !artworkId) {
        throw new Error('!! no listId or artworkId !!');
      }
      const results = await this.listService.addArtworkToList({
          artworkId,
          listId, 
          userUid: user.uid,
        });
        res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'lists/addArtworkToList'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }

  @httpPost('/deleteList', verifyToken)
  public async deleteList(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      const {listId} = req.body;
      if (!listId) {
        throw new Error('!! no listId !!');
      }
      const results = await this.listService.deleteList({
          listId, 
          userUid: user.uid,
        });
        res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'lists/deleteList'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }


  @httpPost('/removeArtworkFromList', verifyToken)
  public async removeArtworkFromList(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const {user} = req as any;
      const {listId, artworkId} = req.body;
      if (!listId || !artworkId) {
        throw new Error('!! no listId or artworkId !!');
      }
      const results = await this.listService.removeArtworkFromList({
          artworkId,
          listId, 
          userUid: user.uid,
        });
        res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'lists/removeArtworkFromList'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }


  @httpGet('/listLists', verifyToken)
  public async listLists(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const {user} = req as any;
    try {
      const results = await this.listService.listLists({
          uid: user.uid,
        });
      res.status(200).send(results);
    } catch (error: any) {
      standardConsoleLog({message: error.message, data: req?.body, request: 'lists/listLists'})
      if (!res.headersSent) {
        res.status(500).send('unable to create new list');
      }
    }
  }
}
