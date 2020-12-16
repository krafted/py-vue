<template>
  <div @click="show = true">
    <slot name="trigger"></slot>
  </div>

  <div
    v-show="show"
    class="fixed inset-0 z-20 overflow-y-auto"
  >
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <transition
        enter-active-class="duration-300 ease-out"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="show"
          class="fixed inset-0 transition-opacity"
          aria-hidden="true"
          @click="hide"
        >
          <div class="absolute inset-0 bg-black opacity-75" />
        </div>
      </transition>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >
        &#8203;
      </span>

      <transition
        enter-active-class="duration-300 ease-out"
        enter-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        enter-to-class="translate-y-0 opacity-100 sm:scale-100"
        leave-active-class="duration-200 ease-in"
        leave-class="translate-y-0 opacity-100 sm:scale-100"
        leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-show="show"
          class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div class="p-4 bg-gray-900 sm:p-6">
            <div class="flex items-start space-x-4 sm:space-x-6">
              <slot name="icon" />

              <div class="flex-1 text-gray-400">
                <header class="flex items-center">
                  <h3 class="flex items-center h-12 text-lg font-semibold leading-6 text-gray-200 sm:h-10" id="modal-headline">
                    <slot name="title" />
                  </h3>
                </header>

                <div class="mt-3">
                  <slot name="content" />
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-800 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot
              name="actions"
              :hide="hide"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialShow: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      show: this.initialShow,
    }
  },
  mounted() {
    window.addEventListener('keyup', this.handleEsc)
  },
  unmounted() {
    window.removeEventListener('keyup', this.handleEsc)
  },
  methods: {
    handleEsc(event) {
      if (event.key === 'Escape') this.hide()
      event.preventDefault()
    },
    hide() {
      this.show = false
    },
  },
}
</script>
