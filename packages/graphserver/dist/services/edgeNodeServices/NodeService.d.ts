import { Database } from 'arangojs';
import { Node } from '../../models/models';
import { INodeService } from './INodeService';
export declare class NodeService implements INodeService {
    private readonly db;
    constructor(db: Database);
    upsertNodeByKey({ collectionName, key, data, }: {
        collectionName: string;
        data: any;
        key?: string;
    }): Promise<Node>;
    upsertNodeById({ collectionName, id, data, }: {
        collectionName: string;
        data: any;
        id?: string;
    }): Promise<Node>;
    getNode({ collectionName, key, }: {
        collectionName: string;
        key: string;
    }): Promise<any>;
    deleteNode({ collectionName, id, }: {
        collectionName: string;
        id: string;
    }): Promise<void>;
    updateNode({ collectionName, key, data, }: {
        collectionName: string;
        key: string;
        data: any;
    }): Promise<Node>;
}
