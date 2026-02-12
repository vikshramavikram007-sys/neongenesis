import { ThumbnailOption, VideoDetails } from '../types';

export const extractVideoId = (url: string): string | null => {
  const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

export const generateThumbnails = (videoId: string): ThumbnailOption[] => {
  return [
    {
      resolution: 'maxres',
      label: 'Max Resolution (HD)',
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      width: 1280,
      height: 720,
    },
    {
      resolution: 'high',
      label: 'High Quality',
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      width: 480,
      height: 360,
    },
    {
      resolution: 'medium',
      label: 'Medium Quality',
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      width: 320,
      height: 180,
    },
    {
      resolution: 'standard',
      label: 'Standard Quality',
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      width: 640,
      height: 480,
    },
  ];
};
