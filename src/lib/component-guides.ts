// Hand-written "When to use" copy and FAQs for the most-searched components, rendered on their detail
// pages (plus FAQPage JSON-LD). Every answer is checked against the component's actual source and props,
// so keep them in sync when a component changes. Components without an entry simply skip the section.

export interface ComponentGuide {
  whenToUse: string[];
  faq: { q: string; a: string }[];
}

export const componentGuides: Record<string, ComponentGuide> = {
  button: {
    whenToUse: [
      "Use Button for any action a visitor takes: submitting a form, opening a dialog, starting a checkout. Pick the primary variant for the one action that matters most on the screen and secondary, outline or ghost for everything around it, so the hierarchy is obvious at a glance.",
      "Its built-in loading state is the reason to reach for it over a plain <button>: set loading while a request is in flight and the button shows a spinner, ignores further clicks and sets aria-busy for screen readers.",
    ],
    faq: [
      { q: "How do I show a loading spinner while a form submits?", a: "Pass loading={true} while your request runs. The button shows a spinner, stops responding to clicks and sets aria-busy, then goes back to normal when you set loading to false." },
      { q: "Can I add an icon to the button?", a: "Yes. Pass any React node to icon and choose iconPosition=\"left\" or \"right\". Lucide, Heroicons or your own SVG all work." },
      { q: "Can I use it as a submit button in a form?", a: "Yes. Set type=\"submit\" and it behaves like a native submit button, including Enter-to-submit in the form." },
    ],
  },
  input: {
    whenToUse: [
      "Use Input for single-line text fields in forms: names, emails, URLs, phone numbers, search terms. It bundles the label, helper text, error message and required marker that a form field needs, so you don't rebuild that scaffolding around every <input>.",
      "Choose the outline variant for dense forms, filled for softer marketing forms and underline for minimal layouts. Leading and trailing icon slots cover the common cases like a mail icon or a clear button.",
    ],
    faq: [
      { q: "How do I show a validation error?", a: "Pass errorText. The field turns to its error color, the message appears below it and aria-invalid plus aria-describedby are set so screen readers announce the error." },
      { q: "Does it work with React Hook Form?", a: "Yes. Pass value and onChange from a Controller, or spread register() props with name and onChange. It renders a real <input>, so native form submission works too." },
      { q: "Which input types are supported?", a: "text, email, password, number, search, tel and url, via the type prop." },
    ],
  },
  select: {
    whenToUse: [
      "Use Select when people pick exactly one option from a short, known list, like a team, a plan or a country from a handful of choices. Each option can carry a description line, which makes it a better fit than a native <select> when choices need explaining.",
      "If the list is long enough that people would rather type than scroll, use the Combobox instead.",
    ],
    faq: [
      { q: "Is the Select keyboard accessible?", a: "Yes. It follows the WAI-ARIA combobox and listbox pattern: arrow keys move through options, Home and End jump to the ends, Enter or Space selects, Escape closes and typing a letter jumps to the matching option." },
      { q: "Can I control the selected value from my own state?", a: "Yes. Pass value and onValueChange for a controlled select, or defaultValue if you only need the initial choice." },
      { q: "Does it have a light theme?", a: "Yes. Set theme=\"light\" for light backgrounds; dark is the default." },
    ],
  },
  combobox: {
    whenToUse: [
      "Use Combobox when there are too many options to scroll through comfortably, like frameworks, cities, users or tags: people type to filter and pick with the keyboard. Matching text is highlighted in each result and an empty state appears when nothing matches.",
      "For a short list of fixed choices a plain Select is simpler; to let people pick several values, use Multi Select.",
    ],
    faq: [
      { q: "How is a Combobox different from a Select?", a: "A Select only opens a list. A Combobox adds a text field that filters the list as you type, which is faster once there are more than about ten options." },
      { q: "Can people clear their choice?", a: "Yes. clearable is on by default and shows a clear button once a value is selected." },
      { q: "Is it accessible?", a: "Yes. It implements the ARIA combobox pattern with aria-activedescendant, so screen readers announce the highlighted option while focus stays in the text field." },
    ],
  },
  "multi-select": {
    whenToUse: [
      "Use Multi Select when people choose several values from one list, like teams, tags, skills or categories. Selected values show as removable chips in the field, and a Select all shortcut is built in for long lists.",
      "Cap the number of choices with maxSelected, and limit how many chips show at once with maxVisibleTags so the field doesn't grow out of control.",
    ],
    faq: [
      { q: "Can I limit how many options are selected?", a: "Yes. Set maxSelected and no more options can be added once the limit is reached." },
      { q: "How do people remove a selected value?", a: "Click the x on its chip, or press Backspace in the empty search field to remove the last one." },
      { q: "What does onValueChange return?", a: "An array of the selected option values, which you can store as-is in your form state." },
    ],
  },
  "date-picker": {
    whenToUse: [
      "Use Date Picker for booking dates, deadlines, birthdays or report ranges. It covers both a single date and a start-to-end range (mode=\"range\"), and can block dates with minDate, maxDate or your own isDateDisabled function, for example weekends or already-booked days.",
      "Month and weekday names come from the browser's Intl API, so setting locale gives you a localized calendar without any extra date library.",
    ],
    faq: [
      { q: "Does it support selecting a date range?", a: "Yes. Set mode=\"range\" and use range and onRangeChange (or defaultRange) instead of value." },
      { q: "Does it need date-fns or dayjs?", a: "No. It works with plain JavaScript Date objects and formats with the built-in Intl API." },
      { q: "Can I start the week on Monday?", a: "Yes. Set weekStartsOn={1}. The default is Sunday (0)." },
    ],
  },
  "time-picker": {
    whenToUse: [
      "Use Time Picker for appointment slots, delivery windows, reminders and opening hours. minTime and maxTime keep people inside the hours you actually offer, and minuteStep (5, 15 or 30) turns a list of 60 minutes into a handful of real slots.",
      "The value is always a 24-hour \"HH:mm\" string, whatever the display, so it goes straight into a form, a database column or an API without any parsing. Set hourCycle={24} for a 24-hour display.",
    ],
    faq: [
      { q: "What format is the value?", a: "A 24-hour \"HH:mm\" string such as \"09:30\" or \"17:45\", or null when nothing is picked. The 12-hour AM/PM display is only for the screen." },
      { q: "Can I limit it to business hours?", a: "Yes. Set minTime=\"09:00\" and maxTime=\"17:00\"; times outside the window are dimmed and can't be picked." },
      { q: "Does it work with the keyboard?", a: "Yes. Tab moves between the hour, minute and AM/PM columns, the arrow keys change the value, and Enter or Escape closes it." },
    ],
  },
  "phone-input": {
    whenToUse: [
      "Use Phone Input in sign-up, checkout, booking and contact forms. The value is always E.164 (for example \"+905321234567\"), the format SMS, WhatsApp and calling APIs expect, so you can store and send it without reformatting.",
      "The built-in check only looks at the number's length for the chosen country. It catches typos and missing digits while typing; if you need to know that a number really exists or is a mobile line, verify it on your server with a library such as libphonenumber or with an SMS code.",
    ],
    faq: [
      { q: "What format does it return?", a: "E.164: a plus, the calling code and the national number with no spaces, such as \"+14155550123\". onValueChange also gives the country code, the national digits and isValid." },
      { q: "Can people paste an international number?", a: "Yes. A number that starts with + switches the country by its calling code, so pasting \"+44 7911 123456\" selects the United Kingdom." },
      { q: "Can I limit or reorder the countries?", a: "Yes. countries limits the list to the ISO codes you pass, and preferredCountries pins some of them to the top of the menu." },
    ],
  },
  "credit-card-input": {
    whenToUse: [
      "Use Credit Card Input for checkout mockups, prototypes, subscription forms that hand the details to your own tokenising backend, and anywhere you want a card form that matches the rest of your UI. It catches the usual typos while people type: a wrong digit fails the Luhn check, an expired date is flagged, and the CVC length follows the card brand.",
      "For real payments, keep raw card numbers off your servers: most sites use their payment provider's hosted fields (Stripe Elements, Adyen, Braintree and similar) so they stay out of PCI scope. This component doesn't send data anywhere, so pair it with a provider that accepts card details from your own form, or use it as the design reference for their hosted fields.",
    ],
    faq: [
      { q: "Which card brands does it recognise?", a: "Visa, Mastercard (including 2-series), American Express, Discover and Troy. Unknown numbers still format and pass through the Luhn check." },
      { q: "Is the card number validated?", a: "Yes, with the Luhn checksum and the brand's length. That catches typos, not whether the card exists or has funds; only your payment provider can tell you that." },
      { q: "What does onValueChange return?", a: "{ number, expiry (\"MM/YY\"), cvc, name, brand, isComplete }, where isComplete is true only when every shown field passes its check." },
    ],
  },
  "currency-input": {
    whenToUse: [
      "Use Currency Input for prices, budgets, invoices, donations and transfers: anywhere people type an amount of money. Separators appear as they type, so 1250000 reads as 1,250,000 before they submit, which prevents the classic extra-zero mistake.",
      "It returns a plain number (and the currency code), not a formatted string, so you can do maths and store it straight away. For accounting where rounding matters, convert it to integer minor units (cents) on your side before storing.",
    ],
    faq: [
      { q: "Which separators does it use?", a: "The ones for the locale you pass: en-US shows 1,234.56, de-DE 1.234,56, tr-TR 1.234,56 and so on, via the browser's Intl API." },
      { q: "How many decimals does it allow?", a: "As many as the currency uses: two for USD and EUR, none for JPY or KRW. Changing the currency re-rounds the amount." },
      { q: "Can I lock it to one currency?", a: "Yes. Pass currencies with a single code, or showCurrencySelect={false}, and the code shows as a plain label." },
    ],
  },
  "form-field": {
    whenToUse: [
      "Use Form Field to give every input in a form the same label, description, required marker, counter and message line, so forms stay consistent without re-building that scaffolding each time. It works with its own input or wraps any control (a select, a date picker, a third-party input) and wires the id and aria attributes for screen readers.",
      "Validation waits until someone leaves the field before showing an error, then re-checks as they type so the error clears the moment it's fixed. That pattern (reward early, punish late) is less nagging than validating every keystroke and faster to recover from than validating only on submit.",
    ],
    faq: [
      { q: "Can validate be async?", a: "Yes. Return a Promise and the field shows a small spinner while it waits; results from older, slower checks are ignored." },
      { q: "How do I show a server error?", a: "Pass errorText. It overrides the field's own validation until you clear it." },
      { q: "Does it work with my own input component?", a: "Yes. Pass it as children and it receives id, aria-describedby, aria-invalid and aria-required, or use a function child to place them yourself." },
    ],
  },
  slider: {
    whenToUse: [
      "Use Slider when the exact number matters less than a quick feel for the amount, like volume, brightness, a price filter or a budget. Set range to get two thumbs for a min and max, which is the usual pattern for price filters in shops.",
      "Show the current value next to the label, as a tooltip above the thumb, or as tick marks along the track, whichever fits the layout.",
    ],
    faq: [
      { q: "How do I make a range slider with two thumbs?", a: "Set range={true} and pass a [min, max] tuple as value or defaultValue. onValueChange then returns a tuple too." },
      { q: "Can I add a unit like % or $?", a: "Yes. Pass unit, and unitPosition=\"prefix\" for currencies or \"suffix\" for percentages." },
      { q: "Is it keyboard accessible?", a: "Yes. Each thumb is a role=\"slider\" with aria-valuenow; arrow keys step by step, Page Up and Page Down take bigger jumps, Home and End go to the limits." },
    ],
  },
  tabs: {
    whenToUse: [
      "Use Tabs to switch between related views that share the same place on the page, like Overview, Settings and Billing, or code samples for different frameworks. The underline, pill and segmented variants cover everything from page-level navigation to compact toggles inside a card.",
      "If people need to compare the sections side by side, show them stacked instead; tabs hide everything except the active panel.",
    ],
    faq: [
      { q: "Is it accessible?", a: "Yes. It uses the ARIA tablist, tab and tabpanel roles, and the arrow keys, Home and End move between tabs." },
      { q: "Can I control the active tab?", a: "Yes. Pass value and onValueChange for a controlled component, or defaultValue for the initial tab." },
      { q: "Can the tabs stretch to fill the container?", a: "Yes. Set fullWidth and the tabs share the available width evenly." },
    ],
  },
  modal: {
    whenToUse: [
      "Use Modal when an action needs the visitor's full attention before they carry on: confirming a delete, editing a record, signing in. It traps focus inside the dialog, locks page scroll and returns focus to the trigger when it closes.",
      "For secondary content people want to glance at while keeping their context, a Drawer usually fits better.",
    ],
    faq: [
      { q: "Is the modal accessible?", a: "Yes. It renders role=\"dialog\" with aria-modal, labels itself from title and description, traps Tab focus, closes on Escape and restores focus to the element that opened it." },
      { q: "How do I stop it closing when people click outside?", a: "Set closeOnBackdrop={false}. closeOnEscape works the same way for the Escape key." },
      { q: "Can I render it inside a container instead of over the whole page?", a: "Yes. Set contained and it is positioned inside its nearest positioned parent instead of being portaled to the document body." },
    ],
  },
  tooltip: {
    whenToUse: [
      "Use Tooltip for short hints on icon-only buttons and controls whose meaning isn't obvious: what a toolbar icon does, or which keyboard shortcut triggers it (the shortcut prop renders it as a key badge). Keep the text to a few words.",
      "Anything people need to read carefully or click belongs in a Popover or Hover Card, since tooltips disappear as soon as the pointer leaves.",
    ],
    faq: [
      { q: "Does the tooltip work with keyboard focus?", a: "Yes. It opens on focus as well as hover, is linked with aria-describedby and closes on Escape." },
      { q: "Can I show a keyboard shortcut in the tooltip?", a: "Yes. Pass shortcut=\"⌘S\" and it renders next to the text as a key badge." },
      { q: "Where can the tooltip appear?", a: "Set placement to top, bottom, left or right. delay controls how quickly it opens." },
    ],
  },
  accordion: {
    whenToUse: [
      "Use Accordion for FAQ sections, settings groups and long product details where people scan the headings and open only what they need. type=\"single\" keeps one panel open at a time; type=\"multiple\" lets several stay open.",
      "Avoid it for content everyone must read, since collapsed text is easy to miss.",
    ],
    faq: [
      { q: "Can more than one item be open at once?", a: "Yes. Set type=\"multiple\". With type=\"single\" (the default) opening one item closes the others, and collapsible (on by default) lets people close the open item again." },
      { q: "Is it good for an FAQ section?", a: "Yes. Each item is a real button with aria-expanded controlling a labelled region, and the arrow keys move between headings." },
      { q: "Can I choose the open item from state?", a: "Yes. Pass value and onValueChange, or defaultValue for the initially open item." },
    ],
  },
  pagination: {
    whenToUse: [
      "Use Pagination to split long result lists, tables or blog archives into pages, when people need to jump to a specific page or know how far along they are. It collapses long page ranges with ellipses around the current page.",
      "For endless feeds where position doesn't matter, infinite scroll or a Load more button is usually friendlier.",
    ],
    faq: [
      { q: "How many page numbers are shown?", a: "siblingCount sets how many pages appear on each side of the current page and boundaryCount how many stay pinned at the start and end; the rest collapse into ellipses." },
      { q: "Can I use it with URL search params?", a: "Yes. Keep the page in your URL, pass it as page and update the URL in onPageChange." },
      { q: "Is it accessible?", a: "Yes. The current page is marked with aria-current=\"page\" and page changes are announced through a live region." },
    ],
  },
  "command-palette": {
    whenToUse: [
      "Use Command Palette to give power users a keyboard-first way to jump anywhere and run actions: search pages, switch projects, toggle settings. It opens on Cmd/Ctrl + K by default, filters as you type and groups results into sections.",
      "It shines in dashboards, docs and SaaS apps with many destinations; on a small marketing site regular navigation is enough.",
    ],
    faq: [
      { q: "How do I open it with Cmd+K?", a: "It's built in: the hotkey prop defaults to \"k\", so Cmd+K on macOS and Ctrl+K elsewhere toggle it. Change hotkey to use another letter." },
      { q: "How do I run an action when an item is picked?", a: "Use onSelectItem, which receives the chosen item. closeOnSelect closes the palette afterwards." },
      { q: "Is it accessible?", a: "Yes. It is a modal dialog with an ARIA combobox and listbox inside, so the arrow keys, Enter and Escape work and screen readers announce the active result." },
    ],
  },
  "file-upload": {
    whenToUse: [
      "Use File Upload for attachments, avatars, documents and imports. People can drag files onto the drop zone or click to browse, and each file gets its own row with a thumbnail for images, a progress bar and remove or retry actions.",
      "Pass your own upload function and the component drives the progress bars from it, so it works with S3 presigned URLs, UploadThing, Supabase Storage or a plain fetch.",
    ],
    faq: [
      { q: "How do I connect it to my upload API?", a: "Pass upload={(file, onProgress) => Promise}. Call onProgress with 0 to 100 as your request progresses and resolve or reject the promise when it finishes; failed uploads get a retry button." },
      { q: "Can I limit file type and size?", a: "Yes. accept takes the same value as a native file input (for example \"image/*,.pdf\"), and maxSize and maxFiles reject files over the limits." },
      { q: "Does it show image previews?", a: "Yes. Image files get a thumbnail in their row; other files show a file-type badge." },
    ],
  },
  "toggle-pro": {
    whenToUse: [
      "Use Toggle Pro for settings that take effect immediately, like notifications, dark mode or auto-save. A switch reads as on and off, which is clearer than a checkbox when nothing needs submitting.",
      "If the choice only applies after a Save button, use a checkbox instead so people know it isn't live yet.",
    ],
    faq: [
      { q: "Is the toggle accessible?", a: "Yes. It is a native checkbox with role=\"switch\", so it is focusable, toggles with Space and is announced as on or off." },
      { q: "Can I control it from state?", a: "Yes. Pass checked and onCheckedChange, or defaultChecked for an uncontrolled switch." },
      { q: "Can I change its size and colors?", a: "Yes. width, height, padding, trackOnColor, trackOffColor and thumbColor are all props, and squish controls how much the thumb stretches while it moves." },
    ],
  },
  "alert-toast": {
    whenToUse: [
      "Use Alert Toast to confirm that something happened, like a saved form, a finished upload or a failed payment, without interrupting the flow. Five tones (neutral, info, success, warning, error) map to the usual message types, and optional primary and secondary actions handle an Undo or View link.",
      "Turn on autoDismiss for routine confirmations; keep errors on screen until the visitor closes them.",
    ],
    faq: [
      { q: "Can the toast close by itself?", a: "Yes. Set dismiss={{ autoDismiss: true, duration: 4 }} and it closes after the given number of seconds; onDismiss fires either way." },
      { q: "Can I add an Undo button?", a: "Yes. Turn on actions.showPrimary, set primaryLabel to \"Undo\" and handle onPrimaryClick." },
      { q: "Does it have a dark theme?", a: "Yes. Set appearance.theme to \"dark\"; the default is light." },
    ],
  },
  "input-otp": {
    whenToUse: [
      "Use Input OTP for one-time passcodes: two-factor login, email verification and phone confirmation. The digits appear in separate boxes, but under the hood it's a single input with autocomplete=\"one-time-code\", so SMS autofill on iOS and Android and pasting a whole code both just work.",
      "Use onComplete to verify the code the moment the last digit is entered, and the error and success states to show the result in place.",
    ],
    faq: [
      { q: "Does pasting a full code work?", a: "Yes. It's one real input behind the boxes, so pasting fills every box at once and onComplete fires." },
      { q: "Can the code contain letters?", a: "Yes. Set type=\"alphanumeric\"; the default numeric type also brings up the number keypad on phones." },
      { q: "How do I show that the code was wrong?", a: "Set status=\"error\" and pass errorText; status=\"success\" shows the verified state." },
    ],
  },
  "password-input": {
    whenToUse: [
      "Use Password Input on sign-up and change-password forms. It includes a show and hide toggle, a four-step strength meter and a live checklist (length, upper and lower case, a number, a symbol), so people see what's missing while they type instead of after submitting.",
      "On sign-in forms, turn off showStrength and showRequirements and keep just the visibility toggle.",
    ],
    faq: [
      { q: "Can I change the minimum length?", a: "Yes. Set minLength; the first checklist item and the strength meter follow it." },
      { q: "Does it work with password managers?", a: "Yes. It's a real password input with name and autoComplete props; set autoComplete=\"current-password\" on sign-in forms (the default is new-password)." },
      { q: "Can I hide the strength meter?", a: "Yes. showStrength={false} hides the meter and showRequirements={false} hides the checklist." },
    ],
  },
  drawer: {
    whenToUse: [
      "Use Drawer for side panels that keep the page visible behind them: filters, a shopping cart, record details or settings. It slides in from any edge (left, right, top or bottom) and can be swiped closed on touch screens.",
      "Use a Modal instead when the task must be finished before anything else happens.",
    ],
    faq: [
      { q: "Which side can it open from?", a: "Any of them: set side to left, right, top or bottom." },
      { q: "Can people swipe it closed on mobile?", a: "Yes. swipeToClose is on by default; set it to false to only close with the button, backdrop or Escape." },
      { q: "Is it accessible?", a: "Yes. It's a modal dialog with aria-modal, labelled by its title, and it closes on Escape." },
    ],
  },
  "data-table": {
    whenToUse: [
      "Use Data Table for admin panels and dashboards that list users, orders or invoices. Sorting, search, status tabs, row selection with checkboxes and pagination are built in, and cells can render avatars and colored badges, so a typical CRUD list needs no extra table library.",
      "For very large datasets, fetch one page at a time from your API and pass it in as data.",
    ],
    faq: [
      { q: "How do I define the columns?", a: "Pass a columns array. Each column has a key, a label, a type (text, number, currency, badge, avatar or actions), alignment, width, and sortable and filterable flags." },
      { q: "Does it need TanStack Table?", a: "No. Sorting, search, tabs, selection and pagination are all built in, with only clsx and tailwind-merge as dependencies." },
      { q: "Can I change how many rows show per page?", a: "Yes. Set rowsPerPage, or turn pagination off with showPagination={false}." },
    ],
  },
  "ai-chat": {
    whenToUse: [
      "Use AI Chat as the floating assistant on a SaaS or agency site: a particle-orb launcher in the bottom corner that opens into a full chat panel. In auto mode it plays a teaser, asks a sample question and answers it, which shows visitors what the assistant does before they type anything.",
      "Connect onSend to your own LLM endpoint and it becomes a real support or sales chat; the replies prop only powers the demo.",
    ],
    faq: [
      { q: "How do I connect it to OpenAI or Claude?", a: "Handle onSend(message) and send the text to your API route, which calls the model. The canned replies prop is only for the built-in demo." },
      { q: "Can I place it inside a section instead of the page corner?", a: "Yes. position=\"fixed\" (the default) pins it to the viewport corner; position=\"absolute\" pins it inside its nearest positioned parent." },
      { q: "Does it respect reduced motion?", a: "Yes. With prefers-reduced-motion the orb, glow and panel morph stop animating." },
    ],
  },
  "ai-chat-prompt": {
    whenToUse: [
      "Use AI Chat Prompt as the input bar of an AI product: a chat app, an agent or an AI search page. It combines an @-mention button, mode and model dropdowns and a send button, and while a request runs it morphs into a thinking capsule with a particle orb and rotating status text.",
      "Drive status from your request: set it to \"thinking\" when you call the model and back to \"idle\" when the answer arrives.",
    ],
    faq: [
      { q: "How do I show the thinking state while my API responds?", a: "Set status=\"thinking\" while the request is in flight and \"idle\" when it finishes. thinkingMessages sets the rotating status lines." },
      { q: "Can I hide the mode or model dropdowns?", a: "Yes. showMode={false}, showModel={false} and showMention={false} remove them, and modes and models take your own options." },
      { q: "Can people stop a running request?", a: "Yes. With showStop on, a stop button appears in the thinking capsule and calls onStop." },
    ],
  },
  "ai-voice-01": {
    whenToUse: [
      "Use AI Voice 01 for voice assistants and voice-first AI features: a pill with an audio-reactive visualizer that moves between idle, listening and speaking, plus a live word-by-word transcript. Out of the box it simulates audio for demos; set input=\"microphone\" to react to the real microphone.",
      "Drive its status from your speech-to-text and text-to-speech pipeline to build a working voice interface.",
    ],
    faq: [
      { q: "Does it use the real microphone?", a: "Only if you set input=\"microphone\". It then asks for microphone permission and the visualizer reacts to your voice; the default simulated mode needs no permission." },
      { q: "How do I control listening and speaking from my app?", a: "Set status to \"idle\", \"listening\" or \"speaking\" as your voice pipeline changes state. onStart fires when it leaves idle and onStop when it returns to idle." },
      { q: "Is it free?", a: "Yes. AI Voice 01 is one of ReactFrame's free components." },
    ],
  },
  "carousel-3d": {
    whenToUse: [
      "Use 3D Carousel to showcase a portfolio, product shots or a video reel on a curved 3D track. Items can be images or videos with titles and subtitles, and it supports autoplay, looping, dots, arrows, swipe on touch screens and tilt on hover.",
      "It works best with around 5 to 15 items of the same aspect ratio.",
    ],
    faq: [
      { q: "Can the carousel play videos?", a: "Yes. Set type: \"video\" on an item and its src plays as a muted video card." },
      { q: "Does it autoplay?", a: "Only if you ask it to: set autoplay and autoplayInterval. It's off by default." },
      { q: "Can people navigate it with the keyboard and touch?", a: "Yes. The left and right arrow keys and dot buttons move between items, and it can be swiped on touch screens." },
    ],
  },
  "testimonial-wall": {
    whenToUse: [
      "Use Testimonial Wall to show a lot of social proof without taking a lot of space: reviews scroll in continuous rows (or columns in vertical mode), alternating direction, with star ratings, avatars and a soft edge mask. It fits naturally below a hero or next to pricing.",
      "Hovering pauses the motion so people can read a card, and every quote stays in the HTML for search engines.",
    ],
    faq: [
      { q: "Can the testimonials scroll vertically?", a: "Yes. Set flowMode=\"vertical\" for columns; horizontal rows are the default." },
      { q: "How many rows can I show?", a: "Set rowCount; alternateDirection makes neighbouring rows scroll in opposite directions." },
      { q: "Does it pause on hover?", a: "Yes. pauseOnHover is on by default, so people can stop the motion to read a card." },
    ],
  },
};

export function getComponentGuide(slug: string): ComponentGuide | undefined {
  return componentGuides[slug];
}
