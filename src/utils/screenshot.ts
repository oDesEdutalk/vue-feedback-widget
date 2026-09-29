export interface ScreenshotOptions {
  format?: 'image/png' | 'image/jpeg'
  quality?: number
  scale?: number
  targetElement?: HTMLElement | string | null
}

function shouldIncludeElement(element: HTMLElement): boolean {
  if (!element || typeof element.getAttribute !== 'function') return true

  const classList = element.classList
  const dataIgnore = element.getAttribute('data-html2canvas-ignore') || element.getAttribute('data-feedback-ignore')
  const pcName = element.getAttribute('data-pc-name')
  const pcSection = element.getAttribute('data-pc-section')

  if (
    dataIgnore === 'true' ||
    pcName === 'dialog' ||
    pcSection === 'mask' ||
    classList?.contains('feedback-widget-modal') ||
    classList?.contains('feedback-modal') ||
    classList?.contains('feedback-ignore') ||
    classList?.contains('p-dialog-mask') ||
    classList?.contains('p-dialog') ||
    classList?.contains('p-component-overlay') ||
    classList?.contains('p-toast') ||
    classList?.contains('p-tooltip') ||
    classList?.contains('el-overlay') ||
    classList?.contains('el-message')
  ) {
    return false
  }

  return true
}

export async function captureScreen(options: ScreenshotOptions = {}): Promise<string | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const {
    format = 'image/jpeg',
    quality = 0.85,
    scale = 1,
    targetElement: customTarget,
  } = options

  let target: HTMLElement | null = null
  if (typeof customTarget === 'string') {
    target = document.querySelector(customTarget)
  } else if (customTarget instanceof HTMLElement) {
    target = customTarget
  }

  if (!target) {
    target = document.getElementById('app') || document.documentElement || document.body
  }

  const isDarkMode =
    document.documentElement.classList.contains('dark') ||
    document.documentElement.classList.contains('dark-mode')

  try {
    const htmlToImage = await import('html-to-image')

    const captureConfig = {
      pixelRatio: Math.min(scale || 1, 1.5),
      quality: quality,
      backgroundColor: isDarkMode ? '#111827' : '#ffffff',
      filter: (node: Node) => shouldIncludeElement(node as HTMLElement),
      cacheBust: false,
      skipAutoScale: true,
      skipFonts: true, // Skip font fetching & CSS parsing to keep main thread fast
      fontEmbedCSS: '', // Bypass font embedding
    }

    let dataUrl: string | null = null
    if (format === 'image/jpeg') {
      dataUrl = await htmlToImage.toJpeg(target, captureConfig)
    } else {
      dataUrl = await htmlToImage.toPng(target, captureConfig)
    }

    if (dataUrl && dataUrl.length > 100) {
      return dataUrl
    }
    return null
  } catch (err) {
    console.warn('[VueFeedbackWidget] Lỗi chụp màn hình:', err)
    return null
  }
}

export function downloadScreenshot(dataUrl: string, fileName?: string): void {
  const isPng = dataUrl.startsWith('data:image/png')
  const ext = isPng ? 'png' : 'jpg'
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const finalName = fileName || `screenshot-feedback-${dateStr}.${ext}`

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = finalName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
