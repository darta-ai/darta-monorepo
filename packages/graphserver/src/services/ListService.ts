import { FullList, List, ListPreview } from '@darta-types/dist';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import {
  IArtworkService,  
  IEdgeService,
  IListService,
  INodeService,
  IUserService} from './interfaces';


@injectable()
export class ListService implements IListService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
    @inject('IUserService') private readonly userService: IUserService,
  ) {}


  public async createList({newList, artworkId, uid} : {newList: List, artworkId: string, uid: string}) : Promise<FullList>{

    const fullUserId = this.userService.generateDartaUserId({uid});
    const fullArtworkId = this.artworkService.generateArtworkId({artworkId});
    
    // create a list node
    const list = await this.nodeService.upsertNodeById({
      collectionName: CollectionNames.DartaUserLists,
      data: newList,
    });

    if (!list || !list._id) {
      throw new Error('!! no list _id !!');
    }
    // create a connection between the user and the list node
    await this.edgeService.upsertEdge({
      edgeName: EdgeNames.FROMDartaUserTOList,
      from: fullUserId,
      to: list._id,
      data: {
        createdAt: new Date().toISOString(),
      }
    });

    // create a connection between the list node and the artwork node

    await this.edgeService.upsertEdge({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: list._id,
      to: fullArtworkId,
      data: {
        createdAt: new Date().toISOString(),
        listPosition: 0,
      }
    });

    const artwork = await this.artworkService.readArtwork(artworkId);
    
    if (!artwork) {
      throw new Error('!! no artwork !!');
    }
    return {
      ...list as FullList, 
      artwork: {
        [artworkId]: artwork,
      },
    }
  }

  public async getFullList({listId}: {listId: string}): Promise<FullList> {
    const fullListId = this.generateListId({id: listId});
    // get list node
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);

    if (!list) {
      throw new Error('!! no list !!');
    }

    // get all artworks from list
    const edges = await this.edgeService.getAllEdgesFromNode({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
    });

    if (!edges) {
      throw new Error('!! no edges for list!!');
    }

    const artworkIds = edges.sort((a, b) => {
      if (!a || !b) {
        return 0;
      }
      return a.data.listPosition - b.data.listPosition;
    }).map((edge) => edge._to)

    const artworkPromises = artworkIds.map((artworkId) => this.artworkService.readArtwork(artworkId));

    const artwork = await Promise.all(artworkPromises)

    if (!artwork) {
      throw new Error('!! no artwork !!');
    }

    return {
      ...list,
      artwork: artwork.reduce((acc: any, curr: any) => {
        if (curr) {
          acc[curr._id] = curr;
        }
        return acc;
      }, {}),
    } as FullList;
  }

  public async listLists({uid}: {uid: string}): Promise<ListPreview[]>{
    const fullUserId = this.userService.generateDartaUserId({uid});
    const edges = await this.edgeService.getAllEdgesFromNode({
      edgeName: EdgeNames.FROMDartaUserTOList,
      from: fullUserId,
    });

    if (!edges) {
      throw new Error('!! no edges when listing Lists !!');
    }

    const listIds = edges.map((edge) => edge._to);

    const listPromises = listIds.map((listId) => this.getListPreview({listId}));

    const lists = await Promise.all(listPromises);

    console.log({lists})
    if (!lists) {
      throw new Error('!! no lists !!');
    }

    return lists;
  }

  public async getListPreview({listId}: {listId: string}): Promise<ListPreview> {
    const fullListId = this.generateListId({id: listId});
    // get list node 
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);

    if (!list) {
      throw new Error('!! no list !!');
    }


    // get all artworks from list
    const edges = await this.edgeService.getEdgesFromNodeWithLimit({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
      limit: 4,
    });

    if (!edges) {
      throw new Error('!! no edges for list!!');
    }

    const artworkIds = edges.sort((a, b) => {
      if (!a || !b) {
        return 0;
      }
      return a.data.listPosition - b.data.listPosition;
    }).map((edge) => edge._to)

    const artworkPromises = artworkIds.map((artworkId) => this.artworkService.readArtworkPreview(artworkId));

    const artwork = await Promise.all(artworkPromises)

    if (!artwork) {
      throw new Error('!! no artwork !!');
    }

    return {
      ...list,
      artwork: artwork.reduce((acc: any, curr: any) => {
        if (curr) {
          acc[curr._id] = curr;
        }
        return acc;
      }, {}),
    } as ListPreview;
  }

  public async addArtworkToList({listId, artworkId}: {listId: string, artworkId: string}): Promise<any> {
    const fullListId = this.generateListId({id: listId});
    // get list node
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);

    if (!list) {
      throw new Error('!! no list !!');
    }

    // get all artworks from list
    const edges = await this.edgeService.getAllEdgesFromNode({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
    });

    if (!edges) {
      throw new Error('!! no edges !!');
    }

    let highestNumber = 0;
    edges.forEach((edge) => {
      if(edge.data.listPosition > highestNumber) {
        highestNumber = edge.data.listPosition;
      }
    })

    await this.edgeService.upsertEdge({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
      to: artworkId,
      data: {
        createdAt: new Date().toISOString(),
        listPosition: highestNumber + 1,
      }
    });

    return {
      artwork: {
        [artworkId]: await this.artworkService.readArtwork(artworkId),
      },
    } as FullList

  }

  // eslint-disable-next-line class-methods-use-this
  public generateListId({id}: {id: string}): string {
    return id.includes(CollectionNames.DartaUserLists)
      ? id
      : `${CollectionNames.DartaUserLists}/${id}`;
  }

}
