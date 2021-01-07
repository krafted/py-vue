<template>
  <div
    class="flex-1 mr-safe-right md:ml-safe-left"
    :style="{
      fontSize: `${app.settings.fontSize}px`,
      lineHeight: `${app.settings.lineHeight}rem`,
    }"
  >
    <textarea
      class="absolute inset-0 flex-shrink-0 w-full h-full px-4 py-1 pb-4 font-mono text-gray-600 bg-transparent border-0 border-none resize-none dark:text-gray-400 leading-inherit text-inherit focus:ring-0 focus:outline-none"
      readonly
      :value="output"
      @mouseover="dirty = false"
      @click="dirty = false"
      @focus="dirty = false"
    />
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  setup() {
    const app = inject('app')
    const output = inject('output')
    const dirty = inject('dirty')

    return {
      app,
      dirty,
      output,
    }
  }
}
</script>
