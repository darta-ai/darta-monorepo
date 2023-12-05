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


  public async createList({newList, artworkId, uid} : {newList: List, artworkId: string, uid: string}) : Promise<FullList> {

    const fullUserId = this.userService.generateDartaUserId({uid});
    const fullArtworkId = this.artworkService.generateArtworkId({artworkId});
    
    // create a list node
    const list = await this.nodeService.upsertNodeById({
      collectionName: CollectionNames.DartaUserLists,
      data: {...newList, createdAt: new Date().toISOString()},
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
        addedAt: new Date().toISOString(),
        listPosition: 0,
        canEdit: true,
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

  // TO-DO: add check for isCreator
  public async getFullList({listId}: {listId: string}): Promise<{[key: string] :FullList}> {
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
      if (!a || !b || !a.data || !b.data || !a.data?.listPosition || !b.data?.listPosition) {
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
      [list._id] : {
        ...list,
        artwork: artwork.reduce((acc: any, curr: any) => {
          if (curr) {
            acc[curr._id] = curr
          }
          return acc;
        }, {}),
      }
    };
  }

  public async listLists({ uid }: { uid: string }): Promise<{[key:string] :ListPreview}> {
    try {
      const fullUserId = this.userService.generateDartaUserId({ uid });
      const edges = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMDartaUserTOList,
        from: fullUserId,
      });
  
      if (!edges) {
        throw new Error('!! no edges when listing Lists !!');
      }
  
      const listIds = edges.map((edge) => edge._to);
      const listPromises = listIds.map((listId) => this.getListPreview({ listId }));
  
      const results = await Promise.allSettled(listPromises);
  
      // Filter out the successfully fulfilled promises and extract their values
      const lists = results
        .filter((result): result is PromiseFulfilledResult<ListPreview> => result.status === 'fulfilled')
        .map((result) => result.value);
  
      if (!lists.length) {
        throw new Error('!! no lists !!');
      }
  
      const listObject = lists.reduce((acc: { [key: string]: ListPreview }, curr) => {
        if (curr) {
          acc[curr._id] = this.returnListData({ list: curr });
        }
        return acc;
      }, {});
  
      return listObject; // Ensure the return type is ListPreview[]
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  public async getListPreview({listId}: {listId: string}): Promise<ListPreview> {
    const fullListId = this.generateListId({id: listId});
    // get list node 
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);

    if (!list) {
      throw new Error('!! no list !!');
    }

    // get user node
    const userEdge = await this.edgeService.getEdgeWithTo({edgeName: EdgeNames.FROMDartaUserTOList, to: fullListId});

    if (!userEdge) {
      throw new Error('!! no user edge !!');
    }

    const user = await this.userService.readDartaUser({uid: userEdge._from});

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
      if (!a || !b || !a.data || !b.data || !a.data?.listPosition || !b.data?.listPosition) {
        return 0;
      }
      return a.data.listPosition - b.data.listPosition;
    }).map((edge) => ({artworkId: edge._to, addedAt: edge?.addedAt}))

    const artworkPromises = artworkIds.map((artwork) => 
    this.artworkService.readArtworkPreview({artworkId: artwork.artworkId, addedAt: artwork.addedAt}));

    const artwork = await Promise.all(artworkPromises)

    if (!artwork) {
      throw new Error('!! no artwork !!');
    }

    return {
      ...this.returnListData(list),
      creatorName: `${user?.legalFirstName} ${user?.legalLastName}`,
      creatorProfilePicture: user?.profilePicture?.value,
      artworkPreviews: artwork.reduce((acc: any, curr: any) => {
        if (curr) {
          acc[curr._id] = curr;
        }
        return acc;
      }, {}),
    };
  }

  public async addArtworkToList({listId, artworkId, userUid}: {listId: string, artworkId: string, userUid: string}): Promise<FullList> {
    const fullListId = this.generateListId({id: listId});
    // get list node
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);

    if (!list) {
      throw new Error('!! no list !!');
    }

    const fullUserId = this.userService.generateDartaUserId({uid: userUid});

    // confirm that the user is the creator of the list
    const listEdge = await this.edgeService.getAllEdgesToPointingToNode({edgeName: EdgeNames.FROMDartaUserTOList, to: fullListId});

    if (!listEdge) {
      throw new Error('!! no list edge !!');
    }

    let canEdit = false;

    listEdge.forEach((edge) => {
      if (edge._from === fullUserId && edge.data?.canEdit) {
        canEdit = true;
      }
    })

    if (!canEdit) {
      throw new Error('!! user cannot edit list !!');
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
      if(edge.data?.listPosition >= highestNumber) {
        highestNumber = edge.data.listPosition + 1;
      }
    })

    await this.edgeService.upsertEdge({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
      to: artworkId,
      data: {
        addedAt: new Date().toISOString(),
        listPosition: highestNumber + 1,
      }
    });

    return {
      ...list,
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

  // HOLY TYPEGUARDS BATMAN
  public returnListData({list}: {list: any}): any {
    return {
      _id: list._id,
      listName: list.listName,
      creatorName: list.creatorName,
      creatorProfilePicture: list?.creatorProfilePicture,
      artworkPreviews: list?.artworkPreviews,
      isCollaborative: list?.isCollaborative,
      isPrivate: list?.isPrivate,
      createdAt: list?.createdAt,
      creator: list?.creator,
    };
  }
}
