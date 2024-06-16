export const CollectionNames = {
  Artwork: 'Artwork',
  ArtworkSizeBuckets: 'ArtworkSizeBuckets',
  ArtworkArtists: 'ArtworkCreatorArtists',
  ArtworkCreatedBuckets: 'ArtworkCreatedBuckets',
  ArtworkPriceBuckets: 'ArtworkPriceBuckets',
  ArtworkMediums: 'ArtworkMediums',
  ArtworkStyleTags: 'ArtworkStyleTags',
  ArtworkVisualTags: 'ArtworkVisualTags',
  ArtworkCategories: 'ArtworkCategories',
  Cities: 'Cities',
  Localities: 'Localities',
  Galleries: 'Galleries',
  Exhibitions: 'Exhibitions',
  GalleryApprovals: 'GalleryApprovals',

  GalleryUsers: 'GalleryUsers',
  GalleryAdminNode: 'GalleryAdminNode',

  DartaUsers: 'DartaUsers',

  DartaUserLists: 'DartaUserLists',
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
  FROMCollectionTOArtwork: 'FROMExhibitionsTOArtwork',
  FROMExhibitionTOCity: 'FROMExhibitionTOCity',
  FROMArtworkTOCategory: 'FROMArtworkTOCategory',
  FROMArtworkTOStyleTag: 'FROMArtworkTOStyleTag',
  FROMArtworkTOVisualTag: 'FROMArtworkTOVisualTag',

  FROMDartaUserTOArtworkLIKE: 'FROMDartaUserTOArtworkLIKE',
  FROMDartaUserTOArtworkDISLIKE: 'FROMDartaUserTOArtworkDISLIKE',
  FROMDartaUserTOArtworkINQUIRE: 'FROMDartaUserTOArtworkINQUIRE',
  FROMDartaUserTOArtworkSAVE: 'FROMDartaUserTOArtworkSAVE',
  FROMDartaUserTOArtworkVIEWED: 'FROMDartaUserTOArtworkVIEWED',
  FROMDartaUserTOArtworkVIEW_TIME: 'FROMDartaUserTOArtworkVIEW_TIME',

  FROMDartaUserTOGalleryVIEWED: 'FROMDartaUserTOGalleryVIEWED',
  FROMDartaUserTOGalleryVIEW_TIME: 'FROMDartaUserTOGalleryVIEW_TIME',
  FROMDartaUserTOGalleryFOLLOWS: 'FROMDartaUserTOGalleryFOLLOWS',

  FROMDartaUserTOExhibitionVIEWED: 'FROMDartaUserTOExhibitionVIEWED',
  FROMDartaUserTOExhibitionVIEW_TIME: 'FROMDartaUserTOExhibitionVIEW_TIME',

  FROMDartaUserTOList: 'FROMDartaUserTOList',
  FROMListTOArtwork: 'FROMListTOArtwork',

};

export const GraphNames = {
  ArtworkGraph: 'ArtworkGraph',
};

export const RequiredContent = {
  GalleryApprovals: {
    approved: 'approved',
    awaitingApprovalGmail: 'awaitingApprovalGmail',
    awaitingApproval: 'awaitingApproval',
  },
};
