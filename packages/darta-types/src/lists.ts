import { Artwork } from "./galleries";

export interface List {
    _id: string;
    listName: string;
    listDescription: string;
    creator: string;
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
    title: string;
    artist: string;
    image: {
        value: string;
    };
}

export interface ListPreview {
    _id: string;
    listName: string;
    artwork0: PreviewArtwork;
    artwork1: PreviewArtwork;
    artwork2: PreviewArtwork;
    artwork3: PreviewArtwork;
    creator: string;
}

export interface FullList extends List {
    artwork: {
        [key: string]: Artwork;
    };
}
