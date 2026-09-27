"use client";

import { VideoGlowLightbox } from "../../registry/new-york/video-glow-lightbox/video-glow-lightbox";
import { Stage } from "./stage";

// The registry preview video and poster, without its demo source switcher, full frame.
export function VideoGlowLightboxStage() {
  return (
    <Stage>
      <div className="h-full w-full overflow-hidden">
        <VideoGlowLightbox videoType="url" videoUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" thumbnailImage="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80" />
      </div>
    </Stage>
  );
}
