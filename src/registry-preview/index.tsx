import * as React from "react";
import { cn } from "@/lib/utils";
import { Playground, type PlaygroundControl } from "@/components/playground";
import { CountdownTimer } from "../../registry/new-york/countdown-timer/countdown-timer";
import { CosmicBackground } from "../../registry/new-york/cosmic-background/cosmic-background";
import { TogglePro, ToggleVisual } from "../../registry/new-york/toggle-pro/toggle-pro";
import { Badge, type BadgeTone, type BadgeIconType, type BadgeTheme } from "../../registry/new-york/badges-kit/badges-kit";
import { RatingStars } from "../../registry/new-york/rating-stars/rating-stars";
import { GlareCard } from "../../registry/new-york/glare-card/glare-card";
import { ImageDeck3D } from "../../registry/new-york/image-deck-3d/image-deck-3d";
import { LinearProgress } from "../../registry/new-york/linear-progress/linear-progress";
import { InfiniteMarquee } from "../../registry/new-york/infinite-marquee/infinite-marquee";
import { DiscordChatWidget } from "../../registry/new-york/discord-chat-widget/discord-chat-widget";
import { TelegramWidget } from "../../registry/new-york/telegram-widget/telegram-widget";
import { MessengerWidget } from "../../registry/new-york/messenger-widget/messenger-widget";
import { XTwitterWidget } from "../../registry/new-york/x-twitter-widget/x-twitter-widget";
import { FooterPremium } from "../../registry/new-york/footer-premium/footer-premium";
import { FooterSection } from "../../registry/new-york/footer-section/footer-section";
import { HoverScanCard } from "../../registry/new-york/hover-scan-card/hover-scan-card";
import { CompareSlider } from "../../registry/new-york/compare-slider/compare-slider";
import { GlowCard } from "../../registry/new-york/glow-card/glow-card";
import { ImageShowcase } from "../../registry/new-york/image-showcase/image-showcase";
import { EternalGlowCard } from "../../registry/new-york/eternal-glow-card/eternal-glow-card";
import { CardStack } from "../../registry/new-york/card-stack/card-stack";
import { HeaderSimple } from "../../registry/new-york/header-simple/header-simple";
import { GlassNavigation } from "../../registry/new-york/glass-navigation/glass-navigation";
import { TestimonialLogos } from "../../registry/new-york/testimonial-logos/testimonial-logos";
import { MotionGalleryGrid } from "../../registry/new-york/motion-gallery-grid/motion-gallery-grid";
import { QrCodeWidget } from "../../registry/new-york/qr-code-widget/qr-code-widget";
import { AirbnbReviews } from "../../registry/new-york/airbnb-reviews/airbnb-reviews";
import { EbayReviews } from "../../registry/new-york/ebay-reviews/ebay-reviews";
import { EtsyReviews } from "../../registry/new-york/etsy-reviews/etsy-reviews";
import { CoinFlipGame } from "../../registry/new-york/coin-flip-game/coin-flip-game";
import { TicTacToeGame } from "../../registry/new-york/tic-tac-toe-game/tic-tac-toe-game";
import { Game2048 } from "../../registry/new-york/2048-game/2048-game";
import { SnakeGame } from "../../registry/new-york/snake-game/snake-game";
import { MinesweeperGame } from "../../registry/new-york/minesweeper-game/minesweeper-game";
import { MemoryMatchGame } from "../../registry/new-york/memory-match-game/memory-match-game";
import { PongGame } from "../../registry/new-york/pong-game/pong-game";
import { DinoRunnerGame } from "../../registry/new-york/dino-runner-game/dino-runner-game";
import { SpaceInvadersGame } from "../../registry/new-york/space-invaders-game/space-invaders-game";
import { TowerBlocksGame } from "../../registry/new-york/tower-blocks-game/tower-blocks-game";
import { MazeRunnerGame } from "../../registry/new-york/maze-runner-game/maze-runner-game";
import { GlowJumpWidget } from "../../registry/new-york/glow-jump-widget/glow-jump-widget";
import { BalloonPopperGame } from "../../registry/new-york/balloon-popper-game/balloon-popper-game";
import { DartThrowGame } from "../../registry/new-york/dart-throw-game/dart-throw-game";
import { SpinToWinWheel } from "../../registry/new-york/spin-to-win-wheel/spin-to-win-wheel";
import { MemoryCardsWidget } from "../../registry/new-york/memory-cards-widget/memory-cards-widget";
import { BubbleCursor } from "../../registry/new-york/bubble-cursor/bubble-cursor";
import { GlassShowcaseScroll } from "../../registry/new-york/glass-showcase-scroll/glass-showcase-scroll";
import { WaveMarquee } from "../../registry/new-york/wave-marquee/wave-marquee";
import { TestimonialSpotlight } from "../../registry/new-york/testimonial-spotlight/testimonial-spotlight";
import { TestimonialPills } from "../../registry/new-york/testimonial-pills/testimonial-pills";
import { TestimonialVideoWall } from "../../registry/new-york/testimonial-video-wall/testimonial-video-wall";
import { ProfileFlipCard } from "../../registry/new-york/profile-flip-card/profile-flip-card";
import { PhoneMockup } from "../../registry/new-york/phone-mockup/phone-mockup";
import { LaptopMockup } from "../../registry/new-york/laptop-mockup/laptop-mockup";
import { BrowserMockup } from "../../registry/new-york/browser-mockup/browser-mockup";
import { InstagramPostMockup } from "../../registry/new-york/instagram-post-mockup/instagram-post-mockup";
import { XPostMockup } from "../../registry/new-york/x-post-mockup/x-post-mockup";
import { TikTokPostMockup } from "../../registry/new-york/tiktok-post-mockup/tiktok-post-mockup";
import { LinkedInPostMockup } from "../../registry/new-york/linkedin-post-mockup/linkedin-post-mockup";
import { CylinderGallery } from "../../registry/new-york/cylinder-gallery/cylinder-gallery";
import { GalleryFlow } from "../../registry/new-york/gallery-flow/gallery-flow";
import { BarChart } from "../../registry/new-york/bar-chart/bar-chart";
import { PieChart } from "../../registry/new-york/pie-chart/pie-chart";
import { RadarChart } from "../../registry/new-york/radar-chart/radar-chart";
import { RangeAreaChart } from "../../registry/new-york/range-area-chart/range-area-chart";
import { RotatingGallery } from "../../registry/new-york/rotating-gallery/rotating-gallery";
import { TearableReveal } from "../../registry/new-york/tearable-reveal/tearable-reveal";
import { LineChart } from "../../registry/new-york/line-chart/line-chart";
import { DataTable } from "../../registry/new-york/data-table/data-table";
import { KanbanBoard } from "../../registry/new-york/kanban-board/kanban-board";
import { ExpandCardGrid } from "../../registry/new-york/expand-card-grid/expand-card-grid";
import { SalesTicketPopup, type SalesTicketTheme } from "../../registry/new-york/sales-ticket-popup/sales-ticket-popup";
import { AnimatedCheckbox, CheckboxVisual, InfoIcon } from "../../registry/new-york/animated-checkbox/animated-checkbox";
import { AnimatedLoader, type AnimatedLoaderVariant } from "../../registry/new-york/animated-loader/animated-loader";
import { ProductGridSection } from "../../registry/new-york/product-grid-section/product-grid-section";
import { FeatureCardIllustrated } from "../../registry/new-york/feature-card-illustrated/feature-card-illustrated";
import { VideoGlowLightbox } from "../../registry/new-york/video-glow-lightbox/video-glow-lightbox";
import { DotImageLoader } from "../../registry/new-york/dot-image-loader/dot-image-loader";
import { DotImageSlider } from "../../registry/new-york/dot-image-slider/dot-image-slider";
import { LogoGrid } from "../../registry/new-york/logo-grid/logo-grid";
import { AIAgentWave } from "../../registry/new-york/ai-agent-wave/ai-agent-wave";
import { NoiseBackground } from "../../registry/new-york/noise-background/noise-background";
import { LinearProgressBars } from "../../registry/new-york/linear-progress-bars/linear-progress-bars";
import { ProgressCircleBars } from "../../registry/new-york/progress-circle-bars/progress-circle-bars";
import { AlertToastShowcase } from "../../registry/new-york/alert-toast/alert-toast";
import { ProgressRowsCard } from "../../registry/new-york/progress-rows-card/progress-rows-card";
import { FeatureMediaHighlight } from "../../registry/new-york/feature-media-highlight/feature-media-highlight";
import { CinematicStackedGallery } from "../../registry/new-york/cinematic-stacked-gallery/cinematic-stacked-gallery";
import { PhoneReelShowcase } from "../../registry/new-york/phone-reel-showcase/phone-reel-showcase";
import { CinematicScrollStory } from "../../registry/new-york/cinematic-scroll-story/cinematic-scroll-story";
import { DiceRollDiscountPopup } from "../../registry/new-york/dice-roll-discount-popup/dice-roll-discount-popup";
import { WheelSpinDiscountPopup } from "../../registry/new-york/wheel-spin-discount-popup/wheel-spin-discount-popup";

