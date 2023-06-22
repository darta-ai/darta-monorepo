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
  unit: {value: 'in' | 'cm'};
};

export type Artwork = {
  artworkImage: PublicFields;
  artworkId?: string;
  published: boolean;
  artworkImagesArray?: PublicFields[] | any[];
  artworkTitle: PublicFields;
  artistName: PublicFields;
  artworkDescription: PublicFields;
  artworkCurrency: PublicFields;
  artworkPrice: PrivateFields;
  canInquire: PublicFields;
  artworkMedium: PublicFields;
  artworkDimensions: Dimensions;
  slug?: PublicFields;
  artworkCreatedYear: PublicFields;
};
