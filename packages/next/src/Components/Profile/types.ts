export interface PrivateFields {
  value: string;
  isPrivate: boolean;
}

export interface PublicFields {
  value: string;
}

interface GalleryFields {
  galleryLogo?: PublicFields;
  galleryName?: PublicFields;
  galleryBio?: PublicFields;
  galleryAddress?: PrivateFields;
  primaryContact?: PrivateFields;
}

interface GalleryAddressFields {
  galleryPrimaryLocation?: PrivateFields;
  galleryPrimaryAddressLine1?: PrivateFields;
  galleryPrimaryAddressLine2?: PrivateFields;
  galleryPrimaryCity?: PrivateFields;
  galleryPrimaryState?: PrivateFields;
  galleryPrimaryZip?: PrivateFields;
  gallerySecondaryLocation?: PrivateFields;
  gallerySecondaryAddressLine1?: PrivateFields;
  gallerySecondaryAddressLine2?: PrivateFields;
  gallerySecondaryCity?: PrivateFields;
  gallerySecondaryState?: PrivateFields;
  gallerySecondaryZip?: PrivateFields;
}

export interface IGalleryProfileData
  extends GalleryFields,
    GalleryAddressFields {}
