<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeDialog">
      <TransitionChild
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-secondary-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                :class="iconBgClass"
              >
                <component :is="iconComponent" class="h-6 w-6" :class="iconColorClass" />
              </div>

              <DialogTitle
                as="h3"
                class="mt-4 text-lg font-medium leading-6 text-secondary-900 dark:text-white text-center"
              >
                {{ title }}
              </DialogTitle>

              <div class="mt-2">
                <p class="text-sm text-secondary-500 dark:text-secondary-400 text-center">
                  {{ message }}
                </p>
              </div>

              <div class="mt-6 flex gap-3" :class="type === 'confirm' ? 'flex-row' : 'flex-col'">
                <button
                  v-if="type === 'confirm'"
                  type="button"
                  class="flex-1 inline-flex justify-center rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none transition"
                  @click="cancel"
                >
                  {{ cancelText }}
                </button>
                <button
                  type="button"
                  class="flex-1 inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none transition"
                  :class="buttonClass"
                  @click="confirm"
                >
                  {{ confirmText }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info', 'confirm'].includes(value),
  },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'OK' },
  cancelText: { type: String, default: 'Batal' },
})

const emit = defineEmits(['confirm', 'cancel'])

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    confirm: InformationCircleIcon,
  }
  return icons[props.type] || CheckCircleIcon
})

const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-green-100 dark:bg-green-900/30',
    error: 'bg-red-100 dark:bg-red-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30',
    confirm: 'bg-blue-100 dark:bg-blue-900/30',
  }
  return classes[props.type] || 'bg-green-100 dark:bg-green-900/30'
})

const iconColorClass = computed(() => {
  const classes = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
    confirm: 'text-blue-600 dark:text-blue-400',
  }
  return classes[props.type] || 'text-green-600 dark:text-green-400'
})

const buttonClass = computed(() => {
  const classes = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-primary-600 hover:bg-primary-700',
    confirm: 'bg-primary-600 hover:bg-primary-700',
  }
  return classes[props.type] || 'bg-primary-600 hover:bg-primary-700'
})

const closeDialog = () => emit('cancel')
const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>
