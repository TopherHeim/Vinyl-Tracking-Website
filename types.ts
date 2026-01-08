
export enum Tab {
  TILES = 'TILES',
  STATS = 'STATS',
  WISHLIST = 'WISHLIST'
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  genre: string;
  year: number;
  coverUrl?: string;
  spineColor: string;
  description?: string;
  addedAt: string;
  status: 'collection' | 'wishlist';
}

export interface NewAlbumInput {
  title: string;
  artist: string;
  genre: string;
  year: string;
  spineColor: string;
  status: 'collection' | 'wishlist';
}

export interface Recommendation {
  title: string;
  artist: string;
  reason: string;
  genre: string;
  year: number;
  spineColor: string;
}
