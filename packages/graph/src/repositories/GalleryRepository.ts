import joi from '@hapi/joi';
import {Database} from 'arangojs';
import {inject} from 'inversify';

import {container} from '../container';
import {
  ArangoCreateType,
  ArangoDocumentType,
  ArangoUpdateType,
  createDocumentSchema,
  DocumentRepository,
  documentSchema,
  updateDocumentSchema,
} from './ArangoRepository';

interface GalleryBase {
  galleryname?: string;
  name?: string;
}

export interface GalleryCreateType extends ArangoCreateType, GalleryBase {
  galleryname: string;
  // TODO what properties are required for a gallery?
}

export interface GalleryUpdateType extends ArangoUpdateType, GalleryBase {
  _key: string;
  // TODO should `_id` be allowed?
}

export interface GalleryType extends ArangoDocumentType, GalleryCreateType {}

// user initially signs up
const gallerySchemaBase = joi.object({
  galleryName: joi.string(),
  initialSignUpEmail: joi.string(),
  initialSignUpPhone: joi.string(),
  galleryWebsite: joi.string().optional(),
});

export const galleryCreateSchema =
  gallerySchemaBase.concat(createDocumentSchema);
export const galleryUpdateSchema =
  gallerySchemaBase.concat(updateDocumentSchema);
export const gallerySchema = gallerySchemaBase.concat(documentSchema);

class GalleryRepository extends DocumentRepository<GalleryBase> {
  constructor(@inject('Database') db: Database) {
    super(db, 'galleries', gallerySchemaBase);
  }
}

container.bind<GalleryRepository>(GalleryRepository).toSelf();
export const galleryRepository =
  container.get<GalleryRepository>(GalleryRepository);
