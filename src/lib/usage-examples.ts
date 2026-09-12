// Short "how you'd actually call this after installing it" snippets for the
// Usage card — distinct from the Code tab's full source. Only written for
// components that have been backfilled; a slug with no entry here just
// skips the Usage card and shows Install + Code.
export const usageExamples: Record<string, string> = {
  "2048-game": `import { Game2048 } from "@/components/2048-game";

<div className="h-[560px] w-full max-w-[420px]">
  <Game2048 accentColor="#88b1ef" />
</div>
`,
  "badges-kit": `import { Badge } from "@/components/badges-kit";

<Badge label="Active" tone="success" icon="check" closable onClose={() => console.log("dismissed")} />
`,
  "balloon-popper-game": `import { BalloonPopperGame } from "@/components/balloon-popper-game";

<div className="h-[560px] w-full">
  <BalloonPopperGame targetHits={4} maxArrows={5} couponCode="BALLOON20" couponText="20% OFF Coupon" />
</div>
`,
  "kanban-board": `import { KanbanBoard } from "@/components/kanban-board";

<div className="h-[700px] w-full overflow-hidden rounded-xl">
  <KanbanBoard />
</div>
`,
  "wave-marquee": `import { WaveMarquee } from "@/components/wave-marquee";

<div className="h-[500px] w-full overflow-hidden rounded-xl bg-black">
  <WaveMarquee />
</div>
`,
  "x-twitter-widget": `import { XTwitterWidget } from "@/components/x-twitter-widget";

<div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-muted">
  <XTwitterWidget agentHandle="reactframe" fixed={false} popupDelay={0} />
</div>
`,
  "wheel-spin-discount-popup": `import { WheelSpinDiscountPopup } from "@/components/wheel-spin-discount-popup";

<div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl">
  <WheelSpinDiscountPopup />
</div>
`,
  "x-post-mockup": `import { XPostMockup } from "@/components/x-post-mockup";

<div className="w-full max-w-md">
  <XPostMockup />
</div>
`,
  "bar-chart": `import { BarChart } from "@/components/bar-chart";

<BarChart theme="dark" title="Support case volume" chartHeight={380} />
`,
  "cinematic-scroll-story": `import { CinematicScrollStory } from "@/components/cinematic-scroll-story";

<div className="w-full overflow-hidden rounded-xl">
  <CinematicScrollStory containerHeight={600} />
</div>
`,
  "card-stack": `import { CardStack } from "@/components/card-stack";

<CardStack heading="Everything you need" subheading="A scroll-driven feature showcase that reveals one card at a time." />
`,
  "bubble-cursor": `import { BubbleCursor } from "@/components/bubble-cursor";

<div className="h-[420px] w-full">
  <BubbleCursor colorA="rgba(214, 165, 74, 1)" colorB="rgba(140, 90, 40, 1)" tint="rgba(255, 250, 240, 1)" showThemeToggle />
</div>
`,
  "browser-mockup": `import { BrowserMockup } from "@/components/browser-mockup";

<div className="h-[420px] w-full">
  <BrowserMockup browserStyle="mac" url="reactframe.com" pageTitle="ReactFrame" tabCount={2} media="/images/screenshot.jpg" />
</div>
`,
  "animated-loader": `import { AnimatedLoader } from "@/components/animated-loader";

<AnimatedLoader variant="lines" color="#7c3aed" size={56} />
`,
  "animated-checkbox": `import { AnimatedCheckbox } from "@/components/animated-checkbox";

<AnimatedCheckbox
  label="Accept terms and conditions"
  helperText="We'll only use this to improve your experience"
  required
  onCheckedChange={(checked) => console.log(checked)}
/>
`,
  "alert-toast": `import { AlertToast } from "@/components/alert-toast";

<div className="w-full max-w-sm">
  <AlertToast
    content={{ title: "Successfully uploaded!", layout: "inline" }}
    appearance={{ tone: "success", background: "tinted", icon: "success" }}
    dismiss={{ dismissible: true }}
  />
</div>
`,
  "ai-agent-wave": `import { AIAgentWave } from "@/components/ai-agent-wave";

<div className="h-[280px] w-full">
  <AIAgentWave
    level={0.55}
    showAvatar
    avatars={[{ position: 50, offsetY: 0, size: 64, float: 8, name: "Assistant" }]}
    cursorReactive
  />
</div>
`,
  "airbnb-reviews": `import { AirbnbReviews } from "@/components/airbnb-reviews";

<AirbnbReviews
  badgeTitle="Airbnb Reviews"
  overallRating={4.3}
  reviewCount={191}
  reviews={[
    { name: "Emma Wilson", date: "7 days ago", rating: 5, text: "The place was even better than the photos. Spotless, well stocked, and the host checked in at just the right moments." },
    { name: "Grace Miller", date: "21 days ago", rating: 5, text: "Loved the location, walkable to everything we wanted to see. Check-in was seamless." },
    { name: "Sofia Martinez", date: "21 days ago", rating: 5, text: "Cozy, clean and exactly as described. Would absolutely stay here again." },
  ]}
/>
`,
  "ebay-reviews": `import { EbayReviews } from "@/components/ebay-reviews";

<EbayReviews
  badgeTitle="eBay Reviews"
  overallRating={4.3}
  reviewCount={191}
  reviews={[
    { name: "Emma Wilson", date: "7 days ago", rating: 5, text: "Item arrived exactly as described and much faster than expected." },
    { name: "Grace Miller", date: "21 days ago", rating: 5, text: "Packaging is careful, shipping is fast, matches the listing photos." },
    { name: "Sofia Martinez", date: "21 days ago", rating: 5, text: "Much better than I expected. Great condition and reasonable price." },
  ]}
/>
`,
  "eternal-glow-card": `import { EternalGlowCard } from "@/components/eternal-glow-card";

<div className="h-[480px] w-[640px]">
  <EternalGlowCard
    image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"
    title="Eternal Glow"
    price="$48.00"
    buttonText="Shop the Glow"
    theme="dark"
  />
</div>
`,
  "etsy-reviews": `import { EtsyReviews } from "@/components/etsy-reviews";

<EtsyReviews
  badgeTitle="Etsy Reviews"
  overallRating={4.3}
  reviewCount={191}
  reviews={[
    { name: "Emma Wilson", date: "7 days ago", rating: 5, text: "Beautiful piece, exactly as pictured! Highly recommend this shop!" },
    { name: "Grace Miller", date: "21 days ago", rating: 5, text: "Quality is consistently excellent and every order feels handmade." },
    { name: "Sofia Martinez", date: "21 days ago", rating: 5, text: "Much better than I expected. Great craftsmanship." },
  ]}
/>
`,
  "expand-card-grid": `import { ExpandCardGrid } from "@/components/expand-card-grid";

<div className="h-[600px] w-full">
  <ExpandCardGrid
    items={[
      { title: "Mountains", description: "High-altitude trails and quiet ridgelines.", buttonText: "Explore Now" },
      { title: "Forest", description: "Dense canopy, moss, and filtered light.", buttonText: "Explore Now" },
      { title: "Coast", description: "Tide pools and salt air at dawn.", buttonText: "Explore Now" },
      { title: "Desert", description: "Wide horizons and shifting dunes.", buttonText: "Explore Now" },
    ]}
  />
</div>
`,
  "footer-premium": `import { FooterPremium } from "@/components/footer-premium";

<FooterPremium logoLabel="Loca" description="Premium, shadcn-compatible components for your next project." />
`,
  "footer-section": `import { FooterSection } from "@/components/footer-section";

<FooterSection theme="paper" />
`,
  "gallery-flow": `import { GalleryFlow } from "@/components/gallery-flow";

<div className="h-[500px] w-full">
  <GalleryFlow />
</div>
`,
  "glare-card": `import { GlareCard } from "@/components/glare-card";

<div className="h-[420px] w-[320px]">
  <GlareCard />
</div>
`,
  "glass-navigation": `import { GlassNavigation } from "@/components/glass-navigation";

<GlassNavigation />
`,
  "glass-showcase-scroll": `import { GlassShowcaseScroll } from "@/components/glass-showcase-scroll";

<GlassShowcaseScroll />
`,
  "glow-card": `import { GlowCard } from "@/components/glow-card";

<div className="h-[280px] w-[320px]">
  <GlowCard />
</div>
`,
  "glow-jump-widget": `import { GlowJumpWidget } from "@/components/glow-jump-widget";

<GlowJumpWidget defaultOpen />
`,
  "header-simple": `import { HeaderSimple } from "@/components/header-simple";

<HeaderSimple
  logoText="Acme"
  navItems={[
    { label: "Product", url: "#" },
    { label: "Pricing", url: "#" },
    { label: "Docs", url: "#" },
  ]}
/>
`,
  "hover-scan-card": `import { HoverScanCard } from "@/components/hover-scan-card";

<div className="h-[480px] w-[360px]">
  <HoverScanCard image="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" />
</div>
`,
  "image-deck-3d": `import { ImageDeck3D } from "@/components/image-deck-3d";

<div className="h-[420px] w-[420px]">
  <ImageDeck3D
    image="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"
    enable3D
  />
</div>
`,
  "image-showcase": `import { ImageShowcase } from "@/components/image-showcase";

<ImageShowcase
  images={[
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80", alt: "Sneaker detail" },
    { src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80", alt: "Sneaker side" },
    { src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80", alt: "Sneaker sole" },
  ]}
/>
`,
  "instagram-post-mockup": `import { InstagramPostMockup } from "@/components/instagram-post-mockup";

<div className="max-w-[420px]">
  <InstagramPostMockup
    media={[
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80",
    ]}
  />
</div>
`,
  "laptop-mockup": `import { LaptopMockup } from "@/components/laptop-mockup";

<div className="h-[440px] w-full">
  <LaptopMockup />
</div>
`,
  "line-chart": `import { LineChart } from "@/components/line-chart";

<LineChart theme="dark" title="Release-room health index" chartHeight={380} />
`,
  "linkedin-post-mockup": `import { LinkedInPostMockup } from "@/components/linkedin-post-mockup";

<div className="w-full max-w-md">
  <LinkedInPostMockup />
</div>
`,
  "maze-runner-game": `import { MazeRunnerGame } from "@/components/maze-runner-game";

<div className="h-[560px] w-full max-w-md">
  <MazeRunnerGame />
</div>
`,
  "memory-cards-widget": `import { MemoryCardsWidget } from "@/components/memory-cards-widget";

<MemoryCardsWidget defaultOpen />
`,
  "memory-match-game": `import { MemoryMatchGame } from "@/components/memory-match-game";

<div className="h-[560px] w-full max-w-md">
  <MemoryMatchGame />
</div>
`,
  "messenger-widget": `import { MessengerWidget } from "@/components/messenger-widget";

<MessengerWidget pageId="yourpagename" fixed={false} />
`,
  "minesweeper-game": `import { MinesweeperGame } from "@/components/minesweeper-game";

<div className="h-[560px] w-full max-w-md">
  <MinesweeperGame />
</div>
`,
  "motion-gallery-grid": `import { MotionGalleryGrid } from "@/components/motion-gallery-grid";

<div className="h-[640px] w-full">
  <MotionGalleryGrid />
</div>
`,
  "noise-background": `import { NoiseBackground } from "@/components/noise-background";

<div className="h-[420px] w-full">
  <NoiseBackground />
</div>
`,
  "phone-mockup": `import { PhoneMockup } from "@/components/phone-mockup";

<div className="h-[700px] w-full">
  <PhoneMockup />
</div>
`,
  "phone-reel-showcase": `import { PhoneReelShowcase } from "@/components/phone-reel-showcase";

<div className="h-[700px] w-full">
  <PhoneReelShowcase />
</div>
`,
  "pie-chart": `import { PieChart } from "@/components/pie-chart";

<PieChart theme="dark" title="ARR by plan tier" chartHeight={280} />
`,
  "pong-game": `import { PongGame } from "@/components/pong-game";

<div className="flex w-full items-center justify-center p-6">
  <PongGame />
</div>
`,
  "product-grid-section": `import { ProductGridSection } from "@/components/product-grid-section";

<div className="w-full">
  <ProductGridSection />
</div>
`,
  "qr-code-widget": `import { QrCodeWidget } from "@/components/qr-code-widget";

<QrCodeWidget />
`,
  "radar-chart": `import { RadarChart } from "@/components/radar-chart";

<RadarChart theme="dark" title="Security posture comparison" chartHeight={320} />
`,
  "range-area-chart": `import { RangeAreaChart } from "@/components/range-area-chart";

<RangeAreaChart theme="dark" title="Latency envelope" chartHeight={320} />
`,
  "rotating-gallery": `import { RotatingGallery } from "@/components/rotating-gallery";

<div className="w-full">
  <RotatingGallery />
</div>
`,
  "sales-ticket-popup": `import { SalesTicketPopup } from "@/components/sales-ticket-popup";

<div className="flex h-[420px] w-full items-center justify-center">
  <SalesTicketPopup fixed={false} />
</div>
`,
  "snake-game": `import { SnakeGame } from "@/components/snake-game";

<SnakeGame />
`,
  "space-invaders-game": `import { SpaceInvadersGame } from "@/components/space-invaders-game";

<SpaceInvadersGame />
`,
  "spin-to-win-wheel": `import { SpinToWinWheel } from "@/components/spin-to-win-wheel";

<div className="h-[520px] w-full max-w-[420px]">
  <SpinToWinWheel />
</div>
`,
  "tearable-reveal": `import { TearableReveal } from "@/components/tearable-reveal";

<div className="h-[500px] w-full">
  <TearableReveal backgroundSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80" />
</div>
`,
  "telegram-widget": `import { TelegramWidget } from "@/components/telegram-widget";

<div className="relative h-[500px] w-full">
  <TelegramWidget username="yourusername" fixed={false} />
</div>
`,
  "testimonial-logos": `import { TestimonialLogos } from "@/components/testimonial-logos";

<TestimonialLogos />
`,
  "testimonial-pills": `import { TestimonialPills } from "@/components/testimonial-pills";

<TestimonialPills rowCount={3} />
`,
  "testimonial-spotlight": `import { TestimonialSpotlight } from "@/components/testimonial-spotlight";

<div className="h-[500px] w-full">
  <TestimonialSpotlight />
</div>
`,
  "testimonial-video-wall": `import { TestimonialVideoWall } from "@/components/testimonial-video-wall";

<TestimonialVideoWall />
`,
  "tic-tac-toe-game": `import { TicTacToeGame } from "@/components/tic-tac-toe-game";

<div className="w-full max-w-[420px]">
  <TicTacToeGame />
</div>
`,
  "tiktok-post-mockup": `import { TikTokPostMockup } from "@/components/tiktok-post-mockup";

<div className="mx-auto h-[500px] max-w-[280px]">
  <TikTokPostMockup />
</div>
`,
  "tower-blocks-game": `import { TowerBlocksGame } from "@/components/tower-blocks-game";

<div className="h-[600px] w-full">
  <TowerBlocksGame />
</div>
`,
  "feature-media-highlight": `import { FeatureMediaHighlight } from "@/components/feature-media-highlight";

<FeatureMediaHighlight
  heading={{ text: "Low fees,\\nno hidden costs", color: "#111111", fontSize: 44, fontWeight: 700 }}
  subtitle1={{ text: "Trade on US exchanges for **just $1.50** per order.", highlightColor: "#4F46E5" }}
/>
`,
  "feature-card-illustrated": `import { FeatureCardIllustrated } from "@/components/feature-card-illustrated";

<div className="h-[280px] w-[380px]">
  <FeatureCardIllustrated
    title="Explore"
    description="Browse and build charts off existing explores"
    button="Start exploring"
    illustration="list"
  />
</div>
`,
  "countdown-timer": `import { CountdownTimer } from "@/components/countdown-timer";

<CountdownTimer
  endDate="2027-12-31T23:59:00"
  showDays
  showHours
  showSeconds
  cellShape="rounded"
  align="center"
/>
`,
  "rating-stars": `import { RatingStars } from "@/components/rating-stars";

<RatingStars
  defaultValue={4}
  maxStars={5}
  allowHalf
  showLabel
  labelStyle="fraction"
  onRatingChange={(value) => console.log(value)}
/>
`,
  "profile-flip-card": `import { ProfileFlipCard } from "@/components/profile-flip-card";

<div className="h-[420px] w-[340px]">
  <ProfileFlipCard
    src="/images/zara-osei.jpg"
    name="Zara Osei"
    role="Creative Director"
    bio="Design is like a perfect strike — you only get one shot to make an impression."
    tag="Design"
    flipOnHover
  />
</div>
`,
  "video-glow-lightbox": `import { VideoGlowLightbox } from "@/components/video-glow-lightbox";

<div className="h-[400px] w-full max-w-lg">
  <VideoGlowLightbox
    videoType="url"
    videoUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    thumbnailImage="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80"
    glowColor="#3633FF"
  />
</div>
`,
  "progress-circle-bars": `import { ProgressCircleBars } from "@/components/progress-circle-bars";

<ProgressCircleBars sizePreset="xl" percentage={75} label="Storage Used" />
`,
  "linear-progress": `import { LinearProgress } from "@/components/linear-progress";

<div className="w-full max-w-sm">
  <LinearProgress value={68} label="Storage used" colorStart="#8b5cf6" colorEnd="#6366f1" capStyle="glow" />
</div>
`,
  "linear-progress-bars": `import { LinearProgressBars } from "@/components/linear-progress-bars";

<div className="w-full max-w-sm">
  <LinearProgressBars
    rows={[
      { kind: "ratio", label: "Progress A", value: 368, maxValue: 500, colorStart: "#34d399", colorEnd: "#10b981", height: 9 },
      { kind: "bar", label: "brand-assets.zip", labelRight: "67%", pct: 67, colorStart: "#6366f1", colorEnd: "#8b5cf6", height: 8, capStyle: "glow", shimmer: true },
    ]}
  />
</div>
`,
  "progress-rows-card": `import { ProgressRowsCard } from "@/components/progress-rows-card";

<div className="w-full max-w-sm">
  <ProgressRowsCard />
</div>
`,
  "cosmic-background": `import { CosmicBackground } from "@/components/cosmic-background";

<div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
  <CosmicBackground backgroundColor="#050c1a" />
</div>
`,
  "cylinder-gallery": `import { CylinderGallery } from "@/components/cylinder-gallery";

<div className="w-full overflow-hidden rounded-2xl bg-[#0a0a0a] p-10">
  <CylinderGallery />
</div>
`,
  "dart-throw-game": `import { DartThrowGame } from "@/components/dart-throw-game";

<div className="h-[500px] w-full max-w-md overflow-hidden rounded-2xl">
  <DartThrowGame />
</div>
`,
  "data-table": `import { DataTable } from "@/components/data-table";

<div className="h-[460px] w-full">
  <DataTable />
</div>
`,
  "dice-roll-discount-popup": `import { DiceRollDiscountPopup } from "@/components/dice-roll-discount-popup";

<div className="h-[560px] w-full overflow-hidden rounded-2xl">
  <DiceRollDiscountPopup theme="saas" accentColor="#818cf8" />
</div>
`,
  "dino-runner-game": `import { DinoRunnerGame } from "@/components/dino-runner-game";

<div className="w-full overflow-hidden rounded-2xl border">
  <DinoRunnerGame />
</div>
`,
  "discord-chat-widget": `import { DiscordChatWidget } from "@/components/discord-chat-widget";

<div className="relative h-[560px] w-full overflow-hidden rounded-2xl bg-[#0b0d12]">
  <DiscordChatWidget inviteCode="reactframe" fixed={false} position="bottom-right" />
</div>
`,
  "dot-image-loader": `import { DotImageLoader } from "@/components/dot-image-loader";

<div className="h-[500px] w-full overflow-hidden rounded-2xl">
  <DotImageLoader image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&q=80" preparingText="Loading your gallery" />
</div>
`,
  "dot-image-slider": `import { DotImageSlider } from "@/components/dot-image-slider";

<div className="h-[500px] w-full overflow-hidden rounded-2xl">
  <DotImageSlider />
</div>
`,
  "compare-slider": `import { CompareSlider } from "@/components/compare-slider";

<div className="h-[420px] w-full">
  <CompareSlider
    beforeImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
    afterImage="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80"
  />
</div>
`,
  "coin-flip-game": `import { CoinFlipGame } from "@/components/coin-flip-game";

<div className="h-[600px] w-full overflow-hidden rounded-2xl border">
  <CoinFlipGame theme="gold" />
</div>
`,
  "cinematic-stacked-gallery": `import { CinematicStackedGallery } from "@/components/cinematic-stacked-gallery";

<div className="h-[600px] w-full overflow-hidden rounded-2xl">
  <CinematicStackedGallery ctaLabel="View Collection" />
</div>
`,
  "infinite-marquee": `import { InfiniteMarquee } from "@/components/infinite-marquee";

<InfiniteMarquee text="Welcome to Framer" separator="✦" fontSize={32} />
`,
  "toggle-pro": `import { TogglePro } from "@/components/toggle-pro";

<TogglePro label="Enable notifications" helperText="Get notified about important updates" />
`,
  "logo-grid": `import { LogoGrid } from "@/components/logo-grid";

<div className="h-[320px] w-full">
  <LogoGrid />
</div>
`,
