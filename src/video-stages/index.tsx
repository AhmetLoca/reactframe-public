import type { ComponentType } from "react";
import { AlertToastStage } from "./alert-toast";
import { AnimatedCheckboxStage } from "./animated-checkbox";
import { AnimatedLoaderStage } from "./animated-loader";
import { BadgesKitStage } from "./badges-kit";
import { BreadcrumbStage } from "./breadcrumb";
import { ButtonStage } from "./button";
import { CalloutStage } from "./callout";
import { Carousel3DStage } from "./carousel-3d";
import { ColorPickerStage } from "./color-picker";
import { CommandPaletteStage } from "./command-palette";
import { ComboboxStage } from "./combobox";
import { DatePickerStage } from "./date-picker";
import { DockStage } from "./dock";
import { DrawerStage } from "./drawer";
import { FileUploadStage } from "./file-upload";
import { InputStage } from "./input";
import { InputOtpStage } from "./input-otp";
import { LinearProgressStage } from "./linear-progress";
import { LinearProgressBarsStage } from "./linear-progress-bars";
import { MenubarStage } from "./menubar";
import { MeterStage } from "./meter";
import { ModalStage } from "./modal";
import { MultiSelectStage } from "./multi-select";
import { NumberInputStage } from "./number-input";
import { PaginationStage } from "./pagination";
import { PasswordInputStage } from "./password-input";
import { PopoverStage } from "./popover";
import { ProgressCircleBarsStage } from "./progress-circle-bars";
import { RadioButtonStage } from "./radio-button";
import { SearchBarStage } from "./search-bar";
import { SegmentedControlStage } from "./segmented-control";
import { SelectStage } from "./select";
import { SidebarStage } from "./sidebar";
import { SkeletonStage } from "./skeleton";
import { SliderStage } from "./slider";
import { StepperStage } from "./stepper";
import { TabsStage } from "./tabs";
import { TagStage } from "./tag";
import { TextareaStage } from "./textarea";
import { ToggleProStage } from "./toggle-pro";
import { TooltipStage } from "./tooltip";

// slug -> the scene rendered by /preview/video/<slug> while recording a hover
// clip with `npm run video -- <slug>`. Add one entry (plus a scene file in
// scripts/video-scenes/) per element.
export const VIDEO_STAGES: Record<string, ComponentType> = {
  "alert-toast": AlertToastStage,
  "animated-checkbox": AnimatedCheckboxStage,
  "animated-loader": AnimatedLoaderStage,
  "badges-kit": BadgesKitStage,
  breadcrumb: BreadcrumbStage,
  button: ButtonStage,
  callout: CalloutStage,
  "carousel-3d": Carousel3DStage,
  "color-picker": ColorPickerStage,
  combobox: ComboboxStage,
  "command-palette": CommandPaletteStage,
  "date-picker": DatePickerStage,
  dock: DockStage,
  drawer: DrawerStage,
  "file-upload": FileUploadStage,
  input: InputStage,
  "input-otp": InputOtpStage,
  "linear-progress": LinearProgressStage,
  "linear-progress-bars": LinearProgressBarsStage,
  menubar: MenubarStage,
  meter: MeterStage,
  modal: ModalStage,
  "multi-select": MultiSelectStage,
  "number-input": NumberInputStage,
  pagination: PaginationStage,
  "password-input": PasswordInputStage,
  popover: PopoverStage,
  "progress-circle-bars": ProgressCircleBarsStage,
  "radio-button": RadioButtonStage,
  "search-bar": SearchBarStage,
  "segmented-control": SegmentedControlStage,
  select: SelectStage,
  sidebar: SidebarStage,
  skeleton: SkeletonStage,
  slider: SliderStage,
  stepper: StepperStage,
  tabs: TabsStage,
  tag: TagStage,
  textarea: TextareaStage,
  "toggle-pro": ToggleProStage,
  tooltip: TooltipStage,
};
