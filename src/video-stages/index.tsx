import type { ComponentType } from "react";
import { AccordionStage } from "./accordion";
import { AIAsistantStage } from "./ai-asistant";
import { AiVoice01Stage } from "./ai-voice-01";
import { AiVoice02Stage } from "./ai-voice-02";
import { AiVoice03Stage } from "./ai-voice-03";
import { AiVoice04Stage } from "./ai-voice-04";
import { AiVoice05Stage } from "./ai-voice-05";
import { AiImageLoader01Stage } from "./ai-image-loader-01";
import { AiImageLoader02Stage } from "./ai-image-loader-02";
import { AiImageLoader03Stage } from "./ai-image-loader-03";
import { AiImageLoader04Stage } from "./ai-image-loader-04";
import { AiDynamicIsland01Stage } from "./ai-dynamic-island-01";
import { AiDynamicIsland02Stage } from "./ai-dynamic-island-02";
import { AiAnswer01Stage } from "./ai-answer-01";
import { AiAnswer02Stage } from "./ai-answer-02";
import { AiAnswer03Stage } from "./ai-answer-03";
import { AIChatPromptStage } from "./ai-chat-prompt";
import { AiChatStage } from "./ai-chat";
import { AIEditReviewStage } from "./ai-edit-review";
import { ImageShowcaseStage } from "./image-showcase";
import { CylinderGalleryStage } from "./cylinder-gallery";
import { GalleryExpandStage } from "./gallery-expand";
import { MoodGalleryStage } from "./mood-gallery";
import { GalleryFlowStage } from "./gallery-flow";
import { GalleryCurveStage } from "./gallery-curve";
import { GalleryRevealStage } from "./gallery-reveal";
import { YoutubeGalleryStage } from "./youtube-gallery";
import { SkewScrollGalleryStage } from "./skew-scroll-gallery";
import { DotImageSliderStage } from "./dot-image-slider";
import { AlertToastStage } from "./alert-toast";
import { AnimatedCheckboxStage } from "./animated-checkbox";
import { AnimatedLoaderStage } from "./animated-loader";
import { AspectRatioStage } from "./aspect-ratio";
import { AvatarStage } from "./avatar";
import { AvatarGroupStage } from "./avatar-group";
import { BackToTopStage } from "./back-to-top";
import { BadgesKitStage } from "./badges-kit";
import { BreadcrumbStage } from "./breadcrumb";
import { ButtonStage } from "./button";
import { CalloutStage } from "./callout";
import { Carousel3DStage } from "./carousel-3d";
import { CardStage } from "./card";
import { CodeBlockStage } from "./code-block";
import { CopyButtonStage } from "./copy-button";
import { ColorPickerStage } from "./color-picker";
import { CommandPaletteStage } from "./command-palette";
import { ComboboxStage } from "./combobox";
import { ConfirmDialogStage } from "./confirm-dialog";
import { ContextMenuStage } from "./context-menu";
import { CreditCardInputStage } from "./credit-card-input";
import { CurrencyInputStage } from "./currency-input";
import { DatePickerStage } from "./date-picker";
import { DescriptionListStage } from "./description-list";
import { DividerStage } from "./divider";
import { DockStage } from "./dock";
import { DrawerStage } from "./drawer";
import { EmptyStateStage } from "./empty-state";
import { FormFieldStage } from "./form-field";
import { FileUploadStage } from "./file-upload";
import { HoverCardStage } from "./hover-card";
import { InputStage } from "./input";
import { InputOtpStage } from "./input-otp";
import { ImageCropperStage } from "./image-cropper";
import { InlineEditStage } from "./inline-edit";
import { KbdStage } from "./kbd";
import { LivingOrbAiStage } from "./living-orb-ai";
import { LinearProgressStage } from "./linear-progress";
import { LinearProgressBarsStage } from "./linear-progress-bars";
import { MenubarStage } from "./menubar";
import { MeterStage } from "./meter";
import { ModalStage } from "./modal";
import { MultiSelectStage } from "./multi-select";
import { NumberInputStage } from "./number-input";
import { PaginationStage } from "./pagination";
import { PanelStage } from "./panel";
import { PasswordInputStage } from "./password-input";
import { PhoneInputStage } from "./phone-input";
import { PopoverStage } from "./popover";
import { ProgressCircleBarsStage } from "./progress-circle-bars";
import { RadioButtonStage } from "./radio-button";
import { RatingStarsStage } from "./rating-stars";
import { ScrollAreaStage } from "./scroll-area";
import { RichTextEditorStage } from "./rich-text-editor";
import { SearchBarStage } from "./search-bar";
import { SegmentedControlStage } from "./segmented-control";
import { SelectStage } from "./select";
import { SidebarStage } from "./sidebar";
import { SignaturePadStage } from "./signature-pad";
import { SkeletonStage } from "./skeleton";
import { SliderStage } from "./slider";
import { SplitterStage } from "./splitter";
import { StatCardStage } from "./stat-card";
import { StepperStage } from "./stepper";
import { TabsStage } from "./tabs";
import { TagInputStage } from "./tag-input";
import { TerminalStage } from "./terminal";
import { TagStage } from "./tag";
import { TextareaStage } from "./textarea";
import { TimePickerStage } from "./time-picker";
import { TimelineStage } from "./timeline";
import { ToggleProStage } from "./toggle-pro";
import { TreeViewStage } from "./tree-view";
import { ToolbarStage } from "./toolbar";
import { TooltipStage } from "./tooltip";
import { DiamondScrollGalleryStage } from "./diamond-scroll-gallery";
import { LinenDragImageStage } from "./linen-drag-image";
import { ExpandCardGridStage } from "./expand-card-grid";
import { StorySliderStage } from "./story-slider";
import { ScrollTitleGalleryStage } from "./scroll-title-gallery";
import { CardsGalleryRingStage } from "./cards-gallery-ring";
import { SocialReelsGridStage } from "./social-reels-grid";
import { ProductGridSectionStage } from "./product-grid-section";
import { WaveGalleryPageStage } from "./wave-gallery-page";
import { ProjectIndexListStage } from "./project-index-list";
import { ScrollSwatchShowcaseStage } from "./scroll-swatch-showcase";
import { FullpagePhotosStage } from "./fullpage-photos";
import { PremiumBentoGridStage } from "./premium-bento-grid";
import { MotionGalleryGridStage } from "./motion-gallery-grid";
import { ImageSidebarDockStage } from "./image-sidebar-dock";
import { BentoScrollZoomGalleryStage } from "./bento-scroll-zoom-gallery";
import { CinematicStackedGalleryStage } from "./cinematic-stacked-gallery";
import { FullscreenPanelRevealGalleryStage } from "./fullscreen-panel-reveal-gallery";
import { InstagramStoryViewerStage } from "./instagram-story-viewer";
import { BusinessHoursStage } from "./business-hours";
import { QrCodeWidgetStage } from "./qr-code-widget";
import { CoinFlipGameStage } from "./coin-flip-game";
import { TicTacToeGameStage } from "./tic-tac-toe-game";
import { Game2048Stage } from "./2048-game";
import { SnakeGameStage } from "./snake-game";
import { MinesweeperGameStage } from "./minesweeper-game";
import { MemoryMatchGameStage } from "./memory-match-game";
import { PongGameStage } from "./pong-game";
import { DinoRunnerGameStage } from "./dino-runner-game";
import { SpaceInvadersGameStage } from "./space-invaders-game";
import { GlowJumpWidgetStage } from "./glow-jump-widget";
import { SpinToWinWheelStage } from "./spin-to-win-wheel";
import { MemoryCardsWidgetStage } from "./memory-cards-widget";
import { GlobeStudioStage } from "./globe-studio";
import { MatrixRainBackgroundStage } from "./matrix-rain-background";
import { BubbleCursorStage } from "./bubble-cursor";
import { CursorRevealHeroStage } from "./cursor-reveal-hero";
import { CurvedImageCarouselStage } from "./curved-image-carousel";
import { OrbitingGlobeBadgesStage } from "./orbiting-globe-badges";
import { DiceRollDiscountPopupStage } from "./dice-roll-discount-popup";
import { WheelSpinDiscountPopupStage } from "./wheel-spin-discount-popup";
import { HotspotCarouselStage } from "./hotspot-carousel";
import { RotateCarouselStage } from "./rotate-carousel";
import { TiltedCarouselStage } from "./tilted-carousel";
import { AnimatedCarouselStage } from "./animated-carousel";
import { DiagonalCarouselStage } from "./diagonal-carousel";
import { ArcMoodCarouselStage } from "./arc-mood-carousel";
import { GlideCarouselStage } from "./glide-carousel";
import { CarouselSliderStage } from "./carousel-slider";
import { RotaryCardCarouselStage } from "./rotary-card-carousel";
import { CurvedNavCarouselStage } from "./curved-nav-carousel";
import { ArcCoverflowCarouselStage } from "./arc-coverflow-carousel";
import { CanvasTransitionCarouselStage } from "./canvas-transition-carousel";
import { TestimonialSliderStage } from "./testimonial-slider";
import { TestimonialSpotlightStage } from "./testimonial-spotlight";
import { TestimonialPillsStage } from "./testimonial-pills";
import { ReviewGalleryStage } from "./review-gallery";
import { ReviewShowcaseStage } from "./review-showcase";
import { TestimonialLogosStage } from "./testimonial-logos";
import { GoogleReviewsStage } from "./google-reviews";
import { AirbnbReviewsStage } from "./airbnb-reviews";
import { AppStoreReviewsStage } from "./app-store-reviews";
import { EbayReviewsStage } from "./ebay-reviews";
import { EtsyReviewsStage } from "./etsy-reviews";
import { FacebookReviewsStage } from "./facebook-reviews";
import { ReviewCardPortraitStage } from "./review-card-portrait";
import { GlareCardStage } from "./glare-card";
import { AccordionCardsStage } from "./accordion-cards";
import { CompareSliderStage } from "./compare-slider";
import { GlowCardStage } from "./glow-card";
import { GalleryLightboxStage } from "./gallery-lightbox";
import { EternalGlowCardStage } from "./eternal-glow-card";
import { CardCarouselStage } from "./card-carousel";
import { HoverGalleryStage } from "./hover-gallery";
import { HoverMediaCardsStage } from "./hover-media-cards";
import { ScrollCardStackStage } from "./scroll-card-stack";
import { StickyScrollRevealStage } from "./sticky-scroll-reveal";
import { FocusFrameStage } from "./focus-frame";
import { PhoneMarqueeShowcaseStage } from "./phone-marquee-showcase";
import { PhoneMockupStage } from "./phone-mockup";
import { BrowserMockupStage } from "./browser-mockup";
import { InstagramPostMockupStage } from "./instagram-post-mockup";
import { XPostMockupStage } from "./x-post-mockup";
import { TiktokPostMockupStage } from "./tiktok-post-mockup";
import { LinkedinPostMockupStage } from "./linkedin-post-mockup";
import { IpadMockupCarouselStage } from "./ipad-mockup-carousel";
import { DesktopMockupCarouselStage } from "./desktop-mockup-carousel";
import { PhoneGalleryStage } from "./phone-gallery";
import { StickyPhoneScrollStage } from "./sticky-phone-scroll";
import { PhoneAnalyticsMockupStage } from "./phone-analytics-mockup";
import { SoftBackgroundStage } from "./soft-background";
import { ShootingStarsStage } from "./shooting-stars";
import { ParticleTextStage } from "./particle-text";
import { NoiseBackgroundStage } from "./noise-background";
import { NodeFieldStage } from "./node-field";
import { DotFieldGridStage } from "./dot-field-grid";
import { WaveLinesStage } from "./wave-lines";
import { CosmicBackgroundStage } from "./cosmic-background";
import { Perspective404GalleryStage } from "./perspective-404-gallery";
import { WhatsappWidgetStage } from "./whatsapp-widget";
import { DiscordChatWidgetStage } from "./discord-chat-widget";
import { TelegramWidgetStage } from "./telegram-widget";
import { MessengerWidgetStage } from "./messenger-widget";
import { InstagramWidgetStage } from "./instagram-widget";
import { XTwitterWidgetStage } from "./x-twitter-widget";
import { TiltTextStage } from "./tilt-text";
import { TextScrambleProStage } from "./text-scramble-pro";
import { LiquidTextStage } from "./liquid-text";
import { ScrollWordHighlightStage } from "./scroll-word-highlight";
import { KineticTypographyShowcaseStage } from "./kinetic-typography-showcase";
import { WordRevealStage } from "./word-reveal";
import { LineChartStage } from "./line-chart";
import { BarChartStage } from "./bar-chart";
import { RangeAreaChartStage } from "./range-area-chart";
import { RadarChartStage } from "./radar-chart";
import { PieChartStage } from "./pie-chart";
import { ImageDeck3dStage } from "./image-deck-3d";
import { TearableRevealStage } from "./tearable-reveal";
import { AuraCursorStage } from "./aura-cursor";
import { ConfettiShowStage } from "./confetti-show";
import { LiquidImageEffectStage } from "./liquid-image-effect";
import { AnimatedStatsStage } from "./animated-stats";
import { WorldMapArcStage } from "./world-map-arc";
import { WorldMapProStage } from "./world-map-pro";
import { DataTableStage } from "./data-table";
import { TeamDrawerStage } from "./team-drawer";
import { TeamListStage } from "./team-list";
import { ProfileFlipCardStage } from "./profile-flip-card";
import { TeamCarouselStage } from "./team-carousel";
import { SalesTicketPopupStage } from "./sales-ticket-popup";
import { DiceDiscountPopupStage } from "./dice-discount-popup";
import { ScratchCardPopupStage } from "./scratch-card-popup";
import { BlogCardHorizontalStage } from "./blog-card-horizontal";
import { BlogCardVerticalStage } from "./blog-card-vertical";
import { BlogArticleCardsStage } from "./blog-article-cards";
import { LogoSpinStage } from "./logo-spin";
import { OrbitLogoWheelStage } from "./orbit-logo-wheel";
import { LogoMarqueeStage } from "./logo-marquee";
import { InfiniteMarqueeStage } from "./infinite-marquee";
import { CardsHoverMarqueeStage } from "./cards-hover-marquee";
import { DiagonalTickerStripsStage } from "./diagonal-ticker-strips";
import { GlassNavigationStage } from "./glass-navigation";
import { HeaderSimpleStage } from "./header-simple";
import { NavbarMenuStage } from "./navbar-menu";
import { NeuralLogicGraphStage } from "./neural-logic-graph";
import { LatencyTraceDiagramStage } from "./latency-trace-diagram";
import { LiquidGlassVideoStage } from "./liquid-glass-video";
import { VideoGlowLightboxStage } from "./video-glow-lightbox";
import { ProgressTimelineStage } from "./progress-timeline";
import { TimelineMilestonesStage } from "./timeline-milestones";
import { AnnouncementBannerStage } from "./announcement-banner";
import { KanbanBoardStage } from "./kanban-board";
import { CountdownTimerStage } from "./countdown-timer";
import { ScrollZoomMediaRevealStage } from "./scroll-zoom-media-reveal";
import { FlowingMenuStage } from "./flowing-menu";
import { ComparisonTableStage } from "./comparison-table";
import { ScrollZoomMosaicGalleryStage } from "./scroll-zoom-mosaic-gallery";
import { FooterPremiumStage } from "./footer-premium";
import { FooterSectionStage } from "./footer-section";
import { FooterColumnsStage } from "./footer-columns";
import { FooterCtaStage } from "./footer-cta";
import { FooterWordmarkStage } from "./footer-wordmark";
import { TestimonialWallStage } from "./testimonial-wall";
import { HeroSliderCarouselStage } from "./hero-slider-carousel";
import { MeetTheTeamStage } from "./meet-the-team";
import { YourCartPageStage } from "./your-cart-page";
import { StatFeatureStage } from "./stat-feature";
import { ProductListStage } from "./product-list";
import { ProductDetailStage } from "./product-detail";
import { FeatureSplitSectionStage } from "./feature-split-section";
import { AboutFounderSectionStage } from "./about-founder-section";
import { TechStackSectionStage } from "./tech-stack-section";
import { CaseStudySectionStage } from "./case-study-section";
import { IndexGridSectionStage } from "./index-grid-section";
import { ProcessSpotlightStage } from "./process-spotlight";
import { AiChatPanelStage } from "./ai-chat-panel";
import { VideoScrollStoryStage } from "./video-scroll-story";
import { ServiceListCursorPreviewStage } from "./service-list-cursor-preview";
import { ProcessStepsRailStage } from "./process-steps-rail";
import { FeatureGridMosaicStage } from "./feature-grid-mosaic";
import { MarqueeHeroSectionStage } from "./marquee-hero-section";
import { TestimonialBentoStage } from "./testimonial-bento";
import { DownloadSectionStage } from "./download-section";
import { FeatureShowcaseStage } from "./feature-showcase";
import { FeatureShowcaseSplitStage } from "./feature-showcase-split";
import { DownloadSectionGlassStage } from "./download-section-glass";
import { HeroScrollGalleryStage } from "./hero-scroll-gallery";
import { FeatureShowcaseVideoStage } from "./feature-showcase-video";
import { FooterMegaStage } from "./footer-mega";
import { AccordionServicesListStage } from "./accordion-services-list";
import { SocialPostTestimonialWallStage } from "./social-post-testimonial-wall";
import { ReviewMarqueeWallStage } from "./review-marquee-wall";
import { CoverflowServicesHeroStage } from "./coverflow-services-hero";
import { SideMarqueePricingCtaStage } from "./side-marquee-pricing-cta";
import { Error404PageSectionStage } from "./error-404-page-section";

