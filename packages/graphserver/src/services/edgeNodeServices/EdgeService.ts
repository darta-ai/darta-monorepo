import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {Edge} from '../../models/models';
import {IEdgeService} from './IEdgeService';

@injectable()
export class EdgeService implements IEdgeService {
  constructor(@inject('Database') private readonly db: Database) {}

  public async upsertEdge({
    edgeName,
    from,
    to,
    data = {},
  }: {
    edgeName: string;
    from: string;
    to: string;
    data: any;
  }): Promise<any> {
    const query = `
    UPSERT { _from: @from, _to: @to }
    INSERT MERGE(@data, { _from: @from, _to: @to })
    UPDATE @data INTO @@edgeName   
    RETURN NEW         
    `;

    const results = await this.db.query(query, {
      '@edgeName': edgeName,
      from,
      to,
      data,
    });
    return results;
  }

  private async addEdge({
    edgeName,
    from,
    to,
    data = {},
  }: {
    edgeName: string;
    from: string;
    to: string;
    data: any;
  }): Promise<void> {
    const query = `
    INSERT MERGE(@data, { _from: @from, _to: @to }) INTO @@edgeName
    `;

    await this.db.query(query, {
      '@edgeName': edgeName,
      from,
      to,
      data,
    });
  }

  public async getEdge({
    edgeName,
    from,
    to,
  }: {
    edgeName: string;
    from: string;
    to: string;
  }): Promise<Edge> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      from,
      to,
    });
    return cursor.next();
  }

  public async getEdgeWithFrom({
    edgeName,
    from,
  }: {
    edgeName: string;
    from: string;
  }): Promise<Edge> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      from,
    });
    return cursor.next();
  }

  public async getEdgeWithTo({
    edgeName,
    to,
  }: {
    edgeName: string;
    to: string;
  }): Promise<Edge> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      to,
    });
    return cursor.next();
  }

  public async deleteEdge({
    edgeName,
    from,
    to,
  }: {
    edgeName: string;
    from: string;
    to: string;
  }): Promise<void> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            REMOVE edge IN @@edgeName
            `;

    await this.db.query(query, {
      '@edgeName': edgeName,
      from,
      to,
    });
  }

  public async deleteEdgeWithFrom({
    edgeName,
    from,
  }: {
    edgeName: string;
    from: string;
  }): Promise<void> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            REMOVE edge IN @@edgeName
            `;

    await this.db.query(query, {
      '@edgeName': edgeName,
      from,
    });
  }

  public async deleteEdgeWithTo({
    edgeName,
    to,
  }: {
    edgeName: string;
    to: string;
  }): Promise<void> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            REMOVE edge IN @@edgeName
            `;

    await this.db.query(query, {
      '@edgeName': edgeName,
      to,
    });
  }

  public async updateEdge({
    edgeName,
    from,
    to,
    data = {},
  }: {
    edgeName: string;
    from: string;
    to: string;
    data: any;
  }): Promise<void> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            UPDATE edge WITH @data INTO @@edgeName
            `;

    await this.db.query(query, {
      '@edgeName': edgeName,
      from,
      to,
      data,
    });
  }

  public async getAllEdgesFromNode({
    edgeName,
    from,
  }: {
    edgeName: string;
    from: string;
  }): Promise<any[]> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      from,
    });
    return cursor.all();
  }

  public async getEdgesFromNodeWithLimit({
    edgeName,
    from,
    limit
  }: {
    edgeName: string;
    from: string;
    limit: number;
  }): Promise<any[]> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            LIMIT @limit
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      from,
      limit
    });
    return cursor.all();
  }

  public async getAllEdgesToPointingToNode({
    edgeName,
    to,
  }: {
    edgeName: string;
    to: string;
  }): Promise<any[]> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      to,
    });
    return cursor.all();
  }

  public async getCurrentMediumEdge(
    edgeName: string,
    from: string,
  ): Promise<any> {
    const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;

    const cursor = await this.db.query(query, {
      '@edgeName': edgeName,
      from,
    });
    return cursor.next();
  }

  public async replaceMediumEdge({
    edgeName,
    from,
    newTo,
    data,
  }: {
    edgeName: string;
    from: string;
    newTo: string;
    data: any;
  }): Promise<void> {
    // Get the current edge (if it exists) for the artwork
    let currentEdge;
    try {
      currentEdge = await this.getCurrentMediumEdge(edgeName, from);
    } catch (err) {
      throw new Error('errors at current edge');
    }

    // If it exists, delete it
    if (currentEdge) {
      try {
        await this.deleteEdge({edgeName, from, to: currentEdge._to});
      } catch (err: any) {
        throw new Error(`error at delete Edge: ${err?.message}`);
      }
    }

    // Create a new edge for the new medium
    try {
      await this.upsertEdge({edgeName, from, to: newTo, data});
    } catch (err: any) {
      throw new Error(`error at upsertEdge: ${err?.message}`);
    }
  }

  public async validateAndCreateEdges({ edgesToCreate, edgeName, from }: { edgesToCreate : {
    from: string;
    to: string;
    data: any;
  }[], edgeName: string, from: string}): Promise<void> {

    try{ 
      const edges = await this.getAllEdgesFromNode({edgeName, from});

      const toEdges = edges.map((edge) => edge._to);

      // get all the to's from the edges to create
      const tos = edgesToCreate.map((edge) => edge.to);

      // get the difference between the two
      const difference = tos.filter((to) => !toEdges.includes(to));


      // create the edges that are not in the db
      difference.forEach(async (to) => {
        const edgeToCreate = edgesToCreate.find((edge) => edge.to === to);
        if (edgeToCreate) {
          await this.upsertEdge({
            edgeName,
            from,
            to,
            data: edgeToCreate.data,
          });
        }
      })

      // delete the edges that are not in the edges to create
      const edgesToDelete = edges.filter((edge) => !tos.includes(edge._to));

      edgesToDelete.forEach(async (edge) => {
        await this.deleteEdge({edgeName, from, to: edge._to});
      })
       
    } catch(error: any){
      throw new Error(`error at validateAndCreateEdges: ${error?.message}`);
    }
  }
}
