<template>
  <div class="flex flex-col h-screen">
    <Header />

    <div class="flex flex-col flex-1 border-t border-gray-100 dark:border-gray-800 md:flex-row">
      <Splitpanes :horizontal="state.settings.layout === 'horizontal'">
        <Pane
          class="flex flex-col w-full h-full overflow-hidden"
          min-size="33.333"
        >
          <div class="relative flex flex-col flex-1">
            <TabBar />

            <Editor v-if="state.activeTab === 'editor'" />
            <Output v-if="state.activeTab === 'output'" />
          </div>
        </Pane>

        <Pane
          v-if="isMd"
          class="flex flex-col w-full h-full overflow-hidden"
          min-size="33.333"
        >
          <div class="relative flex flex-col flex-1">
            <header class="flex items-center w-full px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 pr-safe-right">
              <h3 class="font-mono text-xs font-semibold tracking-wide text-gray-500 uppercase select-none dark:text-gray-700">
                Output
              </h3>

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
            </header>

            <Output />
          </div>
        </Pane>
      </Splitpanes>
    </div>
  </div>

  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <p
      v-if="loading"
      class="fixed text-gray-500 transition-opacity bottom-4 right-4 md:mr-safe-right md:mb-safe-bottom"
    >
      <span class="sr-only">Loading</span>

      <svg fill="none" viewBox="0 0 24 24" class="w-6 h-6 animate-spin">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </p>
  </transition>

  <Settings @update:setting="updateSetting" />
</template>

<script>
import { onMounted, provide, reactive, ref, toRaw, watchEffect } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import Header from './components/Header.vue'
import Editor from './components/Editor.vue'
import Output from './components/Output.vue'
import Settings from './components/Settings.vue'
import TabBar from './components/TabBar.vue'
import useMedia from './hooks/useMedia'
import isMobile from 'is-mobile'
import DEFAULT_SETTINGS, { nonEditorSettings } from './config/settings'
import defaultContent from './config/defaultContent'
import dedent from 'dedent'
import { updateTheme } from './utils/theme'

export default {
  components: {
    Editor,
    Header,
    Output,
    Pane,
    Settings,
    Splitpanes,
    TabBar,
  },
  setup() {
    const state = reactive({
      activeTab: 'editor',
      settings: DEFAULT_SETTINGS
    })
    const loading = ref(true)
    const content = ref(defaultContent)
    const output = ref('')
    const editor = ref(null)
    const dirty = ref(false)
    const error = ref(false)
    const showSettings = ref(false)
    const isMac = ref(navigator.userAgent.indexOf('Mac') !== -1)
    const isMd = useMedia('(min-width: 768px)')
    const clear = async () => {
      /* eslint-disable */
      await pyodide.runPython(dedent`
        sys.stdout.truncate(0)
        sys.stdout.seek(0)
        sys.stderr.truncate(0)
        sys.stderr.seek(0)
      `)
      /* eslint-enable */
    }
    const run = async () => {
      loading.value = true
      output.value = ''
      error.value = false

      await clear()

      try {
        /* eslint-disable */
        await pyodide.runPython(content.value)
        const stderr = (await pyodide.runPython("sys.stderr.getvalue()")).trim()
        if (stderr) {
          error.value = true
          output.value = stderr
        } else {
          const stdout = (await pyodide.runPython("sys.stdout.getvalue()")).trim()
          if (stdout) output.value = stdout
        }
          /* eslint-enable */
      } catch (e) {
        error.value = true
        output.value = e
      }

      loading.value = false
      dirty.value = true
    }
    const updateSetting = ({ key, value }) => {
      state.settings[key] = value
      localStorage.settings = JSON.stringify(state.settings)
      if (!nonEditorSettings.includes(key)) editor.value.setOption(key, value)
    }

    watchEffect(() => {
      if (isMd) state.activeTab = 'editor'
    })

    onMounted(() => {
      if (!localStorage.settings) localStorage.settings = JSON.stringify(DEFAULT_SETTINGS)
      else localStorage.settings = JSON.stringify({ ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.settings) })
      state.settings = JSON.parse(localStorage.settings)
      Object.keys(toRaw(state.settings)).forEach(key => {
        if (!nonEditorSettings.includes(key)) editor.value.setOption(key, state.settings[key])
      })
    })

    onMounted(() => {
      if (state.settings.theme) updateTheme(state.settings.theme)
    })

    onMounted(async () => {
      /* eslint-disable */
      await languagePluginLoader

      pyodide.runPython(dedent`
        import io, code, sys
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
      `)
      /* eslint-enable */

      await run()
    })

    provide('app', state)
    provide('error', error)
    provide('loading', loading)
    provide('content', content)
    provide('output', output)
    provide('editor', editor)
    provide('dirty', dirty)
    provide('isMac', isMac)
    provide('isMd', isMd)
    provide('isMobile', isMobile())
    provide('run', run)
    provide('showSettings', showSettings)

    return {
      dirty,
      error,
      isMd,
      loading,
      state,
      updateSetting,
    }
  }
}
</script>
