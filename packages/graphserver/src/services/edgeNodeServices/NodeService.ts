import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {Node} from '../../models/models';
import {INodeService} from './INodeService';

@injectable()
export class NodeService implements INodeService {
  constructor(@inject('Database') private readonly db: Database) {}

  async upsertNodeByKey({
    collectionName,
    key,
    data = {},
  }: {
    collectionName: string;
    data: any;
    key?: string;
  }): Promise<Node> {
    let query;
    let payload: any = {
      '@collectionName': collectionName,
      data,
    };
    if (key) {
      query = `
            UPSERT { _key: @key }
            INSERT MERGE(@data, { _key: @key })
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
      payload = {
        '@collectionName': collectionName,
        key,
        data,
      };
    } else if (data?.value) {
      query = `
            UPSERT { value: @data.value }
            INSERT @data
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
    } else {
      query = `
            INSERT @data INTO @@collectionName
            RETURN NEW
            `;
    }

    const cursor = await this.db.query(query, payload);

    const results = await cursor.next();
    return results;
  }

  async upsertNodeById({
    collectionName,
    id,
    data = {},
  }: {
    collectionName: string;
    data: any;
    id?: string;
  }): Promise<Node> {
    let query;
    let payload: any = {
      '@collectionName': collectionName,
      data,
    };
    if (id) {
      query = `
            UPSERT { _id: @id }
            INSERT MERGE(@data, { _id: @id })
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
      payload = {
        '@collectionName': collectionName,
        id,
        data,
      };
    } else if (data?.value) {
      query = `
            UPSERT { value: @data.value }
            INSERT @data
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
    } else {
      query = `
            INSERT @data INTO @@collectionName
            RETURN NEW
            `;
    }

    const cursor = await this.db.query(query, payload);

    const results = await cursor.next();
    return results;
  }

  async getNodeByKey({
    collectionName,
    key,
  }: {
    collectionName: string;
    key: string;
  }): Promise<any> {
    const query = `
        FOR doc IN @@collectionName
        FILTER doc._key == @key
        RETURN doc
        `;

    const cursor = await this.db.query(query, {
      '@collectionName': collectionName,
      key,
    });
    try {
      return await cursor.next();
    } catch {
      throw new Error('unable to get node');
    }
  }

  async getNodeById({
    collectionName,
    id,
  }: {
    collectionName: string;
    id: string;
  }): Promise<any> {
    const query = `
        FOR doc IN @@collectionName
        FILTER doc._id == @id
        RETURN doc
        `;

    const cursor = await this.db.query(query, {
      '@collectionName': collectionName,
      id,
    });
    try {
      return await cursor.next();
    } catch {
      throw new Error('unable to get node');
    }
  }


  async deleteNode({
    collectionName,
    id,
  }: {
    collectionName: string;
    id: string;
  }): Promise<void> {
    const query = `
        FOR doc IN ${collectionName}
        FILTER doc._id == @id
        REMOVE doc IN ${collectionName}
        `;

    await this.db.query(query, {
      id,
    });
  }

  async updateNode({
    collectionName,
    key,
    data = {},
  }: {
    collectionName: string;
    key: string;
    data: any;
  }): Promise<Node> {
    const query = `
        FOR doc IN @@collectionName
        FILTER doc._key == @key
        UPDATE doc WITH @data INTO @@collectionName
        `;

    const cursor = await this.db.query(query, {
      '@collectionName': collectionName,
      key,
      data,
    });

    try {
      return await cursor.next();
    } catch {
      throw new Error('unable to delete node');
    }
  }
}
