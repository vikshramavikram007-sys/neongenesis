export interface ThumbnailOption {
  resolution: string;
  label: string;
  url: string;
  width: number;
  height: number;
}

export interface VideoDetails {
  id: string;
  thumbnails: ThumbnailOption[];
}
