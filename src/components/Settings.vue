<template>
  <Modal>
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
        <FormInput
          label="Font Size"
          :value="app.settings.fontSize.toString()"
          @update:value="updateSetting('fontSize', $event)"
        >
          <FormNumberInput
            max="26"
            min="10"
            step="1"
            increments
          />
        </FormInput>

        <FormInput
          label="Indent Size"
          :value="app.settings.indentUnit.toString()"
          @update:value="updateSetting('indentUnit', $event)"
        >
          <FormNumberInput
            max="8"
            min="1"
            step="1"
            increments
          />
        </FormInput>

        <FormInput
          label="Keymap"
          :value="app.settings.keyMap"
          @update:value="updateSetting('keyMap', $event)"
        >
          <template #default="{ handleInput, value }">
            <select
              class="block w-full pt-3 text-white transform -translate-y-1 bg-transparent border-0 border-none focus:outline-none focus:ring-0"
              :value="value"
              @input="handleInput($event.target.value)"
            >
              <option
                v-for="option in keyMapOptions"
                :key="option.key"
                :value="option.key"
                v-text="option.value"
              ></option>
            </select>
          </template>
        </FormInput>

        <FormInput
          label="Line Height"
          :value="app.settings.lineHeight.toString()"
          @update:value="updateSetting('lineHeight', $event)"
        >
          <FormNumberInput
            max="2.5"
            min="0.75"
            step="0.25"
            type="float"
            increments
          />
        </FormInput>
      </div>
    </template>

    <template #actions>
      <button
        type="button"
        class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-400 rounded-md hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="show = false"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<script>
import { inject, onMounted, onUnmounted, provide, watchEffect } from 'vue'
import Modal from './Modal.vue'
import FormInput from './form/FormInput.vue'
import FormNumberInput from './form/FormNumberInput.vue'
import hotkeys from 'hotkeys-js'

export default {
  emits: ['update:setting'],
  components: {
    Modal,
    FormInput,
    FormNumberInput,
  },
  setup(_, { emit }) {
    const app = inject('app')
    const isMac = inject('isMac')
    const show = inject('showSettings')
    const updateSetting = (key, value) => emit('update:setting', { key, value })

    watchEffect(() => show.value && document.activeElement.blur())

    onMounted(() => {
      hotkeys(isMac.value ? 'cmd+,' : 'ctrl+,', (event) => {
        show.value = true
        event.preventDefault()
      })
    })
    onUnmounted(() => hotkeys.unbind(isMac.value ? 'cmd+,' : 'ctrl+,'))

    provide('show', show)

    return {
      app,
      keyMapOptions: [
        { key: 'default', value: 'Default' },
        { key: 'emacs', value: 'Emacs' },
        { key: 'sublime', value: 'Sublime Text' },
        { key: 'vim', value: 'Vim' },
      ],
      show,
      updateSetting,
    }
  }
}
</script>