// slug -> the scene rendered by /preview/video/<slug> while recording a hover
// clip with `npm run video -- <slug>`. Add one entry (plus a scene file in
// scripts/video-scenes/) per element.
export const VIDEO_STAGES: Record<string, ComponentType> = {
  accordion: AccordionStage,
  "alert-toast": AlertToastStage,
  "animated-checkbox": AnimatedCheckboxStage,
  "animated-loader": AnimatedLoaderStage,
  "aspect-ratio": AspectRatioStage,
  avatar: AvatarStage,
  "avatar-group": AvatarGroupStage,
  "back-to-top": BackToTopStage,
  "badges-kit": BadgesKitStage,
  breadcrumb: BreadcrumbStage,
  button: ButtonStage,
  callout: CalloutStage,
  "carousel-3d": Carousel3DStage,
  card: CardStage,
  "code-block": CodeBlockStage,
  "copy-button": CopyButtonStage,
  "color-picker": ColorPickerStage,
  combobox: ComboboxStage,
  "command-palette": CommandPaletteStage,
  "confirm-dialog": ConfirmDialogStage,
  "context-menu": ContextMenuStage,
  "date-picker": DatePickerStage,
  "time-picker": TimePickerStage,
  "description-list": DescriptionListStage,
  divider: DividerStage,
  dock: DockStage,
  drawer: DrawerStage,
  "empty-state": EmptyStateStage,
  "file-upload": FileUploadStage,
  "hover-card": HoverCardStage,
  input: InputStage,
  "input-otp": InputOtpStage,
  "inline-edit": InlineEditStage,
  kbd: KbdStage,
  "living-orb-ai": LivingOrbAiStage,
  "ai-asistant": AIAsistantStage,
  "ai-voice-01": AiVoice01Stage,
  "ai-voice-02": AiVoice02Stage,
  "ai-voice-03": AiVoice03Stage,
  "ai-voice-04": AiVoice04Stage,
  "ai-voice-05": AiVoice05Stage,
  "ai-image-loader-01": AiImageLoader01Stage,
  "ai-image-loader-02": AiImageLoader02Stage,
  "ai-image-loader-03": AiImageLoader03Stage,
  "ai-image-loader-04": AiImageLoader04Stage,
  "ai-dynamic-island-01": AiDynamicIsland01Stage,
  "ai-dynamic-island-02": AiDynamicIsland02Stage,
  "ai-answer-01": AiAnswer01Stage,
  "ai-answer-02": AiAnswer02Stage,
  "ai-answer-03": AiAnswer03Stage,
  "ai-chat-prompt": AIChatPromptStage,
  "ai-chat": AiChatStage,
  "ai-edit-review": AIEditReviewStage,
  "image-showcase": ImageShowcaseStage,
  "cylinder-gallery": CylinderGalleryStage,
  "gallery-expand": GalleryExpandStage,
  "mood-gallery": MoodGalleryStage,
  "gallery-flow": GalleryFlowStage,
  "gallery-curve": GalleryCurveStage,
  "gallery-reveal": GalleryRevealStage,
  "youtube-gallery": YoutubeGalleryStage,
  "skew-scroll-gallery": SkewScrollGalleryStage,
  "dot-image-slider": DotImageSliderStage,
  "linear-progress": LinearProgressStage,
  "linear-progress-bars": LinearProgressBarsStage,
  menubar: MenubarStage,
  meter: MeterStage,
  modal: ModalStage,
  "multi-select": MultiSelectStage,
  "number-input": NumberInputStage,
  pagination: PaginationStage,
  panel: PanelStage,
  "password-input": PasswordInputStage,
  "phone-input": PhoneInputStage,
  "credit-card-input": CreditCardInputStage,
  "currency-input": CurrencyInputStage,
  "form-field": FormFieldStage,
  "rich-text-editor": RichTextEditorStage,
  "signature-pad": SignaturePadStage,
  "image-cropper": ImageCropperStage,
  popover: PopoverStage,
  "progress-circle-bars": ProgressCircleBarsStage,
  "radio-button": RadioButtonStage,
  "rating-stars": RatingStarsStage,
  "scroll-area": ScrollAreaStage,
  "search-bar": SearchBarStage,
  "segmented-control": SegmentedControlStage,
  select: SelectStage,
  sidebar: SidebarStage,
  skeleton: SkeletonStage,
  slider: SliderStage,
  splitter: SplitterStage,
  "stat-card": StatCardStage,
  stepper: StepperStage,
  tabs: TabsStage,
  tag: TagStage,
  "tag-input": TagInputStage,
  terminal: TerminalStage,
  textarea: TextareaStage,
  timeline: TimelineStage,
  "toggle-pro": ToggleProStage,
  toolbar: ToolbarStage,
  tooltip: TooltipStage,
  "tree-view": TreeViewStage,
  "diamond-scroll-gallery": DiamondScrollGalleryStage,
  "linen-drag-image": LinenDragImageStage,
  "expand-card-grid": ExpandCardGridStage,
  "story-slider": StorySliderStage,
  "scroll-title-gallery": ScrollTitleGalleryStage,
  "cards-gallery-ring": CardsGalleryRingStage,
  "social-reels-grid": SocialReelsGridStage,
  "product-grid-section": ProductGridSectionStage,
  "wave-gallery-page": WaveGalleryPageStage,
  "project-index-list": ProjectIndexListStage,
  "scroll-swatch-showcase": ScrollSwatchShowcaseStage,
  "fullpage-photos": FullpagePhotosStage,
  "premium-bento-grid": PremiumBentoGridStage,
  "motion-gallery-grid": MotionGalleryGridStage,
  "image-sidebar-dock": ImageSidebarDockStage,
  "bento-scroll-zoom-gallery": BentoScrollZoomGalleryStage,
  "cinematic-stacked-gallery": CinematicStackedGalleryStage,
  "fullscreen-panel-reveal-gallery": FullscreenPanelRevealGalleryStage,
  "instagram-story-viewer": InstagramStoryViewerStage,
  "business-hours": BusinessHoursStage,
  "qr-code-widget": QrCodeWidgetStage,
  "coin-flip-game": CoinFlipGameStage,
  "tic-tac-toe-game": TicTacToeGameStage,
  "2048-game": Game2048Stage,
  "snake-game": SnakeGameStage,
  "minesweeper-game": MinesweeperGameStage,
  "memory-match-game": MemoryMatchGameStage,
  "pong-game": PongGameStage,
  "dino-runner-game": DinoRunnerGameStage,
  "space-invaders-game": SpaceInvadersGameStage,
  "glow-jump-widget": GlowJumpWidgetStage,
  "spin-to-win-wheel": SpinToWinWheelStage,
  "memory-cards-widget": MemoryCardsWidgetStage,
  "globe-studio": GlobeStudioStage,
  "matrix-rain-background": MatrixRainBackgroundStage,
  "bubble-cursor": BubbleCursorStage,
  "cursor-reveal-hero": CursorRevealHeroStage,
  "curved-image-carousel": CurvedImageCarouselStage,
  "orbiting-globe-badges": OrbitingGlobeBadgesStage,
  "dice-roll-discount-popup": DiceRollDiscountPopupStage,
  "wheel-spin-discount-popup": WheelSpinDiscountPopupStage,
  "hotspot-carousel": HotspotCarouselStage,
  "rotate-carousel": RotateCarouselStage,
  "tilted-carousel": TiltedCarouselStage,
  "animated-carousel": AnimatedCarouselStage,
  "diagonal-carousel": DiagonalCarouselStage,
  "arc-mood-carousel": ArcMoodCarouselStage,
  "glide-carousel": GlideCarouselStage,
  "carousel-slider": CarouselSliderStage,
  "rotary-card-carousel": RotaryCardCarouselStage,
  "curved-nav-carousel": CurvedNavCarouselStage,
  "arc-coverflow-carousel": ArcCoverflowCarouselStage,
  "canvas-transition-carousel": CanvasTransitionCarouselStage,
  "testimonial-slider": TestimonialSliderStage,
  "testimonial-spotlight": TestimonialSpotlightStage,
  "testimonial-pills": TestimonialPillsStage,
  "review-gallery": ReviewGalleryStage,
  "review-showcase": ReviewShowcaseStage,
  "testimonial-logos": TestimonialLogosStage,
  "google-reviews": GoogleReviewsStage,
  "airbnb-reviews": AirbnbReviewsStage,
  "app-store-reviews": AppStoreReviewsStage,
  "ebay-reviews": EbayReviewsStage,
  "etsy-reviews": EtsyReviewsStage,
  "facebook-reviews": FacebookReviewsStage,
  "review-card-portrait": ReviewCardPortraitStage,
  "glare-card": GlareCardStage,
  "accordion-cards": AccordionCardsStage,
  "compare-slider": CompareSliderStage,
  "glow-card": GlowCardStage,
  "gallery-lightbox": GalleryLightboxStage,
  "eternal-glow-card": EternalGlowCardStage,
  "card-carousel": CardCarouselStage,
  "hover-gallery": HoverGalleryStage,
  "hover-media-cards": HoverMediaCardsStage,
  "scroll-card-stack": ScrollCardStackStage,
  "sticky-scroll-reveal": StickyScrollRevealStage,
  "focus-frame": FocusFrameStage,
  "phone-marquee-showcase": PhoneMarqueeShowcaseStage,
  "phone-mockup": PhoneMockupStage,
  "browser-mockup": BrowserMockupStage,
  "instagram-post-mockup": InstagramPostMockupStage,
  "x-post-mockup": XPostMockupStage,
  "tiktok-post-mockup": TiktokPostMockupStage,
  "linkedin-post-mockup": LinkedinPostMockupStage,
  "ipad-mockup-carousel": IpadMockupCarouselStage,
  "desktop-mockup-carousel": DesktopMockupCarouselStage,
  "phone-gallery": PhoneGalleryStage,
  "sticky-phone-scroll": StickyPhoneScrollStage,
  "phone-analytics-mockup": PhoneAnalyticsMockupStage,
  "soft-background": SoftBackgroundStage,
  "shooting-stars": ShootingStarsStage,
  "particle-text": ParticleTextStage,
  "noise-background": NoiseBackgroundStage,
  "node-field": NodeFieldStage,
  "dot-field-grid": DotFieldGridStage,
  "wave-lines": WaveLinesStage,
  "cosmic-background": CosmicBackgroundStage,
  "perspective-404-gallery": Perspective404GalleryStage,
  "whatsapp-widget": WhatsappWidgetStage,
  "discord-chat-widget": DiscordChatWidgetStage,
  "telegram-widget": TelegramWidgetStage,
  "messenger-widget": MessengerWidgetStage,
  "instagram-widget": InstagramWidgetStage,
  "x-twitter-widget": XTwitterWidgetStage,
  "tilt-text": TiltTextStage,
  "text-scramble-pro": TextScrambleProStage,
  "liquid-text": LiquidTextStage,
  "scroll-word-highlight": ScrollWordHighlightStage,
  "kinetic-typography-showcase": KineticTypographyShowcaseStage,
  "word-reveal": WordRevealStage,
  "line-chart": LineChartStage,
  "bar-chart": BarChartStage,
  "range-area-chart": RangeAreaChartStage,
  "radar-chart": RadarChartStage,
  "pie-chart": PieChartStage,
  "image-deck-3d": ImageDeck3dStage,
  "tearable-reveal": TearableRevealStage,
  "aura-cursor": AuraCursorStage,
  "confetti-show": ConfettiShowStage,
  "liquid-image-effect": LiquidImageEffectStage,
  "animated-stats": AnimatedStatsStage,
  "world-map-arc": WorldMapArcStage,
  "world-map-pro": WorldMapProStage,
  "data-table": DataTableStage,
  "team-drawer": TeamDrawerStage,
  "team-list": TeamListStage,
  "profile-flip-card": ProfileFlipCardStage,
  "team-carousel": TeamCarouselStage,
  "sales-ticket-popup": SalesTicketPopupStage,
  "dice-discount-popup": DiceDiscountPopupStage,
  "scratch-card-popup": ScratchCardPopupStage,
  "blog-card-horizontal": BlogCardHorizontalStage,
  "blog-card-vertical": BlogCardVerticalStage,
  "blog-article-cards": BlogArticleCardsStage,
  "logo-spin": LogoSpinStage,
  "orbit-logo-wheel": OrbitLogoWheelStage,
  "logo-marquee": LogoMarqueeStage,
  "infinite-marquee": InfiniteMarqueeStage,
  "cards-hover-marquee": CardsHoverMarqueeStage,
  "diagonal-ticker-strips": DiagonalTickerStripsStage,
  "glass-navigation": GlassNavigationStage,
  "header-simple": HeaderSimpleStage,
  "navbar-menu": NavbarMenuStage,
  "neural-logic-graph": NeuralLogicGraphStage,
  "latency-trace-diagram": LatencyTraceDiagramStage,
  "liquid-glass-video": LiquidGlassVideoStage,
  "video-glow-lightbox": VideoGlowLightboxStage,
  "progress-timeline": ProgressTimelineStage,
  "timeline-milestones": TimelineMilestonesStage,
  "announcement-banner": AnnouncementBannerStage,
  "kanban-board": KanbanBoardStage,
  "countdown-timer": CountdownTimerStage,
  "scroll-zoom-media-reveal": ScrollZoomMediaRevealStage,
  "flowing-menu": FlowingMenuStage,
  "comparison-table": ComparisonTableStage,
  "scroll-zoom-mosaic-gallery": ScrollZoomMosaicGalleryStage,
  "footer-premium": FooterPremiumStage,
  "footer-section": FooterSectionStage,
  "footer-columns": FooterColumnsStage,
  "footer-cta": FooterCtaStage,
  "footer-wordmark": FooterWordmarkStage,
  "testimonial-wall": TestimonialWallStage,
  "hero-slider-carousel": HeroSliderCarouselStage,
  "meet-the-team": MeetTheTeamStage,
  "your-cart-page": YourCartPageStage,
  "stat-feature": StatFeatureStage,
  "product-list": ProductListStage,
  "product-detail": ProductDetailStage,
  "feature-split-section": FeatureSplitSectionStage,
  "about-founder-section": AboutFounderSectionStage,
  "tech-stack-section": TechStackSectionStage,
  "case-study-section": CaseStudySectionStage,
  "index-grid-section": IndexGridSectionStage,
  "process-spotlight": ProcessSpotlightStage,
  "ai-chat-panel": AiChatPanelStage,
  "video-scroll-story": VideoScrollStoryStage,
  "service-list-cursor-preview": ServiceListCursorPreviewStage,
  "process-steps-rail": ProcessStepsRailStage,
  "feature-grid-mosaic": FeatureGridMosaicStage,
  "marquee-hero-section": MarqueeHeroSectionStage,
  "testimonial-bento": TestimonialBentoStage,
  "download-section": DownloadSectionStage,
  "feature-showcase": FeatureShowcaseStage,
  "feature-showcase-split": FeatureShowcaseSplitStage,
  "download-section-glass": DownloadSectionGlassStage,
  "hero-scroll-gallery": HeroScrollGalleryStage,
  "feature-showcase-video": FeatureShowcaseVideoStage,
  "footer-mega": FooterMegaStage,
  "accordion-services-list": AccordionServicesListStage,
  "social-post-testimonial-wall": SocialPostTestimonialWallStage,
  "review-marquee-wall": ReviewMarqueeWallStage,
  "coverflow-services-hero": CoverflowServicesHeroStage,
  "side-marquee-pricing-cta": SideMarqueePricingCtaStage,
  "error-404-page-section": Error404PageSectionStage,
};
