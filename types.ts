export type CardItemT = {
  description?: string;
  hasActions?: boolean;
  hasVariant?: boolean;
  image: any;
  isOnline?: boolean;
  matches?: string;
  name: string;
};

export type IconT = {
  name: any;
  size: number;
  color: string;
  style?: any;
  type?: string;
};

export type MessageT = {
  image: any;
  lastMessage: string;
  name: string;
};

export type ProfileItemT = {
  age?: string;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  location?: string;
  matches: string;
  name: string;
};

export type TabBarIconT = {
  focused: boolean;
  text: string;
  type?: string;
  iconName?: any;
  emoji?: string;
};

type Gene = {
  displayName: string | null; 
  name: string;
  id: string;
}

export type DataT = {
  id: string;
  image: string;
  artist: string; 
  canInquire?: true;
  category: string;
  createdAt: string;
  date: string,
  dimensionsInches: {
    height: number;
    text: string;
    width: number;
    depth?: number | null;
    diameter?: number | null;
  },
  gallery: {
    name: string;
    region: string;
    email: string;
    slug: string;
    id: string;
  };
  geneName: string[];
  genes : Gene[];
  iconicity: number;
  labels:  string[];
  medium: string;
  price: string;
  slug: string;
  sold : boolean,
  title :  string;
};
