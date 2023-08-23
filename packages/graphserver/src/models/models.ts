export type Node = {
    id: string;
    properties?: Record<string, any>;
  };
  
  export type Edge = {
    id: string;
    from: string;
    to: string;
    properties: Record<string, any>;
  };
  