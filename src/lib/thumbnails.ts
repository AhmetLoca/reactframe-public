import { THUMBNAIL_IMAGE_SLUGS, THUMBNAIL_VIDEO_SLUGS } from "./thumbnail-manifest";

const imageSlugs = new Set(THUMBNAIL_IMAGE_SLUGS);
const videoSlugs = new Set(THUMBNAIL_VIDEO_SLUGS);

export function hasThumbnailImage(slug: string): boolean {
  return imageSlugs.has(slug);
}

export function hasThumbnailVideo(slug: string): boolean {
  return videoSlugs.has(slug);
}