// Maps a registry item slug to a rendered preview. Kept separate from
// catalog-data.ts (plain metadata, safe for server components) because this
// file imports actual component code and example props.
//
const TEAM_DRAWER_MEMBERS = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    image: "/demo/team-drawer-1.webp",
    bio: "Sarah is a passionate product designer with over 8 years of experience in creating user-centric digital experiences.",
    detail: "When she's not designing, you can find her exploring local coffee shops or hiking in the mountains.",
    tags: ["UI/UX", "Design Systems", "Prototyping"],
    socials: { twitter: "sarahchen", github: "sarahchen", linkedin: "sarahchen" },
    accentHue: 24,
  },
  {
    name: "Marcus Liu",
    role: "Senior Engineer",
    image: "/demo/team-drawer-2.webp",
    bio: "Marcus brings 10+ years of full-stack engineering expertise, with deep roots in distributed systems and API architecture.",
    detail: "A weekend climber and open source contributor who believes every bug has a story worth reading.",
    tags: ["Backend", "APIs", "Distributed Systems"],
    socials: { twitter: "marcusliu", github: "marcusliu", linkedin: "marcusliu" },
    accentHue: 210,
  },
  {
    name: "Yuki Tanaka",
    role: "Data Scientist",
    image: "/demo/team-drawer-3.webp",
    bio: "Yuki transforms messy datasets into elegant insights. With a PhD in applied mathematics, she bridges raw numbers and human understanding.",
    detail: "Obsessed with origami, jazz piano, and the perfect matcha ratio.",
    tags: ["Machine Learning", "Analytics", "Python"],
    socials: { twitter: "yukitan", github: "yukitanaka", linkedin: "yukitanaka" },
    accentHue: 158,
  },
  {
    name: "Daniel Osei",
    role: "Frontend Lead",
    image: "/demo/team-drawer-4.webp",
    bio: "Daniel crafts pixel-perfect interfaces that delight users across every device. He champions accessibility and performance as first-class features.",
    detail: "Afrobeat enthusiast and sourdough baker who once live-coded a UI at a hackathon while asleep (allegedly).",
    tags: ["React", "Accessibility", "Performance"],
    socials: { twitter: "danielosei", github: "danielosei", linkedin: "danielosei" },
    accentHue: 280,
  },
];

const IMAGE_SHOWCASE_IMAGES = [
  { src: "/demo/image-showcase-1.webp", alt: "Showcase 1" },
  { src: "/demo/image-showcase-2.webp", alt: "Showcase 2" },
  { src: "/demo/image-showcase-3.webp", alt: "Showcase 3" },
  { src: "/demo/image-showcase-4.webp", alt: "Showcase 4" },
  { src: "/demo/image-showcase-5.webp", alt: "Showcase 5" },
];

const HOVER_GALLERY_IMAGES = [
  {
    url: "/demo/hover-gallery-gallop.webp",
    title: "Full Gallop",
    subtitle: "Motion in monochrome",
    tag: "Photography",
    description:
      "A dressage rider caught mid-stride in dramatic black and white, the motion blur turning horse and rider into a single fluid silhouette against a stark white backdrop.",
  },
  {
    url: "/demo/hover-gallery-rowing.webp",
    title: "In Stroke",
    subtitle: "A rower's rhythm, blurred",
    tag: "Photography",
    description:
      "A solitary rower silhouetted mid-stroke, the horizontal motion blur stretching the scull and oar across a pale, minimal backdrop to suggest speed.",
  },
  {
    url: "/demo/hover-gallery-deadlift.webp",
    title: "The Lift",
    subtitle: "Power under blur",
    tag: "Photography",
    description:
      "A weightlifter caught in the explosive moment of a barbell lift, motion blur radiating from the spinning plates to convey raw strength.",
  },
  {
    url: "/demo/hover-gallery-pit-crew.webp",
    title: "Walking Out",
    subtitle: "Pit crew, in step",
    tag: "Photography",
    description:
      "A row of team members walking in formation, motion blur blending their silhouettes together to capture a shared sense of purpose.",
  },
  {
    url: "/demo/hover-gallery-time-trial.webp",
    title: "Time Trial",
    subtitle: "Speed, low and lean",
    tag: "Photography",
    description:
      "A cyclist in aerodynamic tuck racing forward, motion blur streaking the spinning wheels to capture the pure velocity of a solo time trial.",
  },
  {
    url: "/demo/hover-gallery-ascent.webp",
    title: "The Ascent",
    subtitle: "One step at a time",
    tag: "Photography",
    description:
      "A hiker with backpack and trekking pole silhouetted against the ridgeline, motion blur capturing the steady rhythm of climbing a steep mountain trail.",
  },
  {
    url: "/demo/hover-gallery-sled-push.webp",
    title: "Push to the Limit",
    subtitle: "Sled work, full effort",
    tag: "Photography",
    description: "An athlete driving a weighted sled forward with full-body effort, motion blur emphasizing the explosive push.",
  },
  {
    url: "/demo/hover-gallery-sprint.webp",
    title: "Full Sprint",
    subtitle: "Speed at its peak",
    tag: "Photography",
    description:
      "A sprinter frozen mid-stride at full extension, motion blur trailing off the limbs to capture the explosive power and speed of a dead sprint.",
  },
  {
    url: "/demo/hover-gallery-swimming.webp",
    title: "Breaking Through",
    subtitle: "Stroke by stroke",
    tag: "Photography",
    description:
      "A swimmer mid-stroke breaking the water's surface, motion blur and splash merging into a single dynamic form that captures the rhythm.",
  },
  {
    url: "/demo/hover-gallery-runner-pace.webp",
    title: "Chasing Pace",
    subtitle: "Stride in motion",
    tag: "Photography",
    description:
      "A female runner mid-stride with hair and limbs trailing in motion blur, her ponytail whipping behind her to capture the speed.",
  },
  {
    url: "/demo/hover-gallery-downhill.webp",
    title: "Downhill Carve",
    subtitle: "Snow in motion",
    tag: "Photography",
    description:
      "A skier carving down a slope with poles trailing, motion blur and spraying snow capturing the speed and precision of a downhill turn.",
  },
  {
    url: "/demo/hover-gallery-strike.webp",
    title: "The Strike",
    subtitle: "Impact in motion",
    tag: "Photography",
    description: "A footballer captured at the exact moment of impact, motion blur streaking through his kicking leg and the ball to convey the speed.",
  },
];

