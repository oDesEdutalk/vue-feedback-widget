# @odestiny91/vue-feedback-widget

A modern, lightweight, and plug-and-play feedback & bug reporting widget for **Vue 3**.  
Capture high-res screenshots, collect user context, and send reports straight to **Telegram** or your custom **Webhook** in seconds.

---

## Features

- 🎨 **Sleek UI** — Built-in floating launcher and modal dialog with clean styling and dark mode support.
- 📸 **Automatic Screenshots** — Capture full pages or active viewports cleanly with auto-exclusion of dialogs/overlays.
- 📋 **Flexible Media Uploads** — Paste screenshots directly from clipboard (`Ctrl+V`), drag & drop files, or browse.
- 💬 **Instant Telegram Alerts** — Deliver rich messages with screenshots and environment metadata (URL, user info, device, viewport, timestamp) directly to developer channels or forum topics.
- 🔗 **Custom Webhook & Handlers** — Pipe feedback payloads to your own backend API, Slack, Discord, or ticketing systems.
- ⚡ **Zero Bloat & Framework Independent** — Works seamlessly with any Vue 3 app (Vite, Nuxt 3, Quasar, etc.) without requiring bulky UI frameworks.

---

## Installation

```bash
# npm
npm install @odestiny91/vue-feedback-widget

# yarn
yarn add @odestiny91/vue-feedback-widget

# pnpm
pnpm add @odestiny91/vue-feedback-widget
```

---

## Quick Start

### 1. Register the plugin

In your `main.ts` or `main.js`:

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// Import plugin and bundled styles
import VueFeedbackWidget from '@odestiny91/vue-feedback-widget'
import '@odestiny91/vue-feedback-widget/style.css'

const app = createApp(App)

app.use(VueFeedbackWidget, {
  appName: 'My Awesome App',
  appVersion: '1.0.0',
  telegram: {
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
    chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID,
    // threadId: 12345 // Optional: Topic/Thread ID for Telegram supergroups
  },
  // Optional: Attach logged-in user context
  getUser: () => {
    const user = authStore.user // e.g. from Pinia / Vuex
    if (!user) return null
    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role
    }
  }
})

app.mount('#app')
```

### 2. Add the floating button

Place `<FeedbackFloatingButton />` in your root component (e.g., `App.vue`):

```vue
<template>
  <div id="app">
    <router-view />

    <!-- Feedback button in bottom corner -->
    <FeedbackFloatingButton position="bottom-right" />
  </div>
</template>
```

---

## Programmatic Control (`useFeedback`)

Need to trigger feedback from a navigation bar, user settings menu, or an error boundary? Use the `useFeedback` composable:

```vue
<script setup lang="ts">
import { useFeedback } from '@odestiny91/vue-feedback-widget'

const { open, close, isOpen, isCapturing } = useFeedback()

// Open modal pre-selected for bug reporting
function reportIssue() {
  open('bug')
}

// Open modal for feature suggestions
function sendFeedback() {
  open('suggestion')
}
</script>

<template>
  <button @click="reportIssue">Report a bug on this page</button>
  <button @click="sendFeedback">Give feedback</button>
</template>
```

---

## Configuration Options

Pass these options to `app.use(VueFeedbackWidget, options)`:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `appName` | `string` | `undefined` | Display name of your web application |
| `appVersion` | `string` | `undefined` | Current build version of your app |
| `telegram` | `TelegramConfig` | `undefined` | Config for Telegram Bot integration (`botToken`, `chatId`, `threadId`) |
| `webhook` | `WebhookConfig` | `undefined` | Custom HTTP endpoint config (`url`, `headers`) |
| `getUser` | `() => UserContext \| null` | `undefined` | Getter function returning metadata of current user |
| `onSubmit` | `(payload: FeedbackPayload) => Promise<boolean>` | `undefined` | Override default sending logic with custom handler |

---

## Custom Submit Handler

If you want to send reports directly to your private backend instead of Telegram:

```typescript
app.use(VueFeedbackWidget, {
  appName: 'Admin Portal',
  onSubmit: async (payload) => {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return response.ok
  }
})
```

---

## License

[MIT](LICENSE) © [ODESTINY](https://github.com/oDesEdutalk)
