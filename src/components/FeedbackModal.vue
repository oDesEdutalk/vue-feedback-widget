<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  Palette,
  MessageCircle,
  Camera,
  Upload,
  Trash2,
  Download,
  RefreshCw,
  Send,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  X,
} from 'lucide-vue-next'
import { useFeedback } from '../composables/useFeedback'
import type { FeedbackType } from '../types'
import ImagePreviewModal from './ImagePreviewModal.vue'

const {
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
  close,
  handleImageFile,
  captureCurrentScreen,
  removeScreenshot,
  submit,
} = useFeedback()

const showTechnicalDetails = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isCopiedUrl = ref(false)
const alertMessage = ref<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

interface CategoryOption {
  type: FeedbackType
  label: string
  icon: any
  desc: string
  activeColor: string
  placeholder: string
  hint: string
}

const defaultCategories: CategoryOption[] = [
  {
    type: 'bug',
    label: 'Báo lỗi / Sự cố',
    icon: Bug,
    desc: 'Lỗi thao tác, hiển thị sai hoặc dữ liệu không tải',
    activeColor: 'border-rose-500 bg-rose-50/90 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-500 shadow-xs ring-2 ring-rose-500/20',
    placeholder: 'Mô tả chi tiết bước thao tác trước khi xảy ra lỗi, thông báo lỗi nếu có...',
    hint: 'Mẹo: Hãy nêu rõ bạn đang bấm vào nút nào hoặc ở màn hình nào thì xảy ra lỗi nhé.',
  },
  {
    type: 'suggestion',
    label: 'Đóng góp ý kiến',
    icon: Lightbulb,
    desc: 'Đề xuất tính năng mới, cải tiến quy trình làm việc',
    activeColor: 'border-amber-500 bg-amber-50/90 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-500 shadow-xs ring-2 ring-amber-500/20',
    placeholder: 'Chia sẻ ý tưởng hoặc tính năng bạn mong muốn hệ thống có thêm...',
    hint: 'Mẹo: Ý tưởng của bạn sẽ được chuyển thẳng đến ban phát triển sản phẩm.',
  },
  {
    type: 'ui',
    label: 'Giao diện & UI/UX',
    icon: Palette,
    desc: 'Góp ý về màu sắc, bố cục, kích thước hoặc độ mượt',
    activeColor: 'border-purple-500 bg-purple-50/90 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-500 shadow-xs ring-2 ring-purple-500/20',
    placeholder: 'Góp ý về giao diện cần tối ưu (vị trí nút bấm, cỡ chữ, khoảng cách, màn hình điện thoại)...',
    hint: 'Mẹo: Bạn có thể chụp ảnh màn hình điện thoại đính kèm để chỉ rõ điểm cần sửa.',
  },
  {
    type: 'other',
    label: 'Ý kiến khác',
    icon: MessageCircle,
    desc: 'Các phản hồi hoặc câu hỏi khác về hệ thống',
    activeColor: 'border-blue-500 bg-blue-50/90 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20',
    placeholder: 'Nội dung phản hồi hoặc ý kiến đóng góp của bạn...',
    hint: 'Mẹo: Đội ngũ kỹ thuật sẽ tiếp nhận và phản hồi sớm nhất.',
  },
]

const currentCategory = computed(() => {
  return defaultCategories.find((c) => c.type === feedbackType.value) || defaultCategories[0]
})

const currentUser = computed(() => {
  return options.getUser ? options.getUser() : null
})

const currentUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : ''
})

async function copyCurrentUrl(): Promise<void> {
  if (navigator?.clipboard?.writeText && currentUrl.value) {
    await navigator.clipboard.writeText(currentUrl.value)
    isCopiedUrl.value = true
    setTimeout(() => {
      isCopiedUrl.value = false
    }, 2000)
  }
}

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const success = await handleImageFile(file)
    if (success) {
      showAlert('info', 'Ảnh minh họa đã được đính kèm.')
    } else {
      showAlert('error', 'Vui lòng chọn file hình ảnh dưới 10MB.')
    }
  }
  target.value = ''
}

async function onFileDrop(event: DragEvent): Promise<void> {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    const success = await handleImageFile(file)
    if (success) {
      showAlert('info', 'Ảnh minh họa đã được đính kèm.')
    }
  }
}

async function handlePasteEvent(event: ClipboardEvent): Promise<void> {
  if (!isOpen.value) return
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) {
        event.preventDefault()
        const success = await handleImageFile(file)
        if (success) {
          showAlert('success', 'Đã dán ảnh từ clipboard!')
        }
        break
      }
    }
  }
}