// Plain, non-interactive previews — safe to call from Server Components
// (the homepage grid and /components grid both render these directly).
// Passing a function as a prop/child from a Server Component into a Client
// Component throws ("Functions are not valid as a child of Client
// Components"), so nothing here may use <Playground> or any other
// render-prop pattern. The interactive, Playground-wrapped versions live in
// `registryPlaygroundPreviews` below and are only ever read by
// /preview/[slug]/page.tsx, which is a Client Component end to end.
export const registryPreviews: Record<string, () => React.ReactNode> = {
  "countdown-timer": () => <CountdownTimer endDate={oneWeekFromNow()} />,
  "cosmic-background": () => (
    <div className="relative h-[700px] w-full overflow-hidden rounded-xl">
      <CosmicBackground />
    </div>
  ),
  "toggle-pro": () => <TogglePro defaultChecked />,
  "badges-kit": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl">
      <Badge label="Active" tone="success" icon="check" />
    </div>
  ),
  "rating-stars": () => <RatingStars defaultValue={4} />,
  "image-deck-3d": () => (
    <div className="h-[500px] w-[500px]">
      <ImageDeck3D image="/demo/image-deck-3d.webp" enable3D idleAnimation />
    </div>
  ),
  "glare-card": () => (
    <div className="h-[500px] w-[500px]">
      <GlareCard title="Glare Card" subtitle="Cursor-reactive tilt & reflections." image="/demo/glare-card.webp" />
    </div>
  ),
  "linear-progress": () => (
    <div className="w-full max-w-xs">
      <LinearProgress value={67} label="brand-assets.zip" valueLabel="67%" capStyle="glow" shimmer revealOnScroll={false} />
    </div>
  ),
  "infinite-marquee": () => <InfiniteMarquee text="ReactFrame" separator="✦" fontSize={32} textColor="var(--foreground)" separatorColor="var(--foreground)" />,
  "discord-chat-widget": () => (
    <div className="self-end pt-[480px]">
      <DiscordChatWidget inviteCode="reactframe" fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
    </div>
  ),
  "telegram-widget": () => (
    <div className="self-end pt-[480px]">
      <TelegramWidget username="reactframe" fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
    </div>
  ),
  "messenger-widget": () => (
    <div className="self-end pt-[480px]">
      <MessengerWidget pageId="reactframe" fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
    </div>
  ),
  "x-twitter-widget": () => (
    <div className="self-end pt-[480px]">
      <XTwitterWidget agentHandle="reactframe" fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
    </div>
  ),
  "footer-premium": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <FooterPremium showBadge showPill />
    </div>
  ),
  "footer-section": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <FooterSection />
    </div>
  ),
  "hover-scan-card": () => (
    <div className="h-[500px] w-[300px]">
      <HoverScanCard image="/demo/hover-scan-card.webp" className="h-full w-full" />
    </div>
  ),
  "compare-slider": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl border border-border">
      <CompareSlider
        beforeImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&sat=-100"
        afterImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80"
        className="h-full"
      />
    </div>
  ),
  "glow-card": () => (
    <div className="h-[700px] w-72">
      <GlowCard backgroundImage="/demo/glow-card.webp" />
    </div>
  ),
  "image-showcase": () => (
    <div className="w-full max-w-xl overflow-hidden rounded-xl">
      <ImageShowcase height={340} images={IMAGE_SHOWCASE_IMAGES} />
    </div>
  ),
  "eternal-glow-card": () => (
    <div className="h-[300px] w-72">
      <EternalGlowCard />
    </div>
  ),
  "card-stack": () => <CardStack className="w-full" />,
  "glass-navigation": () => (
    <div className="h-[700px] w-full max-w-2xl">
      <GlassNavigation />
    </div>
  ),
  "header-simple": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <HeaderSimple />
    </div>
  ),
  "testimonial-logos": () => (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-8 py-12">
      <TestimonialLogos />
    </div>
  ),
  "motion-gallery-grid": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-border bg-black">
      <MotionGalleryGrid />
    </div>
  ),
  "qr-code-widget": () => (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-card p-8">
      <div className="w-full max-w-[380px]">
        <QrCodeWidget />
      </div>
    </div>
  ),
  "airbnb-reviews": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <AirbnbReviews />
    </div>
  ),
  "ebay-reviews": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <EbayReviews />
    </div>
  ),
  "etsy-reviews": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <EtsyReviews />
    </div>
  ),
  "coin-flip-game": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-border">
      <CoinFlipGame />
    </div>
  ),
  "tic-tac-toe-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <TicTacToeGame />
    </div>
  ),
  "2048-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <Game2048 />
    </div>
  ),
  "snake-game": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-border">
      <SnakeGame />
    </div>
  ),
  "minesweeper-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <MinesweeperGame />
    </div>
  ),
  "memory-match-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <MemoryMatchGame />
    </div>
  ),
  "pong-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <PongGame />
    </div>
  ),
  "dino-runner-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <DinoRunnerGame />
    </div>
  ),
  "space-invaders-game": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <SpaceInvadersGame />
    </div>
  ),
  "tower-blocks-game": () => (
    <div className="flex h-[600px] w-full items-center justify-center overflow-hidden rounded-xl border border-border">
      <TowerBlocksGame />
    </div>
  ),
  "maze-runner-game": () => (
    <div className="flex h-[600px] w-full items-center justify-center overflow-hidden rounded-xl border border-border">
      <MazeRunnerGame />
    </div>
  ),
  "glow-jump-widget": () => (
    <div className="relative flex h-[560px] w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <GlowJumpWidget />
    </div>
  ),
  "balloon-popper-game": () => (
    <div className="flex h-[560px] w-full items-center justify-center overflow-hidden rounded-xl border border-border">
      <BalloonPopperGame />
    </div>
  ),
  "dart-throw-game": () => (
    <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl border border-border p-4">
      <DartThrowGame />
    </div>
  ),
  "spin-to-win-wheel": () => (
    <div className="flex h-[600px] w-full items-center justify-center overflow-hidden rounded-xl border border-border">
      <SpinToWinWheel />
    </div>
  ),
  "memory-cards-widget": () => (
    <div className="relative flex h-[560px] w-full items-center justify-center overflow-hidden rounded-xl border border-border p-6">
      <MemoryCardsWidget />
    </div>
  ),
  "bubble-cursor": () => (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-neutral-900 to-neutral-800 text-sm text-white/60">
      Move your cursor over this area
      <BubbleCursor showThemeToggle={false} hideOnTouch={false} />
    </div>
  ),
  "glass-showcase-scroll": () => <GlassShowcaseScroll className="w-full" />,
  "wave-marquee": () => (
    <div className="h-[420px] w-full overflow-hidden rounded-xl border border-border bg-black">
      <WaveMarquee />
    </div>
  ),
  "testimonial-spotlight": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl border border-border">
      <TestimonialSpotlight />
    </div>
  ),
  "testimonial-pills": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-white p-6">
      <TestimonialPills rowCount={4} />
    </div>
  ),
  "testimonial-video-wall": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border p-4">
      <TestimonialVideoWall columns={3} />
    </div>
  ),
  "profile-flip-card": () => (
    <div className="h-[700px] w-[340px]">
      <ProfileFlipCard
        src="/demo/profile-flip-card.webp"
        name="Zara Osei"
        role="Creative Director"
        bio="Design is like a perfect strike — you only get one shot to make an impression. I craft brands that move fast, hit hard, and leave something behind."
        tag="Design"
      />
    </div>
  ),
  "phone-mockup": () => (
    <div className="h-[700px] w-full overflow-hidden">
      <PhoneMockup />
    </div>
  ),
  "laptop-mockup": () => (
    <div className="h-[700px] w-full">
      <LaptopMockup ambientGlow glowIntensity={35} />
    </div>
  ),
  "browser-mockup": () => (
    <div className="h-[700px] w-full">
      <BrowserMockup url="reactframe.com" pageTitle="ReactFrame" tabCount={2} media="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80" />
    </div>
  ),
  "instagram-post-mockup": () => (
    <div className="w-[360px]">
      <InstagramPostMockup
        media={[
          "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
          "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
        ]}
      />
    </div>
  ),
  "x-post-mockup": () => (
    <div className="w-[420px]">
      <XPostMockup mediaImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=80" />
    </div>
  ),
  "tiktok-post-mockup": () => (
    <div className="h-[700px] w-[315px]">
      <TikTokPostMockup background="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" />
    </div>
  ),
  "linkedin-post-mockup": () => (
    <div className="w-[420px]">
      <LinkedInPostMockup mediaImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" />
    </div>
  ),
  "cylinder-gallery": () => (
    <div className="w-full overflow-hidden">
      <CylinderGallery rows={2} columns={7} cylinderRadius={260} cardWidth={220} cardHeight={160} />
    </div>
  ),
  "gallery-flow": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl border border-border">
      <GalleryFlow backgroundColor="var(--card)" />
    </div>
  ),
  "bar-chart": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <BarChart chartHeight={280} />
    </div>
  ),
  "line-chart": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <LineChart chartHeight={280} />
    </div>
  ),
  "pie-chart": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <PieChart chartHeight={280} />
    </div>
  ),
  "radar-chart": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <RadarChart chartHeight={280} />
    </div>
  ),
  "range-area-chart": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <RangeAreaChart chartHeight={280} />
    </div>
  ),
  "rotating-gallery": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl">
      <RotatingGallery />
    </div>
  ),
  "tearable-reveal": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <TearableReveal
        backgroundSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
        hintText="Drag — it tears easily"
      />
    </div>
  ),
  "data-table": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <DataTable />
    </div>
  ),
  "kanban-board": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <KanbanBoard />
    </div>
  ),
  "expand-card-grid": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <ExpandCardGrid
        items={[
          { title: "Mountains", description: "Alpine ridgelines at first light.", buttonText: "View", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80" },
          { title: "Forest", description: "Deep green canopy, quiet trails.", buttonText: "View", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80" },
          { title: "Coast", description: "Where the cliffs meet the sea.", buttonText: "View", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80" },
          { title: "Desert", description: "Dunes shaped by wind and time.", buttonText: "View", src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=80" },
        ]}
      />
    </div>
  ),
  "sales-ticket-popup": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#f4f4f6] p-6">
      <SalesTicketPopup fixed={false} />
    </div>
  ),
  "animated-checkbox": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl">
      <AnimatedCheckbox />
    </div>
  ),
  "animated-loader": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl">
      <AnimatedLoader />
    </div>
  ),
  "dot-image-slider": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <DotImageSlider />
    </div>
  ),
  "dot-image-loader": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <DotImageLoader image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80" />
    </div>
  ),
  "product-grid-section": () => (
    <div className="max-h-[42rem] w-full overflow-y-auto rounded-xl border border-border">
      <ProductGridSection />
    </div>
  ),
  "feature-card-illustrated": () => (
    <div className="h-[700px] w-full max-w-md overflow-hidden rounded-xl">
      <FeatureCardIllustrated />
    </div>
  ),
  "video-glow-lightbox": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <VideoGlowLightbox
        videoType="url"
        videoUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        thumbnailImage="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80"
        showDemoSwitcher
        demoYoutubeUrl="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
        demoVimeoUrl="https://vimeo.com/76979871"
        demoFileUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </div>
  ),
  "logo-grid": () => (
    <div className="flex h-[700px] w-full items-center overflow-hidden rounded-xl border border-border">
      <LogoGrid />
    </div>
  ),
  "ai-agent-wave": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <AIAgentWave showTitle showAvatar />
    </div>
  ),
  "noise-background": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <NoiseBackground animateBlobs />
    </div>
  ),
  "linear-progress-bars": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-auto rounded-xl bg-neutral-950 p-8">
      <div className="w-full max-w-sm">
        <LinearProgressBars theme="dark" cardBg="#141414" cardBorderColor="#2a2a2a" scrollReveal={false} />
      </div>
    </div>
  ),
  "progress-circle-bars": () => (
    <div className="flex h-[700px] w-full items-center justify-center gap-8 rounded-xl">
      <ProgressCircleBars label="Circle" percentage={75} labelColor="#ffffff" percentageColor="#ffffff" />
      <ProgressCircleBars label="Gauge" arcStyle="gauge" percentage={62} colorStart="#f59e0b" colorEnd="#ef4444" labelColor="#ffffff" percentageColor="#ffffff" />
      <ProgressCircleBars label="Dashes" arcStyle="dashes" percentage={40} colorStart="#10b981" colorEnd="#3b82f6" labelColor="#ffffff" percentageColor="#ffffff" />
    </div>
  ),
  "alert-toast": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl border border-border">
      <AlertToastShowcase />
    </div>
  ),
  "progress-rows-card": () => (
    <div className="flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-100 p-8 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <ProgressRowsCard />
      </div>
    </div>
  ),
  "feature-media-highlight": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl">
      <FeatureMediaHighlight />
    </div>
  ),
  "cinematic-stacked-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl">
      <CinematicStackedGallery />
    </div>
  ),
  "phone-reel-showcase": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
      <PhoneReelShowcase />
    </div>
  ),
  "cinematic-scroll-story": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <CinematicScrollStory containerHeight={600} />
    </div>
  ),
  "dice-roll-discount-popup": () => (
    <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-xl">
      <DiceRollDiscountPopup />
    </div>
  ),
  "wheel-spin-discount-popup": () => (
    <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-xl">
      <WheelSpinDiscountPopup />
    </div>
  ),
};

