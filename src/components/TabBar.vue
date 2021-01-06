<template>
  <header class="flex items-center justify-between px-4 border-b border-gray-800 md:py-3.5">
    <h3 class="hidden font-mono text-xs font-semibold tracking-wide text-gray-700 uppercase select-none md:block pl-safe-left">Editor</h3>

    <div class="flex items-center justify-between w-full -mb-px space-x-4 border-transparent md:hidden pl-safe-left pr-safe-right">
      <div class="flex items-center space-x-4">
        <button
          class="flex py-3.5 border-b-2 border-transparent focus:outline-none"
          :class="{
            'border-yellow-500 text-gray-200': !isMd && app.activeTab === 'editor',
            'border-transparent text-gray-700 hover:text-gray-400 focus:text-gray-400': isMd || app.activeTab !== 'editor',
          }"
          @click="app.activeTab = 'editor'"
        >
          <h3 class="font-mono text-xs font-semibold tracking-wide uppercase select-none">Editor</h3>
        </button>

        <button
          v-if="!isMd"
          class="flex items-center py-3.5 border-b-2 focus:outline-none"
          :class="{
            'border-yellow-500 text-gray-200': app.activeTab === 'output',
            'border-transparent text-gray-700 hover:text-gray-400 focus:text-gray-400': app.activeTab !== 'output',
          }"
          @click="app.activeTab = 'output', dirty = false"
        >
          <h3 class="font-mono text-xs font-semibold tracking-wide uppercase select-none">Output</h3>

          <transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <span
              v-if="dirty || error"
              class="w-1 h-1 ml-2 transition-opacity rounded-full"
              :class="error ? 'bg-red-500' : 'bg-yellow-500'"
            />
          </transition>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { inject } from 'vue'

export default {
  setup() {
    const app = inject('app')
    const dirty = inject('dirty')
    const error = inject('error')
    const isMd = inject('isMd')

    return {
      app,
      dirty,
      error,
      isMd,
    }
  }
}
</script>
