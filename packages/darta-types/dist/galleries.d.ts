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
    locality?: PublicFields;
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
    galleryId?: string;
    galleryExhibitions?: ExhibitionObject;
    galleryInternalEmail?: PublicFields;
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
export type ArtworkPreview = {
    [key: string]: {
        _id: string;
        artworkImage: {
            value: string;
        };
        artworkTitle: {
            value: string;
        };
    };
};
export type ExhibitionPreview = {
    artworkPreviews: ArtworkPreview;
    exhibitionId: string;
    galleryId: string;
    openingDate: PublicFields;
    closingDate: PublicFields;
    exhibitionDuration: {
        value: 'Temporary' | 'Ongoing/Indefinite';
    };
    galleryLogo: Images;
    galleryName: PublicFields;
    exhibitionArtist: PublicFields;
    exhibitionTitle: PublicFields;
    exhibitionLocation: {
        exhibitionLocationString: PublicFields;
        coordinates: CoordinateFields;
    };
    exhibitionPrimaryImage: {
        value: string;
    };
    exhibitionDates: ExhibitionDates;
    receptionDates: ReceptionDates;
};
export type Artwork = {
    artworkImage: Images;
    artworkId?: string;
    published?: boolean;
    artworkImagesArray?: PublicFields[] | any[];
    artworkTitle: PublicFields;
    artistName: PublicFields;
    artworkCategory: PublicFields;
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
    exhibitionId: string | null;
    galleryId?: string;
    _id?: string;
    artworkStyleTags?: string[];
    artworkVisualTags?: string[];
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
    _key?: string;
    _id?: string;
    exhibitionTitle: PublicFields;
    exhibitionPressRelease: PublicFields;
    exhibitionPrimaryImage: Images;
    exhibitionLocation: IOpeningLocationData;
    mediumsUsed?: PublicFields[] | undefined[];
    artists?: PublicFields[] | undefined[];
    pressReleaseImages?: PublicFields[] | undefined[];
    exhibitionImages?: PublicFields[] | undefined[];
    exhibitionOrder?: string[];
    exhibitionType?: {
        value: 'Group Show' | 'Solo Show';
    };
    exhibitionArtist?: {
        value: string;
    };
    artworks?: {
        [key: string]: Artwork;
    };
    published: boolean;
    slug?: PublicFields;
    exhibitionId: string;
    exhibitionDates: ExhibitionDates;
    receptionDates: ReceptionDates;
    createdAt: string | null;
    updatedAt?: string | null;
    exhibitionArtistStatement?: PublicFields;
    artworkStyleTags?: string[];
    artworkVisualTags?: string[];
    artworkCategory: PublicFields;
    videoLink?: PublicFields;
    pressLink?: PublicFields;
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
    user: any;
};
type GalleryDisplayValues = {
    label: string;
    value: string;
};
export type GalleryDropdownDisplay = GalleryDisplayValues[];
export type ExhibitionMapPin = {
    exhibitionId: string;
    galleryId: string;
    galleryName: PublicFields;
    galleryLogo: Images;
    exhibitionTitle: PublicFields;
    exhibitionLocation: IOpeningLocationData;
    exhibitionPrimaryImage: Images;
    exhibitionDates: ExhibitionDates;
    receptionDates: ReceptionDates;
    exhibitionArtist?: PublicFields;
    exhibitionType: {
        value: 'Group Show' | 'Solo Show';
    };
    artworks?: {
        [key: string]: Artwork;
    };
    _id?: string;
};
export type GalleryPreview = {
    galleryLogo: Images;
    galleryName: PublicFields;
    _id: string;
};
export {};
