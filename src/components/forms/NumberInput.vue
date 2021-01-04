<template>
  <div class="flex items-stretch overflow-hidden rounded-md focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-yellow-500">
    <input
      class="flex-1 block bg-black border-0 border-none appearance-none focus:outline-none focus:ring-0"
      :class="{
        'rounded-md': !increments,
        'rounded-l-md': increments,
      }"
      :max="max"
      :min="min"
      :step="step"
      type="number"
      :value="value"
      :disabled="disabled"
      :readonly="increments"
      @input="$emit('update:value', getValue($event.target.value))"
    />

    <div class="flex items-stretch">
      <button
        class="flex items-center justify-center w-10 h-10 bg-gray-800 border-l border-gray-900 focus:outline-none hover:bg-black focus:bg-black"
        @click="decrement"
      >
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      <button
        class="flex items-center justify-center w-10 h-10 bg-gray-800 border-l border-gray-900 focus:outline-none hover:bg-black focus:bg-black"
        @click="increment"
      >
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['update:value'],
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    max: {
      type: String,
      required: false,
    },
    min: {
      type: String,
      required: false,
    },
    increments: {
      type: Boolean,
      required: false,
      default: false,
    },
    step: {
      type: String,
      required: false,
      default: '1',
    },
    type: {
      type: String,
      required: false,
      default: 'int',
    },
    value: {
      type: String,
      required: false,
    },
  },
  methods: {
    getValue(value) {
      if (!value || isNaN(value)) return
      return this.type === 'int' ? parseInt(value) : parseFloat(value)
    },
    decrement() {
      if (this.getValue(this.value) < this.getValue(this.min)) return
      this.$emit('update:value', this.getValue(this.value) - this.getValue(this.step))
    },
    increment() {
      if (this.getValue(this.value) > this.getValue(this.max)) return
      this.$emit('update:value', this.getValue(this.value) + this.getValue(this.step))
    },
  },
}
</script>

