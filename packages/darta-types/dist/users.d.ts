interface Images {
    value?: string | null;
    fileData?: string | null | ArrayBuffer;
    fileName?: string | null;
    bucketName?: string | null;
}
export type MobileUser = {
    profilePicture?: Images;
    userName?: string;
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    uid?: string;
    localStorageUid?: string;
};
type GalleryInquiryStats = 'inquired' | 'gallery_responded' | 'negotiation' | 'accepted' | 'payment_received' | 'artwork_sent' | 'closed' | 'gallery_declined' | 'gallery_archived';
export type InquiryArtworkData = {
    edge_id: string;
    artwork_id: string;
    createdAt: string;
    legalFirstName: string;
    legalLastName: string;
    email: string;
    status: GalleryInquiryStats;
    updatedAt: string;
};
export {};
