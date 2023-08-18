import {injectable, inject} from 'inversify';
import {Database} from 'arangojs';
import {DocumentCollection, EdgeCollection} from 'arangojs/collection';
import * as joi from 'joi';



type NotEmptyObject<T=any> = { [K in string]: T };

export interface ArangoCreateType {
  _key: string;
};

export interface ArangoUpdateType {
  _key: string;
};

export interface ArangoDocumentType extends ArangoCreateType {
  _id: string;
  _rev: string;
};

export interface ArangoEdgeType extends ArangoDocumentType {
  _from: string;
  _to: string;
};

export const createDocumentSchema = joi.object({
  _key: joi.string().required(),
  // createdAt: joi.date()//.timesateSchemaBasetamp().default(Date.now, 'time of creation'),
});

export const updateDocumentSchema = joi.object({
  _key: joi.string().required(),
  _id: joi.string(),
  _rev: joi.string().forbidden(),
  // updatedAt: joi.date()//.forbidden().default(Date.now, 'time of update'),
});

export const documentSchema = createDocumentSchema.keys({
  _id: joi.string().required(),
  _rev: joi.string().required(),
});

const edgeSchemaBase = joi.object({
  _from: joi.string().required(),
  _to: joi.string().required(),
});

export const createEdgeSchema = createDocumentSchema.concat(edgeSchemaBase);
export const updateEdgeSchema = updateDocumentSchema.concat(edgeSchemaBase);
export const edgeSchema = createEdgeSchema.concat(edgeSchemaBase);

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
    this.fullSchema = schema.concat(this.isEdgeCollection ? edgeSchema : documentSchema);
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
