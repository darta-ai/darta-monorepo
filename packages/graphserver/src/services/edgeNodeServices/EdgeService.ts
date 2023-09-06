import { injectable, inject } from 'inversify';
import { IEdgeService } from './IEdgeService'
import { Database } from 'arangojs';
import { Edge } from 'src/models/models';

@injectable()
export class EdgeService implements IEdgeService {
    constructor(
        @inject('Database') private readonly db: Database,
        ) {}

        public async upsertEdge({edgeName, from, to, data = {}} : {edgeName: string, from: string, to: string, data: any }): Promise<any> {
            const query = `
            UPSERT { _from: @from, _to: @to }
            INSERT MERGE(@data, { _from: @from, _to: @to })
            UPDATE @data INTO @@edgeName   
            RETURN NEW         
            `;
    
            return await this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to,
                data
            });
        }
    
        public async getEdge({edgeName, from, to} : {edgeName: string, from: string, to: string}): Promise<Edge> {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            RETURN edge
            `;
    
            const cursor = await this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to
            });
            return cursor.next();
        }

        public async getEdgeWithFrom({edgeName, from} : {edgeName: string, from: string}): Promise<Edge> {
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

        public async getEdgeWithTo({edgeName, to} : {edgeName: string, to: string}): Promise<Edge> {
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
    
        public async deleteEdge({edgeName, from, to} : {edgeName: string, from: string, to: string}): Promise<void> {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            REMOVE edge IN @@edgeName
            `;
    
            await this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to
            });
        }

        public async deleteEdgeWithFrom({edgeName, from} : {edgeName: string, from: string}): Promise<void> {
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
    
        public async deleteEdgeWithTo({edgeName, to} : {edgeName: string, to: string}): Promise<void> {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            REMOVE edge IN @@edgeName
            `;
    
            await this.db.query(query, {
                '@edgeName': edgeName,
                to
            });
        }

        public async updateEdge({edgeName, from, to, data = {}} : {edgeName: string, from: string, to: string, data: any }): Promise<void> {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            UPDATE edge WITH @data INTO @@edgeName
            `;
    
            await this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to,
                data
            });
        }
    
        public async getAllEdgesFromNode({edgeName, from}:{edgeName: string, from: string}): Promise<any[]> {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;
    
            const cursor = await this.db.query(query, {
                '@edgeName': edgeName,
                from
            });
            return cursor.all();
        }

        public async getCurrentMediumEdge(edgeName: string, from: string): Promise<any> {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;
        
            const cursor = await this.db.query(query, {
                '@edgeName': edgeName,
                from
            });
            return cursor.next();
        }
        
        public async replaceMediumEdge({edgeName, from, newTo, data} : {edgeName: string, from: string, newTo: string, data: any}): Promise<void> {
            // Get the current edge (if it exists) for the artwork
            let currentEdge
            try{
                currentEdge = await this.getCurrentMediumEdge(edgeName, from);
            } catch(err){
                console.log('errors at current edge', err)
            }

            // If it exists, delete it
            if (currentEdge) {
                try{
                    await this.deleteEdge({ edgeName, from, to: currentEdge._to });
                } catch (err){
                    console.log('error at delete Edge')
                }
            }
        
            // Create a new edge for the new medium
            try{
                await this.upsertEdge({ edgeName, from, to: newTo, data });
            } catch (err){
                console.log('error at upsertEdge', err)
            }
        }
        
}

