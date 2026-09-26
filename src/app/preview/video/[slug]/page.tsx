import { notFound } from "next/navigation";
import { VIDEO_STAGES } from "@/video-stages";

// Dev-only capture target for scripts/record-video.mts; 404s in production.
export const metadata = { robots: { index: false, follow: false } };

export default async function VideoStagePage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  const Stage = VIDEO_STAGES[slug];
  if (!Stage) notFound();
  return <Stage />;
}
