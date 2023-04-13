/* eslint-disable no-unused-vars */
export interface IUserArtworkRated {
  [key: string]: boolean;
}

// eslint-disable-next-line no-shadow
export enum OpenStateEnum {
  openNav = 'openNav',
  openRatings = 'openRatings',
  openOptions = 'openOptions',
  tombstone = 'tombstone',
  swiped = 'swipped',
}

// eslint-disable-next-line no-shadow
export enum SnackTextEnum {
  save = 'Saved 😍',
  like = 'Liked 😏',
  dislike = 'Disliked 😒',
  reset = 'Reset 🧹',
}

// eslint-disable-next-line no-shadow
export enum RatingEnum {
  unrated = 'unrated',
  save = 'save',
  like = 'like',
  dislike = 'dislike',
}

// eslint-disable-next-line no-shadow
export enum OrientationsEnum {
  landscapeLeft = 'LANDSCAPE-LEFT',
  portraitUp = 'PORTRAIT-UPSIDEDOWN',
  landscapeRight = 'LANDSCAPE-RIGHT',
  portrait = 'PORTRAIT',
}

export type UserArtworkRatings = {
  [key: string]: {
    like?: string;
    save?: string;
    dislike?: string;
  };
};
export interface Icons {
  [key: string]: string;
}

export type CardItemT = {
  description?: string;
  hasActions?: boolean;
  hasVariant?: boolean;
  image: any;
  isOnline?: boolean;
  matches?: string;
  name?: string;
};

export type IconT = {
  icon: any;
  size: number;
  iconColor: string;
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
  icon: string;
  colors: {
    focused: string;
    notFocused: string;
  };
  text?: string;
  type?: string;
  iconName?: any;
  emoji?: string;
};

export type ButtonSizesT = {
  [key: string]: number;
};

type Gene = {
  displayName: string | null;
  name: string;
  id: string;
};

export type DataT = {
  id: string;
  image: string;
  artist: string;
  canInquire?: true;
  category: string;
  createdAt: string;
  date: string;
  dimensionsInches: {
    height: number;
    text: string;
    width: number;
    depth?: number | null;
    diameter?: number | null;
  };
  gallery: {
    name: string;
    region: string;
    email: string;
    slug: string;
    id: string;
  };
  geneName: string[];
  genes: Gene[];
  iconicity: number;
  labels: string[];
  medium: string;
  price: string;
  slug: string;
  sold: boolean;
  title: string;
};

// Mock Data
export interface GalleryLandingPage {
  [key: string]: {
    type: string;
    galleryId: string;
    artworkIds: string[];
    tombstone?: string;
    preview?: {
      [key: string]: {
        id: string;
        image: string;
        dimensionsInches: {
          height: number;
          width: number;
        };
      };
    };
    text: string;
    body: string;
  };
}
