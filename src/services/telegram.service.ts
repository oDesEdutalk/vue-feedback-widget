import type { TelegramConfig, FeedbackPayload } from '../types'

function escapeHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export function buildTelegramCaption(payload: FeedbackPayload): string {
  const typeIcons: Record<string, string> = {
    bug: '🚨 [BÁO LỖI / SỰ CỐ]',
    suggestion: '💡 [ĐÓNG GÓP Ý KIẾN]',
    ui: '🎨 [GÓP Ý GIAO DIỆN & UI/UX]',
    other: '💬 [Ý KIẾN KHÁC]',
  }

  const categoryTitle = typeIcons[payload.type] || '📝 [PHẢN HỒI NGƯỜI DÙNG]'
  const user = payload.user
  const userDetails = user
    ? `👤 <b>Người gửi:</b> ${escapeHtml(user.name || 'N/A')} (ID: <code>${user.id ?? 'N/A'}</code>)\n📧 <b>Email:</b> <code>${escapeHtml(user.email || 'N/A')}</code>\n🏷️ <b>Vai trò/Cơ sở:</b> ${escapeHtml([user.role, user.branch].filter(Boolean).join(' • ') || 'N/A')}`
    : '👤 <b>Người gửi:</b> <i>Khách vãng lai / Chưa đăng nhập</i>'

  const appInfo = payload.appName ? `📱 <b>Hệ thống:</b> ${escapeHtml(payload.appName)}${payload.appVersion ? ` (v${escapeHtml(payload.appVersion)})` : ''}\n` : ''

  return (
    `✨ <b>${categoryTitle}</b> ✨\n\n` +
    appInfo +
    (payload.title ? `📌 <b>Tiêu đề:</b> <b>${escapeHtml(payload.title)}</b>\n` : '') +
    `📝 <b>Nội dung chi tiết:</b>\n<blockquote>${escapeHtml(payload.content)}</blockquote>\n\n` +
    `🌐 <b>Trang gặp sự cố:</b>\n🔗 <a href="${escapeHtml(payload.url)}">${escapeHtml(payload.url)}</a>\n\n` +
    `${userDetails}\n\n` +
    `⏱️ <b>Thời gian gửi:</b> <code>${escapeHtml(payload.timestamp)}</code>\n` +
    (payload.clientInfo?.viewport ? `🖥️ <b>Màn hình / Thiết bị:</b> <code>${escapeHtml(payload.clientInfo.viewport)}</code>\n` : '') +
    (payload.networkInfo?.online !== undefined ? `📶 <b>Mạng:</b> ${payload.networkInfo.online ? '🟢 Online' : '🔴 Offline'}` : '')
  )
}

export async function sendToTelegram(config: TelegramConfig, payload: FeedbackPayload): Promise<boolean> {
  const { botToken, chatId, threadId } = config
  if (!botToken || !chatId) {
    console.warn('[VueFeedbackWidget] Thiếu botToken hoặc chatId Telegram!')
    return false
  }

  const caption = buildTelegramCaption(payload)

  try {
    if (payload.screenshotUrl) {
      const imageBlob = dataUrlToBlob(payload.screenshotUrl)
      const formData = new FormData()
      formData.append('chat_id', chatId)
      if (threadId) {
        formData.append('message_thread_id', String(threadId))
      }
      formData.append('caption', caption)
      formData.append('parse_mode', 'HTML')
      formData.append('photo', imageBlob, 'feedback-screenshot.png')

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      return Boolean(data.ok)
    } else {
      const payloadBody: any = {
        chat_id: chatId,
        text: caption,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }
      if (threadId) {
        payloadBody.message_thread_id = threadId
      }

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
      })

      const data = await response.json()
      return Boolean(data.ok)
    }
  } catch (err) {
    console.error('[VueFeedbackWidget] Lỗi kết nối Telegram API:', err)
    return false
  }
}
