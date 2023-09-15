"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredContent = exports.EdgeNames = exports.CollectionNames = void 0;
exports.CollectionNames = {
    Artwork: 'Artwork',
    ArtworkBelongsToGallery: 'ArtworkBelongsToGallery',
    ArtworkHasPrice: 'ArtworkHasPrice',
    ArtworkSizeBuckets: 'ArtworkSizeBuckets',
    ArtworkArtists: 'ArtworkCreatorArtists',
    ArtworkCreatedBuckets: 'ArtworkCreatedBuckets',
    ArtworkPriceBuckets: 'ArtworkPriceBuckets',
    ArtworkHasDimension: 'ArtworkHasDimension',
    ArtworkCreatedBy: 'ArtworkCreatedBy',
    ArtworkMediums: 'ArtworkMediums',
    ArtworkCreatedIn: 'ArtworkCreatedIn',
    Cities: 'Cities',
    Localities: 'Localities',
    Galleries: 'Galleries',
    Exhibitions: 'Exhibitions',
    GalleryApprovals: 'GalleryApprovals',
    GalleryUsers: 'GalleryUsers',
    GalleryAdminNode: 'GalleryAdminNode',
};
exports.EdgeNames = {
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
exports.RequiredContent = {
    GalleryApprovals: {
        approved: 'approved',
        awaitingApprovalGmail: 'awaitingApprovalGmail',
        awaitingApproval: 'awaitingApproval',
    },
};
