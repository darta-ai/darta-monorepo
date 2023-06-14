import * as joi from "@hapi/joi";
import 'joi-extract-type';

export type NotEmptyObject<T=any> = { [K in string]: T };
// export type NotEmptyObject<T extends object, K extends keyof T = keyof T> = K extends any ? ({} extends Pick<T, K> ? never : T) : never;

export const createSchemaBase = joi.object({
  // createdAt: joi.date()//.timestamp().default(Date.now, 'time of creation'),
});
export type CreateSchemaBase = joi.extractType<typeof createSchemaBase>;

export const updateSchemaBase = joi.object({
  _key: joi.string().required(),
  _id: joi.string(),
  _rev: joi.string().forbidden(),
  // updatedAt: joi.date()//.forbidden().default(Date.now, 'time of update'),
});
export type UpdateSchemaBase = joi.extractType<typeof updateSchemaBase>;
