import * as Types from '@darta-types';

export interface IListService {
  createList({newList, artworkId, uid} : {newList: Types.List, artworkId: string, uid: string}) : Promise<Types.FullList>
  getFullList({listId}: {listId: string}): Promise<{[key: string] : Types.FullList}> 
  listLists({ uid }: { uid: string }): Promise<{[key:string] : Types.ListPreview}>
  addArtworkToList({listId, artworkId, userUid}: {listId: string, artworkId: string, userUid: string}): Promise<Types.FullList> 
}
