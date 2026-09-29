<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { MessageSquarePlus } from 'lucide-vue-next'
import { useFeedback } from '../composables/useFeedback'

const FeedbackModal = defineAsyncComponent(() => import('./FeedbackModal.vue'))

interface Props {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  label?: string
  badgeText?: string
  backgroundColor?: string
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
  label: 'Góp ý & Báo lỗi',
  badgeText: 'Góp ý & Báo lỗi',
  backgroundColor: '#f43f5e',
  zIndex: 1100,
})

const { isOpen, open } = useFeedback()
const isHovered = ref(false)
const hasInteracted = ref(false)

function handleOpen() {
  hasInteracted.value = true
  open('bug')
}

const positionClasses = {
  'bottom-right': 'fixed bottom-2 right-6',
  'bottom-left': 'fixed bottom-2 left-6',
  'top-right': 'fixed top-6 right-6',
  'top-left': 'fixed top-6 left-6',
}
</script>

<template>
  <div>
    <!-- Floating Trigger Container -->
    <div
      :class="[positionClasses[props.position] || positionClasses['bottom-right'], 'inline-flex size-14 sm:size-16 items-center justify-center p-2 print:hidden select-none']"
      :style="{ zIndex: props.zIndex }"
      data-feedback-ignore="true"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Hover Tooltip Pill Sliding from Left (Desktop only) -->
      <Transition name="vfw-slide">
        <button
          v-if="isHovered"
          type="button"
          class="hidden sm:inline-flex absolute right-16 mr-1 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-lg dark:bg-slate-800 dark:text-slate-100 cursor-pointer pointer-events-auto border-0 outline-none"
          @click="handleOpen"
        >
          <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: props.backgroundColor }" />
          <span>{{ props.badgeText }}</span>
        </button>
      </Transition>

      <!-- Main Floating Button -->
      <button
        type="button"
        class="vfw-floating-btn group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-lg cursor-pointer"
        :style="{ backgroundColor: props.backgroundColor }"
        :aria-label="props.label"
        :title="props.label"
        @click="handleOpen"
      >
        <MessageSquarePlus class="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2] text-white transition-transform duration-200 group-hover:scale-110" />
      </button>
    </div>

    <!-- Lazy-loaded Feedback Modal Component -->
    <FeedbackModal v-if="hasInteracted || isOpen" />
  </div>
</template>
