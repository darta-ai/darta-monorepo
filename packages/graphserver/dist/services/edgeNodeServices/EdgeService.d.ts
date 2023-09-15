import { Database } from 'arangojs';
import { Edge } from '../../models/models';
import { IEdgeService } from './IEdgeService';
export declare class EdgeService implements IEdgeService {
    private readonly db;
    constructor(db: Database);
    upsertEdge({ edgeName, from, to, data, }: {
        edgeName: string;
        from: string;
        to: string;
        data: any;
    }): Promise<any>;
    getEdge({ edgeName, from, to, }: {
        edgeName: string;
        from: string;
        to: string;
    }): Promise<Edge>;
    getEdgeWithFrom({ edgeName, from, }: {
        edgeName: string;
        from: string;
    }): Promise<Edge>;
    getEdgeWithTo({ edgeName, to, }: {
        edgeName: string;
        to: string;
    }): Promise<Edge>;
    deleteEdge({ edgeName, from, to, }: {
        edgeName: string;
        from: string;
        to: string;
    }): Promise<void>;
    deleteEdgeWithFrom({ edgeName, from, }: {
        edgeName: string;
        from: string;
    }): Promise<void>;
    deleteEdgeWithTo({ edgeName, to, }: {
        edgeName: string;
        to: string;
    }): Promise<void>;
    updateEdge({ edgeName, from, to, data, }: {
        edgeName: string;
        from: string;
        to: string;
        data: any;
    }): Promise<void>;
    getAllEdgesFromNode({ edgeName, from, }: {
        edgeName: string;
        from: string;
    }): Promise<any[]>;
    getAllEdgesToPointingToNode({ edgeName, to, }: {
        edgeName: string;
        to: string;
    }): Promise<any[]>;
    getCurrentMediumEdge(edgeName: string, from: string): Promise<any>;
    replaceMediumEdge({ edgeName, from, newTo, data, }: {
        edgeName: string;
        from: string;
        newTo: string;
        data: any;
    }): Promise<void>;
}
