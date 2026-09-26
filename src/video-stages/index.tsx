import type { ComponentType } from "react";
import { AccordionStage } from "./accordion";
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
import { SearchBarStage } from "./search-bar";
import { SegmentedControlStage } from "./segmented-control";
import { SelectStage } from "./select";
import { SidebarStage } from "./sidebar";
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
};
