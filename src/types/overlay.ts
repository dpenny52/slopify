export interface OverlayVideo {
  id: string
  name: string
  description: string
  src: string
  thumbnailTime: number // Time in seconds to capture thumbnail
}

export interface OverlaySelection {
  id: string
  position: number // 0-7 for the 8 outer grid positions
}

export const SAMPLE_OVERLAYS: OverlayVideo[] = [
  {
    id: 'overlay-1',
    name: 'Blue & Orange',
    description: 'Blue and orange plasticine',
    src: '/sample-overlays/overlay-1.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-2',
    name: 'Green Ice Cream',
    description: 'Green ice cream plasticine',
    src: '/sample-overlays/overlay-2.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-3',
    name: 'Pink Ice Cream',
    description: 'Pink ice cream plasticine',
    src: '/sample-overlays/overlay-3.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-4',
    name: 'Red Slime',
    description: 'Red slime with bowl',
    src: '/sample-overlays/overlay-4.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-5',
    name: 'Green Squeeze',
    description: 'Green ice cream squeeze',
    src: '/sample-overlays/overlay-5.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-6',
    name: 'Orange Clay',
    description: 'Orange modeling clay',
    src: '/sample-overlays/overlay-6.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-7',
    name: 'Orange Ice Cream',
    description: 'Orange ice cream plasticine',
    src: '/sample-overlays/overlay-7.mp4',
    thumbnailTime: 2,
  },
  {
    id: 'overlay-8',
    name: 'Purple Ice Cream',
    description: 'Purple ice cream plasticine',
    src: '/sample-overlays/overlay-8.mp4',
    thumbnailTime: 2,
  },
]

export const MIN_OVERLAY_SELECTION = 1
export const MAX_OVERLAY_SELECTION = 8
