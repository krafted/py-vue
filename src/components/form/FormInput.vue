<template>
  <label class="flex items-center px-4 pt-2 bg-gray-800 border-2 border-gray-800 rounded-md h-14 focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-yellow-500">
    <span
      class="absolute inset-x-0 block px-4 font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 ease-in-out transform"
      :class="{
        'text-2xs -translate-y-4': value || focused,
        'text-xs -translate-y-1': !value && !focused,
      }"
      v-text="label"
    />

    <slot
      :focused="focused"
      :handleInput="handleInput"
      :value="value"
    >
      <input
        class="block w-full text-white bg-transparent focus:outline-none focus:ring-0"
        type="text"
        :value="value"
        @input="handleInput($event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
    </slot>
  </label>
</template>

<script>
import { provide, ref, toRefs } from 'vue'

export default {
  emits: ['update:value'],
  props: ['label', 'value'],
  setup(props, { emit }) {
    const { value } = toRefs(props)
    const focused = ref(false)
    const handleInput = (value) => emit('update:value', value)

    provide('handleInput', handleInput)
    provide('focused', focused)
    provide('value', value)

    return {
      focused,
      handleInput,
    }
  },
}
</script>
