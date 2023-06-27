export type BusinessHours = {
  [key in BusinessDays]: {
    open: {
      value: string | null;
    };
    close: {
      value: string | null;
    };
  };
};

export type BusinessDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface IBusinessHours {
  hoursOfOperation: BusinessHours;
  isPrivate?: boolean;
}

export interface PrivateFields {
  value: string | null;
  isPrivate: boolean | null;
}

export interface PublicFields {
  value: string | null;
}

export interface DateFields {
  value: string | null;
  isOngoing: boolean | null;
}
export interface CoordinateFields {
  latitude: {value: string | null};
  longitude: {value: string | null};
  googleMapsUrl: {value: string | null};
}

type Dimensions = {
  height: PublicFields;
  text: PublicFields;
  width: PublicFields;
  depth: PublicFields;
  unit: {value: 'in' | 'cm'};
};

interface GalleryFields {
  galleryLogo?: PublicFields;
  galleryName?: PublicFields;
  galleryBio?: PublicFields;
  galleryAddress?: PrivateFields;
  primaryContact?: PrivateFields;
  galleryWebsite?: PrivateFields;
  galleryPhone?: PrivateFields;
  galleryBusinessHours?: IBusinessHours;
  galleryInstagram?: PrivateFields;
}

export interface IBusinessLocationData {
  businessHours?: IBusinessHours;
  locationString?: PrivateFields;
  coordinates?: CoordinateFields;
  googleMapsPlaceId?: PublicFields;
}

interface GalleryAddressFields {
  galleryLocation0: IBusinessLocationData;
  galleryLocation1?: IBusinessLocationData;
  galleryLocation2?: IBusinessLocationData;
  galleryLocation3?: IBusinessLocationData;
  galleryLocation4?: IBusinessLocationData;
}

export interface IGalleryProfileData
  extends GalleryFields,
    GalleryAddressFields {}

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
  createdAt: string | null;
  updatedAt: string | null;
};

export type BusinessAddressType =
  | 'galleryLocation0'
  | 'galleryLocation1'
  | 'galleryLocation2'
  | 'galleryLocation3'
  | 'galleryLocation4';

// make it its own package. and then put the export under index. then import from @types

export type Exhibition = {
  exhibitionTitle: PublicFields;
  pressRelease: PublicFields;
  exhibitionPrimaryImage: PublicFields;
  mediumsUsed: PublicFields[] | undefined[];
  artists: PublicFields[] | undefined[];
  pressReleaseImages: PublicFields[] | undefined[];
  exhibitionImages: PublicFields[] | undefined[];
  artworks: {[key: string]: Artwork} | {[key: string]: undefined};
  published: boolean;
  slug?: PublicFields;
  exhibitionId: string | undefined;
  startDate: DateFields;
  endDate: DateFields;
  openingDate: DateFields;
};

export type CurrencyConverterType = {
  [key: string]: '$' | '€' | '£';
};

export type GalleryState = {
  galleryProfile: IGalleryProfileData;
  galleryArtworks: Artwork[];
  galleryExhibitions: Exhibition[];
  sessionToken: string | null;
};
