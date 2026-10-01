# Changelog

All notable changes to `@edutalk/vue-feedback-widget` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.3] - 2026-10-01

### 🔄 Changed
- **Feedback Content Limit**: Adjusted the maximum character limit for detailed feedback descriptions from 1000 down to 150 characters (`maxlength="150"`) and updated the character counter display accordingly.

---

## [1.0.2] - 2026-09-29

### ⚡ Performance & Optimization
- **Optimized Screenshot Capture**: Set `skipFonts: true` and capped `pixelRatio` to `1.5` max in `html-to-image` configuration to eliminate main-thread freezing and reduce memory overhead during capture.
- **Lazy Render Modals**: Deferred rendering of `ImagePreviewModal` using `v-if` so it only mounts when previewing images.

### 🎨 UI & Design Enhancements
- **Color Theme Refresh**: Upgraded primary accent colors from vibrant pink/rose gradients to modern indigo tones (`#4f46e5`), providing a more professional and accessible look.
- **Dark Mode Refinement**: Enhanced contrast and text readability across light and dark modes.
- **Smoother Micro-Interactions**: Improved transitions and hover/active states for floating action buttons and modal controls.

### 🐛 Bug Fixes
- **Form State Cleanup**: Automatically reset input title, description, attached screenshot, error messages, and submission state when closing or canceling the modal dialog.

---

## [1.0.1] - 2026-09-29

### 🚀 Added
- **Clipboard Image Paste**: Allowed users to paste screenshots directly from their clipboard (`Ctrl+V` / `Cmd+V`).
- **Drag & Drop Upload**: Added drag-and-drop file zone for manual image/screenshot attachments.
- **One-Click URL Copy**: Added quick copy button for current route and technical metadata.

### ⚡ Performance
- **Non-blocking Rendering**: Bypassed heavy font CSS embedding in screen capture utility to accelerate screenshot generation.

### 📖 Documentation
- Published comprehensive English documentation, quick start guide, and API reference in `README.md`.

---

## [1.0.0] - 2026-09-29

### 🎉 Initial Release
- **Vue 3 Plugin**: Standalone feedback and bug reporting widget compatible with Vue 3 (Vite, Nuxt 3, Quasar).
- **Interactive UI Components**:
  - `FeedbackFloatingButton`: Customizable launcher button with configurable positions (`bottom-right`, `bottom-left`, `top-right`, `top-left`).
  - `FeedbackModal`: Rich feedback dialog supporting multiple categories (`bug`, `suggestion`, `other`).
  - `ImagePreviewModal`: Full-screen lightbox viewer for captured and uploaded screenshots.
- **Automated Diagnostics**: Auto-collects technical context including current URL, user agent, browser engine, operating system, screen resolution, viewport dimensions, and timestamps.
- **Integrations**:
  - **Telegram Bot API**: Direct delivery with formatted HTML caption, screenshot photo upload, and support for supergroup forum topics (`threadId`).
  - **Custom Webhook / Handler**: Flexible `onSubmit` option for sending payloads to custom backend APIs, Slack, or Discord.
- **Composable API**: Built-in `useFeedback()` composable for programmatic control over widget visibility and state.
- **TypeScript Support**: Full type definitions exported via `vite-plugin-dts`.
