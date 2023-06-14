import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { DocumentCollection, EdgeCollection } from 'arangojs/collection';
import * as joi from '@hapi/joi';
import 'joi-extract-type';

import { NotEmptyObject } from './util';

export const arangoDocumentSchema = joi.object({
  _key: joi.string().required(),
  _id: joi.string().required(),
  _rev: joi.string().required(),
});
export type ArangoDocumentType = joi.extractType<typeof arangoDocumentSchema>;

export const arangoEdgeSchema = arangoDocumentSchema.keys({
  _from: joi.string().required(),
  _to: joi.string().required(),
});
export type ArangoEdgeType = joi.extractType<typeof arangoEdgeSchema>;

interface IArangoCollection<
  T = ArangoDocumentType | ArangoEdgeType,
  D = NotEmptyObject, // document base type, without `_id`, etc
> {
  create(data: D): Promise<D&T>;
  read(id: string): Promise<D&T>;
  update(data: NotEmptyObject&T): Promise<D&T>;
  delete(id: string): Promise<string>;
}

@injectable()
abstract class ArangoRepository<
  C extends DocumentCollection | EdgeCollection,
  T = ArangoDocumentType | ArangoEdgeType,
  D = NotEmptyObject,
> implements IArangoCollection<T, D> {
  public name: string;
  protected schema: joi.ObjectSchema;
  protected fullSchema: joi.ObjectSchema;
  protected collection: DocumentCollection | EdgeCollection;
  protected isEdgeCollection: boolean = false;
  
  createQry: Function | undefined;
  readQry: Function | undefined;
  updateQry: Function | undefined;
  deleteQry: Function | undefined;

  constructor(
    @inject('Database') db: Database, 
    collectionName: string, 
    schema: joi.ObjectSchema,
  ) {
    this.name = collectionName;
    this.collection = this.getCollection(db, collectionName);
    this.schema = schema;
    this.fullSchema = schema.concat(this.isEdgeCollection ? arangoEdgeSchema : arangoDocumentSchema);
  }

  // Abstract method to be implemented in the child classes
  protected abstract getCollection(db: Database, collectionName: string): C;

  protected validate(data: D | (D&T) | (NotEmptyObject), isCreate: boolean=false) {
    const validation = (isCreate ? this.schema : this.fullSchema).validate(data);
    if (validation.error) throw validation.error;
  }

  async create(data: D): Promise<D&T> {
    this.validate(data, true);
    if (this.createQry) return await this.createQry(data, this.collection.save);
    const { new: newDoc } = await this.collection.save(data, { returnNew: true });
    return newDoc as (D&T);
  }

  async read(id: string): Promise<D&T> {
    return await this.collection.document(id) as (D&T);
  }

  async update(data: NotEmptyObject&T): Promise<D&T> {
    this.validate(data);
    if (this.updateQry) return await this.updateQry(data, this.collection.update);
    const { new: newDoc } = await this.collection.update(data._key, data, { returnNew: true });
    return newDoc as (D&T);
  }

  async delete(id: string): Promise<string> {
    if (this.deleteQry) return await this.deleteQry(id, this.collection.remove);
    await this.collection.remove(id);
    return id;
  }
}

@injectable()
export abstract class DocumentRepository<D>
extends ArangoRepository<DocumentCollection, ArangoDocumentType, D> {
  protected getCollection(db: Database, collectionName: string): DocumentCollection {
    return db.collection(collectionName);
  }
}

@injectable()
export abstract class EdgeRepository<D> extends ArangoRepository<EdgeCollection, ArangoEdgeType, D> {
  protected isEdgeCollection = true;

  protected getCollection(db: Database, collectionName: string): EdgeCollection {
    return db.collection(collectionName);
  }
}