function showAlert(type: 'success' | 'error' | 'info', text: string) {
  alertMessage.value = { type, text }
  setTimeout(() => {
    if (alertMessage.value?.text === text) {
      alertMessage.value = null
    }
  }, 3500)
}

watch(
  isOpen,
  (val) => {
    if (typeof window === 'undefined') return
    if (val) {
      window.addEventListener('paste', handlePasteEvent)
    } else {
      window.removeEventListener('paste', handlePasteEvent)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('paste', handlePasteEvent)
  }
})

async function onSubmit() {
  if (!content.value.trim()) {
    showAlert('error', 'Vui lòng nhập nội dung chi tiết phản hồi trước khi gửi.')
    return
  }

  const success = await submit()
  if (success) {
    showAlert('success', 'Cảm ơn bạn đã đóng góp ý kiến! Thông tin đã được gửi đi.')
  } else {
    showAlert('error', errorMessage.value || 'Gửi thất bại. Vui lòng thử lại sau.')
  }
}
</script>

<template>
  <Teleport to="body">
    <div>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        style="display: none;"
        @change="onFileSelected"
      />

      <Transition name="vfw-fade">
        <div
          v-if="isOpen"
          class="vfw-backdrop"
          data-feedback-ignore="true"
          @click.self="close"
        >
          <div
            class="vfw-modal"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-1">
                <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-indigo-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 shrink-0">
                  <MessageSquarePlus class="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                      Đóng góp ý kiến & Báo lỗi
                    </h3>
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span class="hidden sm:inline">Tiếp nhận 24/7</span>
                    </span>
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Gửi trực tiếp đến đội ngũ phát triển {{ options.appName ? `(${options.appName})` : '' }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-0 bg-transparent cursor-pointer"
                :disabled="isSubmitting"
                @click="close"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Notification Alert -->
            <div
              v-if="alertMessage"
              class="mx-4 sm:mx-6 mt-3 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              :class="{
                'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200': alertMessage.type === 'success',
                'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200': alertMessage.type === 'error',
                'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200': alertMessage.type === 'info'
              }"
            >
              <Info class="w-4 h-4 shrink-0" />
              <span>{{ alertMessage.text }}</span>
            </div>

            <!-- Form Content -->
            <div class="space-y-3.5 sm:space-y-4 px-4 sm:px-6 py-3.5 sm:py-4 max-h-[calc(84vh-130px)] overflow-y-auto">
              <!-- 1. Category Switcher -->
              <div class="space-y-1.5">
                <label class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>Loại phản hồi</span>
                  <span class="text-rose-500 font-bold">*</span>
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  <button
                    v-for="cat in defaultCategories"
                    :key="cat.type"
                    type="button"
                    class="relative flex flex-col items-center justify-center gap-1 p-2 sm:p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer select-none active:scale-95 bg-white dark:bg-slate-800"
                    :class="[
                      feedbackType === cat.type
                        ? cat.activeColor
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    ]"
                    @click="feedbackType = cat.type"
                  >
                    <div class="flex items-center gap-1 sm:gap-1.5">
                      <component :is="cat.icon" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span class="text-[11px] sm:text-xs font-semibold leading-tight">{{ cat.label }}</span>
                    </div>
                    <span
                      v-if="feedbackType === cat.type"
                      class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs"
                    >
                      <CheckCircle2 class="w-3 h-3 stroke-[3]" />
                    </span>
                  </button>
                </div>
              </div>

              <!-- 2. Topic/Title Input -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Tiêu đề / Tóm tắt
                  </label>
                  <span class="text-[11px] text-slate-400">Tùy chọn</span>
                </div>
                <input
                  v-model="title"
                  type="text"
                  placeholder="Ví dụ: Lỗi không tải được dữ liệu, Đề xuất thêm bộ lọc..."
                  class="w-full rounded-xl text-sm py-2 sm:py-2.5 px-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 box-border"
                  maxlength="120"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- 3. Detailed Feedback Content -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>Nội dung chi tiết</span>
                    <span class="text-rose-500 font-bold">*</span>
                  </label>
                  <span class="text-[11px] text-slate-400 font-mono">
                    {{ content.length }}/1000 ký tự
                  </span>
                </div>

                <textarea
                  v-model="content"
                  :placeholder="currentCategory.placeholder"
                  rows="4"
                  class="w-full rounded-xl text-sm p-2.5 sm:p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-y box-border leading-relaxed"
                  maxlength="1000"
                  :disabled="isSubmitting"
                />

                <div class="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 px-1">
                  <Sparkles class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{{ currentCategory.hint }}</span>
                </div>
              </div>

              <!-- 4. Screenshot / Attachment Section -->
              <div class="space-y-2 pt-0.5">
                <div class="flex items-center justify-between">
                  <label class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Camera class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                    <span>Ảnh minh họa sự cố</span>
                    <span class="text-xs text-slate-400 font-normal">(Tùy chọn)</span>
                  </label>

                  <div v-if="screenshotUrl" class="flex items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer border-0 bg-transparent"
                      @click="triggerFileInput"
                    >
                      <Upload class="w-3 h-3" />
                      <span>Đổi ảnh</span>
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer border-0 bg-transparent"
                      @click="removeScreenshot"
                    >
                      <Trash2 class="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                <!-- Empty Attachment State -->
                <div
                  v-if="!screenshotUrl"
                  class="border-2 border-dashed rounded-xl p-3 text-center transition-all bg-slate-50/70 dark:bg-slate-900/50"
                  :class="[
                    isDragging
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700',
                  ]"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="onFileDrop"
                >
                  <div class="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      type="button"
                      class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border-0"
                      :disabled="isCapturing"
                      @click="captureCurrentScreen"
                    >
                      <RefreshCw v-if="isCapturing" class="w-3.5 h-3.5 animate-spin" />
                      <Camera v-else class="w-3.5 h-3.5" />
                      <span>{{ isCapturing ? 'Đang chụp màn hình...' : 'Chụp màn hình trang này' }}</span>
                    </button>

                    <button
                      type="button"
                      class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                      @click="triggerFileInput"
                    >
                      <Upload class="w-3.5 h-3.5" />
                      <span>Tải ảnh từ thiết bị</span>
                    </button>
                  </div>

                  <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    💡 Phím tắt: Bạn có thể nhấn <kbd class="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 font-mono text-[10px]">Ctrl + V</kbd> để dán ảnh trực tiếp từ clipboard.
                  </p>
                </div>

                <!-- Attached Preview Thumbnail -->
                <div
                  v-else
                  class="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center h-36 sm:h-44 shadow-inner"
                >
                  <img
                    :src="screenshotUrl"
                    alt="Attached preview"
                    class="h-full w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    @click="isImagePreviewOpen = true"
                  />
                  <div
                    class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                    @click="isImagePreviewOpen = true"
                  >
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-bold shadow-lg">
                      <Maximize2 class="w-3.5 h-3.5" />
                      <span>Xem toàn màn hình</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- 5. Technical Details Accordion -->
              <div class="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden text-xs">
                <button
                  type="button"
                  class="w-full flex items-center justify-between p-2.5 text-left text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                  @click="showTechnicalDetails = !showTechnicalDetails"
                >
                  <div class="flex items-center gap-1.5 font-medium">
                    <Info class="w-3.5 h-3.5 text-purple-500" />
                    <span>Thông tin kỹ thuật đính kèm tự động</span>
                  </div>
                  <component :is="showTechnicalDetails ? ChevronUp : ChevronDown" class="w-4 h-4 text-slate-400" />
                </button>

                <div v-if="showTechnicalDetails" class="px-3 pb-3 pt-1 space-y-2 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div v-if="currentUser" class="text-slate-600 dark:text-slate-400">
                    <span class="font-semibold text-slate-700 dark:text-slate-300">Tài khoản:</span> {{ currentUser.name }} ({{ currentUser.email || 'N/A' }})
                  </div>
                  <div class="flex items-center justify-between gap-2 text-slate-600 dark:text-slate-400">
                    <div class="truncate">
                      <span class="font-semibold text-slate-700 dark:text-slate-300">URL:</span> {{ currentUrl }}
                    </div>
                    <button
                      type="button"
                      class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 transition-colors border-0 cursor-pointer"
                      @click="copyCurrentUrl"
                    >
                      <component :is="isCopiedUrl ? Check : Copy" class="w-3 h-3 text-purple-600" />
                      <span>{{ isCopiedUrl ? 'Đã chép' : 'Chép URL' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <button
                type="button"
                class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                :disabled="isSubmitting"
                @click="close"
              >
                Đóng
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:via-pink-700 hover:to-purple-700 shadow-md hover:shadow-lg active:scale-95 transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSubmitting"
                @click="onSubmit"
              >
                <RefreshCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                <Send v-else class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Đang gửi...' : 'Gửi ý kiến / Báo lỗi' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <ImagePreviewModal />
    </div>
  </Teleport>
</template>