const THEME_CONTROL = { type: "select", key: "theme", label: "Theme", options: ["paper", "glass"], optionLabels: ["Paper", "Glass"], defaultValue: "paper" } as const;

function reviewWidgetControls(opts: { ratingMin: number; ratingDefault: number; reviewCountStep: number; reviewCountDefault: number }): PlaygroundControl[] {
  return [
    { type: "select", key: "theme", label: "Theme", options: ["light", "dark"], optionLabels: ["Light", "Dark"], defaultValue: "dark" },
    { type: "range", key: "rating", label: "Rating", min: opts.ratingMin, max: 5, step: 0.1, defaultValue: opts.ratingDefault },
    { type: "range", key: "reviewCount", label: "Reviews", min: 0, max: 2000, step: opts.reviewCountStep, defaultValue: opts.reviewCountDefault },
    { type: "select", key: "cardsDesktop", label: "Cards", options: ["2", "3", "4"], defaultValue: "3" },
    { type: "toggle", key: "showArrows", label: "Arrows", defaultValue: true },
  ];
}
const AVAILABILITY_CONTROL = {
  type: "select",
  key: "availability",
  label: "Status",
  options: ["online", "away", "offline"],
  optionLabels: ["Online", "Away", "Offline"],
  defaultValue: "online",
} as const;

// ─── Site-only "showcase every variant" previews ───────────────────────────
// These 5 components used to carry an internal `demoMode` prop that swapped
// their entire render for a light/dark grid of every state. That grid isn't
// something a Playground control panel can drive (it isn't adjusting one
// instance, it's showing all of them at once), so it lives here instead,
// built from each component's own public props — nothing shipped carries it.

function ToggleShowcaseField({
  initialOn,
  disabled,
  forceRing,
  width,
  height,
  padding,
  trackOnColor,
  trackOffColor,
  thumbColor,
  ringColor,
  ringWidth,
  duration,
  squish,
}: {
  initialOn: boolean;
  disabled?: boolean;
  forceRing?: boolean;
  width: number;
  height: number;
  padding: number;
  trackOnColor: string;
  trackOffColor: string;
  thumbColor: string;
  ringColor: string;
  ringWidth: number;
  duration: number;
  squish: number;
}) {
  const [isOn, setIsOn] = React.useState(initialOn);
  return (
    <span className="relative inline-block shrink-0" style={{ width, height }}>
      <input
        type="checkbox"
        role="switch"
        aria-checked={isOn}
        checked={isOn}
        disabled={disabled}
        onChange={() => setIsOn((v) => !v)}
        className={cn("absolute inset-0 m-0 h-full w-full opacity-0", disabled ? "cursor-default" : "cursor-pointer")}
      />
      <ToggleVisual
        isOn={isOn}
        disabled={!!disabled}
        ring={!!forceRing}
        width={width}
        height={height}
        padding={padding}
        trackOnColor={trackOnColor}
        trackOffColor={trackOffColor}
        thumbColor={thumbColor}
        ringColor={ringColor}
        ringWidth={ringWidth}
        duration={duration}
        squish={squish}
      />
    </span>
  );
}

