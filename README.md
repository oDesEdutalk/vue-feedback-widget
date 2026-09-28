# @edutalk/vue-feedback-widget

> Modern, standalone feedback and bug reporting widget for **Vue 3** with high-resolution screenshot capture and direct **Telegram Bot** / **Webhook** integration.

---

## ✨ Tính năng nổi bật

- 🎯 **Nút Floating & Dialog đẹp mắt**: Thiết kế sang trọng, hỗ trợ chế độ Dark Mode & Light Mode.
- 📸 **Tự động chụp ảnh màn hình**: Chụp sắc nét toàn bộ trang web hoặc vùng chỉ định (loại trừ modal/popup tự động).
- 📋 **Dán ảnh từ Clipboard (Ctrl + V)** & **Kéo thả ảnh (Drag & Drop)** hoặc tải file từ máy tính/điện thoại.
- ✈️ **Tích hợp Telegram Bot**: Gửi ngay thông báo kèm hình ảnh và metadata (URL, User, thiết bị, độ phân giải, thời gian) vào nhóm Telegram của đội phát triển.
- 🔗 **Hỗ trợ Custom Webhook / API Backend**: Tùy biến endpoint nhận dữ liệu feedback dễ dàng.
- 📦 **Độc lập, siêu nhẹ**: Không bắt buộc cài đặt UI library nào khác, tự động đính kèm CSS tối ưu.

---

## 📦 Cài đặt

```bash
# Bằng npm
npm install @edutalk/vue-feedback-widget

# Bằng yarn
yarn add @edutalk/vue-feedback-widget

# Bằng pnpm
pnpm add @edutalk/vue-feedback-widget
```

---

## 🚀 Hướng dẫn sử dụng nhanh

### 1. Khởi tạo Plugin trong `main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import VueFeedbackWidget from '@edutalk/vue-feedback-widget'
import '@edutalk/vue-feedback-widget/style.css'

const app = createApp(App)

app.use(VueFeedbackWidget, {
  appName: 'Edutalk Portal',
  appVersion: '2.0.0',
  telegram: {
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
    chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID,
    // threadId: 12345 // (Tùy chọn) ID topic/thread nếu dùng Telegram Forum
  },
  // Hàm cung cấp thông tin người dùng đang đăng nhập
  getUser: () => {
    const user = authStore.user
    if (!user) return null
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleName,
      branch: user.branchName
    }
  }
})

app.mount('#app')
```

### 2. Thêm Widget vào `App.vue`

```html
<template>
  <div id="app">
    <!-- Nút nổi báo lỗi & góp ý -->
    <FeedbackFloatingButton position="bottom-right" />
    
    <router-view />
  </div>
</template>
```

---

## 🛠️ Sử dụng Composable `useFeedback`

Bạn có thể chủ động mở modal feedback từ bất kỳ menu, header hoặc nút bấm nào trong ứng dụng:

```vue
<script setup lang="ts">
import { useFeedback } from '@edutalk/vue-feedback-widget'

const { open, captureCurrentScreen } = useFeedback()

// Mở modal dạng Báo lỗi
function handleReportBug() {
  open('bug')
}

// Mở modal dạng Đóng góp ý kiến
function handleSuggest() {
  open('suggestion')
}
</script>

<template>
  <button @click="handleReportBug">Báo sự cố trang này</button>
</template>
```

---

## ⚙️ Tùy chọn cấu hình (Options)

| Tên Option | Kiểu dữ liệu | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- |
| `appName` | `string` | `undefined` | Tên của ứng dụng hoặc cổng thông tin |
| `appVersion` | `string` | `undefined` | Phiên bản app hiện tại |
| `telegram` | `TelegramConfig` | `undefined` | Cấu hình gửi qua Telegram Bot (`botToken`, `chatId`, `threadId`) |
| `webhook` | `WebhookConfig` | `undefined` | Cấu hình gửi qua Webhook URL riêng (`url`, `headers`) |
| `getUser` | `() => UserContext` | `undefined` | Callback trả về thông tin user hiện tại |
| `onSubmit` | `(payload) => Promise<boolean>` | `undefined` | Tùy biến toàn quyền logic submit dữ liệu |

---

## 🚀 Hướng dẫn Build & Publish lên NPM

### 1. Build package
```bash
cd packages/vue-feedback-widget
npm install
npm run build
```

### 2. Đăng nhập và Public lên NPM
```bash
npm login
npm publish --access public
```

---

## 📄 Giấy phép
MIT License © Edutalk
