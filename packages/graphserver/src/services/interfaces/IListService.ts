import * as Types from '@darta-types';

export interface IListService {
  createList({newList, artworkId, uid} : {newList: Types.List, artworkId: string, uid: string}) : Promise<Types.FullList>
  getFullList({listId}: {listId: string}): Promise<Types.FullList>
}
