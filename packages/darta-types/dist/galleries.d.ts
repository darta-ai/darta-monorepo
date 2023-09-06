export interface PublicFields {
    value: string | null;
}
export interface Images {
    value?: string | null;
    fileData?: string | null | ArrayBuffer;
    fileName?: string | null;
    bucketName?: string | null;
}
export interface PrivateFields {
    value: string | null;
    isPrivate: boolean | null;
}
export interface IBusinessHours {
    hoursOfOperation: BusinessHours;
    isPrivate?: boolean;
}
export type BusinessDays = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
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
export interface CoordinateFields {
    latitude: {
        value: string | null;
    };
    longitude: {
        value: string | null;
    };
    googleMapsPlaceId: {
        value: string | null;
    };
}
export interface IBusinessLocationData {
    businessHours?: IBusinessHours;
    locationString?: PrivateFields;
    exhibitionLocationString?: PublicFields;
    coordinates?: CoordinateFields;
    googleMapsPlaceId?: PublicFields;
    locationId?: string;
    city?: PublicFields;
}
export interface GalleryAddressFields {
    galleryLocation0?: IBusinessLocationData;
    galleryLocation1?: IBusinessLocationData;
    galleryLocation2?: IBusinessLocationData;
    galleryLocation3?: IBusinessLocationData;
    galleryLocation4?: IBusinessLocationData;
}
export interface GalleryBase {
    galleryName: PublicFields;
    normalizedGalleryName?: string | null;
    normalizedGalleryWebsite?: string | null;
    normalizedGalleryDomain?: string | null;
    isValidated?: boolean;
    signUpWebsite?: string;
    value?: string;
    _id?: string;
    _key?: string;
}
interface GalleryFields extends GalleryBase {
    galleryLogo?: Images;
    galleryBio?: PublicFields;
    galleryAddress?: PrivateFields;
    primaryContact?: PrivateFields;
    galleryWebsite?: PrivateFields;
    galleryPhone?: PrivateFields;
    galleryBusinessHours?: IBusinessHours;
    galleryInstagram?: PrivateFields;
}
export interface IGalleryProfileData extends GalleryFields, GalleryAddressFields {
}
export type Dimensions = {
    heightIn: PublicFields;
    text: PublicFields;
    widthIn: PublicFields;
    depthIn?: PublicFields;
    depthCm?: PublicFields;
    heightCm: PublicFields;
    widthCm: PublicFields;
    displayUnit: {
        value: 'in' | 'cm';
    };
};
export interface DateFields {
    value: string | null;
    isOngoing: boolean | null;
}
export interface IOpeningLocationData extends IBusinessLocationData {
    isPrivate: boolean;
}
export type Artwork = {
    artworkImage: Images;
    artworkId?: string;
    published?: boolean;
    artworkImagesArray?: PublicFields[] | any[];
    artworkTitle: PublicFields;
    artistName: PublicFields;
    artworkDescription?: PublicFields;
    artworkCurrency?: PublicFields;
    artworkPrice?: PrivateFields;
    canInquire: PublicFields;
    artworkMedium: PublicFields;
    artworkDimensions: Dimensions;
    slug?: PublicFields;
    artworkCreatedYear?: PublicFields;
    createdAt: string | null;
    updatedAt: string | null;
    collection?: PublicFields;
    exhibitionOrder?: number;
    galleryId?: string;
    _id?: string;
};
export type ExhibitionDates = {
    exhibitionStartDate: DateFields;
    exhibitionEndDate: DateFields;
    exhibitionDuration: {
        value: 'Temporary' | 'Ongoing/Indefinite';
    };
};
export type ReceptionDates = {
    hasReception: {
        value: 'Yes' | 'No';
    };
    receptionStartTime: PublicFields;
    receptionEndTime: PublicFields;
};
export type ArtworkObject = {
    [key: string]: Artwork;
};
export type BusinessAddressType = 'galleryLocation0' | 'galleryLocation1' | 'galleryLocation2' | 'galleryLocation3' | 'galleryLocation4';
export type Exhibition = {
    exhibitionTitle: PublicFields;
    exhibitionPressRelease: PublicFields;
    exhibitionPrimaryImage: PublicFields;
    exhibitionLocation: IOpeningLocationData;
    mediumsUsed?: PublicFields[] | undefined[];
    artists?: PublicFields[] | undefined[];
    pressReleaseImages?: PublicFields[] | undefined[];
    exhibitionImages?: PublicFields[] | undefined[];
    artworks?: {
        [key: string]: Artwork;
    } | {
        [key: string]: undefined;
    };
    published: boolean;
    slug?: PublicFields;
    exhibitionId: string;
    exhibitionDates: ExhibitionDates;
    receptionDates: ReceptionDates;
    createdAt: string | null;
    updatedAt?: string | null;
};
export type ExhibitionObject = {
    [key: string]: Exhibition;
};
export type CurrencyConverterType = {
    [key: string]: '$' | '€' | '£';
};
export type GalleryState = {
    galleryProfile: IGalleryProfileData;
    galleryArtworks: {
        [key: string]: Artwork;
    };
    galleryExhibitions: {
        [key: string]: Exhibition;
    };
    accessToken: string | null;
};
type GalleryDisplayValues = {
    label: string;
    value: string;
};
export type GalleryDropdownDisplay = GalleryDisplayValues[];
export {};
