export type FeedbackType = 'bug' | 'suggestion' | 'ui' | 'other'

export interface UserContext {
  id?: string | number
  name?: string
  email?: string
  role?: string
  branch?: string
  [key: string]: any
}

export interface TelegramConfig {
  botToken: string
  chatId: string
  threadId?: string | number
}

export interface WebhookConfig {
  url: string
  headers?: Record<string, string>
}

export interface FeedbackWidgetOptions {
  telegram?: TelegramConfig
  webhook?: WebhookConfig
  appName?: string
  appVersion?: string
  getUser?: () => UserContext | null | undefined
  onSubmit?: (payload: FeedbackPayload) => Promise<boolean | void>
  categories?: FeedbackCategoryConfig[]
  primaryColor?: string
  zIndex?: number
}

export interface FeedbackCategoryConfig {
  type: FeedbackType
  label: string
  icon?: any
  desc?: string
  placeholder?: string
  hint?: string
}

export interface FeedbackPayload {
  type: FeedbackType
  title?: string
  content: string
  screenshotUrl?: string | null
  url: string
  timestamp: string
  appName?: string
  appVersion?: string
  user?: UserContext | null
  clientInfo?: {
    viewport?: string
    screenResolution?: string
    userAgent?: string
    isDarkMode?: boolean
  }
  networkInfo?: {
    online?: boolean
    effectiveType?: string
    downlink?: string
    rtt?: string
  }
}
