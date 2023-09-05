import { Node } from "src/models/models"


export interface INodeService {
    upsertNode({collectionName, key, data = {}} : {collectionName: string, data: any,  key?: string,}): Promise<Node | null>;
    getNode({collectionName, key} : {collectionName: string, key: string}): Promise<any>
    deleteNode({collectionName, id} : {collectionName: string, id: string}): Promise<void>
    updateNode({collectionName, key, data = {}} : {collectionName: string, key: string, data: any }): Promise<Node>
}
  