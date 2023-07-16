import 'joi-extract-type';

import * as joi from '@hapi/joi';
import {Database} from 'arangojs';
import {inject} from 'inversify';

import {container} from '../container';
import {arangoDocumentSchema, DocumentRepository} from './ArangoRepository';
import {createSchemaBase, updateSchemaBase} from './util';

export const userSchemaBase = joi.object({
  username: joi.string().required(),
  name: joi.string(),
});
type UserBase = joi.extractType<typeof userSchemaBase>;

export const userUpdateSchema = userSchemaBase.concat(updateSchemaBase);
export type UserUpdateType = joi.extractType<typeof userUpdateSchema>;

export const userCreateSchema = userSchemaBase.concat(createSchemaBase);
export type UserCreateType = joi.extractType<typeof userCreateSchema>;

export const userSchema = userSchemaBase.concat(arangoDocumentSchema);
export type User = joi.extractType<typeof userSchema>;

class UserRepository extends DocumentRepository<UserBase> {
  constructor(@inject('Database') db: Database) {
    super(db, 'users', userSchemaBase);
  }
  // add some functions.
}

container.bind<UserRepository>(UserRepository).toSelf();
export const userRepository = container.get<UserRepository>(UserRepository);
