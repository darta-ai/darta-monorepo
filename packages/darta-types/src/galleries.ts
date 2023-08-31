export interface PublicFields {
    value: string | null;
}

export interface Images {
  value?: string | null, 
  fileData?: string | null | string | ArrayBuffer,
  fileName?: string | null
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
    galleryName?: PublicFields;
    isValidated?: boolean;
    primaryOwnerPhone?: string;
    primaryOwnerEmail?: string;
    signUpWebsite?: string;
    primaryUUIDPhone?: string;
    primaryUUID?: string;
    uuids?: string[];
    value?: string;
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
export {};
