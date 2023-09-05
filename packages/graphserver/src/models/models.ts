import { Artwork } from "@darta/types";

export interface Node {
  _key: string;
  _id: string;
  properties?: Record<string, any>;
  value?: string
  };

export interface ArtworkNode extends Node, Artwork {}
  
  export type Edge = {
    id: string;
    from: string;
    to: string;
    properties: Record<string, any>;
  };
  