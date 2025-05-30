import * as Types from '@darta-types';

export interface IListService {
  createList({newList, artworkId, uid} : {newList: Types.List, artworkId: string, uid: string}) : Promise<Types.ListPreview>
  getFullList({listId}: {listId: string}): Promise<{[key: string] : Types.FullList}> 
  listLists({ uid }: { uid: string }): Promise<{[key:string] : Types.ListPreview}>
  addArtworkToList({listId, artworkId, userUid}: {listId: string, artworkId: string, userUid: string}): Promise<{[key: string] : Types.FullList}> 
  removeArtworkFromList({listId, artworkId, userUid}: {listId: string, artworkId: string, userUid: string}): Promise<{[key: string] : Types.FullList}>
  listExhibitionPinsByListId({listId}: {listId: string}): Promise<Types.ExhibitionMapPin[]>
  deleteList({listId, userUid}: {listId: string, userUid: string}): Promise<{[key: string] : Types.ListPreview}>
}