function ToggleShowcase() {
  const width = 52;
  const height = 30;
  const padding = 3;
  const trackOnColor = "#0A0A0A";
  const thumbColor = "#FFFFFF";
  const ringColor = "rgba(10,10,10,0.25)";
  const ringWidth = 3;
  const duration = 0.35;
  const squish = 0.35;
  const rows: { label: string; ring?: boolean; disabled?: boolean }[] = [{ label: "Default" }, { label: "Focused", ring: true }, { label: "Disabled", disabled: true }];
  const panels = [
    { bg: "#FFFFFF", caption: "rgba(17,17,17,0.4)", divider: "rgba(17,17,17,0.08)", trackOffColor: "#E5E7EB" },
    { bg: "#0A0A0A", caption: "rgba(255,255,255,0.4)", divider: "rgba(255,255,255,0.08)", trackOffColor: "rgba(255,255,255,0.16)" },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] sm:flex-row">
      {panels.map((panel) => (
        <div key={panel.bg} className="box-border flex flex-1 flex-col gap-7 overflow-auto p-7" style={{ backgroundColor: panel.bg }}>
          <div className="h-px" style={{ backgroundColor: panel.divider }} />
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-3.5">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: panel.caption, fontFamily: "Inter, system-ui, sans-serif" }}>
                {row.label}
              </span>
              <div className="flex flex-wrap gap-7">
                {[false, true].map((on) => (
                  <ToggleShowcaseField
                    key={String(on)}
                    initialOn={on}
                    disabled={row.disabled}
                    forceRing={row.ring}
                    width={width}
                    height={height}
                    padding={padding}
                    trackOnColor={trackOnColor}
                    trackOffColor={panel.trackOffColor}
                    thumbColor={thumbColor}
                    ringColor={ringColor}
                    ringWidth={ringWidth}
                    duration={duration}
                    squish={squish}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CheckboxShowcaseField({
  initialChecked,
  disabled,
  forceRing,
  showLabel,
  labelColor,
  mutedColor,
  requiredColor,
  helperColor,
  size,
  radius,
  borderWidth,
  borderColor,
  accentColor,
  checkColor,
  ringColor,
  ringWidth,
  duration,
}: {
  initialChecked: boolean;
  disabled?: boolean;
  forceRing?: boolean;
  showLabel?: boolean;
  labelColor?: string;
  mutedColor?: string;
  requiredColor?: string;
  helperColor?: string;
  size: number;
  radius: number;
  borderWidth: number;
  borderColor: string;
  accentColor: string;
  checkColor: string;
  ringColor: string;
  ringWidth: number;
  duration: number;
}) {
  const [isChecked, setIsChecked] = React.useState(initialChecked);
  return (
    <label className={cn("inline-flex select-none gap-2.5", disabled ? "cursor-default" : "cursor-pointer", showLabel ? "items-start" : "items-center")} style={{ fontFamily: "Inter, sans-serif" }}>
      <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={() => setIsChecked((v) => !v)}
          className="absolute inset-0 m-0 h-full w-full opacity-0"
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
        <CheckboxVisual
          isChecked={isChecked}
          disabled={!!disabled}
          ring={!!forceRing}
          style="checkbox"
          size={size}
          radius={radius}
          borderWidth={borderWidth}
          borderColor={borderColor}
          accentColor={accentColor}
          checkColor={checkColor}
          ringColor={ringColor}
          ringWidth={ringWidth}
          duration={duration}
        />
      </span>
      {showLabel && (
        <div className="flex flex-col gap-1" style={{ paddingTop: Math.max(0, (size - 18) / 2) }}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-[1.3] font-semibold tracking-[-0.01em]" style={{ color: labelColor }}>
              Label
            </span>
            <span className="text-sm font-normal" style={{ color: mutedColor }}>
              (optional)
            </span>
            <span className="text-sm font-semibold" style={{ color: requiredColor }}>
              *
            </span>
            <span title="Additional information about this option" className="flex">
              <InfoIcon color={mutedColor ?? "#9ca3af"} />
            </span>
          </div>
          <span className="text-[13px] leading-[1.4]" style={{ color: helperColor }}>
            Helper text
          </span>
        </div>
      )}
    </label>
  );
}

function CheckboxShowcase() {
  const size = 20;
  const radius = 6;
  const borderWidth = 1.5;
  const accentColor = "#7c3aed";
  const checkColor = "#ffffff";
  const requiredColor = "#ef4444";
  const ringColor = "rgba(124,58,237,0.25)";
  const ringWidth = 3;
  const duration = 0.18;
  const rows: { label: string; ring?: boolean; disabled?: boolean }[] = [{ label: "Default" }, { label: "Focused", ring: true }, { label: "Disabled", disabled: true }];
  const panels = [
    { bg: "#FFFFFF", caption: "rgba(17,17,17,0.4)", divider: "rgba(17,17,17,0.08)", borderColor: "#D1D5DB", labelColor: "#111111", helperColor: "#6B7280", mutedColor: "#9CA3AF" },
    { bg: "#0A0A0A", caption: "rgba(255,255,255,0.4)", divider: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.28)", labelColor: "#FFFFFF", helperColor: "rgba(255,255,255,0.55)", mutedColor: "rgba(255,255,255,0.4)" },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] sm:flex-row">
      {panels.map((panel) => (
        <div key={panel.bg} className="box-border flex flex-1 flex-col gap-7 overflow-auto p-7" style={{ backgroundColor: panel.bg }}>
          <div className="flex flex-col gap-3.5">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap gap-7">
                {[false, true].map((checkedState) => (
                  <CheckboxShowcaseField
                    key={String(checkedState)}
                    initialChecked={checkedState}
                    disabled={row.disabled}
                    forceRing={row.ring}
                    size={size}
                    radius={radius}
                    borderWidth={borderWidth}
                    borderColor={panel.borderColor}
                    accentColor={accentColor}
                    checkColor={checkColor}
                    ringColor={ringColor}
                    ringWidth={ringWidth}
                    duration={duration}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="h-px" style={{ backgroundColor: panel.divider }} />

          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-3.5">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: panel.caption, fontFamily: "Inter, sans-serif" }}>
                {row.label}
              </span>
              <div className="flex flex-wrap gap-7">
                {[false, true].map((checkedState) => (
                  <CheckboxShowcaseField
                    key={String(checkedState)}
                    initialChecked={checkedState}
                    disabled={row.disabled}
                    forceRing={row.ring}
                    showLabel
                    labelColor={panel.labelColor}
                    mutedColor={panel.mutedColor}
                    requiredColor={requiredColor}
                    helperColor={panel.helperColor}
                    size={size}
                    radius={radius}
                    borderWidth={borderWidth}
                    borderColor={panel.borderColor}
                    accentColor={accentColor}
                    checkColor={checkColor}
                    ringColor={ringColor}
                    ringWidth={ringWidth}
                    duration={duration}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const BADGE_SHOWCASE_ROWS: { tone: BadgeTone; items: { label: string; icon: BadgeIconType; customIcon?: string }[] }[] = [
  { tone: "success", items: [{ label: "Paid", icon: "check" }, { label: "Active", icon: "check" }, { label: "Subscribed", icon: "check" }, { label: "200", icon: "check" }] },
  { tone: "error", items: [{ label: "Rejected", icon: "cross" }, { label: "Chargeback", icon: "cross" }, { label: "Disconnected", icon: "minus" }] },
  { tone: "neutral", items: [{ label: "Void", icon: "cross" }, { label: "Expired", icon: "cross" }, { label: "Draft", icon: "check" }, { label: "Online", icon: "dot" }] },
  { tone: "info", items: [{ label: "Processing", icon: "spinner" }, { label: "Flagged", icon: "custom", customIcon: "🚩" }, { label: "Washington D.C.", icon: "none" }] },
  { tone: "purple", items: [{ label: "Special", icon: "none" }, { label: "Trial", icon: "none" }, { label: "Bookmarked", icon: "custom", customIcon: "🔖" }, { label: "Live", icon: "custom", customIcon: "#" }] },
  { tone: "warning", items: [{ label: "Moved", icon: "custom", customIcon: "↩" }, { label: "New", icon: "none" }, { label: "Secure", icon: "custom", customIcon: "🔖" }, { label: "Locked", icon: "custom", customIcon: "🔒" }] },
  { tone: "orange", items: [{ label: "Beta", icon: "none" }, { label: "Hello!", icon: "custom", customIcon: "😊" }, { label: "1m 30s", icon: "custom", customIcon: "▶" }, { label: "Pinned", icon: "custom", customIcon: "📌" }, { label: "4", icon: "none" }] },
  { tone: "indigo", items: [{ label: "Design Systems", icon: "custom", customIcon: "♡" }, { label: "@ormanclark", icon: "custom", customIcon: "👤" }, { label: "Free Wifi", icon: "custom", customIcon: "📶" }] },
];

function BadgeKitShowcase() {
  const panels: { theme: BadgeTheme; bg: string }[] = [
    { theme: "light", bg: "#FFFFFF" },
    { theme: "dark", bg: "#0A0A0A" },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden rounded-[20px]">
      {panels.map((panel) => (
        <div key={panel.theme} className="box-border flex flex-1 flex-col gap-[18px] overflow-auto p-7" style={{ backgroundColor: panel.bg }}>
          {BADGE_SHOWCASE_ROWS.map((row, i) => (
            <div key={i} className="flex flex-wrap gap-3">
              {row.items.map((item) => (
                <Badge key={item.label} label={item.label} icon={item.icon} customIcon={item.customIcon} tone={row.tone} size="md" theme={panel.theme} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const LOADER_SHOWCASE_VARIANTS: { key: AnimatedLoaderVariant; label: string }[] = [
  { key: "lines", label: "Lines" },
  { key: "ring", label: "Ring" },
  { key: "dual-ring", label: "Dual Ring" },
  { key: "dots", label: "Dots" },
];

function LoaderShowcase() {
  const color = "#7c3aed";
  const size = 48;
  const thickness = 4;
  const speed = 1.2;
  const lineCount = 8;
  const panels = [
    { bg: "#FFFFFF", fg: "rgba(17,17,17,0.5)", track: "rgba(17,17,17,0.12)" },
    { bg: "#0A0A0A", fg: "rgba(255,255,255,0.5)", track: "rgba(255,255,255,0.16)" },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden rounded-[20px]">
      {panels.map((panel) => (
        <div key={panel.bg} className="box-border flex flex-1 flex-wrap items-center justify-center gap-9 p-9" style={{ backgroundColor: panel.bg }}>
          {LOADER_SHOWCASE_VARIANTS.map((v) => (
            <div key={v.key} className="flex flex-col items-center gap-2.5">
              <AnimatedLoader variant={v.key} color={color} trackColor={panel.track} size={size} thickness={thickness} speed={speed} lineCount={lineCount} />
              <span className="text-xs font-medium tracking-[-0.01em] whitespace-nowrap" style={{ color: panel.fg }}>
                {v.key === "lines" ? `Lines · ${lineCount}` : v.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const TICKET_SHOWCASE_THEMES: SalesTicketTheme[] = ["dark", "light", "gradient", "neon", "outline"];

function SalesTicketShowcase() {
  return (
    <div className="flex flex-wrap gap-6 bg-[#f4f4f6] p-6">
      {TICKET_SHOWCASE_THEMES.map((name) => (
        <SalesTicketPopup
          key={name}
          fixed={false}
          theme={name}
          emoji=""
          kicker="SALE"
          badgeText="30% OFF"
          description="Checkout to enjoy **30% off** your order."
          buttonLabel="Buy Now"
          radius={26}
          texture
          dismissible
          maxWidth={270}
        />
      ))}
    </div>
  );
}


// Playground-wrapped previews for the handful of components with a theme,
// status or other prop worth trying live. Only read by
// /preview/[slug]/page.tsx (a Client Component, so a function child of
// <Playground> is fine there) — never by the Server-rendered grid/homepage,
// which stay on the plain `registryPreviews` above. Slugs not listed here
// simply fall back to `registryPreviews` at the call site.
export const registryPlaygroundPreviews: Partial<Record<string, () => React.ReactNode>> = {
  "countdown-timer": () => (
    <Playground
      controls={[
        { type: "toggle", key: "compact", label: "Compact", defaultValue: false },
        { type: "select", key: "shape", label: "Shape", options: ["rounded", "square", "circle"], optionLabels: ["Rounded", "Square", "Circle"], defaultValue: "rounded" },
        { type: "toggle", key: "labels", label: "Labels", defaultValue: true },
      ]}
    >
      {(v) => (
        <CountdownTimer
          endDate={oneWeekFromNow()}
          compact={v.compact as boolean}
          cellShape={v.shape as "rounded" | "square" | "circle"}
          showLabel={v.labels as boolean}
        />
      )}
    </Playground>
  ),
  "cosmic-background": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["#050c1a", "#0a0614", "#080808"], optionLabels: ["Deep Space", "Void", "Obsidian"], defaultValue: "#050c1a" },
      ]}
    >
      {(v) => (
        <div className="relative h-[700px] w-full overflow-hidden rounded-xl">
          <CosmicBackground backgroundColor={v.theme as string} />
        </div>
      )}
    </Playground>
  ),
  "rating-stars": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "toggle", key: "glow", label: "Glow", defaultValue: false },
        { type: "toggle", key: "label", label: "Label", defaultValue: true },
        { type: "select", key: "labelStyle", label: "Style", options: ["score", "fraction", "percent", "label"], optionLabels: ["#", "÷", "%", "A"], defaultValue: "score" },
        { type: "toggle", key: "bar", label: "Bar", defaultValue: false },
        { type: "toggle", key: "anim", label: "Anim", defaultValue: true },
        { type: "toggle", key: "wave", label: "Wave", defaultValue: false },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
      ]}
    >
      {(v) => (
        <div className="flex w-full items-center justify-center rounded-xl p-10" style={{ background: v.theme === "dark" ? "#000000" : "#FFFFFF" }}>
          <RatingStars
            defaultValue={4}
            sizePreset={v.size as "sm" | "md" | "lg"}
            showGlow={v.glow as boolean}
            showLabel={v.label as boolean}
            labelStyle={v.labelStyle as "score" | "fraction" | "percent" | "label"}
            showBar={v.bar as boolean}
            animated={v.anim as boolean}
            animStyle={v.wave ? "wave" : "instant"}
            textColor={v.theme === "dark" ? "#FFFFFF" : "#111111"}
          />
        </div>
      )}
    </Playground>
  ),
  "glare-card": () => (
    <Playground
      controls={[
        { type: "select", key: "reflexMode", label: "Reflex", options: ["diamond", "holographic", "aurora"], optionLabels: ["💎 Diamond", "✨ Holographic", "🌌 Aurora"], defaultValue: "diamond" },
        { type: "toggle", key: "showText", label: "Show Text", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="flex h-[500px] w-[500px] items-center justify-center">
          <GlareCard
            title="Glare Card"
            subtitle="Cursor-reactive tilt & reflections."
            image="/demo/glare-card.webp"
            reflexMode={v.reflexMode as "diamond" | "holographic" | "aurora"}
            showText={v.showText as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "infinite-marquee": () => (
    <Playground
      controls={[
        { type: "select", key: "direction", label: "Direction", options: ["left", "right"], optionLabels: ["← Left", "→ Right"], defaultValue: "left" },
        { type: "select", key: "textStyle", label: "Text Style", options: ["solid", "gradient", "outline"], optionLabels: ["Solid", "Gradient", "Outline"], defaultValue: "solid" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
      ]}
    >
      {(v) => {
        const fg = v.theme === "dark" ? "#ffffff" : "#000000";
        return (
          <div className="w-full" style={{ background: v.theme === "dark" ? "#000000" : "#ffffff" }}>
            <InfiniteMarquee
              text="ReactFrame"
              separator="✦"
              fontSize={32}
              direction={v.direction as "left" | "right"}
              textStyle={v.textStyle as "solid" | "gradient" | "outline"}
              textColor={fg}
              separatorColor={fg}
              strokeColor={fg}
              backgroundColor={v.theme === "dark" ? "#000000" : "#ffffff"}
            />
          </div>
        );
      }}
    </Playground>
  ),
  "footer-section": () => (
    <Playground controls={[{ type: "toggle", key: "glass", label: "Glass Theme", defaultValue: false }]}>
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl">
          <FooterSection theme={v.glass ? "glass" : "paper"} />
        </div>
      )}
    </Playground>
  ),
  "discord-chat-widget": () => (
    <Playground
      controls={[
        { type: "select", key: "availability", label: "Status", options: ["online", "idle", "dnd", "offline"], optionLabels: ["Online", "Idle", "DND", "Offline"], defaultValue: "online" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
      ]}
    >
      {(v) => (
        <div className="self-end pt-[480px]">
          <DiscordChatWidget inviteCode="reactframe" availability={v.availability as "online" | "idle" | "dnd" | "offline"} theme={v.theme as "dark" | "light"} fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
        </div>
      )}
    </Playground>
  ),
  "telegram-widget": () => (
    <Playground controls={[AVAILABILITY_CONTROL]}>
      {(v) => (
        <div className="self-end pt-[480px]">
          <TelegramWidget username="reactframe" availability={v.availability as "online" | "away" | "offline"} fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
        </div>
      )}
    </Playground>
  ),
  "messenger-widget": () => (
    <Playground controls={[AVAILABILITY_CONTROL]}>
      {(v) => (
        <div className="self-end pt-[480px]">
          <MessengerWidget pageId="reactframe" availability={v.availability as "online" | "away" | "offline"} fixed={false} position="bottom-right" popupDelay={0} autoOpenDelay={0} />
        </div>
      )}
    </Playground>
  ),
  "x-twitter-widget": () => (
    <Playground
      controls={[
        AVAILABILITY_CONTROL,
        { type: "select", key: "theme", label: "Theme", options: ["light", "dark"], optionLabels: ["Light", "Dark"], defaultValue: "light" },
      ]}
    >
      {(v) => (
        <div className="self-end pt-[480px]">
          <XTwitterWidget
            agentHandle="reactframe"
            availability={v.availability as "online" | "away" | "offline"}
            theme={v.theme as "light" | "dark"}
            fixed={false}
            position="bottom-right"
            popupDelay={0}
            autoOpenDelay={0}
          />
        </div>
      )}
    </Playground>
  ),
  "compare-slider": () => (
    <Playground controls={[THEME_CONTROL, { type: "toggle", key: "vertical", label: "Vertical", defaultValue: false }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <CompareSlider
            theme={v.theme as "paper" | "glass"}
            direction={v.vertical ? "vertical" : "horizontal"}
            beforeImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&sat=-100"
            afterImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80"
            className="h-full"
          />
        </div>
      )}
    </Playground>
  ),
  "glow-card": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "textPosition",
          label: "Text position",
          options: ["top-left", "center", "bottom-right"],
          optionLabels: ["Top Left", "Center", "Bottom Right"],
          defaultValue: "center",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-72">
          <GlowCard backgroundImage="/demo/glow-card.webp" textPosition={v.textPosition as "top-left" | "center" | "bottom-right"} />
        </div>
      )}
    </Playground>
  ),
  "image-showcase": () => (
    <Playground
      controls={[
        { type: "toggle", key: "showCounter", label: "Counter", defaultValue: true },
        { type: "toggle", key: "showReset", label: "Reset Button", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="w-full max-w-xl overflow-hidden rounded-xl">
          <ImageShowcase height={340} showCounter={v.showCounter as boolean} showReset={v.showReset as boolean} images={IMAGE_SHOWCASE_IMAGES} />
        </div>
      )}
    </Playground>
  ),
  "glass-navigation": () => (
    <Playground
      controls={[{ type: "select", key: "colorScheme", label: "Theme", options: ["light", "dark"], optionLabels: ["Light", "Dark"], defaultValue: "light" }]}
    >
      {(v) => (
        <div className="h-[700px] w-full max-w-2xl">
          <GlassNavigation colorScheme={v.colorScheme as "light" | "dark"} />
        </div>
      )}
    </Playground>
  ),
  "header-simple": () => (
    <Playground controls={[{ type: "toggle", key: "showBorder", label: "Border", defaultValue: false }]}>
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl">
          <HeaderSimple showBorder={v.showBorder as boolean} />
        </div>
      )}
    </Playground>
  ),
  "testimonial-spotlight": () => (
    <Playground
      controls={[{ type: "select", key: "transitionType", label: "Transition", options: ["crossfade", "slide", "iris"], optionLabels: ["Crossfade", "Slide", "Iris"], defaultValue: "crossfade" }]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <TestimonialSpotlight transitionType={v.transitionType as "crossfade" | "slide" | "iris"} />
        </div>
      )}
    </Playground>
  ),
  "phone-mockup": () => (
    <Playground controls={[{ type: "select", key: "frameColor", label: "Frame", options: ["titanium", "black"], optionLabels: ["Titanium", "Black"], defaultValue: "titanium" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden">
          <PhoneMockup frameColor={v.frameColor as "titanium" | "black"} />
        </div>
      )}
    </Playground>
  ),
  "browser-mockup": () => (
    <Playground controls={[{ type: "select", key: "browserStyle", label: "Style", options: ["mac", "windows", "mobile"], optionLabels: ["macOS", "Windows", "Mobile"], defaultValue: "mac" }]}>
      {(v) => (
        <div className="h-[700px] w-full">
          <BrowserMockup
            browserStyle={v.browserStyle as "mac" | "windows" | "mobile"}
            url="reactframe.com"
            pageTitle="ReactFrame"
            tabCount={2}
            media="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80"
          />
        </div>
      )}
    </Playground>
  ),
  "instagram-post-mockup": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["light", "dark"], optionLabels: ["Light", "Dark"], defaultValue: "light" }]}>
      {(v) => (
        <div className="w-[360px]">
          <InstagramPostMockup
            theme={v.theme as "light" | "dark"}
            media={["https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80", "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80"]}
          />
        </div>
      )}
    </Playground>
  ),
  "x-post-mockup": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="w-[420px]">
          <XPostMockup theme={v.theme as "dark" | "light"} mediaImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=80" />
        </div>
      )}
    </Playground>
  ),
  "linkedin-post-mockup": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["light", "dark"], optionLabels: ["Light", "Dark"], defaultValue: "light" }]}>
      {(v) => (
        <div className="w-[420px]">
          <LinkedInPostMockup theme={v.theme as "light" | "dark"} mediaImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" />
        </div>
      )}
    </Playground>
  ),
  "cylinder-gallery": () => (
    <Playground controls={[{ type: "select", key: "speed", label: "Speed", options: ["slow", "normal", "fast"], optionLabels: ["Slow", "Normal", "Fast"], defaultValue: "normal" }]}>
      {(v) => {
        const speed = v.speed === "slow" ? 0.8 : v.speed === "fast" ? 5 : 2.2;
        return (
          <div className="w-full overflow-hidden">
            <CylinderGallery rows={2} columns={7} cylinderRadius={260} cardWidth={220} cardHeight={160} rotationSpeed={speed} />
          </div>
        );
      }}
    </Playground>
  ),
  "progress-circle-bars": () => (
    <Playground
      controls={[
        { type: "select", key: "arcStyle", label: "Style", options: ["ring", "gauge", "dashes"], optionLabels: ["Ring", "Gauge", "Dashes"], defaultValue: "ring" },
        { type: "select", key: "percentage", label: "Percentage", options: ["25", "50", "75", "100"], defaultValue: "75" },
        { type: "toggle", key: "thresholdsEnabled", label: "Color Thresholds", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center rounded-xl">
          <ProgressCircleBars
            sizePreset="2xl"
            arcStyle={v.arcStyle as "ring" | "gauge" | "dashes"}
            percentage={Number(v.percentage)}
            thresholdsEnabled={Boolean(v.thresholdsEnabled)}
            labelColor="#ffffff"
            percentageColor="#ffffff"
          />
        </div>
      )}
    </Playground>
  ),
  "bar-chart": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <BarChart theme={v.theme as "dark" | "light"} chartHeight={280} />
        </div>
      )}
    </Playground>
  ),
  "line-chart": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <LineChart theme={v.theme as "dark" | "light"} chartHeight={280} />
        </div>
      )}
    </Playground>
  ),
  "pie-chart": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <PieChart theme={v.theme as "dark" | "light"} chartHeight={280} />
        </div>
      )}
    </Playground>
  ),
  "radar-chart": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <RadarChart theme={v.theme as "dark" | "light"} chartHeight={280} />
        </div>
      )}
    </Playground>
  ),
  "range-area-chart": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <RangeAreaChart theme={v.theme as "dark" | "light"} chartHeight={280} />
        </div>
      )}
    </Playground>
  ),
  "tearable-reveal": () => (
    <Playground
      controls={[
        { type: "select", key: "surfaceStyle", label: "Cloth Style", options: ["textured", "smooth"], optionLabels: ["Textured", "Smooth"], defaultValue: "textured" },
        { type: "select", key: "tearEdgeStyle", label: "Edge Style", options: ["jagged", "rounded", "both"], optionLabels: ["Jagged", "Rounded", "Both"], defaultValue: "jagged" },
        { type: "toggle", key: "pinTopRow", label: "Pin Top Row", defaultValue: true },
        { type: "toggle", key: "showParticles", label: "Particles", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <TearableReveal
            backgroundSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
            surfaceStyle={v.surfaceStyle as "textured" | "smooth"}
            tearEdgeStyle={v.tearEdgeStyle as "jagged" | "rounded" | "both"}
            pinTopRow={v.pinTopRow as boolean}
            showParticles={v.showParticles as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "rotating-gallery": () => (
    <Playground controls={[{ type: "toggle", key: "showLabels", label: "Labels", defaultValue: true }]}>
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl">
          <RotatingGallery showLabels={v.showLabels as boolean} />
        </div>
      )}
    </Playground>
  ),
  "data-table": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <DataTable theme={v.theme as "dark" | "light"} />
        </div>
      )}
    </Playground>
  ),
  "kanban-board": () => (
    <Playground controls={[{ type: "select", key: "defaultTheme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <KanbanBoard defaultTheme={v.defaultTheme as "dark" | "light"} showThemeToggle={false} />
        </div>
      )}
    </Playground>
  ),
  "expand-card-grid": () => (
    <Playground controls={[{ type: "toggle", key: "showIndex", label: "Show Index", defaultValue: false }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <ExpandCardGrid
            showIndex={Boolean(v.showIndex)}
            items={[
              { title: "Mountains", description: "Alpine ridgelines at first light.", buttonText: "View", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80" },
              { title: "Forest", description: "Deep green canopy, quiet trails.", buttonText: "View", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80" },
              { title: "Coast", description: "Where the cliffs meet the sea.", buttonText: "View", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80" },
              { title: "Desert", description: "Dunes shaped by wind and time.", buttonText: "View", src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=80" },
            ]}
          />
        </div>
      )}
    </Playground>
  ),
  "dot-image-slider": () => (
    <Playground controls={[{ type: "select", key: "dotSpacing", label: "Dot Spacing", options: ["3", "6", "10"], optionLabels: ["Fine", "Medium", "Coarse"], defaultValue: "3" }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <DotImageSlider dotSpacing={Number(v.dotSpacing)} />
        </div>
      )}
    </Playground>
  ),
  "dot-image-loader": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "saberPreset",
          label: "Saber Color",
          options: ["blue", "red", "green", "white", "purple"],
          optionLabels: ["Blue", "Red", "Green", "White", "Purple"],
          defaultValue: "blue",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <DotImageLoader
            image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80"
            saberPreset={v.saberPreset as "blue" | "red" | "green" | "white" | "purple"}
          />
        </div>
      )}
    </Playground>
  ),
  "product-grid-section": () => (
    <Playground controls={[{ type: "select", key: "columns", label: "Columns", options: ["2", "3", "4"], defaultValue: "3" }]}>
      {(v) => (
        <div className="max-h-[42rem] w-full overflow-y-auto rounded-xl">
          <ProductGridSection columns={Number(v.columns)} />
        </div>
      )}
    </Playground>
  ),
  "feature-card-illustrated": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "illustration",
          label: "Illustration",
          options: ["list", "code", "loader", "chartNode", "dashboardNode"],
          optionLabels: ["List", "Code", "Bar Chart", "Chart Node", "Dashboard"],
          defaultValue: "list",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full max-w-md overflow-hidden rounded-xl">
          <FeatureCardIllustrated illustration={v.illustration as "list" | "code" | "loader" | "chartNode" | "dashboardNode"} />
        </div>
      )}
    </Playground>
  ),
  "video-glow-lightbox": () => (
    <Playground controls={[{ type: "toggle", key: "soundReactiveGlow", label: "Sound Reactive", defaultValue: false }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <VideoGlowLightbox
            videoType="url"
            videoUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            thumbnailImage="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80"
            soundReactiveGlow={Boolean(v.soundReactiveGlow)}
            showDemoSwitcher
            demoYoutubeUrl="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
            demoVimeoUrl="https://vimeo.com/76979871"
            demoFileUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          />
        </div>
      )}
    </Playground>
  ),
  "logo-grid": () => (
    <Playground controls={[{ type: "toggle", key: "enableMagnetic", label: "Magnetic Hover", defaultValue: true }]}>
      {(v) => (
        <div className="flex h-[700px] w-full items-center overflow-hidden rounded-xl">
          <LogoGrid enableMagnetic={Boolean(v.enableMagnetic)} />
        </div>
      )}
    </Playground>
  ),
  "ai-agent-wave": () => (
    <Playground controls={[{ type: "toggle", key: "cursorReactive", label: "Cursor Reactive", defaultValue: true }]}>
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <AIAgentWave showTitle showAvatar cursorReactive={Boolean(v.cursorReactive)} />
        </div>
      )}
    </Playground>
  ),
  "linear-progress-bars": () => (
    <Playground controls={[{ type: "select", key: "theme", label: "Theme", options: ["light", "dark"], optionLabels: ["Light", "Dark"], defaultValue: "dark" }]}>
      {(v) => (
        <div className={cn("flex h-[700px] w-full items-center justify-center overflow-auto rounded-xl p-8", v.theme === "dark" ? "bg-neutral-950" : "bg-neutral-100")}>
          <div className="w-full max-w-sm">
            <LinearProgressBars
              theme={v.theme as "light" | "dark"}
              cardBg={v.theme === "dark" ? "#141414" : "#ffffff"}
              cardBorderColor={v.theme === "dark" ? "#2a2a2a" : "#e5e7eb"}
              scrollReveal={false}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "image-deck-3d": () => (
    <Playground
      controls={[
        { type: "select", key: "shape", label: "Shape", options: ["rectangle", "circle", "hexagon", "star", "blob"], defaultValue: "rectangle" },
        { type: "toggle", key: "enable3D", label: "3D Tilt", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="h-[500px] w-[500px]">
          <ImageDeck3D
            image="/demo/image-deck-3d.webp"
            shape={v.shape as "rectangle" | "circle" | "diamond" | "hexagon" | "triangle" | "pentagon" | "star" | "squircle" | "blob"}
            enable3D={v.enable3D as boolean}
            idleAnimation
          />
        </div>
      )}
    </Playground>
  ),
  "alert-toast": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl border border-border">
      <AlertToastShowcase />
    </div>
  ),
  "progress-rows-card": () => (
    <div className="flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-100 p-8 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <ProgressRowsCard />
      </div>
    </div>
  ),
  "feature-media-highlight": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl">
      <FeatureMediaHighlight />
    </div>
  ),
  "cinematic-stacked-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl">
      <CinematicStackedGallery />
    </div>
  ),
  "phone-reel-showcase": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
      <PhoneReelShowcase />
    </div>
  ),
  "cinematic-scroll-story": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <CinematicScrollStory containerHeight={600} />
    </div>
  ),
  "airbnb-reviews": () => (
    <Playground controls={reviewWidgetControls({ ratingMin: 0, ratingDefault: 4.3, reviewCountStep: 1, reviewCountDefault: 191 })}>
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl">
          <AirbnbReviews
            themeMode={v.theme as "light" | "dark"}
            overallRating={v.rating as number}
            reviewCount={v.reviewCount as number}
            cardsDesktop={Number(v.cardsDesktop)}
            showArrows={v.showArrows as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "ebay-reviews": () => (
    <Playground controls={reviewWidgetControls({ ratingMin: 1, ratingDefault: 4.3, reviewCountStep: 10, reviewCountDefault: 191 })}>
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl">
          <EbayReviews
            themeMode={v.theme as "light" | "dark"}
            overallRating={v.rating as number}
            reviewCount={v.reviewCount as number}
            cardsDesktop={Number(v.cardsDesktop)}
            showArrows={v.showArrows as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "etsy-reviews": () => (
    <Playground controls={reviewWidgetControls({ ratingMin: 1, ratingDefault: 4.3, reviewCountStep: 10, reviewCountDefault: 191 })}>
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl">
          <EtsyReviews
            themeMode={v.theme as "light" | "dark"}
            overallRating={v.rating as number}
            reviewCount={v.reviewCount as number}
            cardsDesktop={Number(v.cardsDesktop)}
            showArrows={v.showArrows as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "profile-flip-card": () => (
    <Playground
      controls={[
        { type: "select", key: "flipTransition", label: "Transition", options: ["flipY", "flipX", "spring", "fade"], optionLabels: ["Flip Y", "Flip X", "Spring", "Fade"], defaultValue: "flipY" },
        { type: "toggle", key: "flipOnHover", label: "Hover", defaultValue: false },
        { type: "toggle", key: "showTag", label: "Tag", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-[340px]">
          <ProfileFlipCard
            src="/demo/profile-flip-card.webp"
            name="Zara Osei"
            role="Creative Director"
            bio="Design is like a perfect strike — you only get one shot to make an impression. I craft brands that move fast, hit hard, and leave something behind."
            tag={v.showTag ? "Design" : ""}
            flipTransition={v.flipTransition as "flipY" | "flipX" | "spring" | "fade"}
            flipOnHover={v.flipOnHover as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "laptop-mockup": () => (
    <Playground
      controls={[
        { type: "range", key: "laptopWidth", label: "Size", min: 400, max: 900, step: 10, defaultValue: 720 },
        { type: "select", key: "frameColor", label: "Frame", options: ["silver", "space-black"], optionLabels: ["Silver", "Space Black"], defaultValue: "silver" },
        { type: "select", key: "videoTransition", label: "Transition", options: ["slide", "fade"], optionLabels: ["Slide", "Fade"], defaultValue: "slide" },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full">
          <LaptopMockup
            ambientGlow
            glowIntensity={35}
            laptopWidth={v.laptopWidth as number}
            frameColor={v.frameColor as "silver" | "space-black"}
            videoTransition={v.videoTransition as "slide" | "fade"}
          />
        </div>
      )}
    </Playground>
  ),
  "gallery-flow": () => (
    <Playground
      controls={[
        { type: "toggle", key: "cardShadow", label: "Shadow", defaultValue: true },
        { type: "select", key: "cardSize", label: "Size", options: ["small", "medium", "large"], defaultValue: "medium" },
        { type: "range", key: "speed", label: "Speed", min: 0.1, max: 2, step: 0.1, defaultValue: 0.4 },
        { type: "select", key: "scrollDirection", label: "Direction", options: ["up", "down", "left", "right"], defaultValue: "up" },
        { type: "select", key: "cursorMode", label: "Cursor", options: ["none", "repel", "attract"], defaultValue: "none" },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <GalleryFlow
            backgroundColor="var(--card)"
            cardShadow={v.cardShadow as boolean}
            cardSize={v.cardSize as "small" | "medium" | "large"}
            speed={v.speed as number}
            scrollDirection={v.scrollDirection as "up" | "down" | "left" | "right"}
            cursorMode={v.cursorMode as "none" | "repel" | "attract"}
          />
        </div>
      )}
    </Playground>
  ),
  "noise-background": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "colorTheme",
          label: "Theme",
          options: ["cognac", "crimson", "orchid", "forest", "midnight", "slate", "obsidian"],
          defaultValue: "cognac",
        },
        { type: "select", key: "blendMode", label: "Blend", options: ["soft-light", "screen"], optionLabels: ["Soft Light", "Screen"], defaultValue: "soft-light" },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl">
          <NoiseBackground
            animateBlobs
            colorTheme={v.colorTheme as "cognac" | "crimson" | "orchid" | "forest" | "midnight" | "slate" | "obsidian"}
            blendMode={v.blendMode as "soft-light" | "screen"}
          />
        </div>
      )}
    </Playground>
  ),
  "eternal-glow-card": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "warm", "navy", "rose"], optionLabels: ["Dark", "Warm", "Navy", "Rose"], defaultValue: "dark" },
      ]}
    >
      {(v) => (
        <div className="h-[300px] w-72">
          <EternalGlowCard theme={v.theme as "dark" | "warm" | "navy" | "rose"} />
        </div>
      )}
    </Playground>
  ),
  "card-stack": () => (
    <Playground
      controls={[
        { type: "toggle", key: "showDots", label: "Dots", defaultValue: true },
        { type: "toggle", key: "showCounter", label: "Counter", defaultValue: true },
      ]}
    >
      {(v) => <CardStack className="w-full" showDots={v.showDots as boolean} showCounter={v.showCounter as boolean} />}
    </Playground>
  ),
  "dice-roll-discount-popup": () => (
    <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-xl">
      <DiceRollDiscountPopup />
    </div>
  ),
  "wheel-spin-discount-popup": () => (
    <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-xl">
      <WheelSpinDiscountPopup />
    </div>
  ),
  "coin-flip-game": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["silver", "gold", "bronze"], optionLabels: ["Silver", "Gold", "Bronze"], defaultValue: "silver" },
        { type: "range", key: "size", label: "Coin Size", min: 120, max: 220, step: 4, defaultValue: 160 },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl border border-border">
          <CoinFlipGame theme={v.theme as "silver" | "gold" | "bronze"} size={v.size as number} />
        </div>
      )}
    </Playground>
  ),
  "bubble-cursor": () => {
    const presets = {
      sapphire: { colorA: "rgba(74, 116, 184, 1)", colorB: "rgba(105, 105, 106, 1)", tint: "rgba(255, 255, 255, 1)" },
      amber: { colorA: "rgba(214, 165, 74, 1)", colorB: "rgba(140, 90, 40, 1)", tint: "rgba(255, 250, 240, 1)" },
      emerald: { colorA: "rgba(52, 168, 132, 1)", colorB: "rgba(30, 90, 80, 1)", tint: "rgba(240, 255, 250, 1)" },
    } as const;
    return (
      <Playground
        controls={[
          { type: "select", key: "preset", label: "Theme", options: ["sapphire", "amber", "emerald"], optionLabels: ["Sapphire", "Amber", "Emerald"], defaultValue: "sapphire" },
        ]}
      >
        {(v) => {
          const preset = presets[v.preset as keyof typeof presets];
          return (
            <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-neutral-900 to-neutral-800 text-sm text-white/60">
              Move your cursor over this area
              <BubbleCursor showThemeToggle={false} hideOnTouch={false} colorA={preset.colorA} colorB={preset.colorB} tint={preset.tint} />
            </div>
          );
        }}
      </Playground>
    );
  },
  "toggle-pro": () => (
    <div className="h-[520px] w-full overflow-hidden rounded-xl">
      <ToggleShowcase />
    </div>
  ),
  "badges-kit": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl">
      <BadgeKitShowcase />
    </div>
  ),
  "animated-checkbox": () => (
    <div className="h-[560px] w-full overflow-hidden rounded-xl">
      <CheckboxShowcase />
    </div>
  ),
  "animated-loader": () => (
    <div className="h-[420px] w-full overflow-hidden rounded-xl">
      <LoaderShowcase />
    </div>
  ),
  "sales-ticket-popup": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <SalesTicketShowcase />
    </div>
  ),
};

function oneWeekFromNow() {
  return new Date(Date.now() + 7 * 86400000).toISOString();
}
