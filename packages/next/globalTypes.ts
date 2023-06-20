export interface PrivateFields {
  value: string | null;
  isPrivate: boolean | null;
}

export interface PublicFields {
  value: string | null;
}

type Dimensions = {
  height: PublicFields;
  text: PublicFields;
  width: PublicFields;
  depth: PublicFields;
};

export type Artwork = {
  artworkImage: PublicFields;
  artworkImagesArray?: PublicFields[];
  artworkTitle: PublicFields;
  artistName: PublicFields;
  artworkDescription: PublicFields;
  currency: PublicFields;
  price: PrivateFields;
  canInquire: PrivateFields;
  sold: PrivateFields;
  medium: PublicFields;
  materials: PublicFields;
  artworkDimensions: Dimensions;
  slug?: string;
  artworkCreatedYear: PublicFields;
};
