import joi from '@hapi/joi';
import {Database} from 'arangojs';
import {inject} from 'inversify';

import {container} from '../container';
import {
  DocumentRepository,
  documentSchema,
  createDocumentSchema,
  updateDocumentSchema,
  ArangoCreateType,
  ArangoUpdateType,
  ArangoDocumentType,
} from './ArangoRepository';

interface UserBase {
  username?: string;
  name?: string;
};

export interface UserCreateType extends ArangoCreateType, UserBase {
  username: string;
  // TODO what properties are required for a user?
};

export interface UserUpdateType extends ArangoUpdateType, UserBase {
  _key: string;
  // TODO should `_id` be allowed?
};

export interface UserType extends ArangoDocumentType, UserCreateType {}

const userSchemaBase = joi.object({
  username: joi.string(),
  name: joi.string(),
});

export const userCreateSchema = userSchemaBase.concat(createDocumentSchema);
export const userUpdateSchema = userSchemaBase.concat(updateDocumentSchema);
export const userSchema = userSchemaBase.concat(documentSchema);

class UserRepository extends DocumentRepository<UserBase> {
  constructor(@inject('Database') db: Database) {
    super(db, 'users', userSchemaBase);
  }
}

container.bind<UserRepository>(UserRepository).toSelf();
export const userRepository = container.get<UserRepository>(UserRepository);

import './UserRepository.test'