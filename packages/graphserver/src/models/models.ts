import { Artwork } from "@darta/types";

export interface Node {
  _key?: string;
  _id?: string;
  properties?: Record<string, any>;
  value?: string
  };

export interface ArtworkNode extends Node, Artwork {}
  
  export type Edge = {
    _key: string;
    _id: string;
    _from: string;
    _to: string;
    _rev: string;
    value: string;
  };
  