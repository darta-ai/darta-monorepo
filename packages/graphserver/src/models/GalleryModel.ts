import {Node} from './models'

export interface GalleryUser {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Gallery extends Node {
    uuids: string[]
  }