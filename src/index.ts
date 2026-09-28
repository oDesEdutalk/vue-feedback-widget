import type { App, Plugin } from 'vue'
import FeedbackFloatingButton from './components/FeedbackFloatingButton.vue'
import FeedbackModal from './components/FeedbackModal.vue'
import ImagePreviewModal from './components/ImagePreviewModal.vue'
import {
  useFeedback,
  setFeedbackGlobalOptions,
  FEEDBACK_OPTIONS_KEY,
} from './composables/useFeedback'
import { captureScreen, downloadScreenshot } from './utils/screenshot'
import { sendToTelegram, buildTelegramCaption } from './services/telegram.service'
import type {
  FeedbackType,
  FeedbackWidgetOptions,
  FeedbackPayload,
  TelegramConfig,
  WebhookConfig,
  UserContext,
  FeedbackCategoryConfig,
} from './types'
import './styles/style.css'

export const VueFeedbackWidget: Plugin = {
  install(app: App, options?: FeedbackWidgetOptions) {
    if (options) {
      setFeedbackGlobalOptions(options)
      app.provide(FEEDBACK_OPTIONS_KEY, options)
    }

    app.component('FeedbackFloatingButton', FeedbackFloatingButton)
    app.component('FeedbackModal', FeedbackModal)
    app.component('ImagePreviewModal', ImagePreviewModal)
  },
}

export default VueFeedbackWidget

export {
  FeedbackFloatingButton,
  FeedbackModal,
  ImagePreviewModal,
  useFeedback,
  setFeedbackGlobalOptions,
  FEEDBACK_OPTIONS_KEY,
  captureScreen,
  downloadScreenshot,
  sendToTelegram,
  buildTelegramCaption,
}

export type {
  FeedbackType,
  FeedbackWidgetOptions,
  FeedbackPayload,
  TelegramConfig,
  WebhookConfig,
  UserContext,
  FeedbackCategoryConfig,
}
