export const CollectionNames = {
  Artwork: 'Artwork',
  ArtworkSizeBuckets: 'ArtworkSizeBuckets',
  ArtworkArtists: 'ArtworkCreatorArtists',
  ArtworkCreatedBuckets: 'ArtworkCreatedBuckets',
  ArtworkPriceBuckets: 'ArtworkPriceBuckets',
  ArtworkMediums: 'ArtworkMediums',
  Cities: 'Cities',
  Localities: 'Localities',
  Galleries: 'Galleries',
  Exhibitions: 'Exhibitions',
  GalleryApprovals: 'GalleryApprovals',

  GalleryUsers: 'GalleryUsers',
  GalleryAdminNode: 'GalleryAdminNode',

  DartaUsers: 'DartaUsers',
};

export const EdgeNames = {
  FROMGalleryToCity: 'FROMGalleryToCity',
  FROMGalleryToArtwork: 'FROMGalleryToArtwork',
  FROMArtworkToMedium: 'FROMArtworkToMedium',
  FROMArtworkTOCostBucket: 'FROMArtworkTOCostBucket',
  FROMArtworkTOSizeBucket: 'FROMArtworkTOSizeBucket',
  FROMArtworkTOArtist: 'FROMArtworkTOArtist',
  FROMArtworkTOCity: 'FROMArtworkTOCity',
  FROMArtworkTOLocality: 'FROMArtworkTOLocality',
  FROMArtworkTOCreateBucket: 'FROMArtworkTOCreateBucket',
  FROMGalleryTOExhibition: 'FROMGalleryTOExhibition',
  FROMUserTOGallery: 'FROMUserTOGallery',
  FROMCollectionTOArtwork: 'FROMCollectionTOArtwork',
  FROMExhibitionTOCity: 'FROMExhibitionTOCity',

  FROMEndUserTOArtwork: 'FROMEndUserTOArtwork',
  FROMEndUserTOGallery: 'FROMEndUserTOGallery',
};

export const RequiredContent = {
  GalleryApprovals: {
    approved: 'approved',
    awaitingApprovalGmail: 'awaitingApprovalGmail',
    awaitingApproval: 'awaitingApproval',
  },
};
