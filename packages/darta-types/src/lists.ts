import { ArtworkListInformation, PublicFields } from "./galleries";

export interface List {
    _id: string;
    listName: string;
    creator: string;
    isPrivate: boolean;
    createdAt: string;
}

export interface NewList {
    listName: string;
    isCollaborative: boolean;
    isPrivate: boolean;
}

export interface ListUserEdge {
    _id: string;
    creator: string;
    createdAt: string;
}

export interface ListArtworkEdge {
    _id: string;
    creator: string;
    createdAt: string;
}

export type PreviewArtwork = {
    _id: string;
    artworkTitle: PublicFields;
    artistName: PublicFields;
    artworkImage: {
        value: string | null | undefined;
    };
    addedAt: string;
}

export interface ListPreview {
    _id: string;
    listName: string;
    artworkPreviews: {[key: string]: PreviewArtwork};
    creatorId: string;
    previewImage: PublicFields;
    createdAt: string;
}


export interface FullList extends List {
    artwork: {
        [key: string]: ArtworkListInformation;
    };
}
