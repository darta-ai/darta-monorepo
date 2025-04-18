import {Edge} from '../../models/models';

export interface IEdgeService {
  upsertEdge({
    edgeName,
    from,
    to,
    data,
  }: {
    edgeName: string;
    from: string;
    to: string;
    data: any;
  }): Promise<void>;
  getEdge({
    edgeName,
    from,
    to,
  }: {
    edgeName: string;
    from: string;
    to: string;
  }): Promise<any>;
  getEdgeWithTo({edgeName, to}: {edgeName: string; to: string}): Promise<Edge>;
  getEdgeWithFrom({
    edgeName,
    from,
  }: {
    edgeName: string;
    from: string;
  }): Promise<any>;
  deleteEdge({
    edgeName,
    from,
    to,
  }: {
    edgeName: string;
    from: string;
    to: string;
  }): Promise<void>;
  deleteEdgeWithFrom({
    edgeName,
    from,
  }: {
    edgeName: string;
    from: string;
  }): Promise<void>;
  deleteEdgeWithTo({
    edgeName,
    to,
  }: {
    edgeName: string;
    to: string;
  }): Promise<void>;
  updateEdge({
    edgeName,
    from,
    to,
    data,
  }: {
    edgeName: string;
    from: string;
    to: string;
    data: any;
  }): Promise<void>;
  getAllEdgesFromNode({
    edgeName,
    from,
  }: {
    edgeName: string;
    from: string;
  }): Promise<any[]>;
  getEdgesFromNodeWithLimit({
    edgeName,
    from,
    limit,
  }: {
    edgeName: string;
    from: string;
    limit: number;
  }): Promise<any[]>;
  replaceMediumEdge({
    edgeName,
    from,
    newTo,
    data,
  }: {
    edgeName: string;
    from: string;
    newTo: string;
    data: any;
  }): Promise<void>;
  getAllEdgesToPointingToNode({
    edgeName,
    to,
  }: {
    edgeName: string;
    to: string;
  }): Promise<any[]>;
  validateAndCreateEdges({ edgesToCreate, edgeName, from }: { edgesToCreate : {
    from: string;
    to: string;
    data: any;
  }[], 
  edgeName: string,
  from: string
}): Promise<void>;
}
