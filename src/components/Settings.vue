<template>
  <Modal>
    <template #trigger>
      <button class="flex items-center justify-center w-10 h-10 text-gray-700 border border-transparent rounded-md hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-400 focus:text-gray-400 focus:outline-none">
        <span class="sr-only">Settings</span>

        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </template>

    <template #icon>
      <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-black rounded-full sm:mx-0 sm:h-10 sm:w-10">
        <svg class="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </template>

    <template #title>
      Settings
    </template>

    <template #content>
      <div class="grid grid-cols-1 gap-3">
        <label class="block text-sm font-medium tracking-wide uppercase sm:text-xs">
          <span>Indent Size</span>
          <input
            class="block w-full mt-1 bg-black border-0 border-none rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500"
            type="number"
            max="8"
            min="1"
            step="1"
            :value="settings.indentUnit"
            @input="debounce(onChanged('indentUnit', parseInt($event.target.value)), 200)"
          />
        </label>

        <label class="block text-sm font-medium tracking-wide uppercase sm:text-xs">
          <span>Keymap</span>
          <select
            class="block w-full mt-1 bg-black border-0 border-none rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500"
            :value="settings.keyMap"
            @input="debounce(onChanged('keyMap', $event.target.value), 200)"
          >
            <option value="default">Default</option>
            <option value="emacs">Emacs</option>
            <option value="sublime">Sublime Text</option>
            <option value="vim">Vim</option>
          </select>
        </label>
      </div>
    </template>

    <template #actions="{ hide }">
      <button
        type="button"
        class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-400 rounded-md hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="hide"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<script>
import debounce from 'debounce'

import Modal from './Modal'

export default {
  components: {
    Modal,
  },
  emits: ['changed'],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onChanged(key, value) {
      this.$emit('changed', { key, value })
    },
    debounce,
  },
}
</script>
