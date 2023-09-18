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
};

export const EdgeNames = {
  GalleryToCity: 'GalleryToCity',
  FROMGalleryToArtwork: 'GalleryShowsArtwork',
  FROMArtworkToMedium: 'ArtworkUsesMedium',
  FROMArtworkTOCostBucket: 'ArtworkCosts',
  FROMArtworkTOSizeBucket: 'ArtworkSizes',
  FROMArtworkTOArtist: 'ArtworkArtist',
  FROMArtworkTOCity: 'FROMArtworkTOCity',
  FROMArtworkTOLocality: 'FROMArtworkTOLocality',
  FROMArtworkTOCreateBucket: 'ArtworkCreatedYear',
  FROMGalleryTOExhibition: 'FROMGalleryTOExhibition',
  FROMUserTOGallery: 'FROMUserTOGallery',
  FROMCollectionTOArtwork: 'FROMCollectionTOArtwork',
};

export const RequiredContent = {
  GalleryApprovals: {
    approved: 'approved',
    awaitingApprovalGmail: 'awaitingApprovalGmail',
    awaitingApproval: 'awaitingApproval',
  },
};
