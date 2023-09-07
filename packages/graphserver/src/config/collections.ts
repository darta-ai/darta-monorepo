export const CollectionNames = {
    Artwork: 'Artwork',
    ArtworkBelongsToGallery : 'ArtworkBelongsToGallery',
    ArtworkHasPrice :'ArtworkHasPrice',
    ArtworkSizeBuckets: 'ArtworkSizeBuckets',
    ArtworkArtists: 'ArtworkCreatorArtists',
    ArtworkCreatedBuckets: 'ArtworkCreatedBuckets',
    ArtworkPriceBuckets: 'ArtworkPriceBuckets',
    ArtworkHasDimension : 'ArtworkHasDimension',
    ArtworkCreatedBy : 'ArtworkCreatedBy',
    ArtworkMediums: 'ArtworkMediums',
    ArtworkCreatedIn : 'ArtworkCreatedIn',
    Cities: 'Cities',
    Galleries: 'Galleries',
    Exhibitions: 'Exhibitions',
    GalleryApprovals: 'GalleryApprovals',


    GalleryUsers: 'GalleryUsers',
}

export const EdgeNames = {
    GalleryToCity: 'GalleryToCity',
    FROMGalleryToArtwork: 'GalleryShowsArtwork',
    FROMArtworkToMedium : 'ArtworkUsesMedium',
    FROMArtworkTOCostBucket: 'ArtworkCosts',
    FROMArtworkTOSizeBucket: 'ArtworkSizes',
    FROMArtworkTOArtist: 'ArtworkArtist',
    FROMArtworkTOCreateBucket: 'ArtworkCreatedYear',
    FROMGalleryTOExhibition: 'FROMGalleryTOExhibition',
    FROMUserTOGallery: 'FROMUserTOGallery'
}


export const RequiredContent = {
    GalleryApprovals : {
        approved: 'approved',
        awaitingApprovalGmail: 'awaitingApprovalGmail',
        awaitingApproval: 'awaitingApproval',
    }
}