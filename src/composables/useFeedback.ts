import { ref, reactive, inject, type InjectionKey } from 'vue'
import type { FeedbackType, FeedbackWidgetOptions, FeedbackPayload } from '../types'
import { captureScreen, downloadScreenshot } from '../utils/screenshot'
import { sendToTelegram } from '../services/telegram.service'

export const FEEDBACK_OPTIONS_KEY: InjectionKey<FeedbackWidgetOptions> = Symbol('FEEDBACK_OPTIONS_KEY')

// Global singleton reactive state
const isOpen = ref(false)
const isCapturing = ref(false)
const isSubmitting = ref(false)
const isImagePreviewOpen = ref(false)

const feedbackType = ref<FeedbackType>('bug')
const title = ref<string>('')
const content = ref<string>('')
const screenshotUrl = ref<string | null>(null)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref<string>('')

let globalOptions: FeedbackWidgetOptions = {}

export function setFeedbackGlobalOptions(options: FeedbackWidgetOptions) {
  globalOptions = { ...globalOptions, ...options }
}

export function useFeedback(localOptions?: FeedbackWidgetOptions) {
  const injectedOptions = inject(FEEDBACK_OPTIONS_KEY, globalOptions)
  const options = { ...globalOptions, ...injectedOptions, ...localOptions }

  function open(initialType: FeedbackType = 'bug') {
    feedbackType.value = initialType
    title.value = ''
    content.value = ''
    screenshotUrl.value = null
    submitStatus.value = 'idle'
    errorMessage.value = ''
    isOpen.value = true
  }

  function close() {
    if (isSubmitting.value) return
    isOpen.value = false
    isImagePreviewOpen.value = false
  }

  function setScreenshot(dataUrl: string | null) {
    screenshotUrl.value = dataUrl
  }

  function removeScreenshot() {
    screenshotUrl.value = null
  }

  function downloadCurrentScreenshot(fileName?: string) {
    if (screenshotUrl.value) {
      downloadScreenshot(screenshotUrl.value, fileName)
    }
  }

  function handleImageFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(false)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        resolve(false)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          screenshotUrl.value = result
          resolve(true)
        } else {
          resolve(false)
        }
      }
      reader.onerror = () => resolve(false)
      reader.readAsDataURL(file)
    })
  }

  async function captureCurrentScreen(): Promise<void> {
    if (isCapturing.value) return
    isCapturing.value = true

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 20)
      })
    })

    try {
      const dataUrl = await captureScreen({ scale: 2 })
      screenshotUrl.value = dataUrl
    } catch (err) {
      console.warn('[VueFeedbackWidget] Lỗi chụp màn hình:', err)
      screenshotUrl.value = null
    } finally {
      isCapturing.value = false
    }
  }

  async function submit(): Promise<boolean> {
    if (!content.value.trim() || isSubmitting.value) {
      return false
    }

    isSubmitting.value = true
    submitStatus.value = 'idle'
    errorMessage.value = ''

    const user = options.getUser ? options.getUser() : null
    const payload: FeedbackPayload = {
      type: feedbackType.value,
      title: title.value.trim() || undefined,
      content: content.value.trim(),
      screenshotUrl: screenshotUrl.value,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      appName: options.appName,
      appVersion: options.appVersion,
      user,
      clientInfo: {
        viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : undefined,
        screenResolution: typeof window !== 'undefined' ? `${window.screen?.width}x${window.screen?.height}` : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        isDarkMode: typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
      },
      networkInfo: {
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      },
    }

    try {
      let success = true

      if (typeof options.onSubmit === 'function') {
        const customRes = await options.onSubmit(payload)
        if (customRes === false) success = false
      } else if (options.telegram) {
        success = await sendToTelegram(options.telegram, payload)
      } else if (options.webhook) {
        const res = await fetch(options.webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(options.webhook.headers || {}),
          },
          body: JSON.stringify(payload),
        })
        success = res.ok
      } else {
        console.warn('[VueFeedbackWidget] Chưa cấu hình telegram, webhook hoặc callback onSubmit!')
        success = false
      }

      if (success) {
        submitStatus.value = 'success'
        setTimeout(() => {
          close()
        }, 1500)
        return true
      } else {
        submitStatus.value = 'error'
        errorMessage.value = 'Không thể gửi phản hồi. Vui lòng thử lại sau.'
        return false
      }
    } catch (err: any) {
      submitStatus.value = 'error'
      errorMessage.value = err?.message || 'Có lỗi xảy ra khi gửi phản hồi.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isOpen,
    isCapturing,
    isSubmitting,
    isImagePreviewOpen,
    feedbackType,
    title,
    content,
    screenshotUrl,
    submitStatus,
    errorMessage,
    options,
    open,
    close,
    setScreenshot,
    removeScreenshot,
    downloadCurrentScreenshot,
    handleImageFile,
    captureCurrentScreen,
    submit,
  }
}
