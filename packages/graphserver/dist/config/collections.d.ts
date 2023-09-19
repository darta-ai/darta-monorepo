export declare const CollectionNames: {
    Artwork: string;
    ArtworkSizeBuckets: string;
    ArtworkArtists: string;
    ArtworkCreatedBuckets: string;
    ArtworkPriceBuckets: string;
    ArtworkMediums: string;
    Cities: string;
    Localities: string;
    Galleries: string;
    Exhibitions: string;
    GalleryApprovals: string;
    GalleryUsers: string;
    GalleryAdminNode: string;
};
export declare const EdgeNames: {
    GalleryToCity: string;
    FROMGalleryToArtwork: string;
    FROMArtworkToMedium: string;
    FROMArtworkTOCostBucket: string;
    FROMArtworkTOSizeBucket: string;
    FROMArtworkTOArtist: string;
    FROMArtworkTOCity: string;
    FROMArtworkTOLocality: string;
    FROMArtworkTOCreateBucket: string;
    FROMGalleryTOExhibition: string;
    FROMUserTOGallery: string;
    FROMCollectionTOArtwork: string;
};
export declare const RequiredContent: {
    GalleryApprovals: {
        approved: string;
        awaitingApprovalGmail: string;
        awaitingApproval: string;
    };
};
