export type Node = {
  _key: string;
    _id: string;
    properties?: Record<string, any>;
  };
  
  export type Edge = {
    id: string;
    from: string;
    to: string;
    properties: Record<string, any>;
  };
  