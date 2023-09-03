
export interface IEdgeService {
    upsertEdge({edgeName, from, to, data} : {edgeName: string, from: string, to: string, data: any }): Promise<void>
    getEdge({edgeName, from, to} : {edgeName: string, from: string, to: string}): Promise<any>
    deleteEdge({edgeName, from, to} : {edgeName: string, from: string, to: string}): Promise<void>
    updateEdge({edgeName, from, to, data} : {edgeName: string, from: string, to: string, data: any }): Promise<void> 
    getAllEdgesFromNode({edgeName, from}:{edgeName: string, from: string}): Promise<any[]>
    replaceMediumEdge({edgeName, from, newTo, data} : {edgeName: string, from: string, newTo: string, data: any}): Promise<void>
}
  