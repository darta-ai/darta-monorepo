import * as joi from '@hapi/joi';
import 'joi-extract-type';
import { inject } from 'inversify';
import { Database } from 'arangojs';

import { DocumentRepository, arangoDocumentSchema } from './ArangoRepository';
import { createSchemaBase, updateSchemaBase } from './util';
import { container } from '../container';

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
}

container.bind<UserRepository>(UserRepository).toSelf();
export const userRepository = container.get<UserRepository>(UserRepository);