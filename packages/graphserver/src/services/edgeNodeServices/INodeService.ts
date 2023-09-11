import { Node } from "src/models/models"


export interface INodeService {
    upsertNodeByKey({collectionName, key, data = {}} : {collectionName: string, data: any,  key?: string,}): Promise<Node | any>;
    upsertNodeById({collectionName, id, data = {}} : {collectionName: string, data: any,  id?: string,}): Promise<Node>
    getNode({collectionName, key} : {collectionName: string, key: string}): Promise<any>
    deleteNode({collectionName, id} : {collectionName: string, id: string}): Promise<void>
    updateNode({collectionName, key, data = {}} : {collectionName: string, key: string, data: any }): Promise<Node>
}
  