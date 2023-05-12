import 'joi-extract-type';

import * as joi from '@hapi/joi';

export const updateArtworkSchema = joi
  .object({
    slug: joi.string().required(),
  })
  .unknown(true);

export const artworkSchema = joi
  .object({
    artworkId: joi.string().required(),
    image: joi.string().required(),
    artist: joi.string().required(),
    slug: joi.string().required(),
    additionalInformation: joi.string().allow(null, ''),
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
  })
  .unknown(true);
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
  likedArtworks: joi.object(),
  savedArtworks: joi.object(),
  dislikedArtworks: joi.object(),
});

export type User = joi.extractType<typeof userSchema>;

export const ratingSchema = joi.object({
  artworkKey: joi.string().required(),
  userKey: joi.string().required(),
  artworkRating: joi.string().required(),
  timeViewed: joi.number(),
  zoomCount: joi.number(),
  createdAt: joi.string(),
  updatedAt: joi.string(),
  _key: joi.string(),
});

export type Rating = joi.extractType<typeof ratingSchema>;

export type UserArtworkEdge = Rating & {
  _from: string;
  _to: string;
};
export interface IUserRepository {
  getUser(key: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  createUser(user: User): Promise<User>;
  addLikedArtworkToUser(userKey: string, edge: Rating): Promise<User>;
  addSavedArtworkToUser(userKey: string, edge: Rating): Promise<User>;
}

export interface IArtworkRepository {
  getArtwork(key: string): Promise<Artwork | null>;
  updateArtwork(artwork: Artwork): Promise<Artwork>;
  createArtwork(artwork: Artwork): Promise<Artwork>;
}

export interface IRatingRepository {
  createUserArtworkEdge(artworkRating: Rating): Promise<Rating | null>;
  updateUserArtworkEdge(artworkRating: Rating): Promise<Rating>;
  getUserArtworkEdge(userKey: string): Promise<Rating[] | undefined>;
}

export interface ICreateCollections {
  createCollections(): Promise<void>;
}

export enum Collections {
  Users = 'users',
  Artworks = 'artworks',
  ArtworkRatingEdge = 'artworkRatingEdge',
  ArtworkOwnersEdge = 'artworkOwnersEdge',
}
