interface Images {
    value?: string | null;
    fileData?: string | null | ArrayBuffer;
    fileName?: string | null;
    bucketName?: string | null;
}

export type MobileUser =  {
    profilePicture?: Images;
    userName?: string;
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    uid?: string;
    localStorageUid?: string;
}