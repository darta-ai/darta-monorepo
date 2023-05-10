import 'joi-extract-type';

import * as joi from '@hapi/joi';

export const updateArtworkSchema = joi
  .object({
    slug: joi.string().required(),
  })
  .unknown(true);

export const artworkSchema = joi.object({
  artworkId: joi.string().required(),
  image: joi.string().required(),
  artist: joi.string().required(),
  slug: joi.string().required(),
  canInquire: joi.boolean(),
  category: joi.string(),
  createdAt: joi.string(),
  updatedAt: joi.string(),
  date: joi.string(),
  dimensionsInches: joi.object({
    height: joi.number().required(),
    text: joi.string(),
    width: joi.number().required(),
    depth: joi.number().allow(null),
    diameter: joi.number().allow(null),
  }),
  gallery: joi.object({
    name: joi.string(),
    region: joi.string(),
    email: joi.string(),
    slug: joi.string(),
  }),
  medium: joi.string(),
  price: joi.string(),
  title: joi.string(),
  year: joi.string(),
});
export type Artwork = joi.extractType<typeof artworkSchema>;

export const userSchema = joi.object({
  _key: joi.string(),
  username: joi.string(),
  deviceId: joi.string().required(),
  userId: joi.string(),
  email: joi.string(),
  phone: joi.string(),
  profilePicture: joi.string(),
  legalName: joi.string(),
  createdAt: joi.string(),
  updatedAt: joi.string(),
});

export type User = joi.extractType<typeof userSchema>;

export interface UserService {
  getUser(key: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  createUser(user: User): Promise<User>;
}

export interface ArtworkService {
  getArtwork(key: string): Promise<Artwork | null>;
  updateArtwork(artwork: Artwork): Promise<Artwork>;
  createArtwork(artwork: Artwork): Promise<Artwork>;
}
