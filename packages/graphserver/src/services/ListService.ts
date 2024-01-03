import { ExhibitionMapPin, FullList, List, ListPreview } from '@darta-types/dist';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import {
  IArtworkService,  
  IEdgeService,
  IExhibitionService,
  IGalleryService,
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
    @inject('IExhibitionService') private readonly exhibitionService: IExhibitionService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
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
    // TO-DO: fix return statement 
    return {
      ...list as FullList
    }
  }

  // TO-DO: add check for isCreator
  public async getFullList({listId}: {listId: string}): Promise<{[key: string] : FullList}> {
    try{
      const fullListId = this.generateListId({id: listId});
      // get list node

      const list: FullList = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);
  
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
  
      // Fetch both artwork/gallery and exhibition data in parallel
      const artworkPromises = artworkIds.map((artworkId) => 
        this.artworkService.readArtworkForList(artworkId)
      );
  
      const galleryPromises = artworkIds.map((artworkId) =>
        this.galleryService.readGalleryForList({artworkId})
      );
  
      const exhibitionPromises = artworkIds.map((artworkId) => 
        this.exhibitionService.readExhibitionForList({artworkId})
      );
  
      // Wait for all promises to resolve
      const [artworks, galleries, exhibitions] = await Promise.all([
        Promise.all(artworkPromises),
        Promise.all(galleryPromises),
        Promise.all(exhibitionPromises)
      ]);
  
      if (!artworks) {
        throw new Error('!! no artwork !!');
      }
  
      // Combine artworks and exhibitions into ArtworkListInformation objects
      const combinedData = artworks.map((artwork, index) => ({
          [artwork?._id as string] : {
          artwork: artwork || null,
          gallery: galleries[index] || null,
          exhibition: exhibitions[index] || null
        }
      }));

      const results = {
        [listId]: {
          ...list,
          artwork: combinedData.reduce((acc, curr) => {
            const id = Object.keys(curr)[0];
            acc[id] = {
              artwork: curr[id].artwork,
              gallery: curr[id].gallery,
              exhibition: curr[id].exhibition,
            };
            return acc;
          }, {}),
        }
      }

      return results

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async listLists({ uid }: { uid: string }): Promise<{[key:string] : ListPreview}> {
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
      limit: 1,
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
      ...list,
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

  public async addArtworkToList({listId, artworkId, userUid}: {listId: string, artworkId: string, userUid: string}): Promise<{[key: string] : FullList}> {

    try{
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
      if (edge._from === fullUserId) {
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
        listPosition: highestNumber,
      }
    });



    return await this.getFullList({listId}) 
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async removeArtworkFromList(
    {listId, artworkId, userUid} : 
    {listId: string, artworkId: string, userUid: string}): Promise<{[key: string] : FullList}> {
    try {
    const fullListId = this.generateListId({id: listId});
    // get list node
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);
    const fullUserId = this.userService.generateDartaUserId({uid: userUid});

  
    if (!list) {
      throw new Error('!! no list !!');
    }

     // confirm that the user is the creator of the list
     const listEdge = await this.edgeService.getAllEdgesToPointingToNode({edgeName: EdgeNames.FROMDartaUserTOList, to: fullListId});

     if (!listEdge) {
       throw new Error('!! no list edge !!');
     }
 
     let canEdit = false;
 
     listEdge.forEach((edge) => {
       if (edge._from === fullUserId) {
         canEdit = true;
       }
     })
 
     if (!canEdit) {
       throw new Error('!! user cannot edit list !!');
     }
  
     const fullArtworkId = this.artworkService.generateArtworkId({artworkId});

    // Check and remove the artwork
    const edgeToRemove = await this.edgeService.getEdge({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
      to: fullArtworkId,
    });
  
    if (!edgeToRemove) {
      throw new Error('!! artwork not in list !!');
    }
  
    await this.edgeService.deleteEdge({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
      to: fullArtworkId,
    });
  
    // Fetch remaining artworks and their positions
    const remainingEdges = await this.edgeService.getAllEdgesFromNode({
      edgeName: EdgeNames.FROMListTOArtwork,
      from: fullListId,
    });
  
    // Update list positions if necessary
    if (remainingEdges && remainingEdges.length > 0) {
      remainingEdges.forEach(async (edge) => {
        if (edge.data?.listPosition > edgeToRemove.data?.listPosition) {
          await this.edgeService.updateEdge({
            edgeName: EdgeNames.FROMListTOArtwork,
            from: fullListId,
            to: edge._to,
            data: {
              ...edge.data,
              listPosition: edge.data.listPosition - 1,
            },
          });
        }
      });
    }
  
    // Update and return the list...
    return await this.getFullList({listId});
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  public async deleteList({listId, userUid}: {listId: string, userUid: string}): Promise<{[key: string] : ListPreview}> {
    // delete the list and the edges from the list to the artwork 
    try {

    const fullListId = this.generateListId({id: listId});
    // get list node
    const list = await this.db.collection(CollectionNames.DartaUserLists).document(fullListId);
    const fullUserId = this.userService.generateDartaUserId({uid: userUid});

    if (!list) {
      throw new Error('!! no list !!');
    }
    
     // confirm that the user is the creator of the list
     const listEdge = await this.edgeService.getAllEdgesToPointingToNode({edgeName: EdgeNames.FROMDartaUserTOList, to: fullListId});

     if (!listEdge) {
       throw new Error('!! no list edge !!');
     }
 
     let canEdit = false;
 
     listEdge.forEach((edge) => {
       if (edge._from === fullUserId) {
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

    const artworkIds = edges.map((edge) => edge._to)

    // delete all edges from list to artwork
    const edgePromises = artworkIds.map((artworkId) => 
      this.edgeService.deleteEdge({
        edgeName: EdgeNames.FROMListTOArtwork,
        from: fullListId,
        to: artworkId,
      })
    );

    await Promise.all(edgePromises);

    // delete all edges from user to list
    const userEdgePromises = artworkIds.map(() => 
      this.edgeService.deleteEdge({
        edgeName: EdgeNames.FROMDartaUserTOList,
        from: fullUserId,
        to: fullListId,
      })
    );

    await Promise.all(userEdgePromises);

    // delete list node
    await this.db.collection(CollectionNames.DartaUserLists).remove(fullListId);

    // return updated list previews
    return await this.listLists({uid: userUid});

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // TO-DO: Delete 
  public async listExhibitionPinsByListId({listId}: {listId: string}): Promise<ExhibitionMapPin[]>{
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

    const artworkIds = edges.map((edge) => edge._to)

    // Fetch both artwork/gallery and exhibition data in parallel
    const exhibitionPromises = artworkIds.map((artworkId) => 
      this.exhibitionService.readExhibitionForList({artworkId})
    );

    // Wait for all promises to resolve
    const exhibitions = await Promise.all(exhibitionPromises);

    if (!exhibitions) {
      throw new Error('!! no exhibitions !!');
    }

    return [] as ExhibitionMapPin[];
  }

  // eslint-disable-next-line class-methods-use-this
  public generateListId({id}: {id: string}): string {
    return id.includes(CollectionNames.DartaUserLists)
      ? id
      : `${CollectionNames.DartaUserLists}/${id}`;
  }

  // HOLY TYPEGUARDS BATMAN
  // eslint-disable-next-line class-methods-use-this
  public returnListData({list}: {list: any}): any {
    return {
      _id: list?._id,
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
