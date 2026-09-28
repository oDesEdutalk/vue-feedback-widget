<script setup lang="ts">
import { Download, X } from 'lucide-vue-next'
import { useFeedback } from '../composables/useFeedback'

const { isImagePreviewOpen, screenshotUrl, downloadCurrentScreenshot } = useFeedback()

function closePreview() {
  isImagePreviewOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="vfw-fade">
      <div
        v-if="isImagePreviewOpen && screenshotUrl"
        class="vfw-backdrop"
        style="z-index: 99999;"
        data-feedback-ignore="true"
        @click.self="closePreview"
      >
        <div class="vfw-modal max-w-4xl" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Xem chi tiết ảnh chụp minh họa</h3>
            <button
              type="button"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-0 bg-transparent cursor-pointer"
              @click="closePreview"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-3 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
            <img
              :src="screenshotUrl"
              alt="Screenshot Preview"
              class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
            />
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-0 cursor-pointer"
              @click="() => downloadCurrentScreenshot()"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Tải ảnh về máy</span>
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
              @click="closePreview"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
