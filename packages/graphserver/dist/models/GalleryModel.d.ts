import { IGalleryProfileData } from '@darta/types';
import { Node } from './models';
export interface GalleryUser {
    id: string;
    name: string;
    email: string;
}
export interface Gallery extends Node, IGalleryProfileData {
}
export interface City extends Node {
    uuids: string[];
}
