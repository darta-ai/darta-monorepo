export const CollectionNames = {
    Artwork: 'Artwork',
    ArtworkBelongsToGallery : 'ArtworkBelongsToGallery',
    ArtworkHasPrice :'ArtworkHasPrice',
    ArtworkPriceBuckets: 'ArtworkPriceBuckets',
    ArtworkHasDimension : 'ArtworkHasDimension',
    ArtworkCreatedBy : 'ArtworkCreatedBy',
    ArtworkMediums: 'ArtworkMediums',
    ArtworkCreatedIn : 'ArtworkCreatedIn',
    Cities: 'Cities',
    Galleries: 'Galleries',
    GalleryApprovals: 'GalleryApprovals'
}

export const EdgeNames = {
    GalleryToCity: 'GalleryToCity',
    GalleryShowsArtwork: 'GalleryShowsArtwork',
    ArtworkUsesMedium : 'ArtworkUsesMedium',
    ArtworkCosts: 'ArtworkCosts'
}


export const RequiredContent = {
    GalleryApprovals : {
        approved: 'approved',
        awaitingApprovalGmail: 'awaitingApprovalGmail',
        awaitingApproval: 'awaitingApproval',
    }
}