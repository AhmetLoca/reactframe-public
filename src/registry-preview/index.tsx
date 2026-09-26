import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Playground, type PlaygroundControl } from "@/components/playground";
const CountdownTimer = dynamic(() =>
  import("../../registry/new-york/countdown-timer/countdown-timer").then(
    (m) => m.CountdownTimer,
  ),
);
const Error404PageSection = dynamic(() =>
  import("../../registry/new-york/error-404-page-section/error-404-page-section").then(
    (m) => m.Error404PageSection,
  ),
);
const CosmicBackground = dynamic(() =>
  import("../../registry/new-york/cosmic-background/cosmic-background").then(
    (m) => m.CosmicBackground,
  ),
);
const TogglePro = dynamic(() =>
  import("../../registry/new-york/toggle-pro/toggle-pro").then(
    (m) => m.TogglePro,
  ),
);
import type {
  BadgeTone,
  BadgeIconType,
  BadgeSize,
  BadgeTheme,
} from "../../registry/new-york/badges-kit/badges-kit";
const Badge = dynamic(() =>
  import("../../registry/new-york/badges-kit/badges-kit").then((m) => m.Badge),
);
const RatingStars = dynamic(() =>
  import("../../registry/new-york/rating-stars/rating-stars").then(
    (m) => m.RatingStars,
  ),
);
const GlareCard = dynamic(() =>
  import("../../registry/new-york/glare-card/glare-card").then(
    (m) => m.GlareCard,
  ),
);
const ImageDeck3D = dynamic(() =>
  import("../../registry/new-york/image-deck-3d/image-deck-3d").then(
    (m) => m.ImageDeck3D,
  ),
);
const InfiniteMarquee = dynamic(() =>
  import("../../registry/new-york/infinite-marquee/infinite-marquee").then(
    (m) => m.InfiniteMarquee,
  ),
);
const DiscordChatWidget = dynamic(() =>
  import("../../registry/new-york/discord-chat-widget/discord-chat-widget").then(
    (m) => m.DiscordChatWidget,
  ),
);
const TelegramWidget = dynamic(() =>
  import("../../registry/new-york/telegram-widget/telegram-widget").then(
    (m) => m.TelegramWidget,
  ),
);
const MessengerWidget = dynamic(() =>
  import("../../registry/new-york/messenger-widget/messenger-widget").then(
    (m) => m.MessengerWidget,
  ),
);
const XTwitterWidget = dynamic(() =>
  import("../../registry/new-york/x-twitter-widget/x-twitter-widget").then(
    (m) => m.XTwitterWidget,
  ),
);
const FooterPremium = dynamic(() =>
  import("../../registry/new-york/footer-premium/footer-premium").then(
    (m) => m.FooterPremium,
  ),
);
const FooterSection = dynamic(() =>
  import("../../registry/new-york/footer-section/footer-section").then(
    (m) => m.FooterSection,
  ),
);
const YourCartPage = dynamic(() =>
  import("../../registry/new-york/your-cart-page/your-cart-page").then(
    (m) => m.YourCartPage,
  ),
);
const YOUR_CART_ITEMS = [
  { title: "Nova Headphones", variant: "Black / Medium", price: "$249.00", image: "/demo/blocks/your-cart-page/item-1.webp" },
  { title: "Orbit Sneakers", variant: "White / 9 (US)", price: "$129.00", image: "/demo/blocks/your-cart-page/item-2.webp" },
  { title: "Trail Backpack", variant: "Olive / 22L", price: "$89.00", image: "/demo/blocks/your-cart-page/item-3.webp" },
  { title: "Thermo Bottle", variant: "Black / 750ml", price: "$34.00", image: "/demo/blocks/your-cart-page/item-4.webp" },
];
const YOUR_CART_FORM = {
  email: "you@example.com",
  phone: "+1 (555) 123-4567",
  fullName: "Jane Doe",
  address: "123 Market St",
  city: "San Francisco",
  region: "California",
  zip: "94103",
  card: "4242 4242 4242 4242",
  exp: "MM / YY",
  cvc: "123",
};
const StatFeature = dynamic(() =>
  import("../../registry/new-york/stat-feature/stat-feature").then(
    (m) => m.StatFeature,
  ),
);
const STAT_FEATURE_PROPS = {
  badge: "INSIGHTS",
  title: "Numbers That Tell the Real Story",
  description: "Clear metrics that help you understand performance, growth and trust at a glance.",
  rings: [
    { value: 88, color: "#3B82F6" },
    { value: 72, color: "#60A5FA" },
    { value: 55, color: "#93C5FD" },
    { value: 40, color: "#BFDBFE" },
  ],
  trendText: "Up 7.4% compared to last period",
  chartCaption: "Growing steadily this quarter",
  chartSubcaption: "Based on activity across the last 90 days",
  stats: [
    { number: "100", suffix: "%", label: "SEO ready out of the box" },
    { number: "620", suffix: "+", label: "Ready-to-use components" },
    { number: "42", suffix: "k+", label: "Builders who rely on us" },
  ],
};
const ProductList = dynamic(() =>
  import("../../registry/new-york/product-list/product-list").then(
    (m) => m.ProductList,
  ),
);
const PRODUCT_LIST_ITEMS = [
  { title: "Noise Cancelling Headphones", price: "$199.00", category: "Electronics", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/headphones.webp", url: "#" },
  { title: "Minimal Watch", price: "$79.00", compareAtPrice: "$129.00", category: "Accessories", tier: "premium" as const, badge: "sale" as const, image: "/demo/blocks/product-list/watch.webp", url: "#" },
  { title: "Insulated Water Bottle", price: "$39.00", category: "Sports & Outdoors", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/bottle.webp", url: "#" },
  { title: "Laptop Stand", price: "$49.00", compareAtPrice: "$89.00", category: "Electronics", tier: "premium" as const, badge: "sale" as const, image: "/demo/blocks/product-list/stand.webp", url: "#" },
  { title: "Everyday Backpack", price: "$89.00", category: "Apparel", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/backpack.webp", url: "#" },
  { title: "Wireless Earbuds", price: "$129.00", category: "Electronics", tier: "premium" as const, image: "/demo/blocks/product-list/earbuds.webp", url: "#" },
  { title: "LED Desk Lamp", price: "$59.00", category: "Home & Living", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/lamp.webp", url: "#" },
  { title: "Running Shoes", price: "$99.00", compareAtPrice: "$149.00", category: "Sports & Outdoors", tier: "premium" as const, badge: "sale" as const, image: "/demo/blocks/product-list/shoe.webp", url: "#" },
  { title: "Premium Notebook", price: "$24.00", category: "Books", tier: "free" as const, badge: "new" as const, image: "/demo/blocks/product-list/notebook.webp", url: "#" },
];
const ProductDetail = dynamic(() =>
  import("../../registry/new-york/product-detail/product-detail").then(
    (m) => m.ProductDetail,
  ),
);
const PRODUCT_DETAIL_GALLERY = [
  { src: "/demo/blocks/product-detail/watch-1.webp", alt: "Minimal Watch, front view" },
  { src: "/demo/blocks/product-detail/watch-2.webp", alt: "Minimal Watch, dial close-up" },
  { src: "/demo/blocks/product-detail/watch-3.webp", alt: "Minimal Watch, upper strap" },
  { src: "/demo/blocks/product-detail/watch-4.webp", alt: "Minimal Watch, lower strap" },
];
const PRODUCT_DETAIL_COLORS = [
  { name: "Black", color: "#2a2a2a" },
  { name: "Silver", color: "#c8c8c8" },
  { name: "Olive", color: "#5b6b58" },
  { name: "Navy", color: "#2c3a6b" },
];
const PRODUCT_DETAIL_SIZES = ["36mm", "38mm", "40mm", "42mm"];
const PRODUCT_DETAIL_SPECS = [
  { label: "Case", value: "Stainless steel, matte black" },
  { label: "Strap", value: "Vegetable-tanned leather" },
  { label: "Movement", value: "Japanese quartz" },
  { label: "SKU", value: "WATCH-MIN-001" },
  { label: "Water resistance", value: "3 ATM (30 m)" },
  { label: "Glass", value: "Scratch-resistant mineral" },
  { label: "Care", value: "Wipe clean, avoid soaking" },
  { label: "Warranty", value: "2 years" },
];
const CompareSlider = dynamic(() =>
  import("../../registry/new-york/compare-slider/compare-slider").then(
    (m) => m.CompareSlider,
  ),
);
const GlowCard = dynamic(() =>
  import("../../registry/new-york/glow-card/glow-card").then((m) => m.GlowCard),
);
const ImageShowcase = dynamic(() =>
  import("../../registry/new-york/image-showcase/image-showcase").then(
    (m) => m.ImageShowcase,
  ),
);
const EternalGlowCard = dynamic(() =>
  import("../../registry/new-york/eternal-glow-card/eternal-glow-card").then(
    (m) => m.EternalGlowCard,
  ),
);
const HeaderSimple = dynamic(() =>
  import("../../registry/new-york/header-simple/header-simple").then(
    (m) => m.HeaderSimple,
  ),
);
const GlassNavigation = dynamic(() =>
  import("../../registry/new-york/glass-navigation/glass-navigation").then(
    (m) => m.GlassNavigation,
  ),
);
const TestimonialLogos = dynamic(() =>
  import("../../registry/new-york/testimonial-logos/testimonial-logos").then(
    (m) => m.TestimonialLogos,
  ),
);
const DiceDiscountPopup = dynamic(() =>
  import("../../registry/new-york/dice-discount-popup/dice-discount-popup").then(
    (m) => m.DiceDiscountPopup,
  ),
);
const ScratchCardPopup = dynamic(() =>
  import("../../registry/new-york/scratch-card-popup/scratch-card-popup").then(
    (m) => m.ScratchCardPopup,
  ),
);
const BusinessHours = dynamic(() =>
  import("../../registry/new-york/business-hours/business-hours").then(
    (m) => m.BusinessHours,
  ),
);
const MotionGalleryGrid = dynamic(() =>
  import("../../registry/new-york/motion-gallery-grid/motion-gallery-grid").then(
    (m) => m.MotionGalleryGrid,
  ),
);
const QrCodeWidget = dynamic(() =>
  import("../../registry/new-york/qr-code-widget/qr-code-widget").then(
    (m) => m.QrCodeWidget,
  ),
);
const AirbnbReviews = dynamic(() =>
  import("../../registry/new-york/airbnb-reviews/airbnb-reviews").then(
    (m) => m.AirbnbReviews,
  ),
);
const EbayReviews = dynamic(() =>
  import("../../registry/new-york/ebay-reviews/ebay-reviews").then(
    (m) => m.EbayReviews,
  ),
);
const EtsyReviews = dynamic(() =>
  import("../../registry/new-york/etsy-reviews/etsy-reviews").then(
    (m) => m.EtsyReviews,
  ),
);
const CoinFlipGame = dynamic(() =>
  import("../../registry/new-york/coin-flip-game/coin-flip-game").then(
    (m) => m.CoinFlipGame,
  ),
);
const TicTacToeGame = dynamic(() =>
  import("../../registry/new-york/tic-tac-toe-game/tic-tac-toe-game").then(
    (m) => m.TicTacToeGame,
  ),
);
const Game2048 = dynamic(() =>
  import("../../registry/new-york/2048-game/2048-game").then((m) => m.Game2048),
);
const SnakeGame = dynamic(() =>
  import("../../registry/new-york/snake-game/snake-game").then(
    (m) => m.SnakeGame,
  ),
);
const MinesweeperGame = dynamic(() =>
  import("../../registry/new-york/minesweeper-game/minesweeper-game").then(
    (m) => m.MinesweeperGame,
  ),
);
const MemoryMatchGame = dynamic(() =>
  import("../../registry/new-york/memory-match-game/memory-match-game").then(
    (m) => m.MemoryMatchGame,
  ),
);
const PongGame = dynamic(() =>
  import("../../registry/new-york/pong-game/pong-game").then((m) => m.PongGame),
);
const DinoRunnerGame = dynamic(() =>
  import("../../registry/new-york/dino-runner-game/dino-runner-game").then(
    (m) => m.DinoRunnerGame,
  ),
);
const SpaceInvadersGame = dynamic(() =>
  import("../../registry/new-york/space-invaders-game/space-invaders-game").then(
    (m) => m.SpaceInvadersGame,
  ),
);
const GlowJumpWidget = dynamic(() =>
  import("../../registry/new-york/glow-jump-widget/glow-jump-widget").then(
    (m) => m.GlowJumpWidget,
  ),
);
const SpinToWinWheel = dynamic(() =>
  import("../../registry/new-york/spin-to-win-wheel/spin-to-win-wheel").then(
    (m) => m.SpinToWinWheel,
  ),
);
const MemoryCardsWidget = dynamic(() =>
  import("../../registry/new-york/memory-cards-widget/memory-cards-widget").then(
    (m) => m.MemoryCardsWidget,
  ),
);
const BubbleCursor = dynamic(() =>
  import("../../registry/new-york/bubble-cursor/bubble-cursor").then(
    (m) => m.BubbleCursor,
  ),
);
const TestimonialSpotlight = dynamic(() =>
  import("../../registry/new-york/testimonial-spotlight/testimonial-spotlight").then(
    (m) => m.TestimonialSpotlight,
  ),
);
const TestimonialPills = dynamic(() =>
  import("../../registry/new-york/testimonial-pills/testimonial-pills").then(
    (m) => m.TestimonialPills,
  ),
);
const ProfileFlipCard = dynamic(() =>
  import("../../registry/new-york/profile-flip-card/profile-flip-card").then(
    (m) => m.ProfileFlipCard,
  ),
);
const PhoneMockup = dynamic(() =>
  import("../../registry/new-york/phone-mockup/phone-mockup").then(
    (m) => m.PhoneMockup,
  ),
);
const BrowserMockup = dynamic(() =>
  import("../../registry/new-york/browser-mockup/browser-mockup").then(
    (m) => m.BrowserMockup,
  ),
);
const InstagramPostMockup = dynamic(() =>
  import("../../registry/new-york/instagram-post-mockup/instagram-post-mockup").then(
    (m) => m.InstagramPostMockup,
  ),
);
const XPostMockup = dynamic(() =>
  import("../../registry/new-york/x-post-mockup/x-post-mockup").then(
    (m) => m.XPostMockup,
  ),
);
const TikTokPostMockup = dynamic(() =>
  import("../../registry/new-york/tiktok-post-mockup/tiktok-post-mockup").then(
    (m) => m.TikTokPostMockup,
  ),
);
const LinkedInPostMockup = dynamic(() =>
  import("../../registry/new-york/linkedin-post-mockup/linkedin-post-mockup").then(
    (m) => m.LinkedInPostMockup,
  ),
);
const CylinderGallery = dynamic(() =>
  import("../../registry/new-york/cylinder-gallery/cylinder-gallery").then(
    (m) => m.CylinderGallery,
  ),
);
const GalleryFlow = dynamic(() =>
  import("../../registry/new-york/gallery-flow/gallery-flow").then(
    (m) => m.GalleryFlow,
  ),
);
const TiltedCarousel = dynamic(() =>
  import("../../registry/new-york/tilted-carousel/tilted-carousel").then(
    (m) => m.TiltedCarousel,
  ),
);
const DiagonalCarousel = dynamic(() =>
  import("../../registry/new-york/diagonal-carousel/diagonal-carousel").then(
    (m) => m.DiagonalCarousel,
  ),
);
const TiltText = dynamic(() =>
  import("../../registry/new-york/tilt-text/tilt-text").then((m) => m.TiltText),
);
const LogoMarquee = dynamic(() =>
  import("../../registry/new-york/logo-marquee/logo-marquee").then(
    (m) => m.LogoMarquee,
  ),
);
const BarChart = dynamic(() =>
  import("../../registry/new-york/bar-chart/bar-chart").then((m) => m.BarChart),
);
const PieChart = dynamic(() =>
  import("../../registry/new-york/pie-chart/pie-chart").then((m) => m.PieChart),
);
const RadarChart = dynamic(() =>
  import("../../registry/new-york/radar-chart/radar-chart").then(
    (m) => m.RadarChart,
  ),
);
const RangeAreaChart = dynamic(() =>
  import("../../registry/new-york/range-area-chart/range-area-chart").then(
    (m) => m.RangeAreaChart,
  ),
);
const DesktopMockupCarousel = dynamic(() =>
  import("../../registry/new-york/desktop-mockup-carousel/desktop-mockup-carousel").then(
    (m) => m.DesktopMockupCarousel,
  ),
);
const TearableReveal = dynamic(() =>
  import("../../registry/new-york/tearable-reveal/tearable-reveal").then(
    (m) => m.TearableReveal,
  ),
);
const LineChart = dynamic(() =>
  import("../../registry/new-york/line-chart/line-chart").then(
    (m) => m.LineChart,
  ),
);
const DataTable = dynamic(() =>
  import("../../registry/new-york/data-table/data-table").then(
    (m) => m.DataTable,
  ),
);
const KanbanBoard = dynamic(() =>
  import("../../registry/new-york/kanban-board/kanban-board").then(
    (m) => m.KanbanBoard,
  ),
);
const ExpandCardGrid = dynamic(() =>
  import("../../registry/new-york/expand-card-grid/expand-card-grid").then(
    (m) => m.ExpandCardGrid,
  ),
);
import type { SalesTicketTheme } from "../../registry/new-york/sales-ticket-popup/sales-ticket-popup";
const SalesTicketPopup = dynamic(() =>
  import("../../registry/new-york/sales-ticket-popup/sales-ticket-popup").then(
    (m) => m.SalesTicketPopup,
  ),
);
const AnimatedCheckbox = dynamic(() =>
  import("../../registry/new-york/animated-checkbox/animated-checkbox").then(
    (m) => m.AnimatedCheckbox,
  ),
);
const RadioButton = dynamic(() =>
  import("../../registry/new-york/radio-button/radio-button").then(
    (m) => m.RadioButton,
  ),
);
const Select = dynamic(() =>
  import("../../registry/new-york/select/select").then((m) => m.Select),
);
const Slider = dynamic(() =>
  import("../../registry/new-york/slider/slider").then((m) => m.Slider),
);
const SearchBar = dynamic(() =>
  import("../../registry/new-york/search-bar/search-bar").then(
    (m) => m.SearchBar,
  ),
);
const Tag = dynamic(() =>
  import("../../registry/new-york/tag/tag").then((m) => m.Tag),
);
const Tooltip = dynamic(() =>
  import("../../registry/new-york/tooltip/tooltip").then((m) => m.Tooltip),
);
const Skeleton = dynamic(() =>
  import("../../registry/new-york/skeleton/skeleton").then((m) => m.Skeleton),
);
const Tabs = dynamic(() =>
  import("../../registry/new-york/tabs/tabs").then((m) => m.Tabs),
);
const Breadcrumb = dynamic(() =>
  import("../../registry/new-york/breadcrumb/breadcrumb").then(
    (m) => m.Breadcrumb,
  ),
);
const Pagination = dynamic(() =>
  import("../../registry/new-york/pagination/pagination").then(
    (m) => m.Pagination,
  ),
);
const Stepper = dynamic(() =>
  import("../../registry/new-york/stepper/stepper").then((m) => m.Stepper),
);
const Modal = dynamic(() =>
  import("../../registry/new-york/modal/modal").then((m) => m.Modal),
);
const Popover = dynamic(() =>
  import("../../registry/new-york/popover/popover").then((m) => m.Popover),
);
const Drawer = dynamic(() =>
  import("../../registry/new-york/drawer/drawer").then((m) => m.Drawer),
);
const Avatar = dynamic(() =>
  import("../../registry/new-york/avatar/avatar").then((m) => m.Avatar),
);
const AvatarGroup = dynamic(() =>
  import("../../registry/new-york/avatar-group/avatar-group").then(
    (m) => m.AvatarGroup,
  ),
);
const Divider = dynamic(() =>
  import("../../registry/new-york/divider/divider").then((m) => m.Divider),
);
const Accordion = dynamic(() =>
  import("../../registry/new-york/accordion/accordion").then(
    (m) => m.Accordion,
  ),
);
const Card = dynamic(() =>
  import("../../registry/new-york/card/card").then((m) => m.Card),
);
const Kbd = dynamic(() =>
  import("../../registry/new-york/kbd/kbd").then((m) => m.Kbd),
);
const EmptyState = dynamic(() =>
  import("../../registry/new-york/empty-state/empty-state").then((m) => m.EmptyState),
);
const TagInput = dynamic(() =>
  import("../../registry/new-york/tag-input/tag-input").then((m) => m.TagInput),
);
const Combobox = dynamic(() =>
  import("../../registry/new-york/combobox/combobox").then((m) => m.Combobox),
);
const MultiSelect = dynamic(() =>
  import("../../registry/new-york/multi-select/multi-select").then((m) => m.MultiSelect),
);
const DatePicker = dynamic(() =>
  import("../../registry/new-york/date-picker/date-picker").then((m) => m.DatePicker),
);
const InputOTP = dynamic(() =>
  import("../../registry/new-york/input-otp/input-otp").then((m) => m.InputOTP),
);
function OtpDemo() {
  const [status, setStatus] = React.useState<"idle" | "error" | "success">("idle");
  const [code, setCode] = React.useState("");
  return (
    <InputOTP
      label="Verification code"
      groupSize={3}
      value={code}
      status={status}
      helperText="Enter the 6-digit code (try 123456)"
      errorText="That code is incorrect. Try again."
      onValueChange={(v) => {
        setCode(v);
        setStatus("idle");
      }}
      onComplete={(v) => {
        if (v === "123456") setStatus("success");
        else {
          setStatus("error");
          setTimeout(() => setCode(""), 700);
        }
      }}
    />
  );
}
const NumberInput = dynamic(() =>
  import("../../registry/new-york/number-input/number-input").then((m) => m.NumberInput),
);
const PasswordInput = dynamic(() =>
  import("../../registry/new-york/password-input/password-input").then((m) => m.PasswordInput),
);
const SegmentedControl = dynamic(() =>
  import("../../registry/new-york/segmented-control/segmented-control").then((m) => m.SegmentedControl),
);
const SEG_ICON_PROPS = { width: "100%", height: "100%", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const SEGMENT_VIEW_OPTIONS = [
  { value: "list", label: "List", icon: <svg {...SEG_ICON_PROPS}><path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" /></svg> },
  { value: "grid", label: "Grid", icon: <svg {...SEG_ICON_PROPS}><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></svg> },
  { value: "board", label: "Board", icon: <svg {...SEG_ICON_PROPS}><rect x="2.5" y="2.5" width="3.5" height="11" rx="1" /><rect x="7" y="2.5" width="3.5" height="7" rx="1" /><rect x="11.5" y="2.5" width="2" height="9" rx="1" /></svg> },
];
const ColorPicker = dynamic(() =>
  import("../../registry/new-york/color-picker/color-picker").then((m) => m.ColorPicker),
);
const FileUpload = dynamic(() =>
  import("../../registry/new-york/file-upload/file-upload").then((m) => m.FileUpload),
);
const fakeUpload = (file: File, onProgress: (p: number) => void) =>
  new Promise<void>((resolve, reject) => {
    let pct = 0;
    const timer = setInterval(() => {
      pct += 8 + Math.random() * 14;
      if (file.name.toLowerCase().includes("fail") && pct > 55) {
        clearInterval(timer);
        reject(new Error("Network error"));
        return;
      }
      if (pct >= 100) {
        clearInterval(timer);
        onProgress(100);
        resolve();
      } else onProgress(pct);
    }, 180);
  });
const Callout = dynamic(() =>
  import("../../registry/new-york/callout/callout").then((m) => m.Callout),
);
const Meter = dynamic(() =>
  import("../../registry/new-york/meter/meter").then((m) => m.Meter),
);
function MeterLiveDemo() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);
  const cpu = [62, 91, 35, 78][tick % 4];
  const battery = [34, 12, 68, 95][tick % 4];
  const score = [82, 47, 25, 91][tick % 4];
  return (
    <div className="flex w-full max-w-[360px] flex-col items-center gap-9">
      <Meter label="CPU load" value={cpu} unit="%" low={40} high={80} goodDirection="down" width={340} />
      <Meter variant="segments" label="Battery" value={battery} unit="%" low={20} high={50} width={340} />
      <Meter variant="gauge" label="Health score" value={score} low={40} high={70} />
    </div>
  );
}
const CommandPalette = dynamic(() =>
  import("../../registry/new-york/command-palette/command-palette").then((m) => m.CommandPalette),
);
const CommandGlyph = dynamic(() =>
  import("../../registry/new-york/command-palette/command-palette").then((m) => m.CommandGlyph),
);
function CommandPaletteDemo({ theme, hotkey = true }: { theme: "dark" | "light"; hotkey?: boolean }) {
  const [open, setOpen] = React.useState(true);
  const light = theme === "light";
  return (
    <div className={`relative flex h-[520px] w-full items-center justify-center overflow-hidden rounded-xl ${light ? "bg-white" : "bg-[#080808]"}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${light ? "border-black/15 text-black/75 hover:bg-black/5" : "border-white/15 text-white/80 hover:bg-white/10"}`}
      >
        <CommandGlyph name="search" size={15} />
        Open command palette
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} theme={theme} contained hotkey={hotkey ? "k" : false} />
    </div>
  );
}
const Menubar = dynamic(() =>
  import("../../registry/new-york/menubar/menubar").then((m) => m.Menubar),
);
type MenubarMenuType = import("../../registry/new-york/menubar/menubar").MenubarMenu;
const MENUBAR_DEMO_MENUS: MenubarMenuType[] = [
  {
    id: "file",
    label: "File",
    items: [
      { id: "new", kind: "item" as const, label: "New file", shortcut: "⌘N" },
      { id: "open", kind: "item" as const, label: "Open...", shortcut: "⌘O" },
      {
        id: "open-recent",
        kind: "submenu" as const,
        label: "Open recent",
        items: [
          { id: "r1", kind: "item" as const, label: "landing-page.tsx" },
          { id: "r2", kind: "item" as const, label: "checkout-flow.tsx" },
          { id: "r3", kind: "item" as const, label: "design-system.md" },
        ],
      },
      { id: "sep1", kind: "separator" as const },
      { id: "save", kind: "item" as const, label: "Save", shortcut: "⌘S" },
      { id: "save-as", kind: "item" as const, label: "Save as...", shortcut: "⇧⌘S" },
      { id: "sep2", kind: "separator" as const },
      { id: "close", kind: "item" as const, label: "Close file", danger: true },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    items: [
      { id: "undo", kind: "item" as const, label: "Undo", shortcut: "⌘Z" },
      { id: "redo", kind: "item" as const, label: "Redo", shortcut: "⇧⌘Z", disabled: true },
      { id: "sep3", kind: "separator" as const },
      { id: "cut", kind: "item" as const, label: "Cut", shortcut: "⌘X" },
      { id: "copy", kind: "item" as const, label: "Copy", shortcut: "⌘C" },
      { id: "paste", kind: "item" as const, label: "Paste", shortcut: "⌘V" },
    ],
  },
  {
    id: "view",
    label: "View",
    items: [
      { id: "label-panels", kind: "label" as const, label: "Panels" },
      { id: "sidebar", kind: "checkbox" as const, label: "Show sidebar", checked: true },
      { id: "minimap", kind: "checkbox" as const, label: "Show minimap", checked: false },
      { id: "sep4", kind: "separator" as const },
      { id: "label-zoom", kind: "label" as const, label: "Zoom" },
      { id: "zoom-100", kind: "radio" as const, label: "100%", checked: false },
      { id: "zoom-125", kind: "radio" as const, label: "125%", checked: true },
      { id: "zoom-150", kind: "radio" as const, label: "150%", checked: false },
    ],
  },
  { id: "help", label: "Help", items: [{ id: "docs", kind: "item" as const, label: "Documentation" }, { id: "about", kind: "item" as const, label: "About" }] },
];
function MenubarDemo({ theme, size }: { theme: "dark" | "light"; size: "sm" | "md" | "lg" }) {
  const [menus, setMenus] = React.useState(MENUBAR_DEMO_MENUS);
  return (
    <Menubar
      menus={menus}
      theme={theme}
      size={size}
      onSelect={(menuId, item) => {
        if (item.kind !== "checkbox" && item.kind !== "radio") return;
        setMenus((prev) =>
          prev.map((m) =>
            m.id !== menuId
              ? m
              : {
                  ...m,
                  items: m.items.map((it) =>
                    it.id === item.id
                      ? { ...it, checked: item.kind === "checkbox" ? !it.checked : true }
                      : item.kind === "radio" && it.kind === "radio"
                        ? { ...it, checked: false }
                        : it,
                  ),
                },
          ),
        );
      }}
    />
  );
}
const Sidebar = dynamic(() =>
  import("../../registry/new-york/sidebar/sidebar").then((m) => m.Sidebar),
);
const SB_ICON_PROPS = { width: "100%", height: "100%", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const SIDEBAR_SECTIONS = [
  {
    id: "main",
    items: [
      { id: "home", label: "Home", icon: <svg {...SB_ICON_PROPS}><path d="M2 8.5L8 3L14 8.5M4 7v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" /></svg> },
      { id: "inbox", label: "Inbox", icon: <svg {...SB_ICON_PROPS}><path d="M2.5 4.5h11l1 4.5v4a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-4l1-4.5Z" /><path d="M1.5 9h4l1 2h3l1-2h4" /></svg>, badge: 4 },
      { id: "calendar", label: "Calendar", icon: <svg {...SB_ICON_PROPS}><rect x="2.5" y="3.5" width="11" height="10" rx="2" /><path d="M2.5 7h11M5.5 2v3M10.5 2v3" /></svg> },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "projects", label: "Projects", icon: <svg {...SB_ICON_PROPS}><path d="M2 4.5a1 1 0 0 1 1-1h3.5l1.3 1.7h5.2a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7.5Z" /></svg> },
      { id: "analytics", label: "Analytics", icon: <svg {...SB_ICON_PROPS}><path d="M3 13V7M8 13V3M13 13V9" /></svg>, badge: "New" },
      { id: "settings", label: "Settings", icon: <svg {...SB_ICON_PROPS}><circle cx="8" cy="8" r="2.3" /><path d="M8 2.5v2M8 11.5v2M2.5 8h2M11.5 8h2M4.4 4.4l1.4 1.4M10.2 10.2l1.4 1.4M4.4 11.6l1.4-1.4M10.2 5.8l1.4-1.4" /></svg>, disabled: true },
    ],
  },
];
function SidebarDemoStatic() {
  return (
    <Sidebar
      header="Acme"
      sections={SIDEBAR_SECTIONS}
      defaultActiveId="home"
      user={{ name: "Ada Lovelace", subtitle: "ada@acme.com" }}
      height={400}
    />
  );
}
const Dock = dynamic(() =>
  import("../../registry/new-york/dock/dock").then((m) => m.Dock),
);
const DOCK_ICON_PROPS = { width: "100%", height: "100%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const DOCK_ITEMS = [
  { id: "finder", label: "Finder", active: true, icon: <svg {...DOCK_ICON_PROPS}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><path d="M8 9.5h.01M16 9.5h.01M8 15c1.2 1 2.8 1 4 0" /></svg> },
  { id: "mail", label: "Mail", icon: <svg {...DOCK_ICON_PROPS}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 6.5L12 13L20 6.5" /></svg> },
  { id: "calendar", label: "Calendar", active: true, icon: <svg {...DOCK_ICON_PROPS}><rect x="3.5" y="4.5" width="17" height="16" rx="3" /><path d="M3.5 9.5h17M8 3v3M16 3v3" /></svg> },
  { id: "notes", label: "Notes", icon: <svg {...DOCK_ICON_PROPS}><rect x="4" y="3.5" width="16" height="17" rx="2.5" /><path d="M7.5 8.5h9M7.5 12.5h9M7.5 16.5h5.5" /></svg> },
  { id: "sep1", kind: "separator" as const },
  { id: "music", label: "Music", icon: <svg {...DOCK_ICON_PROPS}><circle cx="8" cy="17.5" r="2.5" /><circle cx="17.5" cy="15.5" r="2.5" /><path d="M10.5 17.5V6.5L20 4.5v11" /></svg> },
  { id: "photos", label: "Photos", icon: <svg {...DOCK_ICON_PROPS}><rect x="3.5" y="4" width="17" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M4 17l4.5-4.5a2 2 0 0 1 2.8 0L15 16.2M15.5 13l1.4-1.4a2 2 0 0 1 2.8 0L21 13" /></svg> },
  { id: "sep2", kind: "separator" as const },
  { id: "trash", label: "Trash", icon: <svg {...DOCK_ICON_PROPS}><path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l1 12.5a2 2 0 0 0 2 1.9h5a2 2 0 0 0 2-1.9L17.5 7" /></svg> },
];
const ConfirmDialog = dynamic(() =>
  import("../../registry/new-york/confirm-dialog/confirm-dialog").then((m) => m.ConfirmDialog),
);
function ConfirmDialogDemo({ theme, variant, async: isAsync, shouldFail }: { theme: "dark" | "light"; variant: "default" | "warning" | "danger"; async: boolean; shouldFail: boolean }) {
  const [open, setOpen] = React.useState(true);
  const light = theme === "light";
  const copy: Record<string, { title: string; description: string; confirmLabel: string }> = {
    default: { title: "Save changes?", description: "Your draft will be published and visible to everyone.", confirmLabel: "Save" },
    warning: { title: "Leave without saving?", description: "You have unsaved changes that will be lost.", confirmLabel: "Leave" },
    danger: { title: "Delete this project?", description: "This can't be undone. All files and history will be permanently removed.", confirmLabel: "Delete" },
  };
  const c = copy[variant];
  return (
    <div className={`relative flex h-[440px] w-full items-center justify-center overflow-hidden rounded-xl ${light ? "bg-white" : "bg-[#080808]"}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${light ? "border-black/15 text-black/75 hover:bg-black/5" : "border-white/15 text-white/80 hover:bg-white/10"}`}
      >
        {c.confirmLabel} project
      </button>
      <ConfirmDialog
        key={`${variant}-${isAsync}-${shouldFail}`}
        open={open}
        onOpenChange={setOpen}
        contained
        theme={theme}
        variant={variant}
        title={c.title}
        description={c.description}
        confirmLabel={c.confirmLabel}
        onConfirm={() => {
          if (!isAsync) return;
          return new Promise<void>((resolve, reject) =>
            setTimeout(() => (shouldFail ? reject(new Error("Network error. Please try again.")) : resolve()), 1400),
          );
        }}
      />
    </div>
  );
}
const HoverCard = dynamic(() =>
  import("../../registry/new-york/hover-card/hover-card").then((m) => m.HoverCard),
);
function HoverCardProfile({ theme }: { theme: "dark" | "light" }) {
  const p = theme === "light" ? { text: "#0A0A0A", muted: "rgba(10,10,10,0.6)", chip: "rgba(10,10,10,0.06)" } : { text: "#F5F4F1", muted: "rgba(245,244,241,0.6)", chip: "rgba(255,255,255,0.08)" };
  return (
    <div className="flex gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold" style={{ background: p.chip, color: p.text }}>
        AL
      </div>
      <div className="min-w-0">
        <p className="m-0 font-semibold" style={{ color: p.text, fontSize: 14.5 }}>
          Ada Lovelace
        </p>
        <p className="m-0" style={{ color: p.muted, fontSize: 13, marginTop: 2 }}>
          @ada &middot; Mathematician
        </p>
        <p className="m-0" style={{ color: p.muted, fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
          Wrote the first published algorithm intended for a computing machine, a century before computers existed.
        </p>
      </div>
    </div>
  );
}
const ContextMenu = dynamic(() =>
  import("../../registry/new-york/context-menu/context-menu").then((m) => m.ContextMenu),
);
type ContextMenuItemType = import("../../registry/new-york/context-menu/context-menu").ContextMenuItem;
const CONTEXT_MENU_ITEMS: ContextMenuItemType[] = [
  { id: "back", kind: "item", label: "Back", shortcut: "\u2318[" },
  { id: "forward", kind: "item", label: "Forward", shortcut: "\u2318]", disabled: true },
  { id: "reload", kind: "item", label: "Reload", shortcut: "\u2318R" },
  {
    id: "more",
    kind: "submenu",
    label: "More tools",
    items: [
      { id: "save-as", kind: "item", label: "Save page as...", shortcut: "\u2318S" },
      { id: "print", kind: "item", label: "Print...", shortcut: "\u2318P" },
      { id: "inspect", kind: "item", label: "Inspect" },
    ],
  },
  { id: "sep1", kind: "separator" },
  { id: "label-view", kind: "label", label: "View" },
  { id: "bookmarks", kind: "checkbox", label: "Show bookmarks bar", checked: true },
  { id: "sep2", kind: "separator" },
  { id: "delete", kind: "item", label: "Delete", danger: true },
];
function ContextMenuDemo({ theme, size }: { theme: "dark" | "light"; size: "sm" | "md" | "lg" }) {
  const [items, setItems] = React.useState(CONTEXT_MENU_ITEMS);
  const light = theme === "light";
  return (
    <ContextMenu
      items={items}
      theme={theme}
      size={size}
      onSelect={(item) => {
        if (item.kind !== "checkbox") return;
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, checked: !it.checked } : it)));
      }}
    >
      <div
        className="flex h-full w-full select-none items-center justify-center rounded-2xl border border-dashed text-sm font-medium"
        style={{ borderColor: light ? "rgba(10,10,10,0.16)" : "rgba(245,244,241,0.18)", color: light ? "rgba(10,10,10,0.5)" : "rgba(245,244,241,0.5)" }}
      >
        Right-click anywhere in this box
      </div>
    </ContextMenu>
  );
}
const Timeline = dynamic(() =>
  import("../../registry/new-york/timeline/timeline").then((m) => m.Timeline),
);
const TIMELINE_ITEMS = [
  { id: "1", date: "Jan 2024", title: "Project kicked off", description: "Assembled the founding team and set the roadmap.", status: "done" as const },
  { id: "2", date: "Mar 2024", title: "Private beta", description: "Invited 200 early users to test the core flow.", status: "done" as const },
  {
    id: "3",
    date: "Jun 2024",
    title: "Public launch",
    description: "Opened sign-ups to everyone.",
    status: "active" as const,
    content: "Launch week saw 12,000 sign-ups and coverage from three newsletters. The onboarding flow was rebuilt twice based on session recordings.",
  },
  { id: "4", date: "Sep 2024", title: "v2.0: workspaces", status: "pending" as const },
  { id: "5", date: "Nov 2024", title: "Payment provider outage", description: "A three-hour billing disruption affected new sign-ups.", status: "error" as const },
];
const TreeView = dynamic(() =>
  import("../../registry/new-york/tree-view/tree-view").then((m) => m.TreeView),
);
const TREE_VIEW_DATA = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "button.tsx" },
          { id: "card", label: "card.tsx" },
          { id: "modal", label: "modal.tsx" },
        ],
      },
      {
        id: "lib",
        label: "lib",
        children: [
          { id: "utils", label: "utils.ts" },
          { id: "constants", label: "constants.ts", disabled: true },
        ],
      },
      { id: "app", label: "app.tsx" },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [{ id: "logo", label: "logo.svg" }],
  },
  { id: "readme", label: "README.md" },
  { id: "config", label: "package.json" },
];
const StatCard = dynamic(() =>
  import("../../registry/new-york/stat-card/stat-card").then((m) => m.StatCard),
);
const STAT_CARD_ICON_PROPS = { width: "58%", height: "58%", viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
// Interpolates from `from` to `to` with a gentle wave, so the Playground's
// sparkline always tracks whatever the Value/Previous sliders are set to —
// a fixed sample array would otherwise go flat-then-spike the moment the
// slider moves away from the number it was authored around.
function statCardTrend(from: number, to: number, steps = 6): number[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const base = from + (to - from) * t;
    const wobble = Math.sin(t * Math.PI * 2.2) * Math.abs(to - from || to || 1) * 0.05;
    return Math.round(base + wobble);
  });
}
const CodeBlock = dynamic(() =>
  import("../../registry/new-york/code-block/code-block").then((m) => m.CodeBlock),
);
const CODE_BLOCK_SAMPLE = `import * as React from "react";

export function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    setPending(true);
    await onClick?.();
    setPending(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-black px-4 py-2 text-white"
    >
      {pending ? "Loading..." : label}
    </button>
  );
}
`;
const CODE_BLOCK_LONG_SAMPLE = `#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies..."
npm install

echo "Running build..."
npm run build

echo "Running tests..."
npm test -- --ci

echo "Checking bundle size..."
npx bundlesize

echo "Deploying..."
npx vercel deploy --prod

echo "Done. Deployed at $(date)."
`;
const DescriptionList = dynamic(() =>
  import("../../registry/new-york/description-list/description-list").then((m) => m.DescriptionList),
);
const DESC_LIST_ORDER_ITEMS = [
  { id: "order", term: "Order ID", description: "ORD-48213", copyable: true },
  { id: "date", term: "Date placed", description: "Sep 24, 2026" },
  { id: "status", term: "Status", description: "Delivered" },
  { id: "total", term: "Total", description: "$248.00" },
];
const DESC_LIST_SPEC_ITEMS = [
  { id: "cpu", term: "Processor", description: "M3 Pro, 12-core" },
  { id: "ram", term: "Memory", description: "36 GB unified" },
  { id: "storage", term: "Storage", description: "1 TB SSD" },
  { id: "display", term: "Display", description: "14.2\" Liquid Retina XDR" },
  { id: "battery", term: "Battery", description: "Up to 18 hours" },
  { id: "weight", term: "Weight", description: "1.6 kg" },
];
const Splitter = dynamic(() =>
  import("../../registry/new-york/splitter/splitter").then((m) => m.Splitter),
);
function SplitterPane({ label, sub, theme }: { label: string; sub: string; theme: "dark" | "light" }) {
  const light = theme === "light";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center" style={{ gap: 4, color: light ? "#0A0A0A" : "#F5F4F1" }}>
      <span className="font-semibold" style={{ fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 12, color: light ? "rgba(10,10,10,0.5)" : "rgba(245,244,241,0.5)" }}>{sub}</span>
    </div>
  );
}
const BackToTop = dynamic(() =>
  import("../../registry/new-york/back-to-top/back-to-top").then((m) => m.BackToTop),
);
function BackToTopDemo({ theme, showProgress, position }: { theme: "dark" | "light"; showProgress: boolean; position: "bottom-right" | "bottom-left" | "bottom-center" }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const light = theme === "light";
  return (
    <div ref={scrollRef} className={`relative h-full w-full overflow-y-auto rounded-xl ${light ? "bg-white" : "bg-[#080808]"}`}>
      <div className="flex flex-col items-center" style={{ gap: 16, padding: "32px 24px 420px" }}>
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="flex w-full max-w-[360px] items-center justify-center rounded-xl border"
            style={{ height: 56, borderColor: light ? "rgba(10,10,10,0.1)" : "rgba(255,255,255,0.1)", color: light ? "rgba(10,10,10,0.5)" : "rgba(245,244,241,0.5)", fontSize: 13 }}
          >
            Scroll block {i + 1}
          </div>
        ))}
      </div>
      <BackToTop containerRef={scrollRef} contained theme={theme} showProgress={showProgress} position={position} threshold={200} />
    </div>
  );
}
const CopyButton = dynamic(() =>
  import("../../registry/new-york/copy-button/copy-button").then((m) => m.CopyButton),
);
const Terminal = dynamic(() =>
  import("../../registry/new-york/terminal/terminal").then((m) => m.Terminal),
);
const TERMINAL_DEMO_LINES = [
  { id: "1", type: "command" as const, text: "npm install @acme/ui" },
  { id: "2", type: "output" as const, text: "added 42 packages in 1.8s" },
  { id: "3", type: "command" as const, text: "npm run build" },
  { id: "4", type: "comment" as const, text: "compiling for production..." },
  { id: "5", type: "output" as const, text: "Build complete. Ready to deploy." },
  { id: "6", type: "command" as const, text: "git push origin main" },
  { id: "7", type: "output" as const, text: "3 files changed, deployed to production." },
];
const InlineEdit = dynamic(() =>
  import("../../registry/new-york/inline-edit/inline-edit").then((m) => m.InlineEdit),
);
const AspectRatio = dynamic(() =>
  import("../../registry/new-york/aspect-ratio/aspect-ratio").then((m) => m.AspectRatio),
);
const ScrollArea = dynamic(() =>
  import("../../registry/new-york/scroll-area/scroll-area").then((m) => m.ScrollArea),
);
// Aspect Ratio demo content: the ratio itself, drawn inside the box it describes.
const ASPECT_PRESET_LABELS: Record<string, { ratio: string; caption: string }> = {
  square: { ratio: "1:1", caption: "Avatars, social posts" },
  video: { ratio: "16:9", caption: "HDTV, YouTube, widescreen" },
  portrait: { ratio: "3:4", caption: "Portrait photos, cards" },
  wide: { ratio: "21:9", caption: "Ultrawide, cinematic" },
  golden: { ratio: "1.618:1", caption: "Golden ratio" },
};
const ASPECT_DEMO_ITEMS = [
  { ratio: 1, label: "1:1", caption: "Square" },
  { ratio: 4 / 3, label: "4:3", caption: "SDTV, iPad" },
  { ratio: 16 / 9, label: "16:9", caption: "HDTV, YouTube", accent: true },
  { ratio: 21 / 9, label: "21:9", caption: "Ultrawide" },
  { ratio: 9 / 16, label: "9:16", caption: "Stories, Reels" },
];
function AspectRatioLabel({ ratio, theme = "dark", accentColor, size = 22 }: { ratio: string; theme?: "dark" | "light"; accentColor?: string; size?: number }) {
  const light = theme === "light";
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        border: `1.5px solid ${accentColor ?? (light ? "rgba(10,10,10,0.18)" : "rgba(255,255,255,0.18)")}`,
        borderRadius: "inherit",
        background: accentColor ? `color-mix(in srgb, ${accentColor} 8%, transparent)` : light ? "rgba(10,10,10,0.03)" : "rgba(255,255,255,0.03)",
      }}
    >
      <span className="font-semibold tracking-[-0.02em]" style={{ fontSize: size, color: accentColor ?? (light ? "#0A0A0A" : "#F5F4F1") }}>
        {ratio}
      </span>
    </div>
  );
}
function ScrollAreaListDemo({ theme }: { theme: "dark" | "light" }) {
  const light = theme === "light";
  return (
    <div className="flex flex-col" style={{ gap: 10, padding: "4px 18px 16px 4px" }}>
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className="flex items-center rounded-lg border"
          style={{ height: 44, padding: "0 14px", borderColor: light ? "rgba(10,10,10,0.1)" : "rgba(255,255,255,0.1)", color: light ? "#0A0A0A" : "#F5F4F1", fontSize: 13.5 }}
        >
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}
const Toolbar = dynamic(() =>
  import("../../registry/new-york/toolbar/toolbar").then((m) => m.Toolbar),
);
const TOOLBAR_ITEMS: import("../../registry/new-york/toolbar/toolbar").ToolbarEntry[] = [
  { type: "button", id: "undo", label: "Undo", icon: "undo", shortcut: "⌘Z" },
  { type: "button", id: "redo", label: "Redo", icon: "redo", shortcut: "⇧⌘Z", disabled: true },
  { type: "separator" },
  { type: "toggle", id: "bold", label: "Bold", icon: "bold", shortcut: "⌘B" },
  { type: "toggle", id: "italic", label: "Italic", icon: "italic", shortcut: "⌘I" },
  { type: "toggle", id: "underline", label: "Underline", icon: "underline", shortcut: "⌘U" },
  { type: "toggle", id: "strike", label: "Strikethrough", icon: "strike" },
  { type: "separator" },
  { type: "toggle", id: "left", label: "Align left", icon: "alignLeft", group: "align" },
  { type: "toggle", id: "center", label: "Align center", icon: "alignCenter", group: "align" },
  { type: "toggle", id: "right", label: "Align right", icon: "alignRight", group: "align" },
  { type: "separator" },
  { type: "button", id: "link", label: "Insert link", icon: "link", shortcut: "⌘K" },
  { type: "button", id: "image", label: "Insert image", icon: "image" },
  { type: "button", id: "share", label: "Share", icon: "share", text: "Share" },
];
function ToolbarDemo({
  theme = "dark",
  orientation = "horizontal",
  variant = "solid",
  size = "md",
  radius = 12,
  showTooltips = true,
}: {
  theme?: "dark" | "light";
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "floating" | "ghost";
  size?: "sm" | "md" | "lg";
  radius?: number;
  showTooltips?: boolean;
}) {
  const [pressed, setPressed] = React.useState<string[]>(["left"]);
  const light = theme === "light";
  const align = pressed.includes("center") ? "center" : pressed.includes("right") ? "right" : "left";
  const decorations = [pressed.includes("underline") && "underline", pressed.includes("strike") && "line-through"].filter(Boolean).join(" ");
  return (
    <div className={`flex w-full flex-col items-center gap-6 ${orientation === "vertical" ? "sm:flex-row sm:items-start sm:justify-center" : ""}`}>
      <Toolbar
        items={TOOLBAR_ITEMS}
        value={pressed}
        onValueChange={setPressed}
        orientation={orientation}
        variant={variant}
        size={size}
        radius={radius}
        showTooltips={showTooltips}
        theme={theme}
      />
      <p
        className="max-w-sm"
        style={{
          width: "100%",
          fontSize: 15,
          lineHeight: 1.6,
          textAlign: align,
          color: light ? "#0A0A0A" : "#F5F4F1",
          fontWeight: pressed.includes("bold") ? 700 : 400,
          fontStyle: pressed.includes("italic") ? "italic" : "normal",
          textDecoration: decorations || "none",
          transition: "font-weight 0.15s",
        }}
      >
        Format this sample text with the toolbar. Use the arrow keys to move between tools, and Home or End to jump to the ends.
      </p>
    </div>
  );
}
const Panel = dynamic(() =>
  import("../../registry/new-york/panel/panel").then((m) => m.Panel),
);
function PanelDemo({
  theme = "dark",
  variant = "outline",
  padding = "md",
  collapsible = true,
  dividers = true,
  accentBar = false,
  showFooter = true,
  radius = 16,
}: {
  theme?: "dark" | "light";
  variant?: "outline" | "filled" | "elevated";
  padding?: "sm" | "md" | "lg";
  collapsible?: boolean;
  dividers?: boolean;
  accentBar?: boolean;
  showFooter?: boolean;
  radius?: number;
}) {
  const light = theme === "light";
  const btn = (primary: boolean) => ({
    height: 30,
    padding: "0 12px",
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
    border: primary ? "none" : `1px solid ${light ? "rgba(10,10,10,0.14)" : "rgba(255,255,255,0.14)"}`,
    background: primary ? (light ? "#0A0A0A" : "#F5F4F1") : "transparent",
    color: primary ? (light ? "#F5F4F1" : "#0A0A0A") : light ? "#0A0A0A" : "#F5F4F1",
  });
  const rowBorder = light ? "rgba(10,10,10,0.08)" : "rgba(255,255,255,0.08)";
  return (
    <Panel
      title="Notifications"
      description="Choose what you get alerted about."
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3z M6.5 14h3" />
        </svg>
      }
      actions={<button type="button" style={btn(false)}>Reset</button>}
      footer={
        showFooter ? (
          <>
            <span style={{ marginRight: "auto" }}>3 of 4 enabled</span>
            <button type="button" style={btn(true)}>Save changes</button>
          </>
        ) : undefined
      }
      collapsible={collapsible}
      variant={variant}
      padding={padding}
      dividers={dividers}
      accentBar={accentBar}
      radius={radius}
      theme={theme}
      width={420}
    >
      <div className="flex flex-col">
        {["Product updates", "Security alerts", "Weekly digest", "Marketing"].map((label, i) => (
          <div key={label} className="flex items-center justify-between" style={{ padding: "9px 0", borderTop: i ? `1px solid ${rowBorder}` : "none", color: light ? "#0A0A0A" : "#F5F4F1" }}>
            <span>{label}</span>
            <span style={{ fontSize: 12, opacity: 0.55 }}>{i === 3 ? "Off" : "On"}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
const TAG_INPUT_SUGGESTIONS = ["React", "Vue", "Svelte", "Astro", "Next.js", "Tailwind", "TypeScript", "Motion"];
const AVATAR_GROUP_USERS = [
  { name: "Mei Tanaka", src: "/demo/112.webp" },
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Margaret Hamilton" },
  { name: "Linus Torvalds" },
  { name: "Barbara Liskov" },
];
const SEARCH_DEMO_SUGGESTIONS = [
  "Design systems",
  "Dashboard templates",
  "Pricing pages",
  "Hero sections",
  "Testimonial walls",
  "Data tables",
];
const Button = dynamic(() =>
  import("../../registry/new-york/button/button").then((m) => m.Button),
);
const Input = dynamic(() =>
  import("../../registry/new-york/input/input").then((m) => m.Input),
);
const Textarea = dynamic(() =>
  import("../../registry/new-york/textarea/textarea").then((m) => m.Textarea),
);
import type { AnimatedLoaderVariant } from "../../registry/new-york/animated-loader/animated-loader";
const AnimatedLoader = dynamic(() =>
  import("../../registry/new-york/animated-loader/animated-loader").then(
    (m) => m.AnimatedLoader,
  ),
);
const ProductGridSection = dynamic(() =>
  import("../../registry/new-york/product-grid-section/product-grid-section").then(
    (m) => m.ProductGridSection,
  ),
);
// const ContainerScrollIpad = dynamic(() => import("../../registry/new-york/container-scroll-ipad/container-scroll-ipad").then((m) => m.ContainerScrollIpad));
const AIAsistant = dynamic(() =>
  import("../../registry/new-york/ai-asistant/ai-asistant").then(
    (m) => m.AIAsistant,
  ),
);
const AiVoice01 = dynamic(() =>
  import("../../registry/new-york/ai-voice-01/ai-voice-01").then(
    (m) => m.AiVoice01,
  ),
);
const AiVoice05 = dynamic(() =>
  import("../../registry/new-york/ai-voice-05/ai-voice-05").then(
    (m) => m.AiVoice05,
  ),
);
const AiImageLoader03 = dynamic(() =>
  import("../../registry/new-york/ai-image-loader-03/ai-image-loader-03").then(
    (m) => m.AiImageLoader03,
  ),
);
const AIDynamicIsland01 = dynamic(() =>
  import("../../registry/new-york/ai-dynamic-island-01/ai-dynamic-island-01").then(
    (m) => m.AIDynamicIsland01,
  ),
);
const AiAnswer03 = dynamic(() =>
  import("../../registry/new-york/ai-answer-03/ai-answer-03").then(
    (m) => m.AiAnswer03,
  ),
);
const AIEditReview = dynamic(() =>
  import("../../registry/new-york/ai-edit-review/ai-edit-review").then(
    (m) => m.AIEditReview,
  ),
);
const VideoGlowLightbox = dynamic(() =>
  import("../../registry/new-york/video-glow-lightbox/video-glow-lightbox").then(
    (m) => m.VideoGlowLightbox,
  ),
);
const GlideCarousel = dynamic(() =>
  import("../../registry/new-york/glide-carousel/glide-carousel").then(
    (m) => m.GlideCarousel,
  ),
);
const DotImageSlider = dynamic(() =>
  import("../../registry/new-york/dot-image-slider/dot-image-slider").then(
    (m) => m.DotImageSlider,
  ),
);
const NoiseBackground = dynamic(() =>
  import("../../registry/new-york/noise-background/noise-background").then(
    (m) => m.NoiseBackground,
  ),
);
const TextScramblePro = dynamic(() =>
  import("../../registry/new-york/text-scramble-pro/text-scramble-pro").then(
    (m) => m.TextScramblePro,
  ),
);
const LinearProgressBars = dynamic(() =>
  import("../../registry/new-york/linear-progress-bars/linear-progress-bars").then(
    (m) => m.LinearProgressBars,
  ),
);
const ProgressCircleBars = dynamic(() =>
  import("../../registry/new-york/progress-circle-bars/progress-circle-bars").then(
    (m) => m.ProgressCircleBars,
  ),
);
const LiquidText = dynamic(() =>
  import("../../registry/new-york/liquid-text/liquid-text").then(
    (m) => m.LiquidText,
  ),
);
const WordReveal = dynamic(() =>
  import("../../registry/new-york/word-reveal/word-reveal").then(
    (m) => m.WordReveal,
  ),
);
import type {
  AlertBackground,
  AlertLayout,
  AlertTheme,
  AlertTone,
} from "../../registry/new-york/alert-toast/alert-toast";
const AlertToast = dynamic(() =>
  import("../../registry/new-york/alert-toast/alert-toast").then(
    (m) => m.AlertToast,
  ),
);
const ReviewCardPortrait = dynamic(() =>
  import("../../registry/new-york/review-card-portrait/review-card-portrait").then(
    (m) => m.ReviewCardPortrait,
  ),
);
const CinematicStackedGallery = dynamic(() =>
  import("../../registry/new-york/cinematic-stacked-gallery/cinematic-stacked-gallery").then(
    (m) => m.CinematicStackedGallery,
  ),
);
const DiceRollDiscountPopup = dynamic(() =>
  import("../../registry/new-york/dice-roll-discount-popup/dice-roll-discount-popup").then(
    (m) => m.DiceRollDiscountPopup,
  ),
);
const WheelSpinDiscountPopup = dynamic(() =>
  import("../../registry/new-york/wheel-spin-discount-popup/wheel-spin-discount-popup").then(
    (m) => m.WheelSpinDiscountPopup,
  ),
);

// Maps a registry item slug to a rendered preview. Kept separate from
// catalog-data.ts (plain metadata, safe for server components) because this
// file imports actual component code and example props.
//
const TEAM_DRAWER_MEMBERS = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    image: "/demo/49.webp",
    bio: "Sarah is a passionate product designer with over 8 years of experience in creating user-centric digital experiences.",
    detail:
      "When she's not designing, you can find her exploring local coffee shops or hiking in the mountains.",
    tags: ["UI/UX", "Design Systems", "Prototyping"],
    socials: {
      twitter: "sarahchen",
      github: "sarahchen",
      linkedin: "sarahchen",
    },
    accentHue: 24,
  },
  {
    name: "Marcus Liu",
    role: "Senior Engineer",
    image: "/demo/42.webp",
    bio: "Marcus brings 10+ years of full-stack engineering expertise, with deep roots in distributed systems and API architecture.",
    detail:
      "A weekend climber and open source contributor who believes every bug has a story worth reading.",
    tags: ["Backend", "APIs", "Distributed Systems"],
    socials: {
      twitter: "marcusliu",
      github: "marcusliu",
      linkedin: "marcusliu",
    },
    accentHue: 210,
  },
  {
    name: "Yuki Tanaka",
    role: "Data Scientist",
    image: "/demo/50.webp",
    bio: "Yuki transforms messy datasets into elegant insights. With a PhD in applied mathematics, she bridges raw numbers and human understanding.",
    detail: "Obsessed with origami, jazz piano, and the perfect matcha ratio.",
    tags: ["Machine Learning", "Analytics", "Python"],
    socials: {
      twitter: "yukitan",
      github: "yukitanaka",
      linkedin: "yukitanaka",
    },
    accentHue: 158,
  },
  {
    name: "Daniel Osei",
    role: "Frontend Lead",
    image: "/demo/51.webp",
    bio: "Daniel crafts pixel-perfect interfaces that delight users across every device. He champions accessibility and performance as first-class features.",
    detail:
      "Afrobeat enthusiast and sourdough baker who once live-coded a UI at a hackathon while asleep (allegedly).",
    tags: ["React", "Accessibility", "Performance"],
    socials: {
      twitter: "danielosei",
      github: "danielosei",
      linkedin: "danielosei",
    },
    accentHue: 280,
  },
];

const IMAGE_SHOWCASE_IMAGES = [
  { src: "/demo/36.webp", alt: "Showcase 1" },
  { src: "/demo/37.webp", alt: "Showcase 2" },
  { src: "/demo/38.webp", alt: "Showcase 3" },
  { src: "/demo/39.webp", alt: "Showcase 4" },
  { src: "/demo/40.webp", alt: "Showcase 5" },
];

const HOVER_GALLERY_IMAGES = [
  {
    url: "/demo/26.webp",
    title: "Full Gallop",
    subtitle: "Motion in monochrome",
    tag: "Photography",
    description:
      "A dressage rider caught mid-stride in dramatic black and white, the motion blur turning horse and rider into a single fluid silhouette against a stark white backdrop.",
  },
  {
    url: "/demo/28.webp",
    title: "In Stroke",
    subtitle: "A rower's rhythm, blurred",
    tag: "Photography",
    description:
      "A solitary rower silhouetted mid-stroke, the horizontal motion blur stretching the scull and oar across a pale, minimal backdrop to suggest speed.",
  },
  {
    url: "/demo/24.webp",
    title: "The Lift",
    subtitle: "Power under blur",
    tag: "Photography",
    description:
      "A weightlifter caught in the explosive moment of a barbell lift, motion blur radiating from the spinning plates to convey raw strength.",
  },
  {
    url: "/demo/27.webp",
    title: "Walking Out",
    subtitle: "Pit crew, in step",
    tag: "Photography",
    description:
      "A row of team members walking in formation, motion blur blending their silhouettes together to capture a shared sense of purpose.",
  },
  {
    url: "/demo/34.webp",
    title: "Time Trial",
    subtitle: "Speed, low and lean",
    tag: "Photography",
    description:
      "A cyclist in aerodynamic tuck racing forward, motion blur streaking the spinning wheels to capture the pure velocity of a solo time trial.",
  },
  {
    url: "/demo/23.webp",
    title: "The Ascent",
    subtitle: "One step at a time",
    tag: "Photography",
    description:
      "A hiker with backpack and trekking pole silhouetted against the ridgeline, motion blur capturing the steady rhythm of climbing a steep mountain trail.",
  },
  {
    url: "/demo/30.webp",
    title: "Push to the Limit",
    subtitle: "Sled work, full effort",
    tag: "Photography",
    description:
      "An athlete driving a weighted sled forward with full-body effort, motion blur emphasizing the explosive push.",
  },
  {
    url: "/demo/31.webp",
    title: "Full Sprint",
    subtitle: "Speed at its peak",
    tag: "Photography",
    description:
      "A sprinter frozen mid-stride at full extension, motion blur trailing off the limbs to capture the explosive power and speed of a dead sprint.",
  },
  {
    url: "/demo/33.webp",
    title: "Breaking Through",
    subtitle: "Stroke by stroke",
    tag: "Photography",
    description:
      "A swimmer mid-stroke breaking the water's surface, motion blur and splash merging into a single dynamic form that captures the rhythm.",
  },
  {
    url: "/demo/29.webp",
    title: "Chasing Pace",
    subtitle: "Stride in motion",
    tag: "Photography",
    description:
      "A female runner mid-stride with hair and limbs trailing in motion blur, her ponytail whipping behind her to capture the speed.",
  },
  {
    url: "/demo/25.webp",
    title: "Downhill Carve",
    subtitle: "Snow in motion",
    tag: "Photography",
    description:
      "A skier carving down a slope with poles trailing, motion blur and spraying snow capturing the speed and precision of a downhill turn.",
  },
  {
    url: "/demo/32.webp",
    title: "The Strike",
    subtitle: "Impact in motion",
    tag: "Photography",
    description:
      "A footballer captured at the exact moment of impact, motion blur streaking through his kicking leg and the ball to convey the speed.",
  },
];

const BLOG_CARD_HORIZONTAL_TAG_STYLE = {
  color: "rgba(255,255,255,0.85)",
  bg: "rgba(255,255,255,0.08)",
};

const BLOG_CARD_HORIZONTAL_POSTS = [
  {
    mediaType: "video" as const,
    video: "/demo/14.mp4",
    category: "Athletic Performance",
    title: "The Art of Movement: How Athletes Train Their Mind and Body as One",
    excerpt:
      "Discover how elite performers use discipline, breath, and intentional movement to unlock peak physical and mental clarity.",
    tags: [
      { label: "Movement", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
      { label: "Performance", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
      { label: "Mindset", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
    ],
  },
  {
    image: "/demo/25.webp",
    category: "Winter Sports",
    title:
      "Carving the Mountain: What Skiing Teaches You About Controlled Risk",
    excerpt:
      "Every turn down the slope is a split-second decision. Here's how elite skiers train their instincts to read terrain faster than fear can react.",
    tags: [
      { label: "Skiing", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
      { label: "Winter", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
      { label: "Performance", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
    ],
  },
  {
    mediaType: "video" as const,
    video: "/demo/15.mp4",
    category: "Sport & Mind",
    title: "The Ball Doesn't Lie, And Neither Does the Work You Put In",
    excerpt:
      "Every great player has a version of this moment, alone with the ball, the court empty, the pressure self-made. This is where it's built.",
    tags: [
      { label: "Basketball", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
      { label: "Mindset", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
      { label: "Training", ...BLOG_CARD_HORIZONTAL_TAG_STYLE },
    ],
  },
];

const BLOG_CARD_VERTICAL_TAG_STYLE = {
  color: "rgba(255,255,255,0.85)",
  bg: "rgba(255,255,255,0.08)",
};

const BLOG_CARD_VERTICAL_POSTS = [
  {
    mediaType: "video" as const,
    video: "/demo/16.mp4",
    category: "Movement & Mindfulness",
    title: "The Body Knows First: How Movement Rewires the Mind",
    excerpt:
      "Before the mind catches up, the body is already responding. Explore how intentional movement can quiet the mind before language ever gets involved.",
    tags: [
      { label: "Movement", ...BLOG_CARD_VERTICAL_TAG_STYLE },
      { label: "Mindfulness", ...BLOG_CARD_VERTICAL_TAG_STYLE },
      { label: "Body & Mind", ...BLOG_CARD_VERTICAL_TAG_STYLE },
    ],
  },
  {
    mediaType: "video" as const,
    video: "/demo/17.mp4",
    category: "Flexibility & Strength",
    title: "The Bridge Pose: Where Power Meets Surrender",
    excerpt:
      "Few movements demand as much from the body as the full backbend, open chest, strong legs, and total trust in the release.",
    tags: [
      { label: "Flexibility", ...BLOG_CARD_VERTICAL_TAG_STYLE },
      { label: "Strength", ...BLOG_CARD_VERTICAL_TAG_STYLE },
      { label: "Performance", ...BLOG_CARD_VERTICAL_TAG_STYLE },
    ],
  },
  {
    mediaType: "video" as const,
    video: "/demo/18.mp4",
    category: "Cycling",
    title: "Inside the Pain Cave: What Cyclists Know About Pushing Limits",
    excerpt:
      "At a certain point, the legs stop being the problem. Every serious cyclist knows the real limit lives somewhere else entirely.",
    tags: [
      { label: "Zone 2", ...BLOG_CARD_VERTICAL_TAG_STYLE },
      { label: "Cycling", ...BLOG_CARD_VERTICAL_TAG_STYLE },
      { label: "Endurance", ...BLOG_CARD_VERTICAL_TAG_STYLE },
    ],
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
// Six media cards: videos 14 / 17 / 16, photos 34 (cyclist), 31 (sprinter), 12 (skier).
const INDEX_GRID_SECTION_ITEMS = [
  {
    title: "Motion Begins Within",
    description:
      "Performance begins long before the finish. It lives in discipline, control, and the relentless pursuit of the next mile.",
    mediaType: "video" as const,
    video: "/demo/14.mp4",
  },
  {
    title: "Speed is a state of mind.",
    description:
      "Every pedal stroke is a conversation between body and machine. Push past the threshold, that's where performance lives.",
    mediaType: "image" as const,
    image: "/demo/34.webp",
  },
  {
    title: "Move Beyond Stillness.",
    description:
      "Every ascent tests your resolve. Every descent rewards your trust. The ride is where strength becomes effortless.",
    mediaType: "video" as const,
    video: "/demo/17.mp4",
  },
  {
    title: "Run like the finish line doesn't exist.",
    description:
      "Stride, breathe, repeat. The blur in the frame is proof you were moving too fast to be contained.",
    mediaType: "image" as const,
    image: "/demo/31.webp",
  },
  {
    title: "Momentum, Perfected.",
    description:
      "The road rewards consistency, not shortcuts. Every mile refines your strength, every climb reveals your potential.",
    mediaType: "video" as const,
    video: "/demo/16.mp4",
  },
  {
    title: "The mountain doesn't wait.",
    description:
      "Gravity is the opponent. Technique is the answer. Lean in, hold your line, and trust the edge.",
    mediaType: "image" as const,
    image: "/demo/12.webp",
  },
];

// Motion-blur sports series from /demo: 34 cyclist, 28 rower, 33 swimmer, 31 sprinter, 25 skier,
// 11 swimmer, 12 skier, 32 footballer, 30 sled push. Dealt into three columns by index.
const HERO_SCROLL_GALLERY_IMAGES = [
  "34",
  "28",
  "33",
  "31",
  "25",
  "11",
  "12",
  "32",
  "30",
].map((n) => "/demo/" + n + ".webp");
const HERO_SCROLL_GALLERY_PARTNERS = [
  { name: "Sportlife" },
  { name: "Dexin" },
  { name: "Stryda" },
  { name: "Sportix" },
];

// One story per photo: 27 team walk-out, 28 rower, 31 sprinter, 32 footballer.
const STORY_VIEWER_STORIES = [
  {
    src: "/demo/27.webp",
    type: "image" as const,
    duration: 5,
    label: "Team Walk-Out",
    sublabel: "Behind the scenes · Matchday",
    ctaLabel: "See the series",
    ctaLink: "#",
  },
  {
    src: "/demo/28.webp",
    type: "image" as const,
    duration: 5,
    label: "Single Scull",
    sublabel: "Training log · Dawn session",
    ctaLabel: "Read the story",
    ctaLink: "#",
  },
  {
    src: "/demo/31.webp",
    type: "image" as const,
    duration: 5,
    label: "Full Sprint",
    sublabel: "Track series · Speed work",
    ctaLabel: "Watch the run",
    ctaLink: "#",
  },
  {
    src: "/demo/32.webp",
    type: "image" as const,
    duration: 5,
    label: "The Strike",
    sublabel: "Matchday · Motion study",
    ctaLabel: "",
    ctaLink: "",
  },
];

// Shared by the CurvedNavCarousel previews.
const CURVED_NAV_ITEMS = [
  {
    video: "/demo/18.mp4",
    title: "Night Ride",
    description: "Motion, focus, and quiet speed.",
  },
  {
    video: "/demo/17.mp4",
    title: "Stillness",
    description: "The pause between efforts.",
  },
  {
    video: "/demo/16.mp4",
    title: "Shadow Run",
    description: "Chasing your own silhouette.",
  },
  {
    image: "/demo/109.webp",
    title: "Full Sprint",
    description: "Every stride counts.",
  },
  {
    image: "/demo/102.webp",
    title: "Single Scull",
    description: "Dawn session on still water.",
  },
];

// Shared by both CoverflowServicesHero previews.
const COVERFLOW_HERO_PROPS = {
  eyebrow: "discover",
  heading: "push your limits",
  description:
    "Strength and discipline live in every rep. Explore with our application to master your training.",
  buttonText: "download app",
  exploreButtonText: "explore now",
  slides: [
    {
      title: "Velocity",
      tag: "Cycling",
      description: "Ride harder, ride further, ride free.",
      link: "#",
      image: "/demo/108.webp",
    },
    {
      title: "Sprint",
      tag: "Running",
      description:
        "Every stride counts. Break your limits, one step at a time.",
      link: "#",
      image: "/demo/109.webp",
    },
    {
      title: "Flow",
      tag: "Swimming",
      description: "Glide through the water with power and control.",
      link: "#",
      image: "/demo/110.webp",
    },
  ],
};

// Shared by both PhoneMockup previews: a 3-clip swipeable reel.
const PHONE_MOCKUP_MEDIA = [
  { type: "video" as const, src: "/demo/SocialMedia05.mp4" },
  { type: "video" as const, src: "/demo/SocialMedia03.mp4" },
  { type: "video" as const, src: "/demo/SocialMedia06.mp4" },
];

// Shared by both PhoneAnalyticsMockup previews: the SocialMedia03 clip, the avatar cropped from it
// (public/demo/avatar-miroslava.jpg), and a single floating Conversion Rate card.
const PHONE_ANALYTICS_MOCKUP_PROPS = {
  media: {
    video1: "/demo/SocialMedia03.mp4",
    order: ["V1" as const],
    loop: true,
  },
  username: "Miroslava",
  userAvatar: "/demo/avatar-miroslava.jpg",
  showVerified: true,
  overlayText: "",
  overlaySub: "",
  trackingCard: { show: false },
  leftStatCard: { show: false },
  rightStatCard: {
    show: true,
    title: "Conversion Rate",
    value: "14.3%",
    badge: "↗ 23%",
    positive: true,
  },
  revenueCard: { show: false },
};

// One title per photo, in order: 23 hiker, 24 weightlifter, 25 skier, 27 team walk, 28 rower,
// 31 sprinter, 32 footballer, 33 swimmer, 34 cyclist.
const TILTED_CAROUSEL_SLIDES = [
  { src: "/demo/23.webp", title: "steady ascent" },
  { src: "/demo/24.webp", title: "raw strength" },
  { src: "/demo/25.webp", title: "downhill carve" },
  { src: "/demo/27.webp", title: "team walk-out" },
  { src: "/demo/28.webp", title: "single scull" },
  { src: "/demo/31.webp", title: "full sprint" },
  { src: "/demo/32.webp", title: "the strike" },
  { src: "/demo/33.webp", title: "open water" },
  { src: "/demo/34.webp", title: "time trial" },
];

const GALLERY_LIGHTBOX_IMAGES = [
  {
    src: "/demo/26.webp",
    alt: "Dressage rider in motion blur",
    title: "Full Gallop",
    description:
      "A dressage rider caught mid-stride in dramatic black and white, the motion blur turning horse and rider into a single fluid silhouette against a stark white backdrop.",
    tag: "Photography",
  },
  {
    src: "/demo/28.webp",
    alt: "Rower silhouetted mid-stroke",
    title: "In Stroke",
    description:
      "A solitary rower silhouetted mid-stroke, the horizontal motion blur stretching the scull and oar across a pale, minimal backdrop to suggest speed.",
    tag: "Photography",
  },
  {
    src: "/demo/24.webp",
    alt: "Weightlifter mid-lift",
    title: "The Lift",
    description:
      "A weightlifter caught in the explosive moment of a barbell lift, motion blur radiating from the spinning plates to convey raw strength.",
    tag: "Photography",
  },
  {
    src: "/demo/27.webp",
    alt: "Team members walking in formation",
    title: "Walking Out",
    description:
      "A row of team members walking in formation, motion blur blending their silhouettes together to capture.",
    tag: "Photography",
  },
  {
    src: "/demo/23.webp",
    alt: "Hiker climbing a ridgeline",
    title: "The Ascent",
    description:
      "A hiker with backpack and trekking pole silhouetted against the ridgeline, motion blur capturing the steady rhythm of climbing a steep mountain trail.",
    tag: "Photography",
  },
  {
    src: "/demo/30.webp",
    alt: "Athlete pushing a weighted sled",
    title: "Push to the Limit",
    description:
      "An athlete driving a weighted sled forward with full-body effort, motion blur emphasizing the explosive push.",
    tag: "Photography",
  },
];

// One quote per photo: 28 = rower, 12 = skier, 11 = swimmer.
const TESTIMONIAL_SLIDER_ITEMS = [
  {
    quote:
      "Not a stroke wasted. They keep the pace calm and precise, all the way to the finish line.",
    authorName: "James Harrington",
    authorRole: "Head Coach, Northwater Rowing Club",
    image: "/demo/28.webp",
    rating: 5,
  },
  {
    quote:
      "They carve through every challenge like it isn't there, sharp instincts, zero hesitation.",
    authorName: "Elena Marsh",
    authorRole: "Team Manager, Alpine Edge Racing",
    image: "/demo/12.webp",
    rating: 5,
  },
  {
    quote:
      "Full speed without losing form. Seeing the plan come together this fast surprised even me.",
    authorName: "David Kolbe",
    authorRole: "Performance Director, Open Water Club",
    image: "/demo/11.webp",
    rating: 5,
  },
];

// LogoSpin's default center title is near-black (#111) — invisible on the dark
// preview canvas — so follow the page foreground instead.
const LOGO_SPIN_THEME_PROPS = {
  centerTextColor: "var(--foreground)",
  centerBorderColor: "color-mix(in srgb, var(--foreground) 30%, transparent)",
} as const;

export const registryPreviews: Record<string, () => React.ReactNode> = {
  "countdown-timer": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <CountdownTimer endDate={oneWeekFromNow()} />
    </div>
  ),
  "cosmic-background": () => (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <CosmicBackground />
    </div>
  ),
  "toggle-pro": () => (
    <div className="flex h-[400px] w-full flex-wrap items-center justify-center gap-x-14 gap-y-10 rounded-xl bg-[#080808] p-6">
      <TogglePro
        {...TOGGLE_DEMO_COLORS}
        trackOnColor={DEMO_ACCENTS.violet}
        width={80}
        height={46}
        padding={5}
        defaultChecked
      />
      <TogglePro
        {...TOGGLE_DEMO_COLORS}
        trackOnColor={DEMO_ACCENTS.green}
        width={80}
        height={46}
        padding={5}
        defaultChecked
      />
      <TogglePro
        {...TOGGLE_DEMO_COLORS}
        trackOnColor={DEMO_ACCENTS.orange}
        width={80}
        height={46}
        padding={5}
      />
    </div>
  ),
  "badges-kit": () => (
    <div className="flex h-[400px] w-full flex-wrap content-center items-center justify-center gap-4 rounded-xl bg-[#080808] p-6">
      <Badge label="Paid" tone="success" icon="check" size="xl" theme="dark" />
      <Badge
        label="Rejected"
        tone="error"
        icon="cross"
        size="xl"
        theme="dark"
      />
      <Badge
        label="Processing"
        tone="info"
        icon="spinner"
        size="xl"
        theme="dark"
      />
      <Badge label="Pending" tone="warning" icon="dot" size="xl" theme="dark" />
      <Badge label="Trial" tone="purple" size="xl" theme="dark" />
      <Badge label="Beta" tone="orange" size="xl" theme="dark" />
    </div>
  ),
  "rating-stars": () => <RatingStars defaultValue={4} />,
  "image-deck-3d": () => (
    <div className="flex w-full items-center justify-center rounded-xl bg-[#080808] px-6 py-[50px]">
      <div className="aspect-square w-full max-w-[500px]">
        <ImageDeck3D image="/demo/2.webp" enable3D idleAnimation />
      </div>
    </div>
  ),
  "glare-card": () => (
    <div className="flex w-full items-center justify-center rounded-xl bg-[#080808] px-6 py-[50px]">
      <div className="aspect-square w-full max-w-[500px]">
        <GlareCard
          title="Glare Card"
          subtitle="Cursor-reactive tilt & reflections."
          image="/demo/21.webp"
        />
      </div>
    </div>
  ),
  "infinite-marquee": () => (
    <div className="flex h-[400px] w-full items-center overflow-hidden rounded-xl bg-[#080808]">
      <InfiniteMarquee
        text="ReactFrame"
        separator="✦"
        fontSize={32}
        textColor="var(--foreground)"
        separatorColor="var(--foreground)"
      />
    </div>
  ),
  "discord-chat-widget": () => (
    <div className="flex justify-end pt-[560px]">
      <DiscordChatWidget
        inviteCode="reactframe"
        fixed={false}
        position="bottom-right"
        popupDelay={0}
        autoOpenDelay={0}
      />
    </div>
  ),
  "telegram-widget": () => (
    <div className="flex justify-end pt-[540px]">
      <TelegramWidget
        username="reactframe"
        fixed={false}
        position="bottom-right"
        popupDelay={0}
        autoOpenDelay={0}
      />
    </div>
  ),
  "messenger-widget": () => (
    <div className="flex justify-end pt-[540px]">
      <MessengerWidget
        pageId="reactframe"
        fixed={false}
        position="bottom-right"
        popupDelay={0}
        autoOpenDelay={0}
      />
    </div>
  ),
  "x-twitter-widget": () => (
    <div className="flex justify-end pt-[540px]">
      <XTwitterWidget
        agentHandle="reactframe"
        fixed={false}
        position="bottom-right"
        popupDelay={0}
        autoOpenDelay={0}
      />
    </div>
  ),
  "footer-premium": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <FooterPremium showBadge showPill />
    </div>
  ),
  "footer-section": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <FooterSection />
    </div>
  ),
  "your-cart-page": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <YourCartPage items={YOUR_CART_ITEMS} defaultValues={YOUR_CART_FORM} />
    </div>
  ),
  "stat-feature": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <StatFeature {...STAT_FEATURE_PROPS} />
    </div>
  ),
  "product-list": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <ProductList products={PRODUCT_LIST_ITEMS} />
    </div>
  ),
  "product-detail": () => (
    <div className="w-full overflow-hidden rounded-xl">
      <ProductDetail
        breadcrumb={["Home", "Shop", "Accessories", "Minimal Watch"]}
        title="Minimal Watch"
        rating={5}
        reviewCount={124}
        price="$79.00"
        compareAtPrice="$129.00"
        description="A quiet, matte-black watch with a slim case and a soft leather strap. Designed to disappear on the wrist and go with everything."
        longDescription="A quiet, matte-black watch with a slim case and a soft leather strap. Designed to disappear on the wrist and go with everything, from a desk to a dinner."
        reviewsBody="Customers love the slim profile, the soft strap and how little attention the watch asks for."
        gallery={PRODUCT_DETAIL_GALLERY}
        colors={PRODUCT_DETAIL_COLORS}
        sizes={PRODUCT_DETAIL_SIZES}
        defaultSizeIndex={2}
        specs={PRODUCT_DETAIL_SPECS}
        badge="Free shipping"
      />
    </div>
  ),
  "compare-slider": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <CompareSlider
        beforeImage="/demo/compare1.webp"
        afterImage="/demo/compare2.webp"
        className="h-full"
      />
    </div>
  ),
  "glow-card": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <div className="h-[300px] w-72 max-w-full">
        <GlowCard backgroundImage="/demo/22.webp" text="Amelia Hartwell" />
      </div>
    </div>
  ),
  "image-showcase": () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-[#080808]">
        <ImageShowcase
          height={340}
          showReset={false}
          images={IMAGE_SHOWCASE_IMAGES}
        />
      </div>
    </div>
  ),
  "eternal-glow-card": () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <div className="h-[400px] w-72 max-w-full">
        <EternalGlowCard />
      </div>
    </div>
  ),
  "glass-navigation": () => (
    <div className="flex h-[500px] w-full justify-center rounded-xl bg-[#080808] px-6 pt-8">
      <div className="h-full w-full max-w-2xl">
        <GlassNavigation cta={GLASS_NAV_DEMO_CTA.light} navFontSize={48} />
      </div>
    </div>
  ),
  "header-simple": () => (
    <div className="h-[440px] w-full overflow-hidden rounded-xl border border-border bg-[#080808] px-6 pt-8">
      <HeaderSimple />
    </div>
  ),
  "testimonial-logos": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-border bg-[#080808] px-8">
      <div className="w-full max-w-[520px]">
        <TestimonialLogos />
      </div>
    </div>
  ),
  "dice-discount-popup": () => (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-card p-8">
      <div className="w-full max-w-[380px]">
        <DiceDiscountPopup />
      </div>
    </div>
  ),
  "scratch-card-popup": () => (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-card p-8">
      <div className="w-full max-w-[380px]">
        <ScratchCardPopup />
      </div>
    </div>
  ),
  "business-hours": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <BusinessHours />
    </div>
  ),
  "motion-gallery-grid": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-[#080808]">
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
  "error-404-page-section": () => (
    <div className="h-[640px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <Error404PageSection
        theme="dark"
        showThemeToggle
        secondaryLabel="Browse components"
        className="h-full"
      />
    </div>
  ),
  "airbnb-reviews": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <AirbnbReviews />
    </div>
  ),
  "ebay-reviews": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <EbayReviews />
    </div>
  ),
  "etsy-reviews": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <EtsyReviews />
    </div>
  ),
  "coin-flip-game": () => (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-[#080808] p-8">
      <div className="w-full max-w-[360px]">
        <CoinFlipGame />
      </div>
    </div>
  ),
  "tic-tac-toe-game": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "enableAI",
          label: "AI Opponent",
          defaultValue: true,
        },
        {
          type: "select",
          key: "aiDifficulty",
          label: "Difficulty",
          options: ["easy", "medium", "hard"],
          optionLabels: ["Easy", "Medium", "Hard"],
          defaultValue: "medium",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[460px] p-4" : "p-6",
          )}
        >
          <div className={cn(v.asPopup ? "relative h-full w-full" : "")}>
            <TicTacToeGame
              enableAI={v.enableAI as boolean}
              aiDifficulty={v.aiDifficulty as "easy" | "medium" | "hard"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "2048-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["classic", "neon", "gold", "night"],
          optionLabels: ["Classic", "Neon", "Gold", "Night"],
          defaultValue: "classic",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[520px] p-4" : "p-8",
          )}
        >
          <div
            className={cn(
              v.asPopup ? "relative h-full w-full" : "w-full max-w-[360px]",
            )}
          >
            <Game2048
              theme={v.theme as "classic" | "neon" | "gold" | "night"}
              lightMode={v.lightMode === "light"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "snake-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["classic", "violet", "retro"],
          optionLabels: ["Classic", "Violet", "Retro"],
          defaultValue: "classic",
        },
        {
          type: "select",
          key: "defaultDifficulty",
          label: "Difficulty",
          options: ["easy", "medium", "hard"],
          optionLabels: ["Easy", "Medium", "Hard"],
          defaultValue: "medium",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-card",
            v.asPopup ? "h-[460px] p-4" : "p-8",
          )}
        >
          <div
            className={cn(
              v.asPopup ? "relative h-full w-full" : "w-full max-w-[360px]",
            )}
          >
            <SnakeGame
              theme={v.theme as "classic" | "violet" | "retro"}
              defaultDifficulty={
                v.defaultDifficulty as "easy" | "medium" | "hard"
              }
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "minesweeper-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["night", "neon", "gold", "tide"],
          optionLabels: ["Night", "Neon", "Gold", "Tide"],
          defaultValue: "night",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "difficulty",
          label: "Difficulty",
          options: ["beginner", "intermediate", "expert"],
          optionLabels: ["Beginner", "Medium", "Expert"],
          defaultValue: "beginner",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[560px] p-4" : "p-8",
          )}
        >
          <div
            className={cn(
              v.asPopup ? "relative h-full w-full" : "w-full max-w-[420px]",
            )}
          >
            <MinesweeperGame
              theme={v.theme as "night" | "neon" | "gold" | "tide"}
              lightMode={v.lightMode === "light"}
              difficulty={
                v.difficulty as "beginner" | "intermediate" | "expert"
              }
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "memory-match-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["night", "neon", "gold", "tide"],
          optionLabels: ["Night", "Neon", "Gold", "Tide"],
          defaultValue: "night",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[560px] p-4" : "p-8",
          )}
        >
          <div
            className={cn(
              v.asPopup ? "relative h-full w-full" : "w-full max-w-[420px]",
            )}
          >
            <MemoryMatchGame
              theme={v.theme as "night" | "neon" | "gold" | "tide"}
              lightMode={v.lightMode === "light"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "pong-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["arcade", "neon", "tournament", "classic"],
          optionLabels: ["Arcade", "Neon", "Tournament", "Classic"],
          defaultValue: "arcade",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[600px] p-4" : "p-8",
          )}
        >
          <div
            className={cn(
              v.asPopup ? "relative h-full w-full" : "w-full max-w-[420px]",
            )}
          >
            <PongGame
              theme={v.theme as "arcade" | "neon" | "tournament" | "classic"}
              lightMode={v.lightMode === "light"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "dino-runner-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "defaultDifficulty",
          label: "Difficulty",
          options: ["easy", "medium", "hard"],
          optionLabels: ["Easy", "Medium", "Hard"],
          defaultValue: "medium",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-card",
            v.asPopup ? "h-[460px] p-4" : "p-6",
          )}
        >
          <div className={cn(v.asPopup ? "relative h-full w-full" : "w-full")}>
            <DinoRunnerGame
              defaultDifficulty={
                v.defaultDifficulty as "easy" | "medium" | "hard"
              }
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "space-invaders-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[600px] p-4" : "p-6",
          )}
        >
          <div className={cn(v.asPopup ? "relative h-full w-full" : "w-full")}>
            <SpaceInvadersGame
              lightMode={v.lightMode === "light"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "glow-jump-widget": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[560px] p-4" : "p-6",
          )}
        >
          <GlowJumpWidget
            asPopup={Boolean(v.asPopup)}
            position="bottom-right"
          />
        </div>
      )}
    </Playground>
  ),
  "spin-to-win-wheel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["ecommerce", "campaign", "restaurant", "saas", "event"],
          optionLabels: [
            "Ecommerce",
            "Campaign",
            "Restaurant",
            "SaaS",
            "Event",
          ],
          defaultValue: "ecommerce",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[720px] p-4" : "p-8",
          )}
        >
          <div className="w-full max-w-[420px]">
            <SpinToWinWheel
              theme={
                v.theme as
                  "ecommerce" | "campaign" | "restaurant" | "saas" | "event"
              }
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "memory-cards-widget": () => (
    <div className="relative flex h-[560px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] border border-border p-6">
      <MemoryCardsWidget />
    </div>
  ),
  "bubble-cursor": () => (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-border bg-[#080808]">
      <BubbleCursor showThemeToggle={false} hideOnTouch={false} />
    </div>
  ),
  "testimonial-spotlight": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <TestimonialSpotlight />
    </div>
  ),
  "testimonial-pills": () => (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-[#080808] p-6">
      <TestimonialPills
        rowCount={4}
        items={TESTIMONIAL_PILLS_ITEMS}
        spotlight={false}
        depthBlur={false}
      />
    </div>
  ),
  "profile-flip-card": () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <div className="h-[450px] w-[340px] max-w-full">
        <ProfileFlipCard
          src="/demo/32.webp"
          name="Zara Osei"
          role="Creative Director"
          bio="Design is like a perfect strike, you only get one shot to make an impression. I craft brands that move fast, hit hard, and leave something behind."
          tag="Design"
        />
      </div>
    </div>
  ),
  "phone-mockup": () => (
    <div className="h-[700px] w-full overflow-hidden">
      <PhoneMockup media={PHONE_MOCKUP_MEDIA} />
    </div>
  ),
  "browser-mockup": () => (
    <div className="h-[700px] w-full">
      <BrowserMockup
        url="reactframe.com"
        pageTitle="ReactFrame"
        tabCount={2}
        media="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80"
      />
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
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-[#080808] px-6 py-10">
      <div className="w-[315px]">
        <TikTokPostMockup
          background="/demo/112.webp"
          userAvatar="/demo/112.webp"
          description="Good morning!"
        />
      </div>
    </div>
  ),
  "linkedin-post-mockup": () => (
    <div className="flex w-full items-center justify-center py-10">
      <div className="w-[420px] max-w-full">
        <LinkedInPostMockup mediaImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" />
      </div>
    </div>
  ),
  "cylinder-gallery": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
      <CylinderGallery
        rows={2}
        columns={7}
        cylinderRadius={260}
        cardWidth={220}
        cardHeight={160}
      />
    </div>
  ),
  "gallery-flow": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
      <GalleryFlow backgroundColor="#080808" />
    </div>
  ),
  "tilted-carousel": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <TiltedCarousel slides={TILTED_CAROUSEL_SLIDES} />
    </div>
  ),
  "diagonal-carousel": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <DiagonalCarousel cardSize={180} />
    </div>
  ),
  "tilt-text": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <TiltText fontSize={80} />
    </div>
  ),
  "logo-marquee": () => (
    <div className="flex h-[700px] w-full items-center overflow-hidden rounded-xl bg-[#080808] border border-border">
      <LogoMarquee />
    </div>
  ),
  "bar-chart": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
      <div className="w-full max-w-[720px]">
        <BarChart chartHeight={420} />
      </div>
    </div>
  ),
  "line-chart": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
      <div className="w-full max-w-[720px]">
        <LineChart chartHeight={420} />
      </div>
    </div>
  ),
  "pie-chart": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
      <div className="w-full max-w-[720px]">
        <PieChart chartHeight={560} outerRadius={200} />
      </div>
    </div>
  ),
  "radar-chart": () => (
    <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
      <div className="w-full max-w-[680px]">
        <RadarChart chartHeight={420} outerRadius={190} />
      </div>
    </div>
  ),
  "range-area-chart": () => (
    <div className="flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-4 py-10 sm:h-[700px] sm:px-6">
      <div className="w-full max-w-[709px]">
        <RangeAreaChart chartHeight={420} />
      </div>
    </div>
  ),
  "desktop-mockup-carousel": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <DesktopMockupCarousel
        video1="/demo/18.mp4"
        video2="/demo/17.mp4"
        video3="/demo/16.mp4"
        mediaOrder={["V1", "V2", "V3"]}
        tilt
        ambientGlow
      />
    </div>
  ),
  "tearable-reveal": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <TearableReveal
        backgroundSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
        hintText="Drag, it tears easily"
      />
    </div>
  ),
  "data-table": () => (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-4 py-10 sm:h-[700px] sm:px-6">
      <div className="h-[520px] w-full max-w-[900px]">
        <DataTable />
      </div>
    </div>
  ),
  "kanban-board": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <KanbanBoard />
    </div>
  ),
  "expand-card-grid": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <ExpandCardGrid
        items={[
          {
            title: "Mountains",
            description: "Alpine ridgelines at first light.",
            buttonText: "View",
            src: "/demo/105.webp",
          },
          {
            title: "Forest",
            description: "Deep green canopy, quiet trails.",
            buttonText: "View",
            src: "/demo/102.webp",
          },
          {
            title: "Coast",
            description: "Where the cliffs meet the sea.",
            buttonText: "View",
            src: "/demo/109.webp",
          },
          {
            title: "Desert",
            description: "Dunes shaped by wind and time.",
            buttonText: "View",
            src: "/demo/111.webp",
          },
        ]}
      />
    </div>
  ),
  "sales-ticket-popup": () => <SalesTicketDemo />,
  "animated-checkbox": () => (
    <div className="flex h-[400px] w-full flex-wrap items-center justify-center gap-x-14 gap-y-10 rounded-xl bg-[#080808] p-6">
      <AnimatedCheckbox
        {...CHECKBOX_DEMO_COLORS}
        size={56}
        radius={17}
        borderWidth={3}
        ringWidth={6}
        defaultChecked
        label=""
      />
      <AnimatedCheckbox
        {...CHECKBOX_DEMO_COLORS}
        accentColor="#10b981"
        ringColor="rgba(16,185,129,0.3)"
        size={56}
        radius={28}
        borderWidth={3}
        ringWidth={6}
        defaultChecked
        label=""
      />
      <AnimatedCheckbox
        {...CHECKBOX_DEMO_COLORS}
        accentColor="#f59e0b"
        ringColor="rgba(245,158,11,0.3)"
        size={56}
        radius={4}
        borderWidth={3}
        ringWidth={6}
        label=""
      />
    </div>
  ),
  tooltip: () => (
    <div className="flex h-[400px] w-full flex-wrap items-center justify-center gap-4 rounded-xl bg-[#080808] p-6">
      <Tooltip content="Save changes" shortcut="⌘S" placement="top">
        <button type="button" className={TOOLTIP_TRIGGER_CLASS}>
          Top
        </button>
      </Tooltip>
      <Tooltip content="Open the command menu" placement="bottom">
        <button type="button" className={TOOLTIP_TRIGGER_CLASS}>
          Bottom
        </button>
      </Tooltip>
      <Tooltip content="Go back" shortcut="⌘[" placement="left">
        <button type="button" className={TOOLTIP_TRIGGER_CLASS}>
          Left
        </button>
      </Tooltip>
      <Tooltip content="Go forward" shortcut="⌘]" placement="right">
        <button type="button" className={TOOLTIP_TRIGGER_CLASS}>
          Right
        </button>
      </Tooltip>
    </div>
  ),
  skeleton: () => (
    <div className="flex h-[440px] w-full flex-wrap items-center justify-center gap-10 rounded-xl bg-[#080808] p-6">
      <Skeleton variant="card" />
      <div className="flex w-[260px] flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" width={56} />
          <Skeleton variant="text" lines={2} width={170} />
        </div>
        <Skeleton variant="text" lines={3} />
        <Skeleton width="100%" height={80} animation="pulse" />
      </div>
    </div>
  ),
  tabs: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <div className="w-[440px] max-w-full">
        <Tabs fullWidth items={TAB_DEMO_LABELS} />
      </div>
    </div>
  ),
  breadcrumb: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-8 rounded-xl bg-[#080808] p-6">
      <Breadcrumb items={BREADCRUMB_DEMO_ITEMS} />
      <Breadcrumb
        items={BREADCRUMB_DEMO_ITEMS}
        separator="slash"
        showHomeIcon
        maxItems={3}
      />
    </div>
  ),
  pagination: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-8 rounded-xl bg-[#080808] p-6">
      <Pagination totalPages={12} defaultPage={5} />
      <Pagination totalPages={12} defaultPage={3} variant="soft" showLabels />
      <Pagination totalPages={12} defaultPage={2} variant="compact" />
    </div>
  ),
  stepper: () => (
    <StepperDemo
      orientation="horizontal"
      variant="numbered"
      size="md"
      theme="dark"
      accent="#F2A841"
      clickable={false}
      descriptions
      error={false}
    />
  ),
  modal: () => (
    <ModalDemo
      animation="scale"
      size="md"
      theme="dark"
      accent="#F2A841"
      blur
      backdrop
      closeButton
    />
  ),
  popover: () => (
    <div className="flex h-[440px] w-full items-center justify-center gap-6 rounded-xl bg-[#080808] p-6">
      <Popover content={<PopoverDemoContent light={false} accent="#F2A841" />}>
        <button
          type="button"
          className="cursor-pointer rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
        >
          Click me
        </button>
      </Popover>
    </div>
  ),
  drawer: () => (
    <DrawerDemo
      side="right"
      size="md"
      theme="dark"
      accent="#F2A841"
      blur={false}
      backdrop
      swipe
      closeButton
    />
  ),
  avatar: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-8 rounded-xl bg-[#080808] p-6">
      <div className="flex items-end gap-5">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar
            key={size}
            size={size}
            src="/demo/112.webp"
            name="Mei Tanaka"
          />
        ))}
      </div>
      <div className="flex items-center gap-5">
        <Avatar size="lg" name="Ada Lovelace" status="online" pulse />
        <Avatar size="lg" name="Grace Hopper" shape="rounded" status="away" />
        <Avatar size="lg" name="Alan Turing" shape="square" status="busy" />
        <Avatar
          size="lg"
          ring
          src="/demo/112.webp"
          name="Mei Tanaka"
          status="online"
        />
        <Avatar size="lg" />
      </div>
    </div>
  ),
  "avatar-group": () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-10 rounded-xl bg-[#080808] p-6">
      <AvatarGroup users={AVATAR_GROUP_USERS} max={5} size="lg" />
      <AvatarGroup
        users={AVATAR_GROUP_USERS}
        max={4}
        size="md"
        shape="rounded"
      />
      <AvatarGroup users={AVATAR_GROUP_USERS.slice(0, 3)} size="sm" />
    </div>
  ),
  divider: () => (
    <div className="flex h-[440px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <div className="flex w-[440px] max-w-full flex-col">
        <Divider />
        <Divider variant="dashed" label="or continue with" />
        <Divider variant="dotted" />
        <Divider variant="gradient" label="New" accent labelPosition="start" />
      </div>
    </div>
  ),
  accordion: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <Accordion />
    </div>
  ),
  card: () => (
    <div className="flex min-h-[480px] w-full flex-wrap items-center justify-center gap-6 rounded-xl bg-[#080808] p-8">
      <Card
        width={300}
        media="/demo/109.webp"
        badge="New"
        title="Aurora Dashboard"
        description="A clean analytics template for SaaS teams."
        interactive
        spotlight
        footer={
          <span className="text-[13px] font-semibold text-[#F2A841]">
            View details →
          </span>
        }
      />
      <Card
        width={300}
        variant="filled"
        title="Weekly report"
        description="Signups are up 18% compared to last week."
      >
        <div className="mt-1 text-3xl font-bold text-white">2,481</div>
      </Card>
    </div>
  ),
  kbd: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-6 rounded-xl bg-[#080808] p-6">
      <div className="flex items-center gap-8 text-sm text-white/60">
        <span className="flex items-center gap-3">Command menu <Kbd combo="mod+k" /></span>
        <span className="flex items-center gap-3">Save <Kbd combo="mod+s" /></span>
        <span className="flex items-center gap-3">Close <Kbd>Esc</Kbd></span>
      </div>
      <div className="flex items-center gap-6">
        <Kbd combo="mod+shift+p" separator />
        <Kbd combo="ctrl+alt+delete" variant="flat" />
        <Kbd combo="up+down+left+right" variant="outline" size="sm" />
      </div>
    </div>
  ),
  "empty-state": () => (
    <EmptyStateDemo preset="inbox" variant="plain" size="md" theme="dark" float showDescription showActions />
  ),
  "tag-input": () => (
    <div className="flex h-[440px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-24">
      <TagInput label="Skills" placeholder="Add a skill..." defaultValue={["React", "Tailwind"]} suggestions={TAG_INPUT_SUGGESTIONS} helperText="Press Enter or comma to add" />
    </div>
  ),
  combobox: () => (
    <div className="flex h-[480px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-24">
      <Combobox label="Framework" helperText="Type to search, use the arrow keys to move" />
    </div>
  ),
  "multi-select": () => (
    <div className="flex h-[520px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-24">
      <MultiSelect label="Teams" defaultValue={["design", "product"]} helperText="Type to search, Backspace removes the last" />
    </div>
  ),
  "date-picker": () => (
    <div className="flex h-[560px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-20">
      <DatePicker label="Due date" helperText="Arrow keys move, PageUp/PageDown change month" />
    </div>
  ),
  "input-otp": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <OtpDemo />
    </div>
  ),
  "number-input": () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-8 rounded-xl bg-[#080808] px-6">
      <NumberInput label="Quantity" defaultValue={2} min={0} max={10} helperText="Hold the buttons or use the arrow keys" />
      <NumberInput label="Price" defaultValue={1200} prefix="$" step={0.5} thousandSeparator layout="stacked" width={240} />
    </div>
  ),
  "password-input": () => (
    <div className="flex h-[440px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <PasswordInput label="Password" defaultValue="Frame2026" />
    </div>
  ),
  "segmented-control": () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-8 rounded-xl bg-[#080808] px-6">
      <SegmentedControl defaultValue="week" />
      <SegmentedControl variant="soft" options={SEGMENT_VIEW_OPTIONS} defaultValue="grid" />
    </div>
  ),
  "color-picker": () => (
    <div className="flex h-[520px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-20">
      <ColorPicker label="Brand color" defaultValue="#F2A841" helperText="Drag, type a hex or pick a preset" />
    </div>
  ),
  "file-upload": () => (
    <div className="flex min-h-[520px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 py-16">
      <FileUpload label="Attachments" accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={4} upload={fakeUpload} />
    </div>
  ),
  callout: () => (
    <div className="flex min-h-[520px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-[#080808] px-6 py-12">
      <Callout variant="info" title="Heads up">Your trial ends in 3 days. Upgrade to keep your projects.</Callout>
      <Callout variant="success" appearance="bar" title="Deployment complete" dismissible>Your site is live on the edge network.</Callout>
      <Callout variant="warning" appearance="outline" title="Storage almost full" action={{ label: "Manage storage" }}>You have used 92% of your 10 GB plan.</Callout>
      <Callout variant="danger" title="Payment failed" dismissible>We could not charge your card ending in 4242.</Callout>
    </div>
  ),
  meter: () => (
    <div className="flex min-h-[520px] w-full items-center justify-center rounded-xl bg-[#080808] px-6 py-12">
      <MeterLiveDemo />
    </div>
  ),
  "command-palette": () => <CommandPaletteDemo theme="dark" />,
  menubar: () => (
    <div className="flex h-[400px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-16">
      <MenubarDemo theme="dark" size="md" />
    </div>
  ),
  sidebar: () => {
    return (
      <div className="flex h-[460px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
        <SidebarDemoStatic />
      </div>
    );
  },
  dock: () => (
    <div className="flex h-[300px] w-full items-end justify-center rounded-xl bg-[#080808] px-6 pb-12">
      <Dock items={DOCK_ITEMS} />
    </div>
  ),
  "confirm-dialog": () => <ConfirmDialogDemo theme="dark" variant="danger" async={false} shouldFail={false} />,
  "hover-card": () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <HoverCard content={<HoverCardProfile theme="dark" />}>
        <span className="cursor-pointer font-medium underline" style={{ color: "#F5F4F1", textUnderlineOffset: 3 }}>
          @ada
        </span>
      </HoverCard>
    </div>
  ),
  "context-menu": () => (
    <div className="flex h-[360px] w-full items-center justify-center rounded-xl bg-[#080808] p-8">
      <ContextMenuDemo theme="dark" size="md" />
    </div>
  ),
  timeline: () => (
    <div className="flex min-h-[560px] w-full justify-center rounded-xl bg-[#080808] px-6 py-14">
      <Timeline items={TIMELINE_ITEMS} width={440} />
    </div>
  ),
  "tree-view": () => (
    <div className="flex h-[440px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <TreeView data={TREE_VIEW_DATA} defaultExpandedIds={["src", "components"]} defaultSelectedId="button" />
    </div>
  ),
  "stat-card": () => (
    <div className="flex h-[400px] w-full flex-wrap items-center justify-center gap-5 rounded-xl bg-[#080808] p-6">
      <StatCard
        label="Revenue"
        value={48265}
        prefix="$"
        previousValue={41500}
        deltaLabel="vs last 30 days"
        icon={<svg {...STAT_CARD_ICON_PROPS}><path d="M10 2.5v15M14.5 6.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.5 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3" /></svg>}
        sparkline={[1820, 1980, 1880, 2310, 2456, 2680, 3120, 3380]}
        sparklineStyle="smooth"
      />
      <StatCard
        label="Active users"
        value={12480}
        previousValue={11020}
        sparkline={[9800, 10200, 10500, 11020, 11400, 12100, 12480]}
        sparklineStyle="smooth"
      />
      <StatCard label="Signups" value={3260} previousValue={2870} sparkline={[2400, 2900, 2600, 3100, 2950, 3400, 3260]} sparklineStyle="sharp" />
      <StatCard label="Error rate" value={2.1} suffix="%" previousValue={1.4} goodDirection="down" deltaLabel="last 24h" />
    </div>
  ),
  "code-block": () => (
    <div className="flex h-[440px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <CodeBlock filename="button.tsx" language="tsx" code={CODE_BLOCK_SAMPLE} highlightLines={[3]} width={440} />
    </div>
  ),
  "description-list": () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <DescriptionList title="Order summary" layout="inline" items={DESC_LIST_ORDER_ITEMS} width={340} />
    </div>
  ),
  splitter: () => (
    <div className="flex h-[380px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <Splitter
        height={320}
        width={480}
        panels={[
          { id: "sidebar", content: <SplitterPane label="Sidebar" sub="25%" theme="dark" />, defaultSize: 25, minSize: 15, maxSize: 45 },
          { id: "main", content: <SplitterPane label="Main" sub="drag the handle" theme="dark" /> },
        ]}
      />
    </div>
  ),
  "back-to-top": () => (
    <div className="h-[440px] w-full overflow-hidden rounded-xl bg-[#080808] p-3">
      <BackToTopDemo theme="dark" showProgress position="bottom-right" />
    </div>
  ),
  "copy-button": () => (
    <div className="flex h-[280px] w-full flex-col items-center justify-center gap-6 rounded-xl bg-[#080808] p-6">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-2.5" style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#F5F4F1" }}>
        npm install @acme/ui
        <CopyButton value="npm install @acme/ui" />
      </div>
      <div className="flex items-center gap-3">
        <CopyButton value="npm install @acme/ui" label="Copy command" variant="outline" />
        <CopyButton value="https://reactframe.dev/s/8fk2" label="Copy link" variant="solid" />
      </div>
    </div>
  ),
  terminal: () => (
    <div className="flex h-[360px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <Terminal lines={TERMINAL_DEMO_LINES} title="~/project" width={440} height={260} />
    </div>
  ),
  "inline-edit": () => (
    <div className="flex h-[280px] w-full flex-col items-center justify-center gap-6 rounded-xl bg-[#080808] p-6">
      <InlineEdit defaultValue="Q3 Roadmap" size="lg" />
      <InlineEdit
        defaultValue="ada@acme.com"
        validate={(v) => (v.includes("@") ? null : "Enter a valid email")}
      />
      <InlineEdit editOnClick={false} defaultValue="" emptyText="Add a description..." multiline />
    </div>
  ),
  "aspect-ratio": () => (
    <div className="flex h-[500px] w-full flex-wrap items-center justify-center gap-x-6 gap-y-8 rounded-xl bg-[#080808] p-6">
      {ASPECT_DEMO_ITEMS.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2.5">
          <AspectRatio ratio={item.ratio} width={Math.round(120 * item.ratio)} radius={10}>
            <AspectRatioLabel ratio={item.label} accentColor={item.accent ? "#F2A841" : undefined} size={item.ratio < 1 ? 16 : 20} />
          </AspectRatio>
          <span className="text-[12px] text-white/45">{item.caption}</span>
        </div>
      ))}
    </div>
  ),
  "scroll-area": () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <ScrollArea height={340} width={260}>
        <ScrollAreaListDemo theme="dark" />
      </ScrollArea>
    </div>
  ),
  toolbar: () => (
    <div className="flex h-[360px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <ToolbarDemo />
    </div>
  ),
  panel: () => (
    <div className="flex min-h-[420px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <PanelDemo />
    </div>
  ),
  tag: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-5 rounded-xl bg-[#080808] p-6">
      {(["soft", "solid", "outline"] as const).map((variant) => (
        <div
          key={variant}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {(
            ["neutral", "amber", "mint", "coral", "blue", "lavender"] as const
          ).map((color) => (
            <Tag key={color} variant={variant} color={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
  "search-bar": () => (
    <div className="flex h-[460px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-24">
      <SearchBar suggestions={SEARCH_DEMO_SUGGESTIONS} />
    </div>
  ),
  slider: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
      <Slider label="Volume" unit="%" defaultValue={40} />
    </div>
  ),
  select: () => (
    <div className="flex h-[520px] w-full items-start justify-center rounded-xl bg-[#080808] px-6 pt-20">
      <Select label="Team" helperText="Pick the team you work in" />
    </div>
  ),
  "radio-button": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6 text-white">
      <RadioButton label="Choose a plan" defaultValue="pro" />
    </div>
  ),
  button: () => (
    <div className="flex h-[400px] w-full flex-wrap items-center justify-center gap-4 rounded-xl bg-[#080808] p-6">
      <Button label="Primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Outline" variant="outline" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Loading" loading />
    </div>
  ),
  input: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-5 rounded-xl bg-[#080808] p-6">
      <div className="w-full max-w-[300px]">
        <Input label="Email" placeholder="you@example.com" defaultValue="" />
      </div>
      <div className="w-full max-w-[300px]">
        <Input
          label="Password"
          type="password"
          variant="filled"
          placeholder="Enter your password"
          defaultValue="hunter2"
        />
      </div>
      <div className="w-full max-w-[300px]">
        <Input
          label="Username"
          variant="underline"
          errorText="This username is already taken"
          defaultValue="taken_handle"
        />
      </div>
    </div>
  ),
  textarea: () => (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-5 rounded-xl bg-[#080808] p-6">
      <div className="w-full max-w-[320px]">
        <Textarea
          label="Message"
          placeholder="Write your message..."
          helperText="Keep it under 200 characters"
          maxLength={200}
          showCounter
          defaultValue=""
        />
      </div>
      <div className="w-full max-w-[320px]">
        <Textarea
          label="Bio"
          variant="filled"
          autoResize
          defaultValue="Auto-resizing textarea that grows with your content."
        />
      </div>
    </div>
  ),
  "animated-loader": () => (
    <div className="flex h-[400px] w-full flex-wrap items-center justify-center gap-x-16 gap-y-10 rounded-xl bg-[#080808] p-6">
      {LOADER_DEMO_VARIANTS.map((v) => (
        <AnimatedLoader
          key={v}
          variant={v}
          {...LOADER_DEMO_COLORS}
          size={64}
          thickness={5}
        />
      ))}
    </div>
  ),
  "dot-image-slider": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <DotImageSlider />
    </div>
  ),
  "product-grid-section": () => (
    <div className="max-h-[42rem] w-full overflow-y-auto rounded-xl bg-[#080808] border border-border">
      <ProductGridSection />
    </div>
  ),
  //   "container-scroll-ipad": () => (
  //     <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
  //       <ContainerScrollIpad containerHeight={420} ipadWidth={420} />
  //     </div>
  //   ),
  "ai-asistant": () => (
    <div className="flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808]">
      <AIAsistant size={220} theme="mesh" state="waiting" shape="square" />
    </div>
  ),
  "ai-voice-01": () => (
    <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
      <div className="h-24 w-full max-w-[380px]">
        <AiVoice01 />
      </div>
    </div>
  ),
  "ai-voice-05": () => (
    <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
      <div className="h-40 w-full max-w-[420px]">
        <AiVoice05 />
      </div>
    </div>
  ),
  "ai-image-loader-03": () => (
    <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
      <div className="aspect-[3/4] h-full max-h-[420px]">
        <AiImageLoader03 />
      </div>
    </div>
  ),
  "ai-dynamic-island-01": () => (
    <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
      <div className="w-full max-w-[380px]">
        <AIDynamicIsland01 />
      </div>
    </div>
  ),
  "ai-answer-03": () => (
    <div className="flex h-[760px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
      <div className="h-[660px] w-full max-w-[460px]">
        <AiAnswer03 />
      </div>
    </div>
  ),
  "ai-edit-review": () => (
    <div className="flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
      <div className="h-[340px] w-full max-w-md">
        <AIEditReview />
      </div>
    </div>
  ),
  "video-glow-lightbox": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
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
  "glide-carousel": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <GlideCarousel items={GLIDE_CAROUSEL_ITEMS} />
    </div>
  ),
  "noise-background": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <NoiseBackground animateBlobs />
    </div>
  ),
  "text-scramble-pro": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <TextScramblePro />
    </div>
  ),
  "linear-progress-bars": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <LinearProgressBars
        {...LINEAR_BARS_BARE_CARD}
        theme="dark"
        className="max-w-[520px]"
        rows={[
          {
            kind: "bar",
            label: "brand-assets.zip",
            labelRight: "67%",
            pct: 67,
            colorStart: "#6366f1",
            colorEnd: "#8b5cf6",
            height: 10,
            capStyle: "glow",
            shimmer: true,
          },
          {
            kind: "bar",
            label: "Cloud Storage",
            labelRight: "25%",
            pct: 25,
            colorStart: "#3b82f6",
            colorEnd: "#06b6d4",
            height: 10,
            capStyle: "dot",
          },
          {
            kind: "bar",
            label: "Generating tokens",
            labelRight: "79%",
            pct: 79,
            colorStart: "#f59e0b",
            colorEnd: "#ef4444",
            height: 10,
            capStyle: "line",
          },
        ]}
      />
    </div>
  ),
  "progress-circle-bars": () => (
    <div className="flex h-[400px] w-full items-center justify-center gap-8 rounded-xl bg-[#080808]">
      <ProgressCircleBars
        label="Circle"
        percentage={75}
        labelColor="#ffffff"
        percentageColor="#ffffff"
      />
      <ProgressCircleBars
        label="Gauge"
        arcStyle="gauge"
        percentage={62}
        colorStart="#f59e0b"
        colorEnd="#ef4444"
        labelColor="#ffffff"
        percentageColor="#ffffff"
      />
      <ProgressCircleBars
        label="Dashes"
        arcStyle="dashes"
        percentage={40}
        colorStart="#10b981"
        colorEnd="#3b82f6"
        labelColor="#ffffff"
        percentageColor="#ffffff"
      />
    </div>
  ),
  "liquid-text": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <LiquidText />
    </div>
  ),
  "word-reveal": () => <WordRevealDemo />,
  "alert-toast": () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
      <div className="flex w-full max-w-[520px] flex-col">
        {(["info", "success", "error"] as const).map((tone) => (
          <AlertToast
            key={tone}
            {...alertToastDemo(tone, "stacked", true, true)}
            appearance={{
              tone,
              background: "tinted",
              accentBar: true,
              icon: ALERT_DEMO[tone].icon,
              theme: "dark",
              radius: 12,
            }}
            spacing={12}
          />
        ))}
      </div>
    </div>
  ),
  "review-card-portrait": () => (
    <div className="flex h-[600px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-8">
      <div className="h-[520px] w-[380px] overflow-hidden rounded-2xl shadow-xl">
        <ReviewCardPortrait />
      </div>
    </div>
  ),
  "cinematic-stacked-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <CinematicStackedGallery />
    </div>
  ),
  "dice-roll-discount-popup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["ecommerce", "campaign", "restaurant", "saas", "event"],
          optionLabels: [
            "Ecommerce",
            "Campaign",
            "Restaurant",
            "SaaS",
            "Event",
          ],
          defaultValue: "ecommerce",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[720px] p-4" : "p-8",
          )}
        >
          <div className="w-full max-w-[420px]">
            <DiceRollDiscountPopup
              theme={
                v.theme as
                  "ecommerce" | "campaign" | "restaurant" | "saas" | "event"
              }
              lightMode={v.lightMode === "light"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "wheel-spin-discount-popup": () => (
    <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-xl bg-[#080808]">
      <WheelSpinDiscountPopup />
    </div>
  ),
};

function reviewWidgetControls(opts: {
  ratingMin: number;
  ratingDefault: number;
  reviewCountStep: number;
  reviewCountDefault: number;
}): PlaygroundControl[] {
  return [
    {
      type: "select",
      key: "theme",
      label: "Theme",
      options: ["light", "dark"],
      optionLabels: ["Light", "Dark"],
      defaultValue: "dark",
    },
    {
      type: "range",
      key: "rating",
      label: "Rating",
      min: opts.ratingMin,
      max: 5,
      step: 0.1,
      defaultValue: opts.ratingDefault,
    },
    {
      type: "range",
      key: "reviewCount",
      label: "Reviews",
      min: 0,
      max: 2000,
      step: opts.reviewCountStep,
      defaultValue: opts.reviewCountDefault,
    },
    {
      type: "select",
      key: "cardsDesktop",
      label: "Cards",
      options: ["2", "3", "4"],
      defaultValue: "3",
    },
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

// Dark-canvas colours for the Animated Checkbox previews (the preview canvas is dark).
const CHECKBOX_DEMO_COLORS = {
  labelColor: "#ffffff",
  helperColor: "rgba(255,255,255,0.55)",
  mutedColor: "rgba(255,255,255,0.45)",
  borderColor: "rgba(255,255,255,0.35)",
};

// Dark-canvas colours for the Toggle Pro previews (track off + thumb).
const TOGGLE_DEMO_COLORS = {
  trackOffColor: "rgba(255,255,255,0.16)",
  thumbColor: "#ffffff",
};

const RADIO_ACCENTS: Record<string, string> = {
  mint: "#87FFE3",
  amber: "#F2A841",
  coral: "#FF7A6B",
  blue: "#8FB8FF",
  lavender: "#B8A6FF",
  paper: "#F5F4F1",
};

const DEMO_ACCENTS: Record<string, string> = {
  violet: "rgb(124,58,237)",
  blue: "rgb(59,130,246)",
  green: "rgb(16,185,129)",
  orange: "rgb(245,158,11)",
  pink: "rgb(236,72,153)",
};

// ─── Site-only "showcase every variant" previews ───────────────────────────
// These components used to carry an internal `demoMode` prop that swapped
// their entire render for a light/dark grid of every state. That grid isn't
// something a Playground control panel can drive (it isn't adjusting one
// instance, it's showing all of them at once), so it lives here instead,
// built from each component's own public props — nothing shipped carries it.

const ALERT_DEMO: Record<
  AlertTone,
  {
    icon: "info" | "success" | "error";
    title: string;
    description: string;
    primary: string;
    secondary: string;
  }
> = {
  info: {
    icon: "info",
    title: "New update available",
    description: "A new version of the app is ready to install.",
    primary: "Update now",
    secondary: "Later",
  },
  success: {
    icon: "success",
    title: "Successfully uploaded!",
    description: "Your file is now available to everyone on the team.",
    primary: "View file",
    secondary: "Undo",
  },
  warning: {
    icon: "info",
    title: "You have no credits left",
    description: "Upgrade your plan to keep generating.",
    primary: "Upgrade",
    secondary: "Later",
  },
  error: {
    icon: "error",
    title: "Submission failed",
    description: "Check the highlighted fields and try again.",
    primary: "Try again",
    secondary: "Get help",
  },
  neutral: {
    icon: "info",
    title: "Custom code is not validated",
    description: "Incorrect code may impact your website's performance.",
    primary: "Ok, I got it",
    secondary: "Learn more",
  },
};

function alertToastDemo(
  tone: AlertTone,
  layout: AlertLayout,
  actions: boolean,
  dismissible: boolean,
) {
  const d = ALERT_DEMO[tone];
  return {
    content: { title: d.title, description: d.description, layout },
    actions: {
      showPrimary: actions,
      primaryLabel: d.primary,
      showSecondary: actions,
      secondaryLabel: d.secondary,
      secondaryEmphasis: false,
    },
    dismiss: { dismissible, autoDismiss: false, duration: 4 },
  };
}

// Linear Progress Bars previews: strip the card chrome so the bar sits straight on the canvas.
const LINEAR_BARS_BARE_CARD = {
  scrollReveal: false,
  cardBg: "transparent",
  cardShadow: "none",
  cardPaddingX: 0,
  cardPaddingY: 0,
} as const;

const LINEAR_BARS_COLORS: Record<string, [string, string]> = {
  indigo: ["#6366f1", "#8b5cf6"],
  blue: ["#3b82f6", "#06b6d4"],
  green: ["#34d399", "#10b981"],
  amber: ["#f59e0b", "#ef4444"],
  pink: ["#ec4899", "#f97316"],
};

// Glass Navigation previews: a solid black "Get in touch" button on the light glass, and a white one on the
// dark glass so it stays visible.
const GLASS_NAV_DEMO_CTA = {
  light: {
    text: "Get in touch",
    url: "/contact",
    background: "#000000",
    color: "#ffffff",
    height: 36,
    width: 0,
    paddingX: 18,
  },
  dark: {
    text: "Get in touch",
    url: "/contact",
    background: "#ffffff",
    color: "#000000",
    height: 36,
    width: 0,
    paddingX: 18,
  },
};

// Testimonial Pills preview: the component's default 16 phrases, with local portraits instead of hotlinked photos.
const TESTIMONIAL_PILLS_AVATARS = [49, 50, 51, 53, 54, 55, 43, 44, 45, 46].map(
  (n) => `/demo/${n}.webp`,
);
const TESTIMONIAL_PILLS_TEXTS = [
  "Very easy to follow",
  "Eye opening",
  "Very insightful",
  "Loved it",
  "Feeling positive",
  "It was useful",
  "Thanks!",
  "Great",
  "So far, so good",
  "Impressed",
  "I'm feeling hopeful",
  "Highly recommend",
  "Super helpful",
  "Worth it",
  "Mind blowing",
  "Couldn't be easier",
];
const TESTIMONIAL_PILLS_ITEMS = TESTIMONIAL_PILLS_TEXTS.map((text, i) => ({
  text,
  avatar: TESTIMONIAL_PILLS_AVATARS[i % TESTIMONIAL_PILLS_AVATARS.length],
}));

// Premium Bento Grid preview: ten motion-blur sport photos, one per cell of the custom layout.
const PREMIUM_BENTO_SLOTS = [
  { image: "/demo/107.webp", label: "Motorsport", badge: "Full throttle" },
  { image: "/demo/102.webp", label: "Rowing", badge: "Sculling" },
  { image: "/demo/103.webp", label: "Weightlifting", badge: "Strength" },
  { image: "/demo/104.webp", label: "The Team", badge: "Together" },
  { image: "/demo/105.webp", label: "Trail Hiking", badge: "Uphill" },
  { image: "/demo/106.webp", label: "Sled Push", badge: "Conditioning" },
  { image: "/demo/108.webp", label: "Cycling", badge: "Road" },
  { image: "/demo/109.webp", label: "Sprint", badge: "Track" },
  { image: "/demo/110.webp", label: "Swimming", badge: "Freestyle" },
  { image: "/demo/111.webp", label: "Alpine Skiing", badge: "Downhill" },
].map((slot) => ({ mediaType: "image" as const, ...slot }));

// Glide Carousel preview: five motion-blur sport photos with copy that matches each one.
const GLIDE_CAROUSEL_ITEMS = [
  {
    src: "/demo/101.webp",
    title: "Full Gallop",
    description: "Rider and horse in one breath.",
  },
  {
    src: "/demo/102.webp",
    title: "First Stroke",
    description: "One sculler, glassy water, no wake yet.",
  },
  {
    src: "/demo/105.webp",
    title: "Above the Tree Line",
    description: "A steady climb on loose ground.",
  },
  {
    src: "/demo/108.webp",
    title: "Tailwind",
    description: "Low and fast on an empty road.",
  },
  {
    src: "/demo/109.webp",
    title: "Off the Line",
    description: "The first ten strides decide the race.",
  },
];

// Carousel Slider preview: five quiet interiors with copy that matches each scene.
const CAROUSEL_SLIDER_ITEMS = [
  {
    src: "/demo/2.webp",
    title: "Horizon",
    heading: "A view worth pausing for.",
    description: "Quiet plaster walls open onto the sea.",
    buttonText: "View Space",
  },
  {
    src: "/demo/3.webp",
    title: "Drift",
    heading: "Light moves through the room.",
    description: "Sheer curtains and warm velvet, caught mid-step.",
    buttonText: "View Space",
  },
  {
    src: "/demo/4.webp",
    title: "Ritual",
    heading: "Where the day begins.",
    description: "Black marble, soft light and a slow morning in the kitchen.",
    buttonText: "View Space",
  },
  {
    src: "/demo/5.webp",
    title: "Stillness",
    heading: "Space to slow down.",
    description: "Linen, low lines and the calm of an empty afternoon.",
    buttonText: "View Space",
  },
  {
    src: "/demo/8.webp",
    title: "Retreat",
    heading: "Made for quiet mornings.",
    description: "An arched window, a stone bath and the sea beyond.",
    buttonText: "View Space",
  },
];

// Curved Image Carousel preview: eleven local photos, in the order they should appear on the curve.
const CURVED_CAROUSEL_IMAGES = [
  101, 102, 23, 25, 104, 105, 28, 31, 33, 108, 109,
].map((n) => `/demo/${n}.webp`);

// Gallery Expand preview: six motion-blur sport photos, each with a title and description that match it.
const GALLERY_EXPAND_IMAGES = [
  {
    src: "/demo/102.webp",
    alt: "A sculler rowing across still water",
    title: "Still Water",
    description: "One oar, one breath, and a wake that hasn't formed yet.",
  },
  {
    src: "/demo/23.webp",
    alt: "A hiker with a backpack climbing a slope",
    title: "Uphill",
    description: "Every step is a little higher than the last.",
  },
  {
    src: "/demo/25.webp",
    alt: "A skier carving through fresh snow",
    title: "Fresh Line",
    description: "Cutting a clean edge through untouched powder.",
  },
  {
    src: "/demo/32.webp",
    alt: "A footballer striking the ball",
    title: "First Touch",
    description: "The ball leaves the boot before the crowd notices.",
  },
  {
    src: "/demo/108.webp",
    alt: "A cyclist riding low and fast",
    title: "Slipstream",
    description: "Head down, low and fast on an empty road.",
  },
  {
    src: "/demo/110.webp",
    alt: "A swimmer mid-stroke in open water",
    title: "Open Water",
    description: "A single stroke, and the surface closes behind you.",
  },
];

const BADGE_DEMO_LABELS: Record<string, string> = {
  success: "Paid",
  error: "Rejected",
  info: "Processing",
  warning: "Pending",
  purple: "Trial",
  orange: "Beta",
  indigo: "In review",
  neutral: "Draft",
};

// Animated Loader previews: the four variants, and a track colour that shows on the dark canvas.
const LOADER_DEMO_VARIANTS = ["lines", "ring", "dual-ring", "dots"] as const;
const LOADER_DEMO_COLORS = { trackColor: "rgba(255,255,255,0.16)" };

function SalesTicketDemo({ theme }: { theme?: SalesTicketTheme }) {
  const [run, setRun] = React.useState(0);
  const [closed, setClosed] = React.useState(false);
  return (
    <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-4">
      {closed ? (
        <button
          type="button"
          onClick={() => {
            setClosed(false);
            setRun((n) => n + 1);
          }}
          className="cursor-pointer rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur transition-colors hover:bg-white/20"
        >
          Show ticket again
        </button>
      ) : (
        <SalesTicketPopup
          key={`${theme}-${run}`}
          fixed={false}
          theme={theme}
          onClose={() => setClosed(true)}
        />
      )}
    </div>
  );
}

function TagPlayDemo({
  variant,
  color,
  size,
  theme,
  dot,
  pulse,
  removable,
  selectable,
  count,
  disabled,
}: {
  variant: "soft" | "solid" | "outline";
  color: "neutral" | "amber" | "mint" | "coral" | "blue" | "lavender";
  size: "sm" | "md" | "lg";
  theme: "dark" | "light";
  dot: boolean;
  pulse: boolean;
  removable: boolean;
  selectable: boolean;
  count: boolean;
  disabled: boolean;
}) {
  const [run, setRun] = React.useState(0);
  const labels = ["Design", "Engineering", "Product", "Marketing"];
  return (
    <div
      className={`relative flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
    >
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className={`absolute top-4 right-4 z-10 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur transition-colors ${theme === "light" ? "border-black/15 bg-black/5 text-black/70 hover:bg-black/10" : "border-white/15 bg-white/10 text-white/85 hover:bg-white/20"}`}
      >
        Reset
      </button>
      <div
        key={run}
        className="flex max-w-[520px] flex-wrap items-center justify-center gap-3"
      >
        {labels.map((l, i) => (
          <Tag
            key={l}
            variant={variant}
            color={color}
            size={size}
            theme={theme}
            dot={dot}
            pulse={pulse}
            removable={removable}
            count={count ? (i + 1) * 3 : undefined}
            defaultSelected={selectable && i === 1}
            onSelectedChange={selectable ? () => {} : undefined}
            disabled={disabled}
          >
            {l}
          </Tag>
        ))}
      </div>
    </div>
  );
}

const TOOLTIP_TRIGGER_CLASS =
  "cursor-pointer rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10";

function SkeletonDemoContent({ light }: { light: boolean }) {
  const text = light ? "text-black" : "text-white";
  return (
    <div
      className={`flex w-[320px] flex-col gap-4 rounded-[18px] border p-4 ${light ? "border-black/10" : "border-white/10"} ${text}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2A841] text-sm font-bold text-black">
          AL
        </div>
        <div>
          <div className="text-sm font-semibold">Ada Lovelace</div>
          <div className="text-xs opacity-50">Engineer · Analytical Co.</div>
        </div>
      </div>
      <div className="h-[150px] rounded-[10px] bg-gradient-to-br from-[#F2A841]/30 to-[#87FFE3]/20" />
      <p className="m-0 text-xs leading-relaxed opacity-70">
        Notes on the analytical engine: a machine that weaves algebraic patterns
        just as the loom weaves flowers and leaves.
      </p>
    </div>
  );
}

const TAB_ICON_PROPS = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const TAB_DEMO_ICONS = [
  <svg key="a" {...TAB_ICON_PROPS}>
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>,
  <svg key="b" {...TAB_ICON_PROPS}>
    <path d="M2 13V7M6 13V3M10 13V9M14 13V5" />
  </svg>,
  <svg key="c" {...TAB_ICON_PROPS}>
    <path d="M4 2h6l3 3v9H4z" />
    <path d="M9 2v4h4" />
  </svg>,
  <svg key="d" {...TAB_ICON_PROPS}>
    <circle cx="8" cy="8" r="2.2" />
    <path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1" />
  </svg>,
];
const TAB_DEMO_LABELS = [
  {
    value: "overview",
    label: "Overview",
    content:
      "A quick summary of your workspace: recent activity, open tasks and what changed since yesterday.",
  },
  {
    value: "analytics",
    label: "Analytics",
    count: 4,
    content:
      "Traffic, conversion and retention trends, broken down by channel and cohort.",
  },
  {
    value: "reports",
    label: "Reports",
    content:
      "Scheduled and on-demand reports you can export or share with your team.",
  },
  {
    value: "settings",
    label: "Settings",
    content: "Members, billing, integrations and workspace preferences.",
  },
];

const BREADCRUMB_DEMO_ITEMS = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Elements", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb" },
];

function StepperDemo({
  orientation,
  variant,
  size,
  theme,
  accent,
  clickable,
  descriptions,
  error,
}: {
  orientation: "horizontal" | "vertical";
  variant: "numbered" | "minimal";
  size: "sm" | "md" | "lg";
  theme: "dark" | "light";
  accent: string;
  clickable: boolean;
  descriptions: boolean;
  error: boolean;
}) {
  const [step, setStep] = React.useState(1);
  const light = theme === "light";
  const steps = [
    {
      label: "Account",
      description: descriptions ? "Create your login" : undefined,
    },
    {
      label: "Profile",
      description: descriptions ? "Tell us about you" : undefined,
    },
    {
      label: "Workspace",
      description: descriptions ? "Name your team" : undefined,
      error,
    },
    {
      label: "Launch",
      description: descriptions ? "Review and go live" : undefined,
    },
  ];
  const btn = `cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium transition-colors disabled:cursor-default disabled:opacity-40 ${light ? "border-black/15 bg-black/5 text-black/70 hover:bg-black/10" : "border-white/15 bg-white/10 text-white/85 hover:bg-white/20"}`;
  return (
    <div
      className={`flex h-[440px] w-full flex-col items-center justify-center gap-10 rounded-xl px-6 ${light ? "bg-white" : "bg-[#080808]"}`}
    >
      <div className={orientation === "vertical" ? "" : "w-[560px] max-w-full"}>
        <Stepper
          steps={steps}
          currentStep={step}
          onStepChange={setStep}
          orientation={orientation}
          variant={variant}
          size={size}
          theme={theme}
          accentColor={accent}
          clickable={clickable}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className={btn}
          disabled={step === 0}
          onClick={() => setStep((n) => Math.max(0, n - 1))}
        >
          Back
        </button>
        <button
          type="button"
          className={btn}
          disabled={step === steps.length - 1}
          onClick={() => setStep((n) => Math.min(steps.length - 1, n + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ModalDemo({
  animation,
  size,
  theme,
  accent,
  blur,
  backdrop,
  closeButton,
}: {
  animation: "scale" | "slide-up" | "fade";
  size: "sm" | "md" | "lg";
  theme: "dark" | "light";
  accent: string;
  blur: boolean;
  backdrop: boolean;
  closeButton: boolean;
}) {
  const [open, setOpen] = React.useState(true);
  const light = theme === "light";
  const ghost = `cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${light ? "border-black/15 text-black/75 hover:bg-black/5" : "border-white/15 text-white/80 hover:bg-white/10"}`;
  return (
    <div
      className={`relative flex h-[520px] w-full items-center justify-center overflow-hidden rounded-xl ${light ? "bg-white" : "bg-[#080808]"}`}
    >
      <button type="button" onClick={() => setOpen(true)} className={ghost}>
        Open modal
      </button>
      <Modal
        contained
        open={open}
        onOpenChange={setOpen}
        title="Delete project?"
        description="This permanently removes the project and all of its data."
        animation={animation}
        size={size}
        theme={theme}
        blur={blur}
        closeOnBackdrop={backdrop}
        showCloseButton={closeButton}
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={ghost}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-full border-none px-4 py-2 text-sm font-semibold text-black"
              style={{ background: accent }}
            >
              Delete
            </button>
          </>
        }
      >
        Team members will lose access immediately. This action cannot be undone.
      </Modal>
    </div>
  );
}

function PopoverDemoContent({
  light,
  accent,
}: {
  light: boolean;
  accent: string;
}) {
  return (
    <div>
      <div className="text-[14px] font-semibold">Share this page</div>
      <p
        className={`m-0 mt-1 text-[13px] ${light ? "text-black/55" : "text-white/55"}`}
      >
        Anyone with the link can view. Invite people by email below.
      </p>
      <input
        placeholder="name@example.com"
        className={`mt-3 h-9 w-full rounded-lg border bg-transparent px-3 text-[13px] outline-none ${light ? "border-black/15 placeholder:text-black/35" : "border-white/15 placeholder:text-white/35"}`}
      />
      <button
        type="button"
        className="mt-3 h-9 w-full cursor-pointer rounded-lg border-none text-[13px] font-semibold text-black"
        style={{ background: accent }}
      >
        Send invite
      </button>
    </div>
  );
}

function DrawerDemo({
  side,
  size,
  theme,
  accent,
  blur,
  backdrop,
  swipe,
  closeButton,
}: {
  side: "left" | "right" | "top" | "bottom";
  size: "sm" | "md" | "lg";
  theme: "dark" | "light";
  accent: string;
  blur: boolean;
  backdrop: boolean;
  swipe: boolean;
  closeButton: boolean;
}) {
  const [open, setOpen] = React.useState(true);
  const light = theme === "light";
  const ghost = `cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${light ? "border-black/15 text-black/75 hover:bg-black/5" : "border-white/15 text-white/80 hover:bg-white/10"}`;
  const rows = [
    "Email notifications",
    "Push notifications",
    "Weekly digest",
    "Product updates",
  ];
  return (
    <div
      className={`relative flex h-[520px] w-full items-center justify-center overflow-hidden rounded-xl ${light ? "bg-white" : "bg-[#080808]"}`}
    >
      <button type="button" onClick={() => setOpen(true)} className={ghost}>
        Open drawer
      </button>
      <Drawer
        contained
        open={open}
        onOpenChange={setOpen}
        side={side}
        size={size}
        theme={theme}
        blur={blur}
        closeOnBackdrop={backdrop}
        swipeToClose={swipe}
        showCloseButton={closeButton}
        title="Notification settings"
        description="Choose what you want to hear about."
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={ghost}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-full border-none px-4 py-2 text-sm font-semibold text-black"
              style={{ background: accent }}
            >
              Save
            </button>
          </>
        }
      >
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {rows.map((label) => (
            <li
              key={label}
              className={`rounded-xl border px-3.5 py-3 text-sm ${light ? "border-black/10" : "border-white/10"}`}
            >
              {label}
            </li>
          ))}
        </ul>
      </Drawer>
    </div>
  );
}

function DividerDemo({
  orientation,
  variant,
  labelPosition,
  showLabel,
  thickness,
  accent,
  accentColor,
  animated,
  theme,
}: {
  orientation: "horizontal" | "vertical";
  variant: "solid" | "dashed" | "dotted" | "gradient";
  labelPosition: "start" | "center" | "end";
  showLabel: boolean;
  thickness: number;
  accent: boolean;
  accentColor: string;
  animated: boolean;
  theme: "dark" | "light";
}) {
  const [run, setRun] = React.useState(0);
  const light = theme === "light";
  const muted = light ? "text-black/55" : "text-white/55";
  return (
    <div
      className={`relative flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${light ? "bg-white" : "bg-[#080808]"}`}
    >
      {animated && (
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className={`absolute top-4 right-4 z-10 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur transition-colors ${light ? "border-black/15 bg-black/5 text-black/70 hover:bg-black/10" : "border-white/15 bg-white/10 text-white/85 hover:bg-white/20"}`}
        >
          Replay
        </button>
      )}
      {orientation === "horizontal" ? (
        <div key={run} className="w-[440px] max-w-full">
          <p className={`m-0 text-center text-sm ${muted}`}>
            Sign in to your account
          </p>
          <Divider
            variant={variant}
            label={showLabel ? "or continue with" : undefined}
            labelPosition={labelPosition}
            thickness={thickness}
            accent={accent}
            accentColor={accentColor}
            animated={animated}
            theme={theme}
            spacing={22}
          />
          <p className={`m-0 text-center text-sm ${muted}`}>
            Use your work email or a provider
          </p>
        </div>
      ) : (
        <div
          key={run}
          className={`flex h-[160px] items-center gap-2 text-sm ${muted}`}
        >
          <span>Docs</span>
          <Divider
            orientation="vertical"
            variant={variant}
            label={showLabel ? "or" : undefined}
            thickness={thickness}
            accent={accent}
            accentColor={accentColor}
            animated={animated}
            theme={theme}
            spacing={20}
          />
          <span>Blog</span>
        </div>
      )}
    </div>
  );
}

const ACCORDION_ICON_PROPS = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const ACCORDION_DEMO_ICONS = [
  <svg key="a" {...ACCORDION_ICON_PROPS}>
    <path d="M8 2v8M4.5 6.8L8 10.3l3.5-3.5M3 13h10" />
  </svg>,
  <svg key="b" {...ACCORDION_ICON_PROPS}>
    <path d="M2.5 13.5l3-.6 7-7a1.6 1.6 0 00-2.3-2.3l-7 7-.7 2.9z" />
  </svg>,
  <svg key="c" {...ACCORDION_ICON_PROPS}>
    <path d="M8 2l5 2v4c0 3-2.2 4.9-5 6-2.8-1.1-5-3-5-6V4l5-2z" />
  </svg>,
  <svg key="d" {...ACCORDION_ICON_PROPS}>
    <circle cx="8" cy="8" r="5.5" />
    <path d="M6.2 6.4a1.9 1.9 0 113 1.4c-.6.5-1.2.8-1.2 1.6M8 11.4v.1" />
  </svg>,
];

function KbdDemo({ combo, variant, size, theme, separator, listen }: { combo: string; variant: "raised" | "flat" | "outline"; size: "sm" | "md" | "lg"; theme: "dark" | "light"; separator: boolean; listen: boolean }) {
  const light = theme === "light";
  const muted = light ? "text-black/55" : "text-white/55";
  return (
    <div className={`flex h-[400px] w-full flex-col items-center justify-center gap-6 rounded-xl px-6 ${light ? "bg-white" : "bg-[#080808]"}`}>
      <Kbd combo={combo} variant={variant} size={size} theme={theme} separator={separator} listen={listen} />
      {listen && <p className={`m-0 text-sm ${muted}`}>Press the keys on your keyboard</p>}
    </div>
  );
}

function EmptyStateDemo({ preset, variant, size, theme, float, showDescription, showActions }: { preset: "inbox" | "search" | "folder" | "cart" | "error"; variant: "plain" | "card" | "dashed"; size: "sm" | "md" | "lg"; theme: "dark" | "light"; float: boolean; showDescription: boolean; showActions: boolean }) {
  const light = theme === "light";
  const btnBase = { cursor: "pointer", borderRadius: 999, padding: "9px 18px", fontSize: 14, lineHeight: "20px", fontFamily: "Inter, sans-serif" } as const;
  const primary = { ...btnBase, fontWeight: 600, border: "1px solid transparent", background: light ? "#0A0A0A" : "#F5F4F1", color: light ? "#FFFFFF" : "#0A0A0A" } as const;
  const ghost = { ...btnBase, fontWeight: 500, background: "transparent", border: `1px solid ${light ? "rgba(10,10,10,0.22)" : "rgba(255,255,255,0.22)"}`, color: light ? "rgba(10,10,10,0.8)" : "rgba(245,244,241,0.85)" } as const;
  return (
    <div className={`flex min-h-[460px] w-full items-center justify-center rounded-xl px-6 py-10 ${light ? "bg-white" : "bg-[#080808]"}`}>
      <EmptyState
        key={`${preset}-${variant}-${size}`}
        preset={preset}
        variant={variant}
        size={size}
        theme={theme}
        float={float}
        description={showDescription ? undefined : ""}
        action={showActions ? <button type="button" style={primary}>{preset === "error" ? "Try again" : preset === "search" ? "Clear filters" : preset === "cart" ? "Browse catalog" : "Get started"}</button> : undefined}
        secondaryAction={showActions ? <button type="button" style={ghost}>Learn more</button> : undefined}
      />
    </div>
  );
}

function WordRevealDemo({
  animPreset,
}: {
  animPreset?: "fade-up" | "blur-in" | "fade-only" | "spring-up";
}) {
  const [run, setRun] = React.useState(0);
  return (
    <div className="relative flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808]">
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur transition-colors hover:bg-white/20"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset
      </button>
      <WordReveal key={run} triggerMode="inview" animPreset={animPreset} />
    </div>
  );
}

// Playground-wrapped previews for the handful of components with a theme,
// status or other prop worth trying live. Only read by
// /preview/[slug]/page.tsx (a Client Component, so a function child of
// <Playground> is fine there) — never by the Server-rendered grid/homepage,
// which stay on the plain `registryPreviews` above. Slugs not listed here
// simply fall back to `registryPreviews` at the call site.
export const registryPlaygroundPreviews: Partial<
  Record<string, () => React.ReactNode>
> = {
  "countdown-timer": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "compact",
          label: "Compact",
          defaultValue: false,
        },
        {
          type: "select",
          key: "shape",
          label: "Shape",
          options: ["rounded", "square", "circle"],
          optionLabels: ["Rounded", "Square", "Circle"],
          defaultValue: "rounded",
        },
        { type: "toggle", key: "labels", label: "Labels", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
          <CountdownTimer
            endDate={oneWeekFromNow()}
            compact={v.compact as boolean}
            cellShape={v.shape as "rounded" | "square" | "circle"}
            showLabel={v.labels as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "logo-spin": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "mode",
          label: "Mode",
          options: ["flat", "orbit"],
          optionLabels: ["Flat", "Orbit"],
          defaultValue: "flat",
        },
        {
          type: "toggle",
          key: "counterclockwise",
          label: "Counterclockwise",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <div className="mx-auto aspect-square w-full max-w-[600px]">
            <LogoSpin
              {...LOGO_SPIN_THEME_PROPS}
              mode={v.mode as "flat" | "orbit"}
              direction={v.counterclockwise ? "counterclockwise" : "clockwise"}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "shooting-stars": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["midnight", "deepspace", "andromeda", "titanium"],
          optionLabels: ["Midnight", "Deep Space", "Andromeda", "Titanium"],
          defaultValue: "midnight",
        },
        {
          type: "select",
          key: "style",
          label: "Style",
          options: ["minimal", "classic", "comet", "streak", "neon"],
          optionLabels: ["Minimal", "Classic", "Comet", "Streak", "Neon"],
          defaultValue: "minimal",
        },
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["right", "both", "left"],
          optionLabels: ["Right", "Both", "Left"],
          defaultValue: "left",
        },
        {
          type: "range",
          key: "interval",
          label: "Interval",
          min: 0.5,
          max: 30,
          step: 0.5,
          defaultValue: 2,
        },
        {
          type: "toggle",
          key: "meteorShower",
          label: "Meteors",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="relative h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ShootingStars
            colorTheme={
              v.theme as "midnight" | "deepspace" | "andromeda" | "titanium"
            }
            meteorStyle={
              v.style as "minimal" | "classic" | "comet" | "streak" | "neon"
            }
            shootingStarDirection={v.direction as "left" | "right" | "both"}
            shootingStarInterval={v.interval as number}
            meteorShower={v.meteorShower as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "cosmic-background": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["#050c1a", "#0a0614", "#080808"],
          optionLabels: ["Deep Space", "Void", "Obsidian"],
          defaultValue: "#050c1a",
        },
      ]}
    >
      {(v) => (
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <CosmicBackground backgroundColor={v.theme as string} />
        </div>
      )}
    </Playground>
  ),
  "announcement-banner": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light", "glass", "brand"],
          optionLabels: ["Dark", "Light", "Purple", "Brand"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "countdown",
          label: "Countdown",
          defaultValue: true,
        },
        { type: "toggle", key: "coupon", label: "Coupon", defaultValue: true },
        { type: "toggle", key: "cta", label: "CTA Button", defaultValue: true },
        { type: "toggle", key: "ticker", label: "Ticker", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <AnnouncementBanner
            theme={v.theme as "dark" | "light" | "glass" | "brand"}
            showCountdown={v.countdown as boolean}
            showCoupon={v.coupon as boolean}
            showCta={v.cta as boolean}
            tickerMode={v.ticker as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "progress-timeline": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "numberGlow",
          label: "Number Glow",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "hover",
          label: "Hover Reveal",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "horizontal",
          label: "Horizontal",
          defaultValue: false,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 64,
          step: 4,
          defaultValue: 20,
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 1500,
          max: 2000,
          step: 25,
          defaultValue: 1700,
        },
      ]}
    >
      {(v) => (
        <div className="relative w-full overflow-hidden rounded-xl bg-[#080808]">
          <ProgressTimeline
            gap={v.gap as number}
            contentMaxWidth={320}
            numberGlow={v.numberGlow as boolean}
            revealMode={v.hover ? "hover" : "always"}
            orientation={v.horizontal ? "horizontal" : "vertical"}
            revealDuration={v.speed as number}
          />
        </div>
      )}
    </Playground>
  ),
  "rating-stars": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        { type: "toggle", key: "glow", label: "Glow", defaultValue: false },
        { type: "toggle", key: "label", label: "Label", defaultValue: true },
        {
          type: "select",
          key: "labelStyle",
          label: "Style",
          options: ["score", "fraction", "percent", "label"],
          optionLabels: ["#", "÷", "%", "A"],
          defaultValue: "score",
        },
        { type: "toggle", key: "bar", label: "Bar", defaultValue: false },
        { type: "toggle", key: "anim", label: "Anim", defaultValue: true },
        { type: "toggle", key: "wave", label: "Wave", defaultValue: false },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div
          className="flex h-[400px] w-full items-center justify-center rounded-xl p-10"
          style={{ background: v.theme === "dark" ? "#080808" : "#FFFFFF" }}
        >
          <RatingStars
            defaultValue={4}
            sizePreset={v.size as "sm" | "md" | "lg"}
            showGlow={v.glow as boolean}
            showLabel={v.label as boolean}
            labelStyle={
              v.labelStyle as "score" | "fraction" | "percent" | "label"
            }
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
        {
          type: "select",
          key: "reflexMode",
          label: "Reflex",
          options: ["diamond", "holographic", "aurora"],
          optionLabels: ["Diamond", "Holographic", "Aurora"],
          defaultValue: "diamond",
        },
        {
          type: "toggle",
          key: "showText",
          label: "Show Text",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex w-full items-center justify-center rounded-xl bg-[#080808] px-6 py-[50px]">
          <div className="aspect-square w-full max-w-[500px]">
            <GlareCard
              title="Glare Card"
              subtitle="Cursor-reactive tilt & reflections."
              image="/demo/21.webp"
              reflexMode={v.reflexMode as "diamond" | "holographic" | "aurora"}
              showText={v.showText as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "infinite-marquee": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["left", "right"],
          optionLabels: ["← Left", "→ Right"],
          defaultValue: "left",
        },
        {
          type: "select",
          key: "textStyle",
          label: "Text Style",
          options: ["solid", "gradient", "outline"],
          optionLabels: ["Solid", "Gradient", "Outline"],
          defaultValue: "solid",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => {
        const fg = v.theme === "dark" ? "#ffffff" : "#000000";
        return (
          <div
            className="flex h-[400px] w-full items-center overflow-hidden rounded-xl bg-[#080808]"
            style={{ background: v.theme === "dark" ? "#000000" : "#ffffff" }}
          >
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
  "footer-premium": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <FooterPremium
            theme={v.theme as "dark" | "light"}
            showBadge
            showPill
          />
        </div>
      )}
    </Playground>
  ),
  "footer-section": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FooterSection theme={v.theme as "dark" | "light"} />
        </div>
      )}
    </Playground>
  ),
  "footer-columns": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "glass",
          label: "Glass Theme",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FooterColumns theme={v.glass ? "glass" : "paper"} />
        </div>
      )}
    </Playground>
  ),
  "footer-cta": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "glass",
          label: "Glass Theme",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FooterCta theme={v.glass ? "glass" : "paper"} />
        </div>
      )}
    </Playground>
  ),
  "your-cart-page": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "anim", label: "Anim", options: ["blur", "slide", "fade", "scale"], optionLabels: ["Blur", "Slide", "Fade", "Scale"], defaultValue: "blur" },
        { type: "select", key: "step", label: "Start step", options: ["1", "2", "3"], optionLabels: ["Cart", "Checkout", "Confirmed"], defaultValue: "1" },
        { type: "range", key: "shipping", label: "Shipping", min: 0, max: 30, step: 1, defaultValue: 0 },
        { type: "color", key: "accent", label: "Accent", defaultValue: "#7CDE6A" },
      ]}
    >
      {(v) => (
        <div className={`w-full overflow-hidden rounded-xl ${v.theme === "light" ? "bg-white" : "bg-[#0a0a0a]"}`}>
          <YourCartPage
            key={String(v.step)}
            items={YOUR_CART_ITEMS}
            defaultValues={YOUR_CART_FORM}
            defaultStep={Number(v.step) as 1 | 2 | 3}
            theme={v.theme as "dark" | "light"}
            animation={v.anim as "blur" | "slide" | "fade" | "scale"}
            shippingAmount={Number(v.shipping)}
            accentColor={String(v.accent)}
          />
        </div>
      )}
    </Playground>
  ),
  "stat-feature": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "anim", label: "Anim", options: ["blur", "slide", "fade", "scale"], optionLabels: ["Blur", "Slide", "Fade", "Scale"], defaultValue: "blur" },
        { type: "toggle", key: "trend", label: "Show trend", defaultValue: true },
        { type: "toggle", key: "replay", label: "Replay on re-enter", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`w-full overflow-hidden rounded-xl ${v.theme === "light" ? "bg-white" : "bg-[#0a0a0a]"}`}>
          <StatFeature
            {...STAT_FEATURE_PROPS}
            theme={v.theme as "dark" | "light"}
            animation={v.anim as "blur" | "slide" | "fade" | "scale"}
            showTrend={Boolean(v.trend)}
            replayOnReenter={Boolean(v.replay)}
          />
        </div>
      )}
    </Playground>
  ),
  "product-list": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "tiers", label: "Price tiers", defaultValue: true },
        { type: "color", key: "accent", label: "Accent", defaultValue: "#7CDE6A" },
      ]}
    >
      {(v) => (
        <div className={`w-full overflow-hidden rounded-xl ${v.theme === "light" ? "bg-white" : "bg-[#0a0a0a]"}`}>
          <ProductList
            key={String(v.tiers)}
            theme={v.theme as "dark" | "light"}
            accentColor={String(v.accent)}
            products={v.tiers ? PRODUCT_LIST_ITEMS : PRODUCT_LIST_ITEMS.map((item) => ({ ...item, tier: undefined }))}
          />
        </div>
      )}
    </Playground>
  ),
  "product-detail": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "tab", label: "Default tab", options: ["description", "specs", "reviews"], optionLabels: ["Description", "Specs", "Reviews"], defaultValue: "specs" },
        { type: "range", key: "rating", label: "Rating", min: 0, max: 5, step: 1, defaultValue: 5 },
        { type: "toggle", key: "compare", label: "Compare-at price", defaultValue: true },
        { type: "toggle", key: "badge", label: "Shipping badge", defaultValue: true },
        { type: "color", key: "accent", label: "Accent", defaultValue: "#F2A841" },
      ]}
    >
      {(v) => (
        <div className={`w-full overflow-hidden rounded-xl ${v.theme === "light" ? "bg-white" : "bg-[#0a0a0a]"}`}>
          <ProductDetail
            key={String(v.tab)}
            theme={v.theme as "dark" | "light"}
            defaultTab={v.tab as "description" | "specs" | "reviews"}
            breadcrumb={["Home", "Shop", "Accessories", "Minimal Watch"]}
            title="Minimal Watch"
            rating={Number(v.rating)}
            reviewCount={124}
            price="$79.00"
            compareAtPrice={v.compare ? "$129.00" : undefined}
            description="A quiet, matte-black watch with a slim case and a soft leather strap. Designed to disappear on the wrist and go with everything."
            longDescription="A quiet, matte-black watch with a slim case and a soft leather strap. Designed to disappear on the wrist and go with everything, from a desk to a dinner."
            reviewsBody="Customers love the slim profile, the soft strap and how little attention the watch asks for."
            gallery={PRODUCT_DETAIL_GALLERY}
            colors={PRODUCT_DETAIL_COLORS}
            sizes={PRODUCT_DETAIL_SIZES}
            defaultSizeIndex={2}
            specs={PRODUCT_DETAIL_SPECS}
            badge={v.badge ? "Free shipping" : undefined}
            accentColor={String(v.accent)}
          />
        </div>
      )}
    </Playground>
  ),
  "footer-wordmark": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "glass",
          label: "Glass Theme",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FooterWordmark theme={v.glass ? "glass" : "paper"} />
        </div>
      )}
    </Playground>
  ),
  "testimonial-slider": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["midnight", "pearl", "ember", "luxe", "sage"],
          optionLabels: ["Midnight", "Pearl", "Ember", "Luxe", "Sage"],
          defaultValue: "pearl",
        },
        {
          type: "select",
          key: "effect",
          label: "FX",
          options: ["fade", "blur", "float"],
          optionLabels: ["Fade", "Blur", "Float"],
          defaultValue: "fade",
        },
        {
          type: "toggle",
          key: "rating",
          label: "★ Rating",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "counter",
          label: "# Counter",
          defaultValue: true,
        },
        { type: "toggle", key: "dots", label: "• Dots", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center px-6 sm:px-10">
          <div className="w-full max-w-[1100px]">
            <TestimonialSlider
              autoPlay={false}
              showShadow
              testimonials={TESTIMONIAL_SLIDER_ITEMS}
              theme={
                v.theme as "midnight" | "pearl" | "ember" | "luxe" | "sage"
              }
              transitionEffect={v.effect as "fade" | "blur" | "float"}
              showRating={v.rating as boolean}
              showCounter={v.counter as boolean}
              showDots={v.dots as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "team-drawer": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "position",
          label: "Position",
          options: ["right", "bottom", "left"],
          optionLabels: ["→ Right", "↓ Bottom", "← Left"],
          defaultValue: "right",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <TeamDrawer
            contained
            columns={4}
            members={TEAM_DRAWER_MEMBERS}
            defaultPosition={v.position as "right" | "bottom" | "left"}
            className="h-full p-4"
          />
        </div>
      )}
    </Playground>
  ),
  "accordion-cards": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "radius",
          label: "Radius",
          min: 0,
          max: 40,
          step: 2,
          defaultValue: 20,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 32,
          step: 2,
          defaultValue: 10,
        },
        { type: "toggle", key: "glow", label: "Glow", defaultValue: true },
        { type: "toggle", key: "index", label: "Number", defaultValue: true },
        {
          type: "toggle",
          key: "parallax",
          label: "Parallax",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full">
          <AccordionCards
            borderRadius={v.radius as number}
            gap={v.gap as number}
            showGlow={v.glow as boolean}
            showIndex={v.index as boolean}
            showParallax={v.parallax as boolean}
            cards={[
              {
                title: "Speed is a state of mind.",
                description:
                  "Every pedal stroke is a conversation between body and machine. Push past the threshold, that's where performance lives.",
                image: "/demo/34.webp",
              },
              {
                title: "Run like the finish line doesn't exist.",
                description:
                  "Stride, breathe, repeat. The blur in the frame is proof you were moving too fast to be contained.",
                image: "/demo/31.webp",
              },
              {
                title: "Find your rhythm in the deep.",
                description:
                  "Water doesn't resist, it reveals. The silent discipline of every stroke shapes the athlete you become.",
                image: "/demo/33.webp",
              },
              {
                title: "Motion is the only truth.",
                description:
                  "In that split second between launch and landing, everything unnecessary falls away. Only form remains.",
                image: "/demo/32.webp",
              },
              {
                title: "The mountain doesn't wait.",
                description:
                  "Gravity is the opponent. Technique is the answer. Lean in, hold your line, and trust the edge.",
                image: "/demo/25.webp",
              },
            ]}
          />
        </div>
      )}
    </Playground>
  ),
  "animated-stats": () => (
    <Playground
      controls={[
        { type: "toggle", key: "dark", label: "Dark", defaultValue: true },
        {
          type: "select",
          key: "animation",
          label: "Animation",
          options: ["blur", "slide", "fade", "scale"],
          optionLabels: ["Blur", "Slide", "Fade", "Scale"],
          defaultValue: "blur",
        },
        {
          type: "range",
          key: "numberSize",
          label: "Number Size",
          min: 24,
          max: 96,
          step: 2,
          defaultValue: 48,
        },
        {
          type: "range",
          key: "labelSize",
          label: "Label Size",
          min: 10,
          max: 24,
          step: 1,
          defaultValue: 13,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 40,
          step: 2,
          defaultValue: 10,
        },
        {
          type: "range",
          key: "radius",
          label: "Radius",
          min: 0,
          max: 48,
          step: 2,
          defaultValue: 20,
        },
      ]}
    >
      {(v) => (
        <AnimatedStats
          theme={v.dark ? "dark" : "light"}
          animation={v.animation as "blur" | "slide" | "fade" | "scale"}
          numberSize={v.numberSize as number}
          labelSize={v.labelSize as number}
          itemGap={v.gap as number}
          borderRadius={v.radius as number}
        />
      )}
    </Playground>
  ),
  "whatsapp-widget": () => (
    <Playground controls={[AVAILABILITY_CONTROL]}>
      {(v) => (
        <div className="flex justify-end pt-[540px]">
          <WhatsAppWidget
            phoneNumber="905551234567"
            availability={v.availability as "online" | "away" | "offline"}
            fixed={false}
            position="bottom-right"
            popupDelay={0}
            autoOpenDelay={0}
          />
        </div>
      )}
    </Playground>
  ),
  "discord-chat-widget": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "availability",
          label: "Status",
          options: ["online", "idle", "dnd", "offline"],
          optionLabels: ["Online", "Idle", "DND", "Offline"],
          defaultValue: "online",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex justify-end pt-[560px]">
          <DiscordChatWidget
            inviteCode="reactframe"
            availability={
              v.availability as "online" | "idle" | "dnd" | "offline"
            }
            theme={v.theme as "dark" | "light"}
            fixed={false}
            position="bottom-right"
            popupDelay={0}
            autoOpenDelay={0}
          />
        </div>
      )}
    </Playground>
  ),
  "telegram-widget": () => (
    <Playground controls={[AVAILABILITY_CONTROL]}>
      {(v) => (
        <div className="flex justify-end pt-[540px]">
          <TelegramWidget
            username="reactframe"
            availability={v.availability as "online" | "away" | "offline"}
            fixed={false}
            position="bottom-right"
            popupDelay={0}
            autoOpenDelay={0}
          />
        </div>
      )}
    </Playground>
  ),
  "messenger-widget": () => (
    <Playground controls={[AVAILABILITY_CONTROL]}>
      {(v) => (
        <div className="flex justify-end pt-[540px]">
          <MessengerWidget
            pageId="reactframe"
            availability={v.availability as "online" | "away" | "offline"}
            fixed={false}
            position="bottom-right"
            popupDelay={0}
            autoOpenDelay={0}
          />
        </div>
      )}
    </Playground>
  ),
  "instagram-widget": () => (
    <Playground controls={[AVAILABILITY_CONTROL]}>
      {(v) => (
        <div className="flex justify-end pt-[600px]">
          <InstagramWidget
            agentHandle="reactframe"
            availability={v.availability as "online" | "away" | "offline"}
            fixed={false}
            position="bottom-right"
            popupDelay={0}
            autoOpenDelay={0}
          />
        </div>
      )}
    </Playground>
  ),
  "x-twitter-widget": () => (
    <Playground
      controls={[
        AVAILABILITY_CONTROL,
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["light", "dark"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "light",
        },
      ]}
    >
      {(v) => (
        <div className="flex justify-end pt-[540px]">
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
    <Playground
      controls={[
        {
          type: "toggle",
          key: "vertical",
          label: "Vertical",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <CompareSlider
            direction={v.vertical ? "vertical" : "horizontal"}
            beforeImage="/demo/compare1.webp"
            afterImage="/demo/compare2.webp"
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
        {
          type: "range",
          key: "radius",
          label: "Radius",
          min: 0,
          max: 80,
          step: 2,
          defaultValue: 24,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
          <div className="h-[300px] w-72 max-w-full">
            <GlowCard
              backgroundImage="/demo/22.webp"
              text="Amelia Hartwell"
              textPosition={
                v.textPosition as "top-left" | "center" | "bottom-right"
              }
              radius={Number(v.radius)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "image-showcase": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showCounter",
          label: "Counter",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showReset",
          label: "Reset Button",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[600px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-[#080808]">
            <ImageShowcase
              height={340}
              showCounter={v.showCounter as boolean}
              showReset={v.showReset as boolean}
              images={IMAGE_SHOWCASE_IMAGES}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "gallery-lightbox": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "columns",
          label: "Columns",
          min: 2,
          max: 4,
          step: 1,
          defaultValue: 3,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 48,
          step: 2,
          defaultValue: 12,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <GalleryLightbox
            images={GALLERY_LIGHTBOX_IMAGES}
            columns={v.columns as number}
            gap={v.gap as number}
          />
        </div>
      )}
    </Playground>
  ),
  "flowing-menu": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "uppercase",
          label: "Uppercase",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showBorders",
          label: "Borders",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <FlowingMenu
            uppercase={v.uppercase as boolean}
            showBorders={v.showBorders as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "glass-navigation": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "colorScheme",
          label: "Theme",
          options: ["light", "dark"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "light",
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[500px] w-full justify-center rounded-xl bg-[#080808] px-6 pt-8">
          <div className="h-full w-full max-w-2xl">
            <GlassNavigation
              colorScheme={v.colorScheme as "light" | "dark"}
              cta={
                v.colorScheme === "dark"
                  ? GLASS_NAV_DEMO_CTA.dark
                  : GLASS_NAV_DEMO_CTA.light
              }
              navFontSize={48}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "navbar-menu": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["paper", "glass"],
          optionLabels: ["Paper", "Glass"],
          defaultValue: "paper",
        },
        { type: "toggle", key: "showLogo", label: "Logo", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className="h-[540px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border px-4 pt-10 max-sm:h-[560px] max-sm:px-2 lg:h-[440px]">
          <NavbarMenu
            theme={v.theme as "paper" | "glass"}
            showLogo={v.showLogo as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "testimonial-wall": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "flowMode",
          label: "Flow",
          options: ["horizontal", "vertical"],
          optionLabels: ["Horizontal", "Vertical"],
          defaultValue: "horizontal",
        },
        {
          type: "select",
          key: "rowCount",
          label: "Rows",
          options: ["1", "2", "3"],
          defaultValue: "2",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <TestimonialWall
            backgroundColor="#080808"
            maskColor="#080808"
            flowMode={v.flowMode as "horizontal" | "vertical"}
            rowCount={Number(v.rowCount) as 1 | 2 | 3}
          />
        </div>
      )}
    </Playground>
  ),
  "testimonial-spotlight": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "transitionType",
          label: "Transition",
          options: ["crossfade", "slide", "iris"],
          optionLabels: ["Crossfade", "Slide", "Iris"],
          defaultValue: "crossfade",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <TestimonialSpotlight
            transitionType={v.transitionType as "crossfade" | "slide" | "iris"}
          />
        </div>
      )}
    </Playground>
  ),
  "team-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "indicatorStyle",
          label: "Indicator",
          options: ["dots", "counter", "both"],
          optionLabels: ["Dots", "Counter", "Both"],
          defaultValue: "dots",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full">
          <TeamCarousel
            indicatorStyle={v.indicatorStyle as "dots" | "counter" | "both"}
          />
        </div>
      )}
    </Playground>
  ),
  "phone-marquee-showcase": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "frameColor",
          label: "Frame",
          options: [
            "Natural Titanium",
            "Blue Titanium",
            "White Titanium",
            "Black Titanium",
          ],
          defaultValue: "Natural Titanium",
        },
        {
          type: "color",
          key: "glowColor",
          label: "Glow",
          defaultValue: "#6060FF",
        },
        {
          type: "toggle",
          key: "tilt",
          label: "Cursor Tilt",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full">
          <PhoneMarqueeShowcase
            frameColor={
              v.frameColor as
                | "Natural Titanium"
                | "Blue Titanium"
                | "White Titanium"
                | "Black Titanium"
            }
            glowColor={v.glowColor as string}
            tilt={v.tilt as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "phone-mockup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "frameColor",
          label: "Frame",
          options: ["titanium", "black"],
          optionLabels: ["Titanium", "Black"],
          defaultValue: "titanium",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden">
          <PhoneMockup
            media={PHONE_MOCKUP_MEDIA}
            frameColor={v.frameColor as "titanium" | "black"}
          />
        </div>
      )}
    </Playground>
  ),
  "browser-mockup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "browserStyle",
          label: "Style",
          options: ["mac", "windows", "mobile"],
          optionLabels: ["macOS", "Windows", "Mobile"],
          defaultValue: "mac",
        },
      ]}
    >
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
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["light", "dark"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "light",
        },
      ]}
    >
      {(v) => (
        <div className="w-[360px]">
          <InstagramPostMockup
            theme={v.theme as "light" | "dark"}
            media={[
              "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
              "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
            ]}
          />
        </div>
      )}
    </Playground>
  ),
  "x-post-mockup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="w-[420px]">
          <XPostMockup
            theme={v.theme as "dark" | "light"}
            mediaImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=80"
          />
        </div>
      )}
    </Playground>
  ),
  "linkedin-post-mockup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["light", "dark"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "light",
        },
      ]}
    >
      {(v) => (
        <div className="flex w-full items-center justify-center py-10">
          <div className="w-[420px] max-w-full">
            <LinkedInPostMockup
              theme={v.theme as "light" | "dark"}
              mediaImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "cylinder-gallery": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "speed",
          label: "Speed",
          options: ["slow", "normal", "fast"],
          optionLabels: ["Slow", "Normal", "Fast"],
          defaultValue: "normal",
        },
      ]}
    >
      {(v) => {
        const speed = v.speed === "slow" ? 0.8 : v.speed === "fast" ? 5 : 2.2;
        return (
          <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
            <CylinderGallery
              rows={2}
              columns={7}
              cylinderRadius={260}
              cardWidth={220}
              cardHeight={160}
              rotationSpeed={speed}
            />
          </div>
        );
      }}
    </Playground>
  ),
  "gallery-expand": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "transitionStyle",
          label: "Transition",
          options: ["smooth", "spring", "bounce", "snap", "linear"],
          defaultValue: "smooth",
        },
      ]}
    >
      {(v) => (
        <div className="h-[400px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <GalleryExpand
            className="h-full"
            bgColor="#000000"
            images={GALLERY_EXPAND_IMAGES}
            transitionStyle={
              v.transitionStyle as
                "smooth" | "spring" | "bounce" | "snap" | "linear"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "gallery-curve": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <GalleryCurve theme={v.theme as "dark" | "light"} />
        </div>
      )}
    </Playground>
  ),
  "gallery-reveal": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "layout",
          label: "Layout",
          options: ["3x2", "2x3"],
          defaultValue: "3x2",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <GalleryReveal
            theme={v.theme as "light" | "dark"}
            columns={v.layout === "2x3" ? 2 : 3}
          />
        </div>
      )}
    </Playground>
  ),
  "rotate-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "side",
          label: "Side",
          options: ["left", "right", "both"],
          defaultValue: "left",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <RotateCarousel side={v.side as "left" | "right" | "both"} />
        </div>
      )}
    </Playground>
  ),
  "hero-slider-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "transitionStyle",
          label: "Transition",
          options: ["fade", "slide"],
          defaultValue: "fade",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <HeroSliderCarousel
            autoPlay={false}
            transitionStyle={v.transitionStyle as "fade" | "slide"}
          />
        </div>
      )}
    </Playground>
  ),
  "skew-scroll-gallery": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "highSkew",
          label: "Extra skew",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <SkewScrollGallery skewIntensity={v.highSkew ? 70 : 40} />
        </div>
      )}
    </Playground>
  ),
  "orbit-logo-wheel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["clockwise", "counterclockwise"],
          defaultValue: "clockwise",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <OrbitLogoWheel
            designSize={380}
            radius={130}
            logoSize={64}
            direction={v.direction as "clockwise" | "counterclockwise"}
          />
        </div>
      )}
    </Playground>
  ),
  "logo-marquee": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["left", "right"],
          optionLabels: ["Left", "Right"],
          defaultValue: "left",
        },
        {
          type: "toggle",
          key: "edgeBlur",
          label: "Edge Blur",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center overflow-hidden rounded-xl bg-[#080808]">
          <LogoMarquee
            direction={v.direction as "left" | "right"}
            edgeBlur={Boolean(v.edgeBlur)}
          />
        </div>
      )}
    </Playground>
  ),
  "progress-circle-bars": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "arcStyle",
          label: "Style",
          options: ["dashes", "ring", "gauge"],
          optionLabels: ["Dashes", "Ring", "Gauge"],
          defaultValue: "dashes",
        },
        {
          type: "select",
          key: "percentage",
          label: "Percentage",
          options: ["25", "50", "75", "100"],
          defaultValue: "75",
        },
        {
          type: "toggle",
          key: "thresholdsEnabled",
          label: "Color Thresholds",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808]">
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
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
          <div className="w-full max-w-[720px]">
            <BarChart theme={v.theme as "dark" | "light"} chartHeight={420} />
          </div>
        </div>
      )}
    </Playground>
  ),
  "line-chart": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
          <div className="w-full max-w-[720px]">
            <LineChart theme={v.theme as "dark" | "light"} chartHeight={420} />
          </div>
        </div>
      )}
    </Playground>
  ),
  "pie-chart": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
          <div className="w-full max-w-[720px]">
            <PieChart
              theme={v.theme as "dark" | "light"}
              chartHeight={560}
              outerRadius={200}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "radar-chart": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-6">
          <div className="w-full max-w-[680px]">
            <RadarChart
              theme={v.theme as "dark" | "light"}
              chartHeight={420}
              outerRadius={190}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "range-area-chart": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-4 py-10 sm:h-[700px] sm:px-6">
          <div className="w-full max-w-[709px]">
            <RangeAreaChart
              theme={v.theme as "dark" | "light"}
              chartHeight={420}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "latency-trace-diagram": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-4 py-10 sm:h-[700px] sm:px-6">
          <div className="w-full max-w-[820px]">
            <LatencyTraceDiagram theme={v.theme as "dark" | "light"} />
          </div>
        </div>
      )}
    </Playground>
  ),
  "neural-logic-graph": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <NeuralLogicGraph theme={v.theme as "dark" | "light"} />
        </div>
      )}
    </Playground>
  ),
  "arc-mood-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "mood",
          label: "Mood",
          options: ["editorial", "luxury", "chaos", "raw"],
          optionLabels: ["Editorial", "Luxury", "Chaos", "Raw"],
          defaultValue: "editorial",
        },
        { type: "toggle", key: "tilt", label: "Tilt", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ArcMoodCarousel
            mood={v.mood as "editorial" | "luxury" | "chaos" | "raw"}
            tilt={v.tilt as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "tearable-reveal": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "surfaceStyle",
          label: "Cloth Style",
          options: ["textured", "smooth"],
          optionLabels: ["Textured", "Smooth"],
          defaultValue: "textured",
        },
        {
          type: "select",
          key: "tearEdgeStyle",
          label: "Edge Style",
          options: ["jagged", "rounded", "both"],
          optionLabels: ["Jagged", "Rounded", "Both"],
          defaultValue: "jagged",
        },
        {
          type: "toggle",
          key: "pinTopRow",
          label: "Pin Top Row",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showParticles",
          label: "Particles",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
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
  "scroll-title-gallery": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "stylePreset",
          label: "Preset",
          options: ["custom", "cinematic", "neon", "minimal"],
          optionLabels: ["Custom", "Cinematic", "Neon", "Minimal"],
          defaultValue: "custom",
        },
        {
          type: "select",
          key: "titleMode",
          label: "Title",
          options: ["words", "numbers", "roman"],
          optionLabels: ["Words", "Numbers", "Roman"],
          defaultValue: "words",
        },
        {
          type: "select",
          key: "contentPosition",
          label: "Content",
          options: ["top-left", "top-right"],
          optionLabels: ["Top Left", "Top Right"],
          defaultValue: "top-left",
        },
        { type: "toggle", key: "kenBurns", label: "Zoom", defaultValue: false },
        {
          type: "toggle",
          key: "showNavDots",
          label: "Dots",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showProgressRail",
          label: "Rail",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ScrollTitleGallery
            stylePreset={
              v.stylePreset as "custom" | "cinematic" | "neon" | "minimal"
            }
            titleMode={v.titleMode as "words" | "numbers" | "roman"}
            contentPosition={v.contentPosition as "top-left" | "top-right"}
            kenBurns={v.kenBurns as boolean}
            showNavDots={v.showNavDots as boolean}
            showProgressRail={v.showProgressRail as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "cards-gallery-ring": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="h-[900px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <CardsGalleryRing theme={v.theme as "dark" | "light"} />
        </div>
      )}
    </Playground>
  ),
  "social-reels-grid": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "themeMode",
          label: "Theme",
          options: ["glass", "paper"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "glass",
        },
        {
          type: "range",
          key: "borderRadius",
          label: "Corner Radius",
          min: 0,
          max: 48,
          step: 1,
          defaultValue: 18,
        },
        {
          type: "select",
          key: "cardRatio",
          label: "Card Ratio",
          options: ["9 / 16", "3 / 4", "4 / 5", "1 / 1"],
          optionLabels: ["9:16", "3:4", "4:5", "1:1"],
          defaultValue: "9 / 16",
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 48,
          step: 2,
          defaultValue: 20,
        },
        {
          type: "select",
          key: "playTrigger",
          label: "Play Trigger",
          options: ["hover", "click"],
          optionLabels: ["Hover", "Click"],
          defaultValue: "hover",
        },
      ]}
    >
      {(v) => (
        <div className="h-[720px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <SocialReelsGrid
            themeMode={v.themeMode as "glass" | "paper"}
            borderRadius={v.borderRadius as number}
            cardRatio={v.cardRatio as "9 / 16" | "3 / 4" | "4 / 5" | "1 / 1"}
            gap={v.gap as number}
            playTrigger={v.playTrigger as "hover" | "click"}
          />
        </div>
      )}
    </Playground>
  ),
  "tech-stack-section": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "itemNameUppercase",
          label: "Uppercase Names",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <TechStackSection
            itemNameUppercase={v.itemNameUppercase as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "case-study-section": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "firstCaseOpen",
          label: "First Open",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <CaseStudySection firstCaseOpen={v.firstCaseOpen as boolean} />
        </div>
      )}
    </Playground>
  ),
  "liquid-glass-video": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showSpeed",
          label: "Speed Control",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <LiquidGlassVideo
            showSpeed={v.showSpeed as boolean}
            vimeoUrl="https://vimeo.com/76979871"
            vimeoThumbnail="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80"
          />
        </div>
      )}
    </Playground>
  ),
  "aura-cursor": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "triggerMode",
          label: "Trigger",
          options: ["always", "click", "hover"],
          optionLabels: ["Always", "Click", "Hover"],
          defaultValue: "always",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <AuraCursor
            theme={v.theme as "dark" | "light"}
            triggerMode={v.triggerMode as "always" | "click" | "hover"}
          />
        </div>
      )}
    </Playground>
  ),
  "data-table": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] px-4 py-10 sm:h-[700px] sm:px-6">
          <div className="h-[520px] w-full max-w-[900px]">
            <DataTable theme={v.theme as "dark" | "light"} />
          </div>
        </div>
      )}
    </Playground>
  ),
  "kanban-board": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "defaultTheme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <KanbanBoard
            key={v.defaultTheme as string}
            defaultTheme={v.defaultTheme as "dark" | "light"}
            showThemeToggle={false}
          />
        </div>
      )}
    </Playground>
  ),
  "about-founder-section": () => (
    <Playground
      controls={[
        {
          type: "color",
          key: "headingLine2Color",
          label: "Accent",
          defaultValue: "#9ca3af",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <AboutFounderSection
            headingLine2Color={v.headingLine2Color as string}
          />
        </div>
      )}
    </Playground>
  ),
  "expand-card-grid": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showIndex",
          label: "Show Index",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ExpandCardGrid
            showIndex={Boolean(v.showIndex)}
            items={[
              {
                title: "Mountains",
                description: "Alpine ridgelines at first light.",
                buttonText: "View",
                src: "/demo/105.webp",
              },
              {
                title: "Forest",
                description: "Deep green canopy, quiet trails.",
                buttonText: "View",
                src: "/demo/102.webp",
              },
              {
                title: "Coast",
                description: "Where the cliffs meet the sea.",
                buttonText: "View",
                src: "/demo/109.webp",
              },
              {
                title: "Desert",
                description: "Dunes shaped by wind and time.",
                buttonText: "View",
                src: "/demo/111.webp",
              },
            ]}
          />
        </div>
      )}
    </Playground>
  ),
  "linen-drag-image": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <LinenDragImage />
    </div>
  ),
  "blog-card-vertical": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light", "glass"],
          optionLabels: ["Dark", "Light", "Glass"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-y-auto rounded-xl bg-neutral-950 p-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
            {BLOG_CARD_VERTICAL_POSTS.map((post, i) => (
              <div key={i} className="h-auto w-full">
                <BlogCardVertical
                  {...post}
                  theme={v.theme as "dark" | "light" | "glass"}
                  showAuthor={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Playground>
  ),
  "blog-card-horizontal": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light", "glass"],
          optionLabels: ["Dark", "Light", "Glass"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-y-auto rounded-xl bg-neutral-950 p-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {BLOG_CARD_HORIZONTAL_POSTS.map((post, i) => (
              <div
                key={i}
                className="h-[390px] w-full sm:h-[270px] md:h-[240px]"
              >
                <BlogCardHorizontal
                  {...post}
                  theme={v.theme as "dark" | "light" | "glass"}
                  showAuthor={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Playground>
  ),
  "diamond-scroll-gallery": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "diamondSize",
          label: "Size",
          options: ["160", "200", "260"],
          optionLabels: ["Small", "Medium", "Large"],
          defaultValue: "200",
        },
        {
          type: "toggle",
          key: "parallaxTilt",
          label: "Parallax Tilt",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showTileOverlay",
          label: "Tile Overlay",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <DiamondScrollGallery
            diamondSize={Number(v.diamondSize)}
            parallaxTilt={v.parallaxTilt as boolean}
            showTileOverlay={v.showTileOverlay as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "dot-image-slider": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "dotSpacing",
          label: "Dot Spacing",
          options: ["3", "6", "10"],
          optionLabels: ["Fine", "Medium", "Coarse"],
          defaultValue: "3",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
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
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <DotImageLoader
            image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80"
            saberPreset={
              v.saberPreset as "blue" | "red" | "green" | "white" | "purple"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "product-grid-section": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "columns",
          label: "Columns",
          options: ["2", "3", "4"],
          defaultValue: "3",
        },
      ]}
    >
      {(v) => (
        <div className="max-h-[42rem] w-full overflow-y-auto rounded-xl bg-[#080808]">
          <ProductGridSection
            theme={v.theme as "dark" | "light"}
            columns={Number(v.columns)}
          />
        </div>
      )}
    </Playground>
  ),
  "wave-gallery-page": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "uppercase",
          label: "Uppercase",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <WaveGalleryPage uppercase={Boolean(v.uppercase)} />
        </div>
      )}
    </Playground>
  ),
  "scroll-swatch-showcase": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "themeMode",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <ScrollSwatchShowcase
            containerHeight={800}
            themeMode={v.themeMode as "dark" | "light"}
          />
        </div>
      )}
    </Playground>
  ),
  //   "container-scroll-ipad": () => (
  //     <Playground controls={[{ type: "select", key: "themeMode", label: "Theme", options: ["glass", "paper"], defaultValue: "glass" }]}>
  //       {(v) => (
  //         <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
  //           <ContainerScrollIpad containerHeight={420} ipadWidth={420} themeMode={v.themeMode as "glass" | "paper"} />
  //         </div>
  //       )}
  //     </Playground>
  //   ),
  "process-spotlight": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "autoAdvance",
          label: "Auto-advance",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <ProcessSpotlight autoAdvance={Boolean(v.autoAdvance)} />
        </div>
      )}
    </Playground>
  ),
  "living-orb-ai": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["aura", "veil", "sphere"],
          optionLabels: ["Aura", "Veil", "Sphere"],
          defaultValue: "aura",
        },
        {
          type: "select",
          key: "preset",
          label: "Color",
          options: ["Aurora", "Champagne", "Emerald", "Sunset", "Ice"],
          defaultValue: "Aurora",
        },
        {
          type: "range",
          key: "glow",
          label: "Glow",
          min: 0,
          max: 1.5,
          step: 0.05,
          defaultValue: 0.85,
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 0,
          max: 2.5,
          step: 0.05,
          defaultValue: 1,
        },
        {
          type: "range",
          key: "iridescence",
          label: "Iridescence",
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.55,
        },
      ]}
    >
      {(v) => {
        const LIVING_ORB_PRESETS: Record<string, { a: string; b: string }> = {
          Aurora: { a: "#7C5CFF", b: "#05101F" },
          Champagne: { a: "#995E24", b: "#221307" },
          Emerald: { a: "#176945", b: "#06231A" },
          Sunset: { a: "#BD4628", b: "#2F132B" },
          Ice: { a: "#2B88B1", b: "#0E1E3A" },
        };
        const preset =
          LIVING_ORB_PRESETS[v.preset as string] ?? LIVING_ORB_PRESETS.Aurora;
        return (
          <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808]">
            <LivingOrbAI
              size={260}
              theme={v.theme as "aura" | "veil" | "sphere"}
              colorA={preset.a}
              colorB={preset.b}
              glow={Number(v.glow)}
              speed={Number(v.speed)}
              iridescence={Number(v.iridescence)}
            />
          </div>
        );
      }}
    </Playground>
  ),
  "ai-asistant": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["mesh", "halo"],
          optionLabels: ["Mesh", "Halo"],
          defaultValue: "mesh",
        },
        {
          type: "select",
          key: "state",
          label: "State",
          options: ["waiting", "listening", "thinking"],
          optionLabels: ["Waiting", "Listening", "Thinking"],
          defaultValue: "waiting",
        },
        {
          type: "select",
          key: "shape",
          label: "Shape",
          options: ["circle", "square", "diamond", "ring"],
          optionLabels: ["Circle", "Square", "Diamond", "Ring"],
          defaultValue: "square",
        },
        {
          type: "select",
          key: "preset",
          label: "Color",
          options: ["Aurora", "Champagne", "Emerald", "Sunset", "Ice"],
          defaultValue: "Champagne",
        },
      ]}
    >
      {(v) => {
        const AI_ASISTANT_PRESETS: Record<string, { a: string; b: string }> = {
          Aurora: { a: "#7C5CFF", b: "#05101F" },
          Champagne: { a: "#995E24", b: "#221307" },
          Emerald: { a: "#176945", b: "#06231A" },
          Sunset: { a: "#BD4628", b: "#2F132B" },
          Ice: { a: "#2B88B1", b: "#0E1E3A" },
        };
        const preset =
          AI_ASISTANT_PRESETS[v.preset as string] ??
          AI_ASISTANT_PRESETS.Champagne;
        return (
          <div className="flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808]">
            <AIAsistant
              size={220}
              theme={v.theme as "mesh" | "halo"}
              state={v.state as "waiting" | "listening" | "thinking"}
              shape={v.shape as "circle" | "square" | "diamond" | "ring"}
              colorA={preset.a}
              colorB={preset.b}
            />
          </div>
        );
      }}
    </Playground>
  ),
  "ai-voice-01": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["custom", "silver"],
          optionLabels: ["Custom", "Silver"],
          defaultValue: "custom",
        },
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["idle", "listening", "speaking"],
          optionLabels: ["Idle", "Listening", "Speaking"],
          defaultValue: "idle",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Tap to toggle",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "transcript",
          label: "Live transcript",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-24 w-full max-w-[380px]">
            <AiVoice01
              theme={v.theme as "custom" | "silver"}
              status={v.status as "idle" | "listening" | "speaking"}
              interactive={Boolean(v.interactive)}
              transcript={Boolean(v.transcript)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-voice-02": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["idle", "listening", "speaking"],
          optionLabels: ["Idle", "Listening", "Speaking"],
          defaultValue: "idle",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Tap to toggle",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "transcript",
          label: "Live transcript",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[72px] w-full max-w-[440px]">
            <AiVoice02
              status={v.status as "idle" | "listening" | "speaking"}
              interactive={Boolean(v.interactive)}
              transcript={Boolean(v.transcript)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-voice-03": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["idle", "listening", "speaking"],
          optionLabels: ["Idle", "Listening", "Speaking"],
          defaultValue: "idle",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Tap to toggle",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "transcript",
          label: "Live transcript",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[72px] w-full max-w-[440px]">
            <AiVoice03
              status={v.status as "idle" | "listening" | "speaking"}
              interactive={Boolean(v.interactive)}
              transcript={Boolean(v.transcript)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-voice-04": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["idle", "listening", "speaking"],
          optionLabels: ["Idle", "Listening", "Speaking"],
          defaultValue: "idle",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Tap to toggle",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "transcript",
          label: "Live transcript",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[72px] w-full max-w-[340px]">
            <AiVoice04
              status={v.status as "idle" | "listening" | "speaking"}
              interactive={Boolean(v.interactive)}
              transcript={Boolean(v.transcript)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-voice-05": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["idle", "listening", "speaking"],
          optionLabels: ["Idle", "Listening", "Speaking"],
          defaultValue: "idle",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Tap to toggle",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "transcript",
          label: "Live transcript",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-40 w-full max-w-[420px]">
            <AiVoice05
              status={v.status as "idle" | "listening" | "speaking"}
              interactive={Boolean(v.interactive)}
              transcript={Boolean(v.transcript)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-image-loader-01": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "generating", "done"],
          optionLabels: ["Auto play", "Generating", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "toggle",
          key: "showRing",
          label: "Light ring",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="aspect-[3/4] h-full max-h-[420px]">
            <AIImageLoader01
              preview={v.preview as "auto" | "generating" | "done"}
              loop={Boolean(v.loop)}
              showRing={Boolean(v.showRing)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-image-loader-02": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "generating", "done"],
          optionLabels: ["Auto play", "Generating", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "toggle",
          key: "showDots",
          label: "Dots …",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="aspect-[3/4] h-full max-h-[420px]">
            <AIImageLoader02
              preview={v.preview as "auto" | "generating" | "done"}
              loop={Boolean(v.loop)}
              showDots={Boolean(v.showDots)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-image-loader-03": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "generating", "done"],
          optionLabels: ["Auto play", "Generating", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "range",
          key: "edgeFade",
          label: "Edge fade",
          min: 0,
          max: 40,
          step: 1,
          defaultValue: 20,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="aspect-[3/4] h-full max-h-[420px]">
            <AiImageLoader03
              preview={v.preview as "auto" | "generating" | "done"}
              loop={Boolean(v.loop)}
              edgeFade={Number(v.edgeFade)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-image-loader-04": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["custom", "silver"],
          optionLabels: ["Custom", "Silver"],
          defaultValue: "custom",
        },
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "generating", "done"],
          optionLabels: ["Auto play", "Generating", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "toggle",
          key: "showActions",
          label: "Actions",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="aspect-[3/4] h-full max-h-[420px]">
            <AiImageLoader04
              theme={v.theme as "custom" | "silver"}
              preview={v.preview as "auto" | "generating" | "done"}
              loop={Boolean(v.loop)}
              showActions={Boolean(v.showActions)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-dynamic-island-01": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "State",
          options: ["auto", "idle", "listening", "thinking", "working", "done"],
          optionLabels: [
            "Auto play",
            "Idle",
            "Listening",
            "Thinking",
            "Working",
            "Done",
          ],
          defaultValue: "auto",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Interactive",
          defaultValue: true,
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="w-full max-w-[380px]">
            <AIDynamicIsland01
              status={
                v.status as
                  | "auto"
                  | "idle"
                  | "listening"
                  | "thinking"
                  | "working"
                  | "done"
              }
              interactive={Boolean(v.interactive)}
              loop={Boolean(v.loop)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-dynamic-island-02": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "State",
          options: ["auto", "idle", "listening", "thinking", "speaking"],
          optionLabels: [
            "Auto play",
            "Idle",
            "Listening",
            "Thinking",
            "Speaking",
          ],
          defaultValue: "auto",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Interactive",
          defaultValue: true,
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="w-full max-w-[380px]">
            <AIDynamicIsland02
              status={
                v.status as
                  "auto" | "idle" | "listening" | "thinking" | "speaking"
              }
              interactive={Boolean(v.interactive)}
              loop={Boolean(v.loop)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-answer-01": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "thinking", "streaming", "done"],
          optionLabels: ["Auto play", "Thinking", "Streaming", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "toggle",
          key: "showSources",
          label: "Sources",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[600px] w-full max-w-[420px]">
            <AiAnswer01
              preview={v.preview as "auto" | "thinking" | "streaming" | "done"}
              loop={Boolean(v.loop)}
              showSources={Boolean(v.showSources)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-chat-panel": () => (
    <Playground
      controls={[
        { type: "text", key: "botName", label: "Bot name", defaultValue: "Assistant" },
        {
          type: "text",
          key: "placeholder",
          label: "Placeholder",
          defaultValue: "Message the assistant...",
        },
        {
          type: "color",
          key: "accentColor",
          label: "Accent",
          defaultValue: "#9B7BFF",
        },
        { type: "toggle", key: "showGlow", label: "Glow", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="w-full max-w-[420px]">
            <AIChatPanel
              botName={v.botName as string}
              placeholder={v.placeholder as string}
              accentColor={v.accentColor as string}
              showGlow={Boolean(v.showGlow)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-answer-02": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["custom", "silver"],
          optionLabels: ["Custom", "Silver"],
          defaultValue: "custom",
        },
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "thinking", "streaming", "done"],
          optionLabels: ["Auto play", "Thinking", "Streaming", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "toggle",
          key: "showSources",
          label: "Sources",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[700px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[600px] w-full max-w-[420px]">
            <AiAnswer02
              theme={v.theme as "custom" | "silver"}
              preview={v.preview as "auto" | "thinking" | "streaming" | "done"}
              loop={Boolean(v.loop)}
              showSources={Boolean(v.showSources)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-answer-03": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["custom", "sunset"],
          optionLabels: ["Custom", "Sunset"],
          defaultValue: "custom",
        },
        {
          type: "select",
          key: "preview",
          label: "Preview",
          options: ["auto", "searching", "writing", "done"],
          optionLabels: ["Auto play", "Researching", "Writing", "Done"],
          defaultValue: "auto",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "toggle",
          key: "showSources",
          label: "Sources",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[760px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[660px] w-full max-w-[460px]">
            <AiAnswer03
              theme={v.theme as "custom" | "sunset"}
              preview={v.preview as "auto" | "searching" | "writing" | "done"}
              loop={Boolean(v.loop)}
              showSources={Boolean(v.showSources)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-chat-prompt": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["custom", "silver", "metal"],
          optionLabels: ["Custom", "Silver", "Metal"],
          defaultValue: "custom",
        },
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["idle", "thinking"],
          optionLabels: ["Idle", "Thinking"],
          defaultValue: "idle",
        },
        {
          type: "toggle",
          key: "showMention",
          label: "Mention @",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showStop",
          label: "Stop button",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[200px] w-full max-w-[520px]">
            <AIChatPrompt
              theme={v.theme as "custom" | "silver" | "metal"}
              status={v.status as "idle" | "thinking"}
              showMention={Boolean(v.showMention)}
              showStop={Boolean(v.showStop)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "ai-chat": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "State",
          options: ["auto", "closed", "open"],
          optionLabels: ["Auto play", "Closed", "Open"],
          defaultValue: "auto",
        },
        {
          type: "select",
          key: "corner",
          label: "Corner",
          options: ["bottom-right", "bottom-left"],
          optionLabels: ["Bottom right", "Bottom left"],
          defaultValue: "bottom-right",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Interactive",
          defaultValue: true,
        },
        { type: "toggle", key: "loop", label: "Loop demo", defaultValue: true },
        { type: "toggle", key: "showBadge", label: "Badge", defaultValue: false },
        { type: "text", key: "agentName", label: "Agent name", defaultValue: "Assistant" },
        { type: "color", key: "accentColor", label: "Accent", defaultValue: "#BFC4DE" },
        {
          type: "range",
          key: "ringGlow",
          label: "Border glow",
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.55,
        },
      ]}
    >
      {(v) => (
        <div className="relative h-[560px] w-full overflow-hidden rounded-xl bg-[#080808] [container-type:inline-size]">
          <AiChat
            position="absolute"
            status={v.status as "auto" | "closed" | "open"}
            corner={v.corner as "bottom-right" | "bottom-left"}
            interactive={Boolean(v.interactive)}
            loop={Boolean(v.loop)}
            showBadge={Boolean(v.showBadge)}
            agentName={v.agentName as string}
            accentColor={v.accentColor as string}
            ringGlow={v.ringGlow as number}
          />
        </div>
      )}
    </Playground>
  ),
  "ai-edit-review": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "status",
          label: "State",
          options: ["auto", "idle", "working", "review", "applied"],
          optionLabels: ["Auto play", "Idle", "Writing", "Review", "Applied"],
          defaultValue: "auto",
        },
        {
          type: "toggle",
          key: "interactive",
          label: "Interactive",
          defaultValue: true,
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-6">
          <div className="h-[340px] w-full max-w-md">
            <AIEditReview
              status={
                v.status as "auto" | "idle" | "working" | "review" | "applied"
              }
              interactive={Boolean(v.interactive)}
              loop={Boolean(v.loop)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "fullpage-photos": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "startIndex",
          label: "Photo",
          options: ["0", "1", "2", "3", "4"],
          optionLabels: [
            "Quiet Living",
            "Material Light",
            "Private Suite",
            "Inner Threshold",
            "Gathered Space",
          ],
          defaultValue: "0",
        },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <FullpagePhotos startIndex={Number(v.startIndex)} />
        </div>
      )}
    </Playground>
  ),
  "service-list-cursor-preview": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "colorMode",
          label: "Theme",
          options: ["dark", "light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "showPreviewImage",
          label: "Hover Image",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <ServiceListCursorPreview
            colorMode={v.colorMode as "dark" | "light"}
            showModeToggle={false}
            showPreviewImage={Boolean(v.showPreviewImage)}
          />
        </div>
      )}
    </Playground>
  ),
  "premium-bento-grid": () => (
    <Playground
      controls={[
        { type: "toggle", key: "tilt", label: "3D Tilt", defaultValue: false },
        {
          type: "select",
          key: "layout",
          label: "Layout",
          options: ["2x2", "3x3", "custom"],
          optionLabels: ["⊞ 2×2", "⊟ 3×3", "✦ Custom"],
          defaultValue: "custom",
        },
        {
          type: "toggle",
          key: "showBadge",
          label: "Badges",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <PremiumBentoGrid
            slots={PREMIUM_BENTO_SLOTS}
            showBadge={Boolean(v.showBadge)}
            badgeColor="rgba(0,0,0,0.6)"
            tilt={Boolean(v.tilt)}
            layout={v.layout as "2x2" | "3x3" | "custom"}
          />
        </div>
      )}
    </Playground>
  ),
  "video-glow-lightbox": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "soundReactiveGlow",
          label: "Sound Reactive",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
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
  "process-steps-rail": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showEyebrowIcon",
          label: "Eyebrow Icon",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <ProcessStepsRail showEyebrowIcon={Boolean(v.showEyebrowIcon)} />
        </div>
      )}
    </Playground>
  ),
  "expanding-panel-gallery": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showParallax",
          label: "Parallax",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ExpandingPanelGallery showParallax={Boolean(v.showParallax)} />
        </div>
      )}
    </Playground>
  ),
  "world-map-pro": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "mapStyle",
          label: "Style",
          options: ["light", "dark", "midnight", "ocean", "minimal"],
          optionLabels: ["Light", "Dark", "Midnight", "Ocean", "Minimal"],
          defaultValue: "light",
        },
        {
          type: "toggle",
          key: "showLegend",
          label: "Legend",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <WorldMapPro
            mapStyle={
              v.mapStyle as "light" | "dark" | "midnight" | "ocean" | "minimal"
            }
            showLegend={Boolean(v.showLegend)}
          />
        </div>
      )}
    </Playground>
  ),
  "feature-grid-mosaic": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "themeMode",
          label: "Theme",
          options: ["paper", "glass"],
          optionLabels: ["Paper", "Glass"],
          defaultValue: "glass",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FeatureGridMosaic themeMode={v.themeMode as "paper" | "glass"} />
        </div>
      )}
    </Playground>
  ),
  "glide-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "windMode",
          label: "Motion",
          options: ["wind", "drift", "magnetic", "none"],
          optionLabels: ["Wind", "Drift", "Magnetic", "None"],
          defaultValue: "wind",
        },
        {
          type: "toggle",
          key: "autoPlay",
          label: "Autoplay",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <GlideCarousel
            items={GLIDE_CAROUSEL_ITEMS}
            windMode={v.windMode as "wind" | "drift" | "magnetic" | "none"}
            autoPlay={Boolean(v.autoPlay)}
          />
        </div>
      )}
    </Playground>
  ),
  "marquee-hero-section": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "themeMode",
          label: "Theme",
          options: ["paper", "glass"],
          optionLabels: ["Paper", "Glass"],
          defaultValue: "glass",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <MarqueeHeroSection themeMode={v.themeMode as "paper" | "glass"} />
        </div>
      )}
    </Playground>
  ),
  "scroll-card-stack": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showCounter",
          label: "Counter",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ScrollCardStack showCounter={Boolean(v.showCounter)} />
        </div>
      )}
    </Playground>
  ),
  "linear-progress-bars": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "cap",
          label: "Cap",
          options: ["glow", "dot", "line", "none"],
          optionLabels: ["Glow", "Dot", "Line", "None"],
          defaultValue: "glow",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["amber", "indigo", "blue", "green", "pink"],
          optionLabels: ["Amber", "Indigo", "Blue", "Green", "Pink"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "progress",
          label: "Progress",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 67,
        },
        {
          type: "range",
          key: "thickness",
          label: "Thickness",
          min: 4,
          max: 24,
          step: 1,
          defaultValue: 10,
        },
        {
          type: "toggle",
          key: "shimmer",
          label: "Shimmer",
          defaultValue: true,
        },
        { type: "toggle", key: "label", label: "Label", defaultValue: true },
      ]}
    >
      {(v) => {
        const [colorStart, colorEnd] =
          LINEAR_BARS_COLORS[v.color as string] ?? LINEAR_BARS_COLORS.indigo;
        const pct = Number(v.progress);
        const showLabel = Boolean(v.label);
        return (
          <div
            className={cn(
              "flex h-[400px] w-full items-center justify-center rounded-xl p-6",
              v.theme === "dark" ? "bg-[#080808]" : "bg-white",
            )}
          >
            <LinearProgressBars
              {...LINEAR_BARS_BARE_CARD}
              theme={v.theme as "light" | "dark"}
              className="max-w-[520px]"
              rows={[
                {
                  kind: "bar",
                  label: showLabel ? "brand-assets.zip" : undefined,
                  labelRight: showLabel ? `${pct}%` : undefined,
                  pct,
                  colorStart,
                  colorEnd,
                  height: Number(v.thickness),
                  capStyle: v.cap as "glow" | "dot" | "line" | "none",
                  shimmer: Boolean(v.shimmer),
                },
              ]}
            />
          </div>
        );
      }}
    </Playground>
  ),
  "image-deck-3d": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "shape",
          label: "Shape",
          options: ["rectangle", "circle", "hexagon", "star", "blob"],
          defaultValue: "rectangle",
        },
        {
          type: "toggle",
          key: "enable3D",
          label: "3D Tilt",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="flex w-full items-center justify-center rounded-xl bg-[#080808] px-6 py-[50px]">
          <div className="aspect-square w-full max-w-[500px]">
            <ImageDeck3D
              image="/demo/2.webp"
              shape={
                v.shape as
                  | "rectangle"
                  | "circle"
                  | "diamond"
                  | "hexagon"
                  | "triangle"
                  | "pentagon"
                  | "star"
                  | "squircle"
                  | "blob"
              }
              enable3D={v.enable3D as boolean}
              idleAnimation
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "liquid-text": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "preset",
          label: "Preset",
          options: ["liquid", "melt", "blob", "ghost", "crystal"],
          defaultValue: "liquid",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <LiquidText
            preset={
              v.preset as "liquid" | "melt" | "blob" | "ghost" | "crystal"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "word-reveal": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "animPreset",
          label: "Preset",
          options: ["blur-in", "fade-up", "spring-up", "fade-only"],
          defaultValue: "blur-in",
        },
      ]}
    >
      {(v) => (
        <WordRevealDemo
          animPreset={
            v.animPreset as "fade-up" | "blur-in" | "fade-only" | "spring-up"
          }
        />
      )}
    </Playground>
  ),
  "alert-toast": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "tone",
          label: "Tone",
          options: ["info", "success", "warning", "error", "neutral"],
          optionLabels: ["Info", "Success", "Warning", "Error", "Neutral"],
          defaultValue: "info",
        },
        {
          type: "select",
          key: "layout",
          label: "Layout",
          options: ["stacked", "inline"],
          optionLabels: ["Stacked", "Inline"],
          defaultValue: "stacked",
        },
        {
          type: "select",
          key: "background",
          label: "Background",
          options: ["tinted", "subtle"],
          optionLabels: ["Tinted", "Subtle"],
          defaultValue: "tinted",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "width",
          label: "Width",
          min: 320,
          max: 640,
          step: 10,
          defaultValue: 480,
        },
        {
          type: "toggle",
          key: "accentBar",
          label: "Accent Bar",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "actions",
          label: "Actions",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "dismissible",
          label: "Dismissible",
          defaultValue: true,
        },
      ]}
    >
      {(v) => {
        const tone = v.tone as AlertTone;
        const layout = v.layout as AlertLayout;
        return (
          <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
            <div className="w-full" style={{ maxWidth: Number(v.width) }}>
              <AlertToast
                key={`${tone}-${layout}-${v.background}-${v.theme}-${v.accentBar}-${v.actions}-${v.dismissible}`}
                {...alertToastDemo(
                  tone,
                  layout,
                  Boolean(v.actions),
                  Boolean(v.dismissible),
                )}
                appearance={{
                  tone,
                  background: v.background as AlertBackground,
                  accentBar: Boolean(v.accentBar),
                  icon: ALERT_DEMO[tone].icon,
                  theme: v.theme as AlertTheme,
                  radius: 12,
                }}
              />
            </div>
          </div>
        );
      }}
    </Playground>
  ),
  "scroll-word-highlight": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <ScrollWordHighlight />
    </div>
  ),
  "rotary-card-carousel": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
      <RotaryCardCarousel containerHeight={800} />
    </div>
  ),
  "curved-nav-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["desk-dark", "desk-light", "original"],
          optionLabels: ["Desk Dark", "Desk Light", "Original"],
          defaultValue: "desk-dark",
        },
        {
          type: "toggle",
          key: "showArrows",
          label: "Arrows",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[560px] w-full overflow-hidden rounded-xl">
          <CurvedNavCarousel
            items={CURVED_NAV_ITEMS}
            theme={v.theme as "desk-dark" | "desk-light" | "original"}
            showArrows={Boolean(v.showArrows)}
          />
        </div>
      )}
    </Playground>
  ),
  "accordion-services-list": () => (
    <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <AccordionServicesList />
    </div>
  ),
  "review-card-portrait": () => (
    <div className="flex h-[600px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#080808] p-8">
      <div className="h-[520px] w-[380px] overflow-hidden rounded-2xl shadow-xl">
        <ReviewCardPortrait />
      </div>
    </div>
  ),
  "social-post-testimonial-wall": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <SocialPostTestimonialWall />
    </div>
  ),
  "bento-scroll-zoom-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <BentoScrollZoomGallery containerHeight={600} scrollDistance={1800} />
    </div>
  ),
  "cinematic-stacked-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <CinematicStackedGallery />
    </div>
  ),
  "phone-analytics-mockup": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 200,
          max: 300,
          step: 10,
          defaultValue: 280,
        },
        {
          type: "select",
          key: "frame",
          label: "Frame",
          options: ["Titanium", "Black"],
          optionLabels: ["Titanium", "Black"],
          defaultValue: "Titanium",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["light", "dark"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "light",
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "h-[820px] w-full overflow-hidden rounded-xl",
            v.theme === "dark" ? "bg-neutral-900" : "bg-white",
          )}
        >
          <PhoneAnalyticsMockup
            {...PHONE_ANALYTICS_MOCKUP_PROPS}
            phoneWidth={v.size as number}
            frameColor={v.frame as "Titanium" | "Black"}
            theme={v.theme as "light" | "dark"}
          />
        </div>
      )}
    </Playground>
  ),
  "error-404-page-section": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light", "auto"],
          optionLabels: ["Dark", "Light", "Auto"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "glitch", label: "Glitch", defaultValue: true },
        {
          type: "toggle",
          key: "toggle",
          label: "Theme Toggle",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[640px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <Error404PageSection
            theme={v.theme as "auto" | "dark" | "light"}
            glitch={v.glitch as boolean}
            showThemeToggle={v.toggle as boolean}
            secondaryLabel="Browse components"
            className="h-full"
          />
        </div>
      )}
    </Playground>
  ),
  "hero-scroll-gallery": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "columns",
          label: "Columns",
          options: ["1", "2", "3"],
          optionLabels: ["1 Col", "2 Col", "3 Col"],
          defaultValue: "3",
        },
        {
          type: "select",
          key: "viewMode",
          label: "View",
          options: ["wall", "tunnel", "flat", "tilted"],
          optionLabels: ["Wall", "Tunnel", "Flat", "Tilted"],
          defaultValue: "tilted",
        },
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["up", "down", "alternate"],
          optionLabels: ["Up", "Down", "Alternate"],
          defaultValue: "alternate",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <HeroScrollGallery
            className="h-[720px] max-sm:h-auto"
            images={HERO_SCROLL_GALLERY_IMAGES}
            partners={HERO_SCROLL_GALLERY_PARTNERS}
            columns={Number(v.columns) as 1 | 2 | 3}
            viewMode={v.viewMode as "wall" | "tunnel" | "flat" | "tilted"}
            direction={v.direction as "up" | "down" | "alternate"}
          />
        </div>
      )}
    </Playground>
  ),
  "diagonal-ticker-strips": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["cream", "blush", "sand"],
          optionLabels: ["Cream", "Blush", "Sand"],
          defaultValue: "cream",
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 3,
          max: 40,
          step: 1,
          defaultValue: 18,
        },
        {
          type: "range",
          key: "angle",
          label: "Angle",
          min: 0,
          max: 20,
          step: 0.5,
          defaultValue: 7,
        },
        {
          type: "range",
          key: "spacing",
          label: "Spacing",
          min: -50,
          max: 60,
          step: 1,
          defaultValue: 30,
        },
      ]}
    >
      {(v) => (
        <div className="h-[400px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <DiagonalTickerStrips
            colorMode={v.theme as "cream" | "blush" | "sand"}
            speed={Number(v.speed)}
            angle={Number(v.angle)}
            spacing={Number(v.spacing)}
          />
        </div>
      )}
    </Playground>
  ),
  "kinetic-typography-showcase": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["orbit", "prism"],
          optionLabels: ["Orbit", "Prism"],
          defaultValue: "orbit",
        },
        {
          type: "range",
          key: "glowIntensity",
          label: "Glow",
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0,
        },
        {
          type: "toggle",
          key: "enableTilt",
          label: "Tilt",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <KineticTypographyShowcase
            theme={v.theme as "orbit" | "prism"}
            glowIntensity={Number(v.glowIntensity)}
            enableTilt={Boolean(v.enableTilt)}
          />
        </div>
      )}
    </Playground>
  ),
  "fullscreen-panel-reveal-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <FullscreenPanelRevealGallery />
    </div>
  ),
  "scroll-zoom-mosaic-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <ScrollZoomMosaicGallery />
    </div>
  ),
  "perspective-404-gallery": () => (
    <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <Perspective404Gallery />
    </div>
  ),
  "scroll-zoom-media-reveal": () => (
    <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
      <ScrollZoomMediaReveal containerHeight={600} />
    </div>
  ),
  "arc-coverflow-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "visibleCount",
          label: "Cards",
          options: ["3", "5"],
          defaultValue: "5",
        },
        {
          type: "select",
          key: "arcMode",
          label: "Arc",
          options: ["convex", "concave", "flat"],
          optionLabels: ["Convex", "Concave", "Flat"],
          defaultValue: "convex",
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 100,
          max: 500,
          step: 10,
          defaultValue: 280,
        },
        {
          type: "range",
          key: "arcStrength",
          label: "Arc Str.",
          min: 0,
          max: 200,
          step: 5,
          defaultValue: 200,
        },
        {
          type: "select",
          key: "borderRadius",
          label: "Radius",
          options: ["0", "10", "20", "36"],
          optionLabels: ["0", "S", "M", "L"],
          defaultValue: "20",
        },
        {
          type: "toggle",
          key: "showCaption",
          label: "Caption",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showThumbnails",
          label: "Thumbs",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[560px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ArcCoverflowCarousel
            visibleCount={Number(v.visibleCount) as 3 | 5}
            arcMode={v.arcMode as "convex" | "concave" | "flat"}
            gap={v.gap as number}
            arcStrength={v.arcStrength as number}
            borderRadius={Number(v.borderRadius)}
            showCaption={v.showCaption as boolean}
            showThumbnails={v.showThumbnails as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "google-reviews": () => (
    <Playground
      controls={reviewWidgetControls({
        ratingMin: 1,
        ratingDefault: 4.9,
        reviewCountStep: 10,
        reviewCountDefault: 128,
      })}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <GoogleReviews
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
  "airbnb-reviews": () => (
    <Playground
      controls={reviewWidgetControls({
        ratingMin: 0,
        ratingDefault: 4.3,
        reviewCountStep: 1,
        reviewCountDefault: 191,
      })}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
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
  "app-store-reviews": () => (
    <Playground
      controls={reviewWidgetControls({
        ratingMin: 0,
        ratingDefault: 4.3,
        reviewCountStep: 1,
        reviewCountDefault: 191,
      })}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <AppStoreReviews
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
    <Playground
      controls={reviewWidgetControls({
        ratingMin: 1,
        ratingDefault: 4.3,
        reviewCountStep: 10,
        reviewCountDefault: 191,
      })}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
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
    <Playground
      controls={reviewWidgetControls({
        ratingMin: 1,
        ratingDefault: 4.3,
        reviewCountStep: 10,
        reviewCountDefault: 191,
      })}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
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
  "facebook-reviews": () => (
    <Playground
      controls={reviewWidgetControls({
        ratingMin: 1,
        ratingDefault: 4.3,
        reviewCountStep: 10,
        reviewCountDefault: 191,
      })}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FacebookReviews
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
  "hover-gallery": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "borderRadius",
          label: "Radius",
          min: 0,
          max: 200,
          step: 4,
          defaultValue: 100,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 32,
          step: 2,
          defaultValue: 8,
        },
        {
          type: "toggle",
          key: "parallax",
          label: "Parallax",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full">
          <HoverGallery
            images={HOVER_GALLERY_IMAGES}
            borderRadius={v.borderRadius as number}
            gap={v.gap as number}
            parallax={v.parallax as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "profile-flip-card": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "flipTransition",
          label: "Transition",
          options: ["flipY", "flipX", "spring", "fade"],
          optionLabels: ["Flip Y", "Flip X", "Spring", "Fade"],
          defaultValue: "flipY",
        },
        {
          type: "toggle",
          key: "flipOnHover",
          label: "Hover",
          defaultValue: false,
        },
        { type: "toggle", key: "showTag", label: "Tag", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="flex h-[600px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
          <div className="h-[450px] w-[340px] max-w-full">
            <ProfileFlipCard
              src="/demo/32.webp"
              name="Zara Osei"
              role="Creative Director"
              bio="Design is like a perfect strike, you only get one shot to make an impression. I craft brands that move fast, hit hard, and leave something behind."
              tag={v.showTag ? "Design" : ""}
              flipTransition={
                v.flipTransition as "flipY" | "flipX" | "spring" | "fade"
              }
              flipOnHover={v.flipOnHover as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "mood-gallery": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "mood",
          label: "Mood",
          options: ["editorial", "luxury", "chaos", "raw"],
          optionLabels: ["Editorial", "Luxury", "Chaos", "Raw"],
          defaultValue: "editorial",
        },
        {
          type: "select",
          key: "perspective",
          label: "Perspective",
          options: [...MOOD_GALLERY_PERSPECTIVES],
          defaultValue: "slant",
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 0.1,
          max: 2,
          step: 0.1,
          defaultValue: 0.9,
        },
        {
          type: "toggle",
          key: "alternateScroll",
          label: "Alternate",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "autoMood",
          label: "Auto Mood",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <MoodGallery
            key={v.mood as string}
            mood={v.mood as "editorial" | "luxury" | "chaos" | "raw"}
            perspective={
              v.perspective as (typeof MOOD_GALLERY_PERSPECTIVES)[number]
            }
            speed={v.speed as number}
            alternateScroll={v.alternateScroll as boolean}
            autoMood={v.autoMood as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "gallery-flow": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "cardShadow",
          label: "Shadow",
          defaultValue: true,
        },
        {
          type: "select",
          key: "cardSize",
          label: "Size",
          options: ["small", "medium", "large"],
          defaultValue: "medium",
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 0.1,
          max: 2,
          step: 0.1,
          defaultValue: 0.4,
        },
        {
          type: "select",
          key: "scrollDirection",
          label: "Direction",
          options: ["up", "down", "left", "right"],
          defaultValue: "up",
        },
        {
          type: "select",
          key: "cursorMode",
          label: "Cursor",
          options: ["none", "repel", "attract"],
          defaultValue: "none",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <GalleryFlow
            backgroundColor="#080808"
            cardShadow={v.cardShadow as boolean}
            cardSize={v.cardSize as "small" | "medium" | "large"}
            speed={v.speed as number}
            scrollDirection={
              v.scrollDirection as "up" | "down" | "left" | "right"
            }
            cursorMode={v.cursorMode as "none" | "repel" | "attract"}
          />
        </div>
      )}
    </Playground>
  ),
  "youtube-gallery": () => (
    <Playground
      controls={[
        { type: "toggle", key: "darkMode", label: "Dark", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <YoutubeGallery maxVideos={5} darkMode={v.darkMode as boolean} />
        </div>
      )}
    </Playground>
  ),
  "carousel-3d": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "visibleCount",
          label: "Cards",
          options: ["3", "5"],
          defaultValue: "5",
        },
        {
          type: "range",
          key: "curveRadius",
          label: "Curve",
          min: 150,
          max: 1200,
          step: 25,
          defaultValue: 700,
        },
        {
          type: "range",
          key: "cardWidth",
          label: "Width",
          min: 140,
          max: 480,
          step: 10,
          defaultValue: 190,
        },
        {
          type: "range",
          key: "cardHeight",
          label: "Height",
          min: 180,
          max: 680,
          step: 10,
          defaultValue: 390,
        },
        {
          type: "range",
          key: "borderRadius",
          label: "Radius",
          min: 0,
          max: 60,
          step: 2,
          defaultValue: 18,
        },
        {
          type: "range",
          key: "overlayOpacity",
          label: "Overlay",
          min: 0,
          max: 80,
          step: 5,
          defaultValue: 35,
        },
        {
          type: "toggle",
          key: "showCaption",
          label: "Caption",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "reflectionEffect",
          label: "Reflection",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "tiltOnHover",
          label: "Tilt",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "autoplay",
          label: "Autoplay",
          defaultValue: false,
        },
        {
          type: "select",
          key: "transitionStyle",
          label: "Transition",
          options: ["smooth", "spring", "cinematic", "snappy"],
          optionLabels: ["Smooth", "Spring", "Cinematic", "Snappy"],
          defaultValue: "cinematic",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <Carousel3D
            visibleCount={Number(v.visibleCount) as 3 | 5}
            curveRadius={v.curveRadius as number}
            cardWidth={v.cardWidth as number}
            cardHeight={v.cardHeight as number}
            borderRadius={v.borderRadius as number}
            overlayOpacity={(v.overlayOpacity as number) / 100}
            showCaption={v.showCaption as boolean}
            reflectionEffect={v.reflectionEffect as boolean}
            tiltOnHover={v.tiltOnHover as boolean}
            autoplay={v.autoplay as boolean}
            transitionStyle={
              v.transitionStyle as "smooth" | "spring" | "cinematic" | "snappy"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "hotspot-carousel": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "showThumbnails",
          label: "Thumbnails",
          defaultValue: true,
        },
        {
          type: "select",
          key: "thumbnailAspectRatio",
          label: "Ratio",
          options: ["16/9", "4/3", "1/1", "3/4", "2/3"],
          defaultValue: "4/3",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <HotspotCarousel
            showThumbnails={v.showThumbnails as boolean}
            thumbnailAspectRatio={
              v.thumbnailAspectRatio as "16/9" | "4/3" | "1/1" | "3/4" | "2/3"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "tilted-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["paper", "glass"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "paper",
        },
        {
          type: "select",
          key: "titleAlign",
          label: "Align",
          options: ["bottom-left", "bottom-center", "center"],
          optionLabels: ["↙ Left", "↓ Center", "✛ Mid"],
          defaultValue: "bottom-left",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <TiltedCarousel
            slides={TILTED_CAROUSEL_SLIDES}
            theme={v.theme as "paper" | "glass"}
            titleAlign={
              v.titleAlign as "bottom-left" | "bottom-center" | "center"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "animated-carousel": () => (
    <Playground
      controls={[
        { type: "toggle", key: "glass", label: "Glass", defaultValue: false },
        {
          type: "range",
          key: "cardWidth",
          label: "Card Width",
          min: 100,
          max: 400,
          step: 10,
          defaultValue: 250,
        },
        {
          type: "select",
          key: "cardAspectRatio",
          label: "Aspect Ratio",
          options: ["7/10", "3/4", "4/3", "1/1", "9/16", "16/9"],
          optionLabels: [
            "7 : 10",
            "3 : 4",
            "4 : 3",
            "1 : 1",
            "9 : 16",
            "16 : 9",
          ],
          defaultValue: "4/3",
        },
        {
          type: "range",
          key: "cardBorderRadius",
          label: "Border Radius",
          min: 0,
          max: 48,
          step: 2,
          defaultValue: 24,
        },
        {
          type: "range",
          key: "rotationSpeed",
          label: "Speed (s/turn)",
          min: 10,
          max: 80,
          step: 2,
          defaultValue: 36,
        },
        {
          type: "range",
          key: "perspective",
          label: "Perspective",
          min: 200,
          max: 2000,
          step: 50,
          defaultValue: 400,
        },
        {
          type: "range",
          key: "gap",
          label: "Card Gap",
          min: 0,
          max: 60,
          step: 2,
          defaultValue: 22,
        },
        {
          type: "range",
          key: "fadeEdge",
          label: "Edge Fade",
          min: 0,
          max: 40,
          step: 1,
          defaultValue: 11,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <AnimatedCarousel
            theme={v.glass ? "glass" : "paper"}
            cardWidth={Number(v.cardWidth)}
            cardAspectRatio={
              v.cardAspectRatio as
                "7/10" | "3/4" | "4/3" | "1/1" | "9/16" | "16/9"
            }
            cardBorderRadius={Number(v.cardBorderRadius)}
            rotationSpeed={Number(v.rotationSpeed)}
            perspective={Number(v.perspective)}
            gap={Number(v.gap)}
            fadeEdge={Number(v.fadeEdge)}
          />
        </div>
      )}
    </Playground>
  ),
  "diagonal-carousel": () => (
    <Playground
      controls={[
        { type: "toggle", key: "glass", label: "Glass", defaultValue: false },
        {
          type: "select",
          key: "titleAlign",
          label: "Align",
          options: ["bottom-left", "bottom-center", "center"],
          optionLabels: ["↙ Left", "↓ Center", "✛ Mid"],
          defaultValue: "bottom-left",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <DiagonalCarousel
            cardSize={180}
            theme={v.glass ? "glass" : "paper"}
            titleAlign={
              v.titleAlign as "bottom-left" | "bottom-center" | "center"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "world-map-arc": () => (
    <Playground
      controls={[
        { type: "toggle", key: "darkMode", label: "Dark", defaultValue: true },
        {
          type: "select",
          key: "mapType",
          label: "Type",
          options: ["dots", "flat"],
          optionLabels: ["Dots", "Flat"],
          defaultValue: "dots",
        },
        {
          type: "select",
          key: "animType",
          label: "Anim",
          options: ["sequential", "atOnce"],
          optionLabels: ["Seq", "All"],
          defaultValue: "sequential",
        },
        {
          type: "select",
          key: "pinStyle",
          label: "Pin",
          options: ["bracket", "glow"],
          optionLabels: ["Bracket", "Glow"],
          defaultValue: "bracket",
        },
        {
          type: "select",
          key: "mapStyle",
          label: "Style",
          options: [
            "navy",
            "midnight",
            "teal",
            "forest",
            "rose",
            "snow",
            "onyx",
          ],
          defaultValue: "navy",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <WorldMapArc
            darkMode={v.darkMode as boolean}
            mapType={v.mapType as "dots" | "flat"}
            animType={v.animType as "sequential" | "atOnce"}
            pinStyle={v.pinStyle as "bracket" | "glow"}
            mapStyle={
              v.mapStyle as
                | "navy"
                | "midnight"
                | "teal"
                | "forest"
                | "rose"
                | "snow"
                | "onyx"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "comparison-table": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "glass",
          label: "Glass Theme",
          defaultValue: true,
        },
        {
          type: "range",
          key: "columns",
          label: "Columns",
          min: 2,
          max: 4,
          step: 1,
          defaultValue: 3,
        },
        {
          type: "toggle",
          key: "stickyHeader",
          label: "Sticky Header",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ComparisonTable
            theme={v.glass ? "glass" : "paper"}
            columns={v.columns as number}
            stickyHeader={v.stickyHeader as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "hover-media-cards": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "columnCount",
          label: "Columns",
          options: ["2", "3"],
          defaultValue: "3",
        },
        {
          type: "select",
          key: "contentAlign",
          label: "Align",
          options: ["bottom-left", "bottom-center", "center"],
          optionLabels: ["Left", "B.Center", "Center"],
          defaultValue: "bottom-left",
        },
        {
          type: "select",
          key: "arrowStyle",
          label: "Arrow",
          options: ["circle", "filled", "none"],
          optionLabels: ["Circle", "Filled", "None"],
          defaultValue: "circle",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <HoverMediaCards
            columnCount={Number(v.columnCount)}
            contentAlign={
              v.contentAlign as "bottom-left" | "bottom-center" | "center"
            }
            arrowStyle={v.arrowStyle as "circle" | "filled" | "none"}
          />
        </div>
      )}
    </Playground>
  ),
  "particle-text": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "interactionMode",
          label: "Interaction",
          options: ["repel", "attract", "vortex", "none"],
          optionLabels: ["Repel", "Attract", "Vortex", "Off"],
          defaultValue: "repel",
        },
        {
          type: "toggle",
          key: "autoFit",
          label: "Auto Fit",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "idleOscillation",
          label: "Oscillation",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ParticleText
            interactionMode={
              v.interactionMode as "repel" | "attract" | "vortex" | "none"
            }
            autoFit={v.autoFit as boolean}
            idleOscillation={v.idleOscillation as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "tilt-text": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "tiltStrength",
          label: "Tilt",
          min: 3,
          max: 80,
          step: 1,
          defaultValue: 60,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <TiltText fontSize={80} tiltStrength={v.tiltStrength as number} />
        </div>
      )}
    </Playground>
  ),
  "confetti-show": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "trigger",
          label: "Trigger",
          options: ["auto", "click", "hover"],
          optionLabels: ["Auto", "Click", "Hover"],
          defaultValue: "auto",
        },
        {
          type: "select",
          key: "emissionMode",
          label: "Emission",
          options: ["rain", "burst", "cannon"],
          optionLabels: ["Rain", "Burst", "Cannon"],
          defaultValue: "rain",
        },
        {
          type: "select",
          key: "gravityDirection",
          label: "Direction",
          options: ["down", "up", "left", "right"],
          optionLabels: ["↓ Down", "↑ Up", "← Left", "→ Right"],
          defaultValue: "down",
        },
        {
          type: "select",
          key: "colorPreset",
          label: "Color",
          options: [
            "custom",
            "pastel",
            "neon",
            "gold",
            "pride",
            "christmas",
            "monochrome",
          ],
          optionLabels: [
            "Custom",
            "Pastel",
            "Neon",
            "Gold",
            "Pride",
            "Christmas",
            "Monochrome",
          ],
          defaultValue: "custom",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ConfettiShow
            trigger={v.trigger as "auto" | "click" | "hover"}
            emissionMode={v.emissionMode as "rain" | "burst" | "cannon"}
            gravityDirection={
              v.gravityDirection as "down" | "up" | "left" | "right"
            }
            colorPreset={
              v.colorPreset as
                | "custom"
                | "pastel"
                | "neon"
                | "gold"
                | "pride"
                | "christmas"
                | "monochrome"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "index-grid-section": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "cellAspect",
          label: "Cell Shape",
          options: ["1 / 1", "4 / 3", "3 / 2", "16 / 9"],
          optionLabels: ["Square", "4:3", "3:2", "Wide"],
          defaultValue: "4 / 3",
        },
        {
          type: "range",
          key: "columns",
          label: "Columns",
          min: 1,
          max: 4,
          step: 1,
          defaultValue: 3,
        },
        {
          type: "toggle",
          key: "showMediaPreview",
          label: "Media Preview",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <IndexGridSection
            heading="Our Services"
            sideDescription="From training to performance, every service is built to keep you moving."
            items={INDEX_GRID_SECTION_ITEMS}
            cellAspect={v.cellAspect as "1 / 1" | "4 / 3" | "3 / 2" | "16 / 9"}
            columns={v.columns as number}
            showMediaPreview={v.showMediaPreview as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "cards-hover-marquee": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "imageSize",
          label: "Image Size",
          min: 120,
          max: 320,
          step: 10,
          defaultValue: 220,
        },
        {
          type: "range",
          key: "hoverLift",
          label: "Hover Lift",
          min: 0,
          max: 60,
          step: 1,
          defaultValue: 4,
        },
        {
          type: "range",
          key: "edgeFadeWidth",
          label: "Fade Width",
          min: 0,
          max: 300,
          step: 5,
          defaultValue: 60,
        },
        {
          type: "select",
          key: "topScrollDirection",
          label: "Top Direction",
          options: ["left", "right"],
          defaultValue: "right",
        },
        {
          type: "select",
          key: "bottomScrollDirection",
          label: "Bottom Direction",
          options: ["left", "right"],
          defaultValue: "left",
        },
        {
          type: "toggle",
          key: "autoScroll",
          label: "Auto Scroll",
          defaultValue: true,
        },
        {
          type: "range",
          key: "autoScrollDuration",
          label: "Scroll Duration",
          min: 3,
          max: 60,
          step: 1,
          defaultValue: 20,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <CardsHoverMarquee
            imageSize={v.imageSize as number}
            hoverLift={v.hoverLift as number}
            edgeFadeWidth={v.edgeFadeWidth as number}
            topScrollDirection={v.topScrollDirection as "left" | "right"}
            bottomScrollDirection={v.bottomScrollDirection as "left" | "right"}
            autoScroll={v.autoScroll as boolean}
            autoScrollDuration={v.autoScrollDuration as number}
          />
        </div>
      )}
    </Playground>
  ),
  "ipad-mockup-carousel": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "tabletWidth",
          label: "Size",
          min: 320,
          max: 700,
          step: 10,
          defaultValue: 520,
        },
        {
          type: "select",
          key: "frameColor",
          label: "Frame",
          options: ["Silver", "Space Gray"],
          defaultValue: "Silver",
        },
        {
          type: "select",
          key: "orientation",
          label: "Orient",
          options: ["Landscape", "Portrait"],
          optionLabels: ["Land", "Port"],
          defaultValue: "Landscape",
        },
        {
          type: "select",
          key: "videoTransition",
          label: "Transition",
          options: ["Slide", "Fade"],
          defaultValue: "Fade",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <IPadMockupCarousel
            video1="/demo/18.mp4"
            video2="/demo/17.mp4"
            video3="/demo/16.mp4"
            mediaOrder={["V1", "V2", "V3"]}
            tilt
            tabletWidth={v.tabletWidth as number}
            frameColor={v.frameColor as "Silver" | "Space Gray"}
            orientation={v.orientation as "Landscape" | "Portrait"}
            videoTransition={v.videoTransition as "Slide" | "Fade"}
          />
        </div>
      )}
    </Playground>
  ),
  "desktop-mockup-carousel": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "displayWidth",
          label: "Size",
          min: 400,
          max: 900,
          step: 10,
          defaultValue: 680,
        },
        {
          type: "select",
          key: "frameColor",
          label: "Frame",
          options: ["Silver", "Space Black"],
          defaultValue: "Silver",
        },
        {
          type: "select",
          key: "videoTransition",
          label: "Transition",
          options: ["Slide", "Fade"],
          defaultValue: "Slide",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <DesktopMockupCarousel
            video1="/demo/18.mp4"
            video2="/demo/17.mp4"
            video3="/demo/16.mp4"
            mediaOrder={["V1", "V2", "V3"]}
            tilt
            ambientGlow
            displayWidth={v.displayWidth as number}
            frameColor={v.frameColor as "Silver" | "Space Black"}
            videoTransition={v.videoTransition as "Slide" | "Fade"}
          />
        </div>
      )}
    </Playground>
  ),
  "story-slider": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "transitionEffect",
          label: "Transition",
          options: [
            "fade",
            "slideLeft",
            "wipe",
            "zoom",
            "iris",
            "bars",
            "morph",
            "dissolve",
          ],
          optionLabels: [
            "Fade",
            "Slide",
            "Wipe",
            "Zoom",
            "Iris",
            "Bars",
            "Morph",
            "Dissolve",
          ],
          defaultValue: "iris",
        },
        {
          type: "select",
          key: "thumbnailOrientation",
          label: "Thumbnails",
          options: [
            "none",
            "vertical-right",
            "vertical-left",
            "horizontal-top",
            "horizontal-bottom",
          ],
          optionLabels: ["None", "Right", "Left", "Top", "Bottom"],
          defaultValue: "vertical-right",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <StorySlider
            transitionEffect={
              v.transitionEffect as
                | "fade"
                | "slideLeft"
                | "wipe"
                | "zoom"
                | "iris"
                | "bars"
                | "morph"
                | "dissolve"
            }
            thumbnailOrientation={
              v.thumbnailOrientation as
                | "none"
                | "vertical-right"
                | "vertical-left"
                | "horizontal-top"
                | "horizontal-bottom"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "feature-split-section": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "glass",
          label: "Glass Theme",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "showButton",
          label: "Button",
          defaultValue: true,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 32,
          step: 2,
          defaultValue: 16,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <FeatureSplitSection
            theme={v.glass ? "glass" : "paper"}
            showButton={v.showButton as boolean}
            gap={v.gap as number}
          />
        </div>
      )}
    </Playground>
  ),
  "pixel-grid-reveal": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "revealDirection",
          label: "Direction",
          options: ["random", "left-to-right", "top-to-bottom", "center-out"],
          optionLabels: [
            "Random",
            "Left to Right",
            "Top to Bottom",
            "Center Out",
          ],
          defaultValue: "random",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <PixelGridReveal
            revealDirection={
              v.revealDirection as
                "random" | "left-to-right" | "top-to-bottom" | "center-out"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "project-index-list": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "highlightDirection",
          label: "Direction",
          options: ["bottom-up", "top-down", "left-right", "right-left"],
          optionLabels: ["Up", "Down", "Right", "Left"],
          defaultValue: "top-down",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <ProjectIndexList
            highlightDirection={
              v.highlightDirection as
                "bottom-up" | "top-down" | "left-right" | "right-left"
            }
          />
        </div>
      )}
    </Playground>
  ),
  "video-scroll-story": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "textPosition",
          label: "Text Pos",
          options: ["left", "center"],
          defaultValue: "left",
        },
        {
          type: "toggle",
          key: "showAmbientNumber",
          label: "Ambient Num",
          defaultValue: false,
        },
        { type: "toggle", key: "showDots", label: "Dots", defaultValue: true },
        {
          type: "toggle",
          key: "showProgressBar",
          label: "Bar",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "showScrollHint",
          label: "Scroll Hint",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <VideoScrollStory
            containerHeight={420}
            textPosition={v.textPosition as "left" | "center"}
            showAmbientNumber={v.showAmbientNumber as boolean}
            showDots={v.showDots as boolean}
            showProgressBar={v.showProgressBar as boolean}
            showScrollHint={v.showScrollHint as boolean}
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
          options: [
            "cognac",
            "crimson",
            "orchid",
            "forest",
            "midnight",
            "slate",
            "obsidian",
          ],
          defaultValue: "slate",
        },
        {
          type: "select",
          key: "blendMode",
          label: "Blend",
          options: ["soft-light", "screen"],
          optionLabels: ["Soft Light", "Screen"],
          defaultValue: "screen",
        },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <NoiseBackground
            animateBlobs
            colorTheme={
              v.colorTheme as
                | "cognac"
                | "crimson"
                | "orchid"
                | "forest"
                | "midnight"
                | "slate"
                | "obsidian"
            }
            blendMode={v.blendMode as "soft-light" | "screen"}
          />
        </div>
      )}
    </Playground>
  ),
  "text-scramble-pro": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "revealMode",
          label: "Reveal Mode",
          options: ["left-to-right", "right-to-left", "random"],
          optionLabels: ["L→R", "R→L", "RND"],
          defaultValue: "left-to-right",
        },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        {
          type: "color",
          key: "fontColor",
          label: "Text Color",
          defaultValue: "#ffffff",
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <TextScramblePro
            revealMode={
              v.revealMode as "left-to-right" | "right-to-left" | "random"
            }
            loop={v.loop as boolean}
            fontColor={v.fontColor as string}
          />
        </div>
      )}
    </Playground>
  ),
  "meet-the-team": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "minWidth",
          label: "Min Width",
          min: 80,
          max: 400,
          step: 4,
          defaultValue: 140,
        },
        {
          type: "range",
          key: "cardHeight",
          label: "Card Height",
          min: 200,
          max: 700,
          step: 4,
          defaultValue: 340,
        },
        {
          type: "range",
          key: "radius",
          label: "Corner Radius",
          min: 0,
          max: 60,
          step: 2,
          defaultValue: 20,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 64,
          step: 2,
          defaultValue: 16,
        },
        {
          type: "range",
          key: "blurAmount",
          label: "Blur Amount",
          min: 0,
          max: 60,
          step: 1,
          defaultValue: 0,
        },
        {
          type: "range",
          key: "blurSize",
          label: "Edge Blur Size",
          min: 5,
          max: 80,
          step: 1,
          defaultValue: 30,
        },
        {
          type: "toggle",
          key: "showShimmer",
          label: "Shimmer",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <MeetTheTeam
            minWidth={v.minWidth as number}
            cardHeight={v.cardHeight as number}
            radius={v.radius as number}
            gap={v.gap as number}
            blurAmount={v.blurAmount as number}
            blurSize={v.blurSize as number}
            showShimmer={v.showShimmer as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "liquid-image-effect": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "effect",
          label: "Effect",
          options: ["ripple", "melt", "bulge", "glitch"],
          optionLabels: ["Ripple", "Melt", "Bulge", "Glitch"],
          defaultValue: "ripple",
        },
        {
          type: "range",
          key: "strength",
          label: "Strength",
          min: 0.01,
          max: 0.6,
          step: 0.01,
          defaultValue: 0.18,
        },
        {
          type: "range",
          key: "cornerRadius",
          label: "Corner R.",
          min: 0,
          max: 60,
          step: 1,
          defaultValue: 0,
        },
        {
          type: "toggle",
          key: "cursorVisible",
          label: "Cursor",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <LiquidImageEffect
            image="/demo/34.webp"
            effect={v.effect as "ripple" | "melt" | "bulge" | "glitch"}
            strength={v.strength as number}
            cornerRadius={v.cornerRadius as number}
            cursorVisible={v.cursorVisible as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "sticky-scroll-reveal": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "cardWidth",
          label: "Card W",
          min: 160,
          max: 600,
          step: 8,
          defaultValue: 320,
        },
        {
          type: "range",
          key: "cardHeight",
          label: "Card H",
          min: 120,
          max: 500,
          step: 8,
          defaultValue: 240,
        },
        {
          type: "select",
          key: "cardPosition",
          label: "Side",
          options: ["left", "right"],
          defaultValue: "right",
        },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl bg-[#080808]">
          <StickyScrollReveal
            containerHeight={380}
            cardWidth={v.cardWidth as number}
            cardHeight={v.cardHeight as number}
            cardPosition={v.cardPosition as "left" | "right"}
          />
        </div>
      )}
    </Playground>
  ),
  "node-field": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "mode",
          label: "Mode",
          options: ["repel", "attract"],
          defaultValue: "repel",
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 0.1,
          max: 3,
          step: 0.1,
          defaultValue: 0.3,
        },
        {
          type: "range",
          key: "force",
          label: "Force",
          min: 20,
          max: 500,
          step: 10,
          defaultValue: 180,
        },
        {
          type: "toggle",
          key: "connectionLines",
          label: "Lines",
          defaultValue: true,
        },
        {
          type: "range",
          key: "connectionDistance",
          label: "Distance",
          min: 20,
          max: 400,
          step: 10,
          defaultValue: 180,
        },
        {
          type: "range",
          key: "count",
          label: "Count",
          min: 20,
          max: 1200,
          step: 10,
          defaultValue: 120,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <NodeField
            mode={v.mode as "repel" | "attract"}
            speed={v.speed as number}
            force={v.force as number}
            connectionLines={v.connectionLines as boolean}
            connectionDistance={v.connectionDistance as number}
            count={v.count as number}
          />
        </div>
      )}
    </Playground>
  ),
  "dot-field-grid": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "shape",
          label: "Shape",
          options: [
            "circle",
            "square",
            "triangle",
            "diamond",
            "cross",
            "star",
            "ring",
          ],
          optionLabels: [
            "Circle",
            "Square",
            "Triangle",
            "Diamond",
            "Plus",
            "Star",
            "Ring",
          ],
          defaultValue: "circle",
        },
        {
          type: "range",
          key: "influence",
          label: "Repel",
          min: 40,
          max: 200,
          step: 5,
          defaultValue: 120,
        },
        {
          type: "range",
          key: "spacing",
          label: "Density",
          min: 20,
          max: 60,
          step: 4,
          defaultValue: 36,
        },
        {
          type: "select",
          key: "mode",
          label: "Mode",
          options: ["repel", "attract"],
          defaultValue: "repel",
        },
        {
          type: "toggle",
          key: "gradientMask",
          label: "Mask",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "showCursor",
          label: "Cursor",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <DotFieldGrid
            shape={
              v.shape as
                | "circle"
                | "square"
                | "triangle"
                | "diamond"
                | "cross"
                | "star"
                | "ring"
            }
            influence={v.influence as number}
            spacing={v.spacing as number}
            mode={v.mode as "repel" | "attract"}
            gradientMask={v.gradientMask as boolean}
            showCursor={v.showCursor as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "focus-frame": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "blurSize",
          label: "Edge Blur Size",
          min: 5,
          max: 60,
          step: 1,
          defaultValue: 35,
        },
        {
          type: "range",
          key: "blurAmount",
          label: "Blur Amount",
          min: 0,
          max: 60,
          step: 1,
          defaultValue: 24,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <FocusFrame
            blurSize={v.blurSize as number}
            blurAmount={v.blurAmount as number}
          />
        </div>
      )}
    </Playground>
  ),
  "wave-lines": () => (
    <Playground
      controls={[
        {
          type: "toggle",
          key: "useGradient",
          label: "Gradient",
          defaultValue: true,
        },
        {
          type: "range",
          key: "vignette",
          label: "Vignette",
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 1,
        },
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["horizontal", "vertical", "diagonal", "diagonalReverse"],
          optionLabels: ["Horizontal", "Vertical", "Diagonal", "Diagonal ↘︎"],
          defaultValue: "horizontal",
        },
        {
          type: "toggle",
          key: "enableMouseInteraction",
          label: "Mouse",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <WaveLines
            color="#5b8dee"
            colorB="#a855f7"
            useGradient={v.useGradient as boolean}
            vignette={v.vignette as number}
            direction={
              v.direction as
                "horizontal" | "vertical" | "diagonal" | "diagonalReverse"
            }
            enableMouseInteraction={v.enableMouseInteraction as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "eternal-glow-card": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "warm", "navy", "rose"],
          optionLabels: ["Dark", "Warm", "Navy", "Rose"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-[#080808] px-6">
          <div className="h-[400px] w-72 max-w-full">
            <EternalGlowCard
              theme={v.theme as "dark" | "warm" | "navy" | "rose"}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "instagram-story-viewer": () => (
    <div className="h-[640px] w-full max-w-[1000px] mx-auto overflow-hidden rounded-xl bg-[#080808]">
      <InstagramStoryViewer stories={STORY_VIEWER_STORIES} />
    </div>
  ),
  "coverflow-services-hero": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["glass", "paper"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "glass",
        },
        {
          type: "toggle",
          key: "showParallax",
          label: "Parallax",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "showIndex",
          label: "Show Number",
          defaultValue: true,
        },
        {
          type: "range",
          key: "borderRadius",
          label: "Radius",
          min: 0,
          max: 40,
          step: 2,
          defaultValue: 20,
        },
        {
          type: "toggle",
          key: "autoplay",
          label: "Autoplay",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "headingUppercase",
          label: "Uppercase",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <CoverflowServicesHero
            {...COVERFLOW_HERO_PROPS}
            theme={v.theme as "glass" | "paper"}
            showParallax={Boolean(v.showParallax)}
            showIndex={Boolean(v.showIndex)}
            borderRadius={v.borderRadius as number}
            autoplay={Boolean(v.autoplay)}
            headingUppercase={Boolean(v.headingUppercase)}
            slideTitleUppercase={Boolean(v.headingUppercase)}
          />
        </div>
      )}
    </Playground>
  ),
  "side-marquee-pricing-cta": () => (
    <div className="w-full overflow-hidden rounded-xl bg-white p-6">
      <div className="h-[420px] w-full max-[360px]:h-[500px]">
        <SideMarqueePricingCta />
      </div>
    </div>
  ),
  "dice-roll-discount-popup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["ecommerce", "campaign", "restaurant", "saas", "event"],
          optionLabels: [
            "Ecommerce",
            "Campaign",
            "Restaurant",
            "SaaS",
            "Event",
          ],
          defaultValue: "ecommerce",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[720px] p-4" : "p-8",
          )}
        >
          <div className="w-full max-w-[420px]">
            <DiceRollDiscountPopup
              theme={
                v.theme as
                  "ecommerce" | "campaign" | "restaurant" | "saas" | "event"
              }
              lightMode={v.lightMode === "light"}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "review-marquee-wall": () => (
    <div className="h-[560px] w-full overflow-hidden rounded-xl bg-[#080808]">
      <ReviewMarqueeWall />
    </div>
  ),
  "canvas-transition-carousel": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "transitionEffect",
          label: "Transition",
          options: [
            "wipe",
            "curtain",
            "crosszoom",
            "reveal",
            "burn",
            "fade",
            "slide",
            "zoom",
            "iris",
            "dissolve",
          ],
          optionLabels: [
            "Wipe",
            "Curtain",
            "Cross Zoom",
            "Reveal",
            "Burn",
            "Fade",
            "Slide",
            "Zoom",
            "Iris",
            "Dissolve",
          ],
          defaultValue: "wipe",
        },
        {
          type: "toggle",
          key: "parallax",
          label: "Parallax",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <CanvasTransitionCarousel
            transitionEffect={
              v.transitionEffect as
                | "wipe"
                | "curtain"
                | "crosszoom"
                | "reveal"
                | "burn"
                | "fade"
                | "slide"
                | "zoom"
                | "iris"
                | "dissolve"
            }
            parallax={v.parallax as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "social-proof-video-grid": () => (
    <div className="w-full overflow-hidden rounded-xl bg-white p-6">
      <SocialProofVideoGrid />
    </div>
  ),
  "wheel-spin-discount-popup": () => (
    <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-xl bg-[#080808]">
      <WheelSpinDiscountPopup />
    </div>
  ),
  "coin-flip-game": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["night", "neon", "gold", "tide"],
          optionLabels: ["Night", "Neon", "Gold", "Tide"],
          defaultValue: "night",
        },
        {
          type: "select",
          key: "lightMode",
          label: "Mode",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "size",
          label: "Coin Size",
          min: 120,
          max: 200,
          step: 4,
          defaultValue: 160,
        },
        {
          type: "toggle",
          key: "asPopup",
          label: "Popup Mode",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-xl border border-border bg-[#080808]",
            v.asPopup ? "h-[420px] p-4" : "p-8",
          )}
        >
          <div
            className={cn(
              v.asPopup ? "relative h-full w-full" : "w-full max-w-[360px]",
            )}
          >
            <CoinFlipGame
              theme={v.theme as "night" | "neon" | "gold" | "tide"}
              lightMode={v.lightMode === "light"}
              size={v.size as number}
              asPopup={v.asPopup as boolean}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "card-carousel": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "radius",
          label: "Radius",
          min: 0,
          max: 40,
          step: 2,
          defaultValue: 20,
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 0,
          max: 32,
          step: 2,
          defaultValue: 8,
        },
        {
          type: "toggle",
          key: "autoPlay",
          label: "Autoplay",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "parallax",
          label: "Parallax",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div className="h-[700px] w-full">
          <CardCarousel
            cards={[
              {
                src: "/demo/8.webp",
                title: "Morning Ritual",
                description:
                  "A quiet pass through the bedroom before the light gets too warm.",
                tag: "Interiors",
              },
              {
                src: "/demo/9.webp",
                title: "Interior No. 4",
                description:
                  "Part of an ongoing series on empty rooms and the people passing through them.",
                tag: "Interiors",
              },
              {
                src: "/demo/10.webp",
                title: "Kitchen Pass",
                description:
                  "Low light, bare counters, no plan beyond showing up.",
                tag: "Photography",
              },
              {
                src: "/demo/19.webp",
                title: "Living Room",
                description: "A study in stillness, shot over three mornings.",
                tag: "Interiors",
              },
              {
                src: "/demo/20.webp",
                title: "Last Light",
                description: "The last frame before the roll ran out.",
                tag: "Photography",
              },
            ]}
            showButton
            borderRadius={v.radius as number}
            gap={v.gap as number}
            autoPlay={v.autoPlay as boolean}
            showParallax={v.parallax as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "carousel-slider": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "titleMode",
          label: "Counter",
          options: ["numbers", "roman", "words"],
          optionLabels: ["Numbers", "Roman", "Words"],
          defaultValue: "numbers",
        },
        {
          type: "range",
          key: "gap",
          label: "Gap",
          min: 16,
          max: 64,
          step: 16,
          defaultValue: 32,
        },
        {
          type: "range",
          key: "radius",
          label: "Radius",
          min: 0,
          max: 40,
          step: 4,
          defaultValue: 12,
        },
        {
          type: "toggle",
          key: "autoplay",
          label: "Autoplay",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="h-[600px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <CarouselSlider
            items={CAROUSEL_SLIDER_ITEMS}
            titleMode={v.titleMode as "numbers" | "roman" | "words"}
            gap={v.gap as number}
            radius={v.radius as number}
            autoplay={v.autoplay as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "matrix-rain-background": () => (
    <Playground
      controls={[
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 1,
          max: 20,
          step: 1,
          defaultValue: 8,
        },
        {
          type: "range",
          key: "density",
          label: "Density",
          min: 0.3,
          max: 2,
          step: 0.1,
          defaultValue: 1,
        },
        {
          type: "range",
          key: "fontSize",
          label: "Font Size",
          min: 10,
          max: 28,
          step: 1,
          defaultValue: 14,
        },
        {
          type: "select",
          key: "colorMode",
          label: "Color",
          options: ["green", "blue", "purple", "rainbow"],
          optionLabels: ["Green", "Blue", "Purple", "Rainbow"],
          defaultValue: "green",
        },
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["down", "up", "left", "right"],
          optionLabels: ["Down", "Up", "Left", "Right"],
          defaultValue: "down",
        },
      ]}
    >
      {(v) => (
        <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <MatrixRainBackground
            speed={Number(v.speed)}
            density={Number(v.density)}
            fontSize={Number(v.fontSize)}
            colorMode={v.colorMode as "green" | "blue" | "purple" | "rainbow"}
            direction={v.direction as "down" | "up" | "left" | "right"}
          />
        </div>
      )}
    </Playground>
  ),
  "bubble-cursor": () => {
    const presets = {
      sapphire: {
        colorA: "rgba(74, 116, 184, 1)",
        colorB: "rgba(105, 105, 106, 1)",
        tint: "rgba(255, 255, 255, 1)",
      },
      amber: {
        colorA: "rgba(214, 165, 74, 1)",
        colorB: "rgba(140, 90, 40, 1)",
        tint: "rgba(255, 250, 240, 1)",
      },
      emerald: {
        colorA: "rgba(52, 168, 132, 1)",
        colorB: "rgba(30, 90, 80, 1)",
        tint: "rgba(240, 255, 250, 1)",
      },
    } as const;
    return (
      <Playground
        controls={[
          {
            type: "select",
            key: "preset",
            label: "Theme",
            options: ["sapphire", "amber", "emerald"],
            optionLabels: ["Sapphire", "Amber", "Emerald"],
            defaultValue: "sapphire",
          },
        ]}
      >
        {(v) => {
          const preset = presets[v.preset as keyof typeof presets];
          return (
            <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-border bg-[#080808]">
              <BubbleCursor
                showThemeToggle={false}
                hideOnTouch={false}
                colorA={preset.colorA}
                colorB={preset.colorB}
                tint={preset.tint}
              />
            </div>
          );
        }}
      </Playground>
    );
  },
  "soft-background": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "preset",
          label: "Preset",
          options: [
            "aurora",
            "blush",
            "mint",
            "dusk",
            "peach",
            "slate",
            "midnight",
            "ember",
            "forest",
            "noir",
          ],
          optionLabels: [
            "Aurora",
            "Blush",
            "Mint",
            "Dusk",
            "Peach",
            "Slate",
            "Midnight",
            "Ember",
            "Forest",
            "Noir",
          ],
          defaultValue: "dusk",
        },
        {
          type: "range",
          key: "orbCount",
          label: "Orbs",
          min: 1,
          max: 5,
          step: 1,
          defaultValue: 3,
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 0.2,
          max: 3,
          step: 0.1,
          defaultValue: 1,
        },
        {
          type: "toggle",
          key: "noiseTexture",
          label: "Noise",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "vignette",
          label: "Vignette",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="relative h-[700px] w-full overflow-hidden rounded-xl bg-[#080808]">
          <SoftBackground
            preset={v.preset as SoftBackgroundPreset}
            orbCount={v.orbCount as 1 | 2 | 3 | 4 | 5}
            speed={v.speed as number}
            noiseTexture={v.noiseTexture as boolean}
            vignette={v.vignette as boolean}
          />
        </div>
      )}
    </Playground>
  ),
  "toggle-pro": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["orange", "violet", "blue", "green", "pink"],
          optionLabels: ["Orange", "Violet", "Blue", "Green", "Pink"],
          defaultValue: "orange",
        },
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 24,
          max: 80,
          step: 2,
          defaultValue: 32,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => {
        const height = Number(v.size);
        const accent = DEMO_ACCENTS[v.color as string] ?? DEMO_ACCENTS.orange;
        return (
          <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
            <TogglePro
              {...TOGGLE_DEMO_COLORS}
              defaultChecked
              height={height}
              width={Math.round((height * 52) / 30)}
              padding={Math.max(3, Math.round(height * 0.11))}
              ringWidth={Math.max(3, Math.round(height * 0.1))}
              trackOnColor={accent}
              ringColor={accent.replace("rgb", "rgba").replace(")", ",0.3)")}
              disabled={Boolean(v.disabled)}
            />
          </div>
        );
      }}
    </Playground>
  ),
  "badges-kit": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "tone",
          label: "Tone",
          options: [
            "success",
            "error",
            "info",
            "warning",
            "purple",
            "orange",
            "indigo",
            "neutral",
          ],
          optionLabels: [
            "Success",
            "Error",
            "Info",
            "Warning",
            "Purple",
            "Orange",
            "Indigo",
            "Neutral",
          ],
          defaultValue: "success",
        },
        {
          type: "select",
          key: "icon",
          label: "Icon",
          options: ["check", "cross", "dot", "spinner", "none"],
          optionLabels: ["Check", "Cross", "Dot", "Spinner", "None"],
          defaultValue: "check",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["md", "lg", "xl", "2xl"],
          optionLabels: ["MD", "LG", "XL", "2XL"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "closable",
          label: "Closable",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
          <Badge
            key={`${v.tone}-${v.icon}-${v.size}-${v.theme}-${v.closable}`}
            label={BADGE_DEMO_LABELS[v.tone as string] ?? "Badge"}
            tone={v.tone as BadgeTone}
            icon={v.icon as BadgeIconType}
            size={v.size as BadgeSize}
            theme={v.theme as BadgeTheme}
            closable={Boolean(v.closable)}
          />
        </div>
      )}
    </Playground>
  ),
  "animated-checkbox": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "shape",
          label: "Style",
          options: ["rounded", "square", "circle"],
          optionLabels: ["Rounded", "Square", "Circle"],
          defaultValue: "rounded",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["orange", "violet", "blue", "green", "pink"],
          optionLabels: ["Orange", "Violet", "Blue", "Green", "Pink"],
          defaultValue: "orange",
        },
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 16,
          max: 96,
          step: 2,
          defaultValue: 40,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => {
        const size = Number(v.size);
        const accent = DEMO_ACCENTS[v.color as string] ?? DEMO_ACCENTS.orange;
        const radius =
          v.shape === "circle"
            ? size / 2
            : v.shape === "square"
              ? Math.max(2, size * 0.08)
              : size * 0.3;
        return (
          <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
            <AnimatedCheckbox
              {...CHECKBOX_DEMO_COLORS}
              defaultChecked
              size={size}
              radius={radius}
              borderWidth={Math.max(1.5, size * 0.075)}
              ringWidth={Math.max(3, size * 0.14)}
              accentColor={accent}
              ringColor={accent.replace("rgb", "rgba").replace(")", ",0.3)")}
              disabled={Boolean(v.disabled)}
              label=""
            />
          </div>
        );
      }}
    </Playground>
  ),
  "radio-button": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["default", "card"],
          optionLabels: ["Default", "Card"],
          defaultValue: "default",
        },
        {
          type: "select",
          key: "direction",
          label: "Direction",
          options: ["vertical", "horizontal"],
          optionLabels: ["Vertical", "Horizontal"],
          defaultValue: "vertical",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 16,
          max: 40,
          step: 2,
          defaultValue: 20,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => {
        const accent = RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber;
        return (
          <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6 text-white">
            <RadioButton
              key={`${v.variant}-${v.direction}`}
              label="Choose a plan"
              defaultValue="pro"
              variant={v.variant as "default" | "card"}
              direction={v.direction as "vertical" | "horizontal"}
              size={Number(v.size)}
              accentColor={accent}
              ringColor={`color-mix(in srgb, ${accent} 30%, transparent)`}
              disabled={Boolean(v.disabled)}
            />
          </div>
        );
      }}
    </Playground>
  ),
  select: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 12,
          max: 20,
          step: 1,
          defaultValue: 15,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[520px] w-full items-start justify-center rounded-xl px-6 pt-20 ${v.theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
        >
          <Select
            label="Team"
            helperText="Pick the team you work in"
            theme={v.theme as "dark" | "light"}
            accentColor={
              RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
            }
            size={Number(v.size)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  slider: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "mode",
          label: "Mode",
          options: ["single", "range"],
          optionLabels: ["Single", "Range"],
          defaultValue: "single",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "range",
          key: "thumb",
          label: "Thumb",
          min: 14,
          max: 32,
          step: 2,
          defaultValue: 20,
        },
        { type: "toggle", key: "marks", label: "Marks", defaultValue: false },
        {
          type: "toggle",
          key: "tooltip",
          label: "Tooltip",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
        >
          <Slider
            key={String(v.mode)}
            label={v.mode === "range" ? "Price" : "Volume"}
            unit={v.mode === "range" ? "$" : "%"}
            unitPosition={v.mode === "range" ? "prefix" : "suffix"}
            range={v.mode === "range"}
            min={0}
            max={v.mode === "range" ? 200 : 100}
            step={v.mode === "range" ? 10 : 1}
            defaultValue={v.mode === "range" ? [40, 120] : 40}
            theme={v.theme as "dark" | "light"}
            accentColor={
              RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
            }
            thumbSize={Number(v.thumb)}
            showMarks={Boolean(v.marks)}
            showTooltip={Boolean(v.tooltip)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  "search-bar": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 12,
          max: 20,
          step: 1,
          defaultValue: 15,
        },
        {
          type: "toggle",
          key: "suggestions",
          label: "Suggestions",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "shortcut",
          label: "Shortcut",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "loading",
          label: "Loading",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[460px] w-full items-start justify-center rounded-xl px-6 pt-24 ${v.theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
        >
          <SearchBar
            theme={v.theme as "dark" | "light"}
            accentColor={
              RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
            }
            size={Number(v.size)}
            suggestions={v.suggestions ? SEARCH_DEMO_SUGGESTIONS : []}
            shortcut={v.shortcut ? "⌘K" : ""}
            loading={Boolean(v.loading)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  kbd: () => (
    <Playground
      controls={[
        { type: "select", key: "combo", label: "Keys", options: ["mod+k", "mod+shift+p", "ctrl+alt+delete", "esc", "enter", "up+down"], optionLabels: ["⌘ K", "⌘ ⇧ P", "Ctrl Alt Del", "Esc", "Enter", "↑ ↓"], defaultValue: "mod+k" },
        { type: "select", key: "variant", label: "Variant", options: ["raised", "flat", "outline"], optionLabels: ["Raised", "Flat", "Outline"], defaultValue: "raised" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "lg" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "separator", label: "Separator", defaultValue: false },
        { type: "toggle", key: "listen", label: "Listen to keys", defaultValue: true },
      ]}
    >
      {(v) => (
        <KbdDemo
          combo={v.combo as string}
          variant={v.variant as "raised" | "flat" | "outline"}
          size={v.size as "sm" | "md" | "lg"}
          theme={v.theme as "dark" | "light"}
          separator={Boolean(v.separator)}
          listen={Boolean(v.listen)}
        />
      )}
    </Playground>
  ),
  "empty-state": () => (
    <Playground
      controls={[
        { type: "select", key: "preset", label: "Preset", options: ["inbox", "search", "folder", "cart", "error"], optionLabels: ["Inbox", "Search", "Folder", "Cart", "Error"], defaultValue: "inbox" },
        { type: "select", key: "variant", label: "Variant", options: ["plain", "card", "dashed"], optionLabels: ["Plain", "Card", "Dashed"], defaultValue: "plain" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "float", label: "Float", defaultValue: true },
        { type: "toggle", key: "desc", label: "Description", defaultValue: true },
        { type: "toggle", key: "actions", label: "Actions", defaultValue: true },
      ]}
    >
      {(v) => (
        <EmptyStateDemo
          preset={v.preset as "inbox" | "search" | "folder" | "cart" | "error"}
          variant={v.variant as "plain" | "card" | "dashed"}
          size={v.size as "sm" | "md" | "lg"}
          theme={v.theme as "dark" | "light"}
          float={Boolean(v.float)}
          showDescription={Boolean(v.desc)}
          showActions={Boolean(v.actions)}
        />
      )}
    </Playground>
  ),
  "tag-input": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "max", label: "Max tags", min: 0, max: 10, step: 1, defaultValue: 0 },
        { type: "toggle", key: "suggestions", label: "Suggestions", defaultValue: true },
        { type: "toggle", key: "duplicates", label: "Allow duplicates", defaultValue: false },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[440px] w-full items-start justify-center rounded-xl px-6 pt-24 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <TagInput
            label="Skills"
            placeholder="Add a skill..."
            defaultValue={["React", "Tailwind"]}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            maxTags={Number(v.max) > 0 ? Number(v.max) : undefined}
            suggestions={v.suggestions ? TAG_INPUT_SUGGESTIONS : []}
            allowDuplicates={Boolean(v.duplicates)}
            disabled={Boolean(v.disabled)}
            helperText="Press Enter or comma to add"
            validate={(tag) => (tag.length < 2 ? "Tags need at least 2 characters" : null)}
          />
        </div>
      )}
    </Playground>
  ),
  combobox: () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "clearable", label: "Clearable", defaultValue: true },
        { type: "toggle", key: "descriptions", label: "Descriptions", defaultValue: true },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[480px] w-full items-start justify-center rounded-xl px-6 pt-24 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Combobox
            key={`${v.descriptions}`}
            label="Framework"
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            clearable={Boolean(v.clearable)}
            disabled={Boolean(v.disabled)}
            helperText="Type to search, use the arrow keys to move"
            options={
              v.descriptions
                ? undefined
                : ["React", "Vue", "Svelte", "SolidJS", "Angular", "Astro", "Next.js", "Remix"].map((n) => ({ value: n.toLowerCase(), label: n, disabled: n === "Remix" }))
            }
          />
        </div>
      )}
    </Playground>
  ),
  "multi-select": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "max", label: "Max selected", min: 0, max: 7, step: 1, defaultValue: 0 },
        { type: "range", key: "visible", label: "Visible chips", min: 1, max: 6, step: 1, defaultValue: 3 },
        { type: "toggle", key: "all", label: "Select all", defaultValue: true },
        { type: "toggle", key: "clearable", label: "Clearable", defaultValue: true },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[520px] w-full items-start justify-center rounded-xl px-6 pt-24 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <MultiSelect
            label="Teams"
            defaultValue={["design", "product"]}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            maxSelected={Number(v.max) > 0 ? Number(v.max) : undefined}
            maxVisibleTags={Number(v.visible)}
            showSelectAll={Boolean(v.all)}
            clearable={Boolean(v.clearable)}
            disabled={Boolean(v.disabled)}
            helperText="Type to search, Backspace removes the last"
          />
        </div>
      )}
    </Playground>
  ),
  "date-picker": () => (
    <Playground
      controls={[
        { type: "select", key: "mode", label: "Mode", options: ["single", "range"], optionLabels: ["Single", "Range"], defaultValue: "single" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "week", label: "Week starts", options: ["0", "1"], optionLabels: ["Sun", "Mon"], defaultValue: "0" },
        { type: "toggle", key: "future", label: "Future only", defaultValue: false },
        { type: "toggle", key: "close", label: "Close on select", defaultValue: true },
        { type: "toggle", key: "clearable", label: "Clearable", defaultValue: true },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[560px] w-full items-start justify-center rounded-xl px-6 pt-20 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <DatePicker
            key={String(v.mode)}
            label="Due date"
            mode={v.mode as "single" | "range"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            weekStartsOn={Number(v.week) as 0 | 1}
            minDate={v.future ? new Date() : undefined}
            closeOnSelect={Boolean(v.close)}
            clearable={Boolean(v.clearable)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  "input-otp": () => (
    <Playground
      controls={[
        { type: "range", key: "length", label: "Length", min: 4, max: 8, step: 1, defaultValue: 6 },
        { type: "range", key: "group", label: "Group size", min: 0, max: 4, step: 1, defaultValue: 3 },
        { type: "select", key: "kind", label: "Type", options: ["numeric", "alphanumeric"], optionLabels: ["Numeric", "Alphanumeric"], defaultValue: "numeric" },
        { type: "select", key: "status", label: "Status", options: ["idle", "error", "success"], optionLabels: ["Idle", "Error", "Success"], defaultValue: "idle" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "mask", label: "Mask", defaultValue: false },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <InputOTP
            key={`${v.length}-${v.kind}`}
            label="Verification code"
            length={Number(v.length)}
            groupSize={Number(v.group) > 0 ? Number(v.group) : undefined}
            type={v.kind as "numeric" | "alphanumeric"}
            status={v.status as "idle" | "error" | "success"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            mask={Boolean(v.mask)}
            disabled={Boolean(v.disabled)}
            helperText="Type or paste your code"
            errorText="That code is incorrect."
          />
        </div>
      )}
    </Playground>
  ),
  "number-input": () => (
    <Playground
      controls={[
        { type: "select", key: "layout", label: "Layout", options: ["split", "stacked"], optionLabels: ["Split", "Stacked"], defaultValue: "split" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "step", label: "Step", options: ["1", "0.5", "0.01", "5"], optionLabels: ["1", "0.5", "0.01", "5"], defaultValue: "1" },
        { type: "select", key: "unit", label: "Unit", options: ["none", "$", "kg"], optionLabels: ["None", "$ prefix", "kg suffix"], defaultValue: "none" },
        { type: "range", key: "max", label: "Max", min: 10, max: 100, step: 10, defaultValue: 100 },
        { type: "toggle", key: "sep", label: "Thousands", defaultValue: false },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <NumberInput
            key={`${v.step}-${v.layout}`}
            label="Amount"
            defaultValue={10}
            min={0}
            max={Number(v.max)}
            step={Number(v.step)}
            layout={v.layout as "split" | "stacked"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            prefix={v.unit === "$" ? "$" : undefined}
            suffix={v.unit === "kg" ? "kg" : undefined}
            thousandSeparator={Boolean(v.sep)}
            disabled={Boolean(v.disabled)}
            width={240}
          />
        </div>
      )}
    </Playground>
  ),
  "password-input": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "min", label: "Min length", min: 6, max: 16, step: 1, defaultValue: 8 },
        { type: "toggle", key: "strength", label: "Strength", defaultValue: true },
        { type: "toggle", key: "rules", label: "Requirements", defaultValue: true },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[440px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <PasswordInput
            label="Password"
            helperText="Use a mix of letters, numbers and symbols"
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            minLength={Number(v.min)}
            showStrength={Boolean(v.strength)}
            showRequirements={Boolean(v.rules)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  "segmented-control": () => (
    <Playground
      controls={[
        { type: "select", key: "variant", label: "Variant", options: ["solid", "soft"], optionLabels: ["Solid", "Soft"], defaultValue: "solid" },
        { type: "select", key: "orientation", label: "Orientation", options: ["horizontal", "vertical"], optionLabels: ["Horizontal", "Vertical"], defaultValue: "horizontal" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "icons", label: "Icons", defaultValue: true },
        { type: "toggle", key: "iconOnly", label: "Icon only", defaultValue: false },
        { type: "toggle", key: "full", label: "Full width", defaultValue: false },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <div style={{ width: v.full && v.orientation === "horizontal" ? 420 : undefined }} className="flex justify-center">
            <SegmentedControl
              key={String(v.icons)}
              options={SEGMENT_VIEW_OPTIONS.map((o) => (v.icons ? o : { ...o, icon: undefined }))}
              defaultValue="grid"
              variant={v.variant as "solid" | "soft"}
              orientation={v.orientation as "horizontal" | "vertical"}
              size={v.size as "sm" | "md" | "lg"}
              theme={v.theme as "dark" | "light"}
              iconOnly={Boolean(v.iconOnly) && Boolean(v.icons)}
              fullWidth={Boolean(v.full)}
              disabled={Boolean(v.disabled)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "color-picker": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "alpha", label: "Opacity", defaultValue: false },
        { type: "toggle", key: "presets", label: "Presets", defaultValue: true },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[520px] w-full items-start justify-center rounded-xl px-6 pt-20 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <ColorPicker
            key={String(v.alpha)}
            label="Brand color"
            defaultValue="#F2A841"
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            showAlpha={Boolean(v.alpha)}
            presets={v.presets ? undefined : []}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  "file-upload": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "accept", label: "Accept", options: ["any", "images", "pdf"], optionLabels: ["Any", "Images", "PDF"], defaultValue: "any" },
        { type: "range", key: "maxFiles", label: "Max files", min: 1, max: 8, step: 1, defaultValue: 4 },
        { type: "toggle", key: "multiple", label: "Multiple", defaultValue: true },
        { type: "toggle", key: "simulate", label: "Simulate upload", defaultValue: true },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex min-h-[520px] w-full items-start justify-center rounded-xl px-6 py-16 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <FileUpload
            key={`${v.accept}-${v.multiple}`}
            label="Attachments"
            accept={v.accept === "images" ? "image/*" : v.accept === "pdf" ? ".pdf,application/pdf" : undefined}
            multiple={Boolean(v.multiple)}
            maxFiles={Number(v.maxFiles)}
            maxSize={5 * 1024 * 1024}
            upload={v.simulate ? fakeUpload : undefined}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  callout: () => (
    <Playground
      controls={[
        { type: "select", key: "variant", label: "Variant", options: ["info", "success", "warning", "danger", "neutral"], optionLabels: ["Info", "Success", "Warning", "Danger", "Neutral"], defaultValue: "info" },
        { type: "select", key: "appearance", label: "Appearance", options: ["soft", "outline", "bar"], optionLabels: ["Soft", "Outline", "Bar"], defaultValue: "soft" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "title", label: "Title", defaultValue: true },
        { type: "toggle", key: "dismiss", label: "Dismissible", defaultValue: true },
        { type: "toggle", key: "action", label: "Action", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex min-h-[400px] w-full items-center justify-center rounded-xl px-6 py-12 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Callout
            key={`${v.variant}-${v.dismiss}`}
            variant={v.variant as "info" | "success" | "warning" | "danger" | "neutral"}
            appearance={v.appearance as "soft" | "outline" | "bar"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            title={v.title ? "Something worth knowing" : undefined}
            dismissible={Boolean(v.dismiss)}
            action={v.action ? { label: "Learn more" } : undefined}
          >
            Changes are saved automatically and synced across your devices.
          </Callout>
        </div>
      )}
    </Playground>
  ),
  meter: () => (
    <Playground
      controls={[
        { type: "select", key: "variant", label: "Variant", options: ["bar", "gauge", "segments"], optionLabels: ["Bar", "Gauge", "Segments"], defaultValue: "bar" },
        { type: "range", key: "value", label: "Value", min: 0, max: 100, step: 1, defaultValue: 64 },
        { type: "select", key: "dir", label: "Good direction", options: ["up", "down"], optionLabels: ["Up", "Down"], defaultValue: "up" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "zones", label: "Zones", defaultValue: true },
        { type: "toggle", key: "showValue", label: "Show value", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex min-h-[400px] w-full items-center justify-center rounded-xl px-6 py-12 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Meter
            label="Storage"
            variant={v.variant as "bar" | "gauge" | "segments"}
            value={Number(v.value)}
            unit="%"
            low={v.zones ? 35 : undefined}
            high={v.zones ? 75 : undefined}
            goodDirection={v.dir as "up" | "down"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            showValue={Boolean(v.showValue)}
            description="Low below 35, high above 75"
          />
        </div>
      )}
    </Playground>
  ),
  "command-palette": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "hotkey", label: "Cmd/Ctrl+K hint", defaultValue: true },
      ]}
    >
      {(v) => <CommandPaletteDemo theme={v.theme as "dark" | "light"} hotkey={Boolean(v.hotkey)} />}
    </Playground>
  ),
  menubar: () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
      ]}
    >
      {(v) => (
        <div className={`flex h-[400px] w-full items-start justify-center rounded-xl px-6 pt-16 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <MenubarDemo theme={v.theme as "dark" | "light"} size={v.size as "sm" | "md" | "lg"} />
        </div>
      )}
    </Playground>
  ),
  sidebar: () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "collapsed", label: "Collapsed", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[460px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Sidebar
            key={String(v.collapsed)}
            header="Acme"
            sections={SIDEBAR_SECTIONS}
            defaultActiveId="home"
            user={{ name: "Ada Lovelace", subtitle: "ada@acme.com" }}
            theme={v.theme as "dark" | "light"}
            size={v.size as "sm" | "md" | "lg"}
            defaultCollapsed={Boolean(v.collapsed)}
            height={420}
          />
        </div>
      )}
    </Playground>
  ),
  dock: () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "magnification", label: "Magnification", min: 1.2, max: 2.2, step: 0.1, defaultValue: 1.7 },
        { type: "range", key: "distance", label: "Reach", min: 60, max: 220, step: 10, defaultValue: 140 },
      ]}
    >
      {(v) => (
        <div className={`flex h-[300px] w-full items-end justify-center rounded-xl px-6 pb-12 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Dock items={DOCK_ITEMS} size={v.size as "sm" | "md" | "lg"} theme={v.theme as "dark" | "light"} magnification={Number(v.magnification)} distance={Number(v.distance)} />
        </div>
      )}
    </Playground>
  ),
  "confirm-dialog": () => (
    <Playground
      controls={[
        { type: "select", key: "variant", label: "Variant", options: ["default", "warning", "danger"], optionLabels: ["Default", "Warning", "Danger"], defaultValue: "danger" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "async", label: "Async confirm", defaultValue: true },
        { type: "toggle", key: "fail", label: "Fails (shows error)", defaultValue: false },
      ]}
    >
      {(v) => (
        <ConfirmDialogDemo
          theme={v.theme as "dark" | "light"}
          variant={v.variant as "default" | "warning" | "danger"}
          async={Boolean(v.async)}
          shouldFail={Boolean(v.fail)}
        />
      )}
    </Playground>
  ),
  "hover-card": () => (
    <Playground
      controls={[
        { type: "select", key: "placement", label: "Placement", options: ["top", "bottom", "left", "right"], optionLabels: ["Top", "Bottom", "Left", "Right"], defaultValue: "bottom" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "openDelay", label: "Open delay", min: 0, max: 800, step: 50, defaultValue: 300 },
        { type: "toggle", key: "arrow", label: "Arrow", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex h-[320px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <HoverCard
            content={<HoverCardProfile theme={v.theme as "dark" | "light"} />}
            placement={v.placement as "top" | "bottom" | "left" | "right"}
            theme={v.theme as "dark" | "light"}
            openDelay={Number(v.openDelay)}
            arrow={Boolean(v.arrow)}
          >
            <span className="cursor-pointer font-medium underline" style={{ color: v.theme === "light" ? "#0A0A0A" : "#F5F4F1", textUnderlineOffset: 3 }}>
              @ada
            </span>
          </HoverCard>
        </div>
      )}
    </Playground>
  ),
  "context-menu": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
      ]}
    >
      {(v) => (
        <div className={`flex h-[360px] w-full items-center justify-center rounded-xl p-8 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <ContextMenuDemo theme={v.theme as "dark" | "light"} size={v.size as "sm" | "md" | "lg"} />
        </div>
      )}
    </Playground>
  ),
  timeline: () => (
    <Playground
      controls={[
        { type: "select", key: "align", label: "Align", options: ["left", "alternate"], optionLabels: ["Left", "Alternate"], defaultValue: "left" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "lineStyle", label: "Line", options: ["solid", "dashed"], optionLabels: ["Solid", "Dashed"], defaultValue: "solid" },
        { type: "color", key: "accent", label: "Accent", defaultValue: "#F2A841" },
      ]}
    >
      {(v) => (
        <div className={`flex min-h-[560px] w-full justify-center rounded-xl px-6 py-14 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Timeline
            items={TIMELINE_ITEMS}
            align={v.align as "left" | "alternate"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            lineStyle={v.lineStyle as "solid" | "dashed"}
            accentColor={String(v.accent)}
            animateOnView={false}
            width={v.align === "alternate" ? 560 : 440}
          />
        </div>
      )}
    </Playground>
  ),
  "tree-view": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "checkable", label: "Checkboxes", defaultValue: false },
        { type: "toggle", key: "lines", label: "Guide lines", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex h-[440px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <TreeView
            key={String(v.checkable)}
            data={TREE_VIEW_DATA}
            defaultExpandedIds={["src", "components"]}
            defaultSelectedId="button"
            defaultCheckedIds={v.checkable ? ["button", "card"] : []}
            checkable={Boolean(v.checkable)}
            showLines={Boolean(v.lines)}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
          />
        </div>
      )}
    </Playground>
  ),
  "stat-card": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "value", label: "Value", min: 0, max: 100000, step: 500, defaultValue: 48200 },
        { type: "range", key: "previous", label: "Previous", min: 0, max: 100000, step: 500, defaultValue: 41500 },
        { type: "select", key: "goodDir", label: "Good direction", options: ["up", "down"], optionLabels: ["Up", "Down"], defaultValue: "up" },
        { type: "toggle", key: "sparkline", label: "Sparkline", defaultValue: true },
        { type: "select", key: "sparkStyle", label: "Line", options: ["smooth", "sharp"], optionLabels: ["Smooth", "Sharp"], defaultValue: "smooth" },
      ]}
    >
      {(v) => (
        <div className={`flex h-[400px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <StatCard
            key={String(v.sparkStyle)}
            label="Revenue"
            value={Number(v.value)}
            previousValue={Number(v.previous)}
            prefix="$"
            deltaLabel="vs last month"
            goodDirection={v.goodDir as "up" | "down"}
            sparkline={v.sparkline ? statCardTrend(Number(v.previous) * 0.82, Number(v.value)) : undefined}
            sparklineStyle={v.sparkStyle as "sharp" | "smooth"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
          />
        </div>
      )}
    </Playground>
  ),
  "code-block": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "lineNumbers", label: "Line numbers", defaultValue: true },
        { type: "toggle", key: "wrap", label: "Wrap lines", defaultValue: false },
        { type: "toggle", key: "cap", label: "Max height (160px)", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex h-[440px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <CodeBlock
            filename="deploy.sh"
            language="bash"
            code={CODE_BLOCK_LONG_SAMPLE}
            showLineNumbers={Boolean(v.lineNumbers)}
            wrapLines={Boolean(v.wrap)}
            maxHeight={v.cap ? 160 : undefined}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            width={420}
          />
        </div>
      )}
    </Playground>
  ),
  "description-list": () => (
    <Playground
      controls={[
        { type: "select", key: "layout", label: "Layout", options: ["stacked", "inline", "grid"], optionLabels: ["Stacked", "Inline", "Grid"], defaultValue: "inline" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "bordered", label: "Bordered", defaultValue: true },
        { type: "toggle", key: "dividers", label: "Dividers", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex h-[440px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <DescriptionList
            title={v.layout === "grid" ? "Specifications" : "Order summary"}
            items={v.layout === "grid" ? DESC_LIST_SPEC_ITEMS : DESC_LIST_ORDER_ITEMS}
            layout={v.layout as "stacked" | "inline" | "grid"}
            bordered={Boolean(v.bordered)}
            dividers={Boolean(v.dividers)}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            width={v.layout === "grid" ? 420 : 340}
          />
        </div>
      )}
    </Playground>
  ),
  splitter: () => (
    <Playground
      controls={[
        { type: "select", key: "direction", label: "Direction", options: ["horizontal", "vertical"], optionLabels: ["Horizontal", "Vertical"], defaultValue: "horizontal" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "count", label: "Panels", min: 2, max: 3, step: 1, defaultValue: 2 },
      ]}
    >
      {(v) => (
        <div className={`flex h-[380px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Splitter
            key={`${v.direction}-${v.count}`}
            direction={v.direction as "horizontal" | "vertical"}
            theme={v.theme as "dark" | "light"}
            height={320}
            width={480}
            panels={
              Number(v.count) === 3
                ? [
                    { id: "a", content: <SplitterPane label="Panel A" sub="30%" theme={v.theme as "dark" | "light"} />, defaultSize: 30 },
                    { id: "b", content: <SplitterPane label="Panel B" sub="40%" theme={v.theme as "dark" | "light"} />, defaultSize: 40 },
                    { id: "c", content: <SplitterPane label="Panel C" sub="30%" theme={v.theme as "dark" | "light"} />, defaultSize: 30 },
                  ]
                : [
                    { id: "sidebar", content: <SplitterPane label="Sidebar" sub="25%" theme={v.theme as "dark" | "light"} />, defaultSize: 25, minSize: 15, maxSize: 45 },
                    { id: "main", content: <SplitterPane label="Main" sub="drag the handle" theme={v.theme as "dark" | "light"} /> },
                  ]
            }
          />
        </div>
      )}
    </Playground>
  ),
  "back-to-top": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "position", label: "Position", options: ["bottom-right", "bottom-left", "bottom-center"], optionLabels: ["Right", "Left", "Center"], defaultValue: "bottom-right" },
        { type: "toggle", key: "progress", label: "Progress ring", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="h-[440px] w-full overflow-hidden rounded-xl bg-[#080808] p-3">
          <BackToTopDemo theme={v.theme as "dark" | "light"} showProgress={Boolean(v.progress)} position={v.position as "bottom-right" | "bottom-left" | "bottom-center"} />
        </div>
      )}
    </Playground>
  ),
  "copy-button": () => (
    <Playground
      controls={[
        { type: "select", key: "variant", label: "Variant", options: ["ghost", "outline", "solid"], optionLabels: ["Ghost", "Outline", "Solid"], defaultValue: "outline" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "iconOnly", label: "Icon only", defaultValue: false },
        { type: "toggle", key: "disabled", label: "Disabled", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[280px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <CopyButton
            value="npm install @acme/ui"
            label={v.iconOnly ? undefined : "Copy command"}
            variant={v.variant as "ghost" | "outline" | "solid"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  terminal: () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "loop", label: "Loop", defaultValue: true },
        { type: "range", key: "speed", label: "Typing speed", min: 10, max: 80, step: 5, defaultValue: 32 },
      ]}
    >
      {(v) => (
        <div className={`flex h-[360px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <Terminal
            key={`${v.loop}-${v.speed}`}
            lines={TERMINAL_DEMO_LINES}
            title="~/project"
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            loop={Boolean(v.loop)}
            typingSpeed={Number(v.speed)}
            width={440}
            height={260}
          />
        </div>
      )}
    </Playground>
  ),
  "inline-edit": () => (
    <Playground
      controls={[
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "toggle", key: "multiline", label: "Multiline", defaultValue: false },
        { type: "toggle", key: "editOnClick", label: "Click text to edit", defaultValue: true },
        { type: "toggle", key: "validate", label: "Require email", defaultValue: false },
        { type: "toggle", key: "async", label: "Async save (1s)", defaultValue: false },
      ]}
    >
      {(v) => (
        <div className={`flex h-[280px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <InlineEdit
            key={`${v.multiline}-${v.editOnClick}`}
            defaultValue={v.multiline ? "A short project description goes here." : "Q3 Roadmap"}
            multiline={Boolean(v.multiline)}
            editOnClick={Boolean(v.editOnClick)}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            validate={v.validate ? (val: string) => (val.includes("@") ? null : "Enter a valid email") : undefined}
            onSave={
              v.async
                ? (val: string) => new Promise<void>((resolve) => setTimeout(resolve, 1000))
                : undefined
            }
          />
        </div>
      )}
    </Playground>
  ),
  "aspect-ratio": () => (
    <Playground
      controls={[
        { type: "select", key: "preset", label: "Preset", options: ["square", "video", "portrait", "wide", "golden"], optionLabels: ["Square", "Video", "Portrait", "Wide", "Golden"], defaultValue: "video" },
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "range", key: "radius", label: "Radius", min: 0, max: 40, step: 2, defaultValue: 12 },
        { type: "color", key: "accent", label: "Accent", defaultValue: "#F2A841" },
        { type: "toggle", key: "image", label: "Show image", defaultValue: false },
        { type: "select", key: "fit", label: "Object fit (image)", options: ["cover", "contain"], optionLabels: ["Cover", "Contain"], defaultValue: "cover" },
      ]}
    >
      {(v) => {
        const preset = v.preset as "square" | "video" | "portrait" | "wide" | "golden";
        const info = ASPECT_PRESET_LABELS[preset];
        const light = v.theme === "light";
        return (
          <div className={`flex h-[500px] w-full flex-col items-center justify-center gap-3 rounded-xl p-6 ${light ? "bg-white" : "bg-[#080808]"}`}>
            <AspectRatio
              preset={preset}
              objectFit={v.fit as "cover" | "contain"}
              theme={v.theme as "dark" | "light"}
              radius={Number(v.radius)}
              width={preset === "portrait" ? 270 : 360}
            >
              {v.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/demo/101.webp" alt="" />
              ) : (
                <AspectRatioLabel ratio={info.ratio} theme={v.theme as "dark" | "light"} accentColor={String(v.accent)} size={36} />
              )}
            </AspectRatio>
            <span className={`text-[13px] ${light ? "text-black/50" : "text-white/45"}`}>{info.caption}</span>
          </div>
        );
      }}
    </Playground>
  ),
  "scroll-area": () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "size", label: "Scrollbar size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "toggle", key: "alwaysVisible", label: "Always visible", defaultValue: false },
        { type: "toggle", key: "fade", label: "Fade mask", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex h-[420px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <ScrollArea height={340} width={260} theme={v.theme as "dark" | "light"} size={v.size as "sm" | "md" | "lg"} alwaysVisible={Boolean(v.alwaysVisible)} showFadeMask={Boolean(v.fade)}>
            <ScrollAreaListDemo theme={v.theme as "dark" | "light"} />
          </ScrollArea>
        </div>
      )}
    </Playground>
  ),
  toolbar: () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "orientation", label: "Orientation", options: ["horizontal", "vertical"], optionLabels: ["Horizontal", "Vertical"], defaultValue: "horizontal" },
        { type: "select", key: "variant", label: "Variant", options: ["solid", "floating", "ghost"], optionLabels: ["Solid", "Floating", "Ghost"], defaultValue: "solid" },
        { type: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "range", key: "radius", label: "Radius", min: 0, max: 24, step: 1, defaultValue: 12 },
        { type: "toggle", key: "tooltips", label: "Tooltips", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex min-h-[360px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <ToolbarDemo
            theme={v.theme as "dark" | "light"}
            orientation={v.orientation as "horizontal" | "vertical"}
            variant={v.variant as "solid" | "floating" | "ghost"}
            size={v.size as "sm" | "md" | "lg"}
            radius={Number(v.radius)}
            showTooltips={Boolean(v.tooltips)}
          />
        </div>
      )}
    </Playground>
  ),
  panel: () => (
    <Playground
      controls={[
        { type: "select", key: "theme", label: "Theme", options: ["dark", "light"], optionLabels: ["Dark", "Light"], defaultValue: "dark" },
        { type: "select", key: "variant", label: "Variant", options: ["outline", "filled", "elevated"], optionLabels: ["Outline", "Filled", "Elevated"], defaultValue: "outline" },
        { type: "select", key: "padding", label: "Padding", options: ["sm", "md", "lg"], optionLabels: ["S", "M", "L"], defaultValue: "md" },
        { type: "range", key: "radius", label: "Radius", min: 0, max: 32, step: 1, defaultValue: 16 },
        { type: "toggle", key: "collapsible", label: "Collapsible", defaultValue: true },
        { type: "toggle", key: "dividers", label: "Dividers", defaultValue: true },
        { type: "toggle", key: "accentBar", label: "Accent bar", defaultValue: false },
        { type: "toggle", key: "footer", label: "Footer", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className={`flex min-h-[420px] w-full items-center justify-center rounded-xl p-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}>
          <PanelDemo
            theme={v.theme as "dark" | "light"}
            variant={v.variant as "outline" | "filled" | "elevated"}
            padding={v.padding as "sm" | "md" | "lg"}
            radius={Number(v.radius)}
            collapsible={Boolean(v.collapsible)}
            dividers={Boolean(v.dividers)}
            accentBar={Boolean(v.accentBar)}
            showFooter={Boolean(v.footer)}
          />
        </div>
      )}
    </Playground>
  ),
  tag: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["soft", "solid", "outline"],
          optionLabels: ["Soft", "Solid", "Outline"],
          defaultValue: "soft",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["neutral", "amber", "mint", "coral", "blue", "lavender"],
          optionLabels: [
            "Neutral",
            "Amber",
            "Mint",
            "Coral",
            "Blue",
            "Lavender",
          ],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "dot", label: "Dot", defaultValue: true },
        { type: "toggle", key: "pulse", label: "Pulse", defaultValue: false },
        { type: "toggle", key: "count", label: "Count", defaultValue: false },
        {
          type: "toggle",
          key: "removable",
          label: "Removable",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "selectable",
          label: "Selectable",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <TagPlayDemo
          key={`${v.selectable}`}
          variant={v.variant as "soft" | "solid" | "outline"}
          color={
            v.color as
              "neutral" | "amber" | "mint" | "coral" | "blue" | "lavender"
          }
          size={v.size as "sm" | "md" | "lg"}
          theme={v.theme as "dark" | "light"}
          dot={Boolean(v.dot)}
          pulse={Boolean(v.pulse)}
          removable={Boolean(v.removable)}
          selectable={Boolean(v.selectable)}
          count={Boolean(v.count)}
          disabled={Boolean(v.disabled)}
        />
      )}
    </Playground>
  ),
  card: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["default", "elevated", "outline", "filled"],
          optionLabels: ["Default", "Elevated", "Outline", "Filled"],
          defaultValue: "default",
        },
        {
          type: "select",
          key: "orientation",
          label: "Orientation",
          options: ["vertical", "horizontal"],
          optionLabels: ["Vertical", "Horizontal"],
          defaultValue: "vertical",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "radius",
          label: "Radius",
          min: 0,
          max: 32,
          step: 2,
          defaultValue: 20,
        },
        { type: "toggle", key: "media", label: "Media", defaultValue: true },
        { type: "toggle", key: "badge", label: "Badge", defaultValue: true },
        {
          type: "toggle",
          key: "interactive",
          label: "Interactive",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "spotlight",
          label: "Spotlight",
          defaultValue: true,
        },
        { type: "toggle", key: "footer", label: "Footer", defaultValue: true },
      ]}
    >
      {(v) => {
        const accent = RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber;
        const light = v.theme === "light";
        return (
          <div
            className={`flex min-h-[480px] w-full items-center justify-center rounded-xl px-6 py-8 ${light ? "bg-white" : "bg-[#080808]"}`}
          >
            <Card
              key={`${v.orientation}`}
              width={v.orientation === "horizontal" ? 520 : 340}
              variant={
                v.variant as "default" | "elevated" | "outline" | "filled"
              }
              orientation={v.orientation as "vertical" | "horizontal"}
              theme={v.theme as "dark" | "light"}
              accentColor={accent}
              radius={Number(v.radius)}
              media={v.media ? "/demo/109.webp" : undefined}
              badge={v.badge ? "New" : undefined}
              interactive={Boolean(v.interactive)}
              spotlight={Boolean(v.spotlight)}
              title="Aurora Dashboard"
              description="A clean analytics template for SaaS teams, with dark and light themes."
              footer={
                v.footer ? (
                  <>
                    <span
                      className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-black"
                      style={{ background: accent }}
                    >
                      Preview
                    </span>
                    <span
                      className={`text-[13px] font-medium ${light ? "text-black/55" : "text-white/55"}`}
                    >
                      Free
                    </span>
                  </>
                ) : undefined
              }
            />
          </div>
        );
      }}
    </Playground>
  ),
  accordion: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["default", "card", "filled"],
          optionLabels: ["Default", "Card", "Filled"],
          defaultValue: "default",
        },
        {
          type: "select",
          key: "type",
          label: "Type",
          options: ["single", "multiple"],
          optionLabels: ["Single", "Multiple"],
          defaultValue: "single",
        },
        {
          type: "select",
          key: "indicator",
          label: "Indicator",
          options: ["chevron", "plus"],
          optionLabels: ["Chevron", "Plus"],
          defaultValue: "chevron",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "icons", label: "Icons", defaultValue: false },
        {
          type: "toggle",
          key: "collapsible",
          label: "Collapsible",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[480px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}
        >
          <Accordion
            key={`${v.type}`}
            type={v.type as "single" | "multiple"}
            variant={v.variant as "default" | "card" | "filled"}
            indicator={v.indicator as "chevron" | "plus"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            collapsible={Boolean(v.collapsible)}
            items={[
              {
                value: "install",
                title: "How do I install a component?",
                content:
                  "Copy the source into your project or run the shadcn CLI command shown on each component page. There are no runtime dependencies beyond motion, clsx and tailwind-merge.",
                icon: v.icons ? ACCORDION_DEMO_ICONS[0] : undefined,
              },
              {
                value: "customize",
                title: "Can I customize the design?",
                content:
                  "Everything is plain React and Tailwind, so you own the code. Most components also expose props for colors, sizes and behavior.",
                icon: v.icons ? ACCORDION_DEMO_ICONS[1] : undefined,
              },
              {
                value: "license",
                title: "What license do the components use?",
                content:
                  "Free components are MIT licensed. Premium components come with a commercial license for unlimited personal and client projects.",
                icon: v.icons ? ACCORDION_DEMO_ICONS[2] : undefined,
              },
              {
                value: "support",
                title: "Where can I get help?",
                content:
                  "Open an issue on GitHub or reach out through the support page. We usually reply within a day.",
                icon: v.icons ? ACCORDION_DEMO_ICONS[3] : undefined,
              },
            ]}
          />
        </div>
      )}
    </Playground>
  ),
  divider: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "orientation",
          label: "Orientation",
          options: ["horizontal", "vertical"],
          optionLabels: ["Horizontal", "Vertical"],
          defaultValue: "horizontal",
        },
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["solid", "dashed", "dotted", "gradient"],
          optionLabels: ["Solid", "Dashed", "Dotted", "Gradient"],
          defaultValue: "solid",
        },
        {
          type: "select",
          key: "position",
          label: "Label position",
          options: ["start", "center", "end"],
          optionLabels: ["Start", "Center", "End"],
          defaultValue: "center",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "thickness",
          label: "Thickness",
          min: 1,
          max: 6,
          step: 1,
          defaultValue: 1,
        },
        { type: "toggle", key: "label", label: "Label", defaultValue: true },
        { type: "toggle", key: "accent", label: "Accent", defaultValue: false },
        {
          type: "toggle",
          key: "animated",
          label: "Animated",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <DividerDemo
          orientation={v.orientation as "horizontal" | "vertical"}
          variant={v.variant as "solid" | "dashed" | "dotted" | "gradient"}
          labelPosition={v.position as "start" | "center" | "end"}
          showLabel={Boolean(v.label)}
          thickness={Number(v.thickness)}
          accent={Boolean(v.accent)}
          accentColor={RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber}
          animated={Boolean(v.animated)}
          theme={v.theme as "dark" | "light"}
        />
      )}
    </Playground>
  ),
  "avatar-group": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["xs", "sm", "md", "lg", "xl"],
          optionLabels: ["XS", "S", "M", "L", "XL"],
          defaultValue: "lg",
        },
        {
          type: "select",
          key: "shape",
          label: "Shape",
          options: ["circle", "rounded"],
          optionLabels: ["Circle", "Rounded"],
          defaultValue: "circle",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "max",
          label: "Max",
          min: 2,
          max: 8,
          step: 1,
          defaultValue: 4,
        },
        {
          type: "range",
          key: "overlap",
          label: "Overlap",
          min: 0,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.2,
        },
        {
          type: "toggle",
          key: "expand",
          label: "Expand on hover",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "tooltip",
          label: "Tooltip",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}
        >
          <AvatarGroup
            users={AVATAR_GROUP_USERS}
            max={Number(v.max)}
            size={v.size as "xs" | "sm" | "md" | "lg" | "xl"}
            shape={v.shape as "circle" | "rounded"}
            theme={v.theme as "dark" | "light"}
            overlap={Number(v.overlap)}
            expandOnHover={Boolean(v.expand)}
            showTooltip={Boolean(v.tooltip)}
          />
        </div>
      )}
    </Playground>
  ),
  avatar: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "content",
          label: "Content",
          options: ["image", "initials", "icon"],
          optionLabels: ["Image", "Initials", "Icon"],
          defaultValue: "image",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["xs", "sm", "md", "lg", "xl"],
          optionLabels: ["XS", "S", "M", "L", "XL"],
          defaultValue: "xl",
        },
        {
          type: "select",
          key: "shape",
          label: "Shape",
          options: ["circle", "rounded", "square"],
          optionLabels: ["Circle", "Rounded", "Square"],
          defaultValue: "circle",
        },
        {
          type: "select",
          key: "status",
          label: "Status",
          options: ["none", "online", "away", "busy", "offline"],
          optionLabels: ["None", "Online", "Away", "Busy", "Offline"],
          defaultValue: "online",
        },
        {
          type: "select",
          key: "color",
          label: "Ring color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "ring", label: "Ring", defaultValue: false },
        { type: "toggle", key: "pulse", label: "Pulse", defaultValue: true },
        {
          type: "toggle",
          key: "click",
          label: "Clickable",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}
        >
          <Avatar
            src={v.content === "image" ? "/demo/112.webp" : undefined}
            name={v.content === "icon" ? undefined : "Mei Tanaka"}
            size={v.size as "xs" | "sm" | "md" | "lg" | "xl"}
            shape={v.shape as "circle" | "rounded" | "square"}
            status={
              v.status === "none"
                ? undefined
                : (v.status as "online" | "away" | "busy" | "offline")
            }
            pulse={Boolean(v.pulse)}
            ring={Boolean(v.ring)}
            ringColor={RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber}
            theme={v.theme as "dark" | "light"}
            onClick={v.click ? () => {} : undefined}
          />
        </div>
      )}
    </Playground>
  ),
  drawer: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "side",
          label: "Side",
          options: ["right", "left", "top", "bottom"],
          optionLabels: ["Right", "Left", "Top", "Bottom"],
          defaultValue: "right",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "blur", label: "Blur", defaultValue: false },
        {
          type: "toggle",
          key: "backdrop",
          label: "Backdrop close",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "swipe",
          label: "Swipe to close",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "close",
          label: "Close button",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <DrawerDemo
          side={v.side as "left" | "right" | "top" | "bottom"}
          size={v.size as "sm" | "md" | "lg"}
          theme={v.theme as "dark" | "light"}
          accent={RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber}
          blur={Boolean(v.blur)}
          backdrop={Boolean(v.backdrop)}
          swipe={Boolean(v.swipe)}
          closeButton={Boolean(v.close)}
        />
      )}
    </Playground>
  ),
  popover: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "trigger",
          label: "Trigger",
          options: ["click", "hover"],
          optionLabels: ["Click", "Hover"],
          defaultValue: "click",
        },
        {
          type: "select",
          key: "placement",
          label: "Placement",
          options: ["top", "bottom", "left", "right"],
          optionLabels: ["Top", "Bottom", "Left", "Right"],
          defaultValue: "bottom",
        },
        {
          type: "select",
          key: "align",
          label: "Align",
          options: ["start", "center", "end"],
          optionLabels: ["Start", "Center", "End"],
          defaultValue: "center",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "arrow", label: "Arrow", defaultValue: true },
      ]}
    >
      {(v) => {
        const light = v.theme === "light";
        return (
          <div
            className={`flex h-[440px] w-full items-center justify-center rounded-xl px-6 ${light ? "bg-white" : "bg-[#080808]"}`}
          >
            <Popover
              key={`${v.trigger}`}
              trigger={v.trigger as "click" | "hover"}
              placement={v.placement as "top" | "bottom" | "left" | "right"}
              align={v.align as "start" | "center" | "end"}
              theme={v.theme as "dark" | "light"}
              arrow={Boolean(v.arrow)}
              content={
                <PopoverDemoContent
                  light={light}
                  accent={
                    RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
                  }
                />
              }
            >
              <button
                type="button"
                className={`cursor-pointer rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${light ? "border-black/25 bg-black/[0.05] text-black hover:bg-black/10" : "border-white/12 bg-white/5 text-white/90 hover:bg-white/10"}`}
              >
                {v.trigger === "hover" ? "Hover me" : "Click me"}
              </button>
            </Popover>
          </div>
        );
      }}
    </Playground>
  ),
  modal: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "animation",
          label: "Animation",
          options: ["scale", "slide-up", "fade"],
          optionLabels: ["Scale", "Slide up", "Fade"],
          defaultValue: "scale",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "blur", label: "Blur", defaultValue: true },
        {
          type: "toggle",
          key: "backdrop",
          label: "Backdrop close",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "close",
          label: "Close button",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <ModalDemo
          animation={v.animation as "scale" | "slide-up" | "fade"}
          size={v.size as "sm" | "md" | "lg"}
          theme={v.theme as "dark" | "light"}
          accent={RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber}
          blur={Boolean(v.blur)}
          backdrop={Boolean(v.backdrop)}
          closeButton={Boolean(v.close)}
        />
      )}
    </Playground>
  ),
  stepper: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "orientation",
          label: "Orientation",
          options: ["horizontal", "vertical"],
          optionLabels: ["Horizontal", "Vertical"],
          defaultValue: "horizontal",
        },
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["numbered", "minimal"],
          optionLabels: ["Numbered", "Minimal"],
          defaultValue: "numbered",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "toggle",
          key: "desc",
          label: "Descriptions",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "clickable",
          label: "Clickable",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "error",
          label: "Error step",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <StepperDemo
          orientation={v.orientation as "horizontal" | "vertical"}
          variant={v.variant as "numbered" | "minimal"}
          size={v.size as "sm" | "md" | "lg"}
          theme={v.theme as "dark" | "light"}
          accent={RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber}
          clickable={Boolean(v.clickable)}
          descriptions={Boolean(v.desc)}
          error={Boolean(v.error)}
        />
      )}
    </Playground>
  ),
  pagination: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["solid", "soft", "compact"],
          optionLabels: ["Solid", "Soft", "Compact"],
          defaultValue: "solid",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "pages",
          label: "Pages",
          min: 1,
          max: 40,
          step: 1,
          defaultValue: 12,
        },
        {
          type: "range",
          key: "siblings",
          label: "Siblings",
          min: 0,
          max: 2,
          step: 1,
          defaultValue: 1,
        },
        { type: "toggle", key: "labels", label: "Labels", defaultValue: false },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}
        >
          <Pagination
            totalPages={Number(v.pages)}
            defaultPage={Math.min(5, Number(v.pages))}
            siblingCount={Number(v.siblings)}
            variant={v.variant as "solid" | "soft" | "compact"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            accentColor={
              RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
            }
            showLabels={Boolean(v.labels)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  breadcrumb: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "separator",
          label: "Separator",
          options: ["chevron", "slash", "dot", "arrow"],
          optionLabels: ["Chevron", "Slash", "Dot", "Arrow"],
          defaultValue: "chevron",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "home", label: "Home icon", defaultValue: true },
        {
          type: "toggle",
          key: "collapse",
          label: "Collapse",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-white" : "bg-[#080808]"}`}
        >
          <Breadcrumb
            key={`${v.collapse}`}
            items={BREADCRUMB_DEMO_ITEMS}
            separator={v.separator as "chevron" | "slash" | "dot" | "arrow"}
            size={v.size as "sm" | "md" | "lg"}
            theme={v.theme as "dark" | "light"}
            accentColor={
              RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
            }
            showHomeIcon={Boolean(v.home)}
            maxItems={v.collapse ? 3 : undefined}
          />
        </div>
      )}
    </Playground>
  ),
  tabs: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["underline", "pill", "segmented"],
          optionLabels: ["Underline", "Pill", "Segmented"],
          defaultValue: "underline",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["mint", "amber", "coral", "blue", "lavender", "paper"],
          optionLabels: ["Mint", "Amber", "Coral", "Blue", "Lavender", "Paper"],
          defaultValue: "amber",
        },
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          optionLabels: ["S", "M", "L"],
          defaultValue: "md",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        { type: "toggle", key: "icons", label: "Icons", defaultValue: false },
        { type: "toggle", key: "counts", label: "Counts", defaultValue: false },
        {
          type: "toggle",
          key: "full",
          label: "Full width",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disable one",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
        >
          <div className="w-[480px] max-w-full">
            <Tabs
              variant={v.variant as "underline" | "pill" | "segmented"}
              size={v.size as "sm" | "md" | "lg"}
              theme={v.theme as "dark" | "light"}
              accentColor={
                RADIO_ACCENTS[v.color as string] ?? RADIO_ACCENTS.amber
              }
              fullWidth={Boolean(v.full)}
              items={TAB_DEMO_LABELS.map((it, i) => ({
                ...it,
                icon: v.icons ? TAB_DEMO_ICONS[i] : undefined,
                count: v.counts ? (i + 1) * 3 : undefined,
                disabled: Boolean(v.disabled) && it.value === "reports",
              }))}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  skeleton: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["card", "text", "rect", "circle"],
          optionLabels: ["Card", "Text", "Rect", "Circle"],
          defaultValue: "card",
        },
        {
          type: "select",
          key: "animation",
          label: "Animation",
          options: ["shimmer", "pulse", "none"],
          optionLabels: ["Shimmer", "Pulse", "None"],
          defaultValue: "shimmer",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "lines",
          label: "Lines",
          min: 1,
          max: 6,
          step: 1,
          defaultValue: 3,
        },
        {
          type: "toggle",
          key: "loading",
          label: "Loading",
          defaultValue: true,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[440px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
        >
          <div className="w-[320px] max-w-full">
            <Skeleton
              variant={v.variant as "card" | "text" | "rect" | "circle"}
              animation={v.animation as "shimmer" | "pulse" | "none"}
              theme={v.theme as "dark" | "light"}
              lines={Number(v.lines)}
              width={v.variant === "circle" ? 72 : undefined}
              loading={Boolean(v.loading)}
            >
              <SkeletonDemoContent light={v.theme === "light"} />
            </Skeleton>
          </div>
        </div>
      )}
    </Playground>
  ),
  tooltip: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "placement",
          label: "Placement",
          options: ["top", "bottom", "left", "right"],
          optionLabels: ["Top", "Bottom", "Left", "Right"],
          defaultValue: "top",
        },
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "dark",
        },
        {
          type: "range",
          key: "delay",
          label: "Delay",
          min: 0,
          max: 600,
          step: 20,
          defaultValue: 20,
        },
        { type: "toggle", key: "arrow", label: "Arrow", defaultValue: true },
        {
          type: "toggle",
          key: "shortcut",
          label: "Shortcut",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div
          className={`flex h-[400px] w-full items-center justify-center rounded-xl px-6 ${v.theme === "light" ? "bg-[#F5F4F1]" : "bg-[#080808]"}`}
        >
          <Tooltip
            content="Save your changes"
            shortcut={v.shortcut ? "⌘S" : undefined}
            placement={v.placement as "top" | "bottom" | "left" | "right"}
            theme={v.theme as "dark" | "light"}
            delay={Number(v.delay)}
            arrow={Boolean(v.arrow)}
            disabled={Boolean(v.disabled)}
          >
            <button
              type="button"
              className={`cursor-pointer rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${v.theme === "light" ? "border-black/15 bg-white text-black/85 hover:bg-black/5" : "border-white/12 bg-white/5 text-white/90 hover:bg-white/10"}`}
            >
              Hover me
            </button>
          </Tooltip>
        </div>
      )}
    </Playground>
  ),
  button: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["primary", "secondary", "outline", "ghost"],
          optionLabels: ["Primary", "Secondary", "Outline", "Ghost"],
          defaultValue: "primary",
        },
        {
          type: "color",
          key: "accentColor",
          label: "Accent",
          defaultValue: "#f59e0b",
        },
        {
          type: "range",
          key: "height",
          label: "Height",
          min: 28,
          max: 64,
          step: 2,
          defaultValue: 40,
        },
        {
          type: "toggle",
          key: "loading",
          label: "Loading",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
          <Button
            label="Get Started"
            variant={v.variant as "primary" | "secondary" | "outline" | "ghost"}
            accentColor={v.accentColor as string}
            ringColor={`${v.accentColor}40`}
            height={v.height as number}
            loading={Boolean(v.loading)}
            disabled={Boolean(v.disabled)}
          />
        </div>
      )}
    </Playground>
  ),
  input: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["outline", "filled", "underline"],
          optionLabels: ["Outline", "Filled", "Underline"],
          defaultValue: "outline",
        },
        {
          type: "color",
          key: "accentColor",
          label: "Accent",
          defaultValue: "#f59e0b",
        },
        {
          type: "range",
          key: "height",
          label: "Height",
          min: 32,
          max: 56,
          step: 2,
          defaultValue: 40,
        },
        {
          type: "toggle",
          key: "hasError",
          label: "Error",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "disabled",
          label: "Disabled",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
          <div className="w-full max-w-[320px]">
            <Input
              label="Email address"
              placeholder="you@example.com"
              helperText="We'll never share your email"
              errorText={v.hasError ? "Please enter a valid email" : undefined}
              variant={v.variant as "outline" | "filled" | "underline"}
              accentColor={v.accentColor as string}
              ringColor={`${v.accentColor}40`}
              height={v.height as number}
              disabled={Boolean(v.disabled)}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  textarea: () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: ["outline", "filled", "underline"],
          optionLabels: ["Outline", "Filled", "Underline"],
          defaultValue: "outline",
        },
        {
          type: "color",
          key: "accentColor",
          label: "Accent",
          defaultValue: "#f59e0b",
        },
        {
          type: "toggle",
          key: "autoResize",
          label: "Auto-resize",
          defaultValue: false,
        },
        {
          type: "toggle",
          key: "showCounter",
          label: "Counter",
          defaultValue: true,
        },
        {
          type: "toggle",
          key: "hasError",
          label: "Error",
          defaultValue: false,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
          <div className="w-full max-w-[340px]">
            <Textarea
              label="Message"
              placeholder="Write your message..."
              helperText="Keep it under 200 characters"
              errorText={v.hasError ? "Message is required" : undefined}
              maxLength={200}
              showCounter={Boolean(v.showCounter)}
              autoResize={Boolean(v.autoResize)}
              variant={v.variant as "outline" | "filled" | "underline"}
              accentColor={v.accentColor as string}
              ringColor={`${v.accentColor}40`}
            />
          </div>
        </div>
      )}
    </Playground>
  ),
  "animated-loader": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "variant",
          label: "Variant",
          options: [...LOADER_DEMO_VARIANTS],
          optionLabels: ["Lines", "Ring", "Dual Ring", "Dots"],
          defaultValue: "dots",
        },
        {
          type: "select",
          key: "color",
          label: "Color",
          options: ["orange", "violet", "blue", "green", "pink"],
          optionLabels: ["Orange", "Violet", "Blue", "Green", "Pink"],
          defaultValue: "orange",
        },
        {
          type: "range",
          key: "size",
          label: "Size",
          min: 24,
          max: 160,
          step: 2,
          defaultValue: 56,
        },
        {
          type: "range",
          key: "thickness",
          label: "Thickness",
          min: 2,
          max: 16,
          step: 1,
          defaultValue: 4,
        },
        {
          type: "range",
          key: "speed",
          label: "Speed",
          min: 0.4,
          max: 3,
          step: 0.1,
          defaultValue: 1.2,
        },
      ]}
    >
      {(v) => (
        <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-[#080808] p-6">
          <AnimatedLoader
            variant={v.variant as AnimatedLoaderVariant}
            {...LOADER_DEMO_COLORS}
            color={DEMO_ACCENTS[v.color as string] ?? DEMO_ACCENTS.orange}
            size={Number(v.size)}
            thickness={Number(v.thickness)}
            speed={Number(v.speed)}
          />
        </div>
      )}
    </Playground>
  ),
  "sales-ticket-popup": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Ticket",
          options: ["dark", "light", "gradient", "neon", "outline"],
          optionLabels: ["Obsidian", "Paper", "Mint", "Amber", "Outline"],
          defaultValue: "dark",
        },
      ]}
    >
      {(v) => (
        <SalesTicketDemo
          key={String(v.theme)}
          theme={v.theme as SalesTicketTheme}
        />
      )}
    </Playground>
  ),
  "review-gallery": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["dark", "light"],
          optionLabels: ["Dark", "Light"],
          defaultValue: "light",
        },
      ]}
    >
      {(v) => (
        <div className="h-[500px] w-full overflow-hidden rounded-xl bg-[#080808] border border-border">
          <ReviewGallery theme={v.theme as "dark" | "light"} />
        </div>
      )}
    </Playground>
  ),
  "orbiting-globe-badges": () => (
    <Playground
      controls={[
        {
          type: "select",
          key: "theme",
          label: "Theme",
          options: ["light", "dark"],
          optionLabels: ["Light", "Dark"],
          defaultValue: "light",
        },
        {
          type: "select",
          key: "globeType",
          label: "Globe Style",
          options: [
            "particles",
            "wireframe",
            "dotgrid",
            "rings",
            "constellation",
            "aurora",
            "pulse",
            "hex",
          ],
          optionLabels: [
            "Particles",
            "Wireframe",
            "Dot Grid",
            "Rings",
            "Constellation",
            "Aurora",
            "Pulse",
            "Hex",
          ],
          defaultValue: "particles",
        },
        { type: "toggle", key: "mask", label: "Mask", defaultValue: true },
      ]}
    >
      {(v) => (
        <div className="w-full overflow-hidden rounded-xl border border-border bg-[#080808]">
          <OrbitingGlobeBadges
            theme={v.theme as "light" | "dark"}
            globeType={
              v.globeType as
                | "particles"
                | "wireframe"
                | "dotgrid"
                | "rings"
                | "constellation"
                | "aurora"
                | "pulse"
                | "hex"
            }
            maskEnabled={Boolean(v.mask)}
            componentHeight={480}
          />
        </div>
      )}
    </Playground>
  ),
};

function oneWeekFromNow() {
  return new Date(Date.now() + 7 * 86400000).toISOString();
}
