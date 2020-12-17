<template>
  <div class="flex flex-col h-screen">
    <header class="px-4 pt-safe-top">
      <div class="flex items-center justify-between py-1 pl-safe-left pr-safe-right">
        <h1>
          <a
            class="flex items-center justify-center w-10 h-10 -ml-2 font-mono text-lg font-semibold text-gray-700 border border-transparent rounded-md select-none hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-400 focus:text-gray-400 focus:outline-none"
            href="/"
          >
            Py
          </a>
        </h1>

        <div class="flex items-center justify-end -mr-2 space-x-2">
          <button
            class="flex items-center justify-center p-2.5 text-gray-700 border border-transparent rounded-md group hover:w-auto hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-400 focus:text-gray-400 focus:outline-none focus:w-auto"
            @click="showSettings = true"
          >
            <span class="sr-only">Settings</span>

            <span
              v-if="!isMobile()"
              class="hidden mr-2 font-mono text-xs group-hover:inline group-focus:inline"
              v-text="isMac ? 'CMD + ,' : 'CTRL + ,'"
            />

            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <Settings
            :is-mobile="isMobile()"
            :settings="settings"
            :show="showSettings"
            @changed="setSetting($event.key, $event.value, $event.editor || true)"
            @closed="showSettings = false"
          />
        </div>
      </div>
    </header>

    <div class="flex flex-col flex-1 border-t border-gray-800 md:flex-row">
      <Splitpanes :horizontal="!isMd">
        <Pane
          class="flex flex-col w-full h-full overflow-hidden"
          min-size="33.333"
        >
          <div class="relative flex flex-col flex-1">
            <header class="flex items-center px-4 border-b border-gray-800 md:py-4">
              <h3 class="hidden font-mono text-xs font-semibold tracking-wide text-gray-700 uppercase select-none md:block pl-safe-left">Editor</h3>

              <div class="flex items-center -mb-px space-x-4 border-transparent md:hidden pl-safe-left pr-safe-right">
                <button
                  class="flex py-4 border-b-2 border-transparent focus:outline-none"
                  :class="{
                    'border-yellow-500 text-gray-200': !isMd && activeTab === 'editor',
                    'border-transparent text-gray-700 hover:text-gray-400 focus:text-gray-400': isMd || activeTab !== 'editor',
                  }"
                  @click="activeTab = 'editor'"
                >
                  <h3 class="font-mono text-xs font-semibold tracking-wide uppercase select-none">Editor</h3>
                </button>

                <button
                  v-if="!isMd"
                  class="flex items-center py-4 border-b-2 focus:outline-none"
                  :class="{
                    'border-yellow-500 text-gray-200': activeTab === 'output',
                    'border-transparent text-gray-700 hover:text-gray-400 focus:text-gray-400': activeTab !== 'output',
                  }"
                  @click="activeTab = 'output', dirty = false"
                >
                  <h3 class="font-mono text-xs font-semibold tracking-wide uppercase select-none">Output</h3>

                  <span
                    v-if="dirty"
                    class="w-1 h-1 ml-2 bg-yellow-500 rounded-full"
                  />
                </button>
              </div>
            </header>

            <div
              v-show="isMd || activeTab === 'editor'"
              class="flex-1 ml-safe-left"
              :style="{
                fontSize: `${settings.fontSize}px`,
                lineHeight: `${settings.lineHeight}rem`,
              }"
            >
              <textarea
                ref="editor"
                v-model="code"
              />
            </div>

            <div
              v-if="!isMd && activeTab === 'output'"
              class="flex-1"
              :style="{
                fontSize: `${settings.fontSize}px`,
                lineHeight: `${settings.lineHeight}rem`,
              }"
            >
              <textarea
                v-model="output"
                ref="output"
                class="absolute inset-0 flex-shrink-0 w-full h-full px-4 py-1 pb-4 font-mono text-gray-400 bg-transparent border-0 border-none resize-none text-inherit leading-inherit focus:ring-0 focus:outline-none"
                readonly
                @click="dirty = false"
                @focus="dirty = false"
              />
            </div>
          </div>
        </Pane>

        <Pane
          v-if="isMd"
          class="flex flex-col w-full h-full overflow-hidden"
          min-size="33.333"
        >
          <div class="relative flex flex-col flex-1">
            <header class="flex items-center px-4 py-4 border-b border-gray-800 pr-safe-right">
              <h3 class="font-mono text-xs font-semibold tracking-wide text-gray-700 uppercase select-none">Output</h3>
            </header>

            <div
              class="flex-1 mr-safe-right"
              :style="{
                fontSize: `${settings.fontSize}px`,
                lineHeight: `${settings.lineHeight}rem`,
              }"
            >
              <textarea
                v-model="output"
                ref="output"
                class="absolute inset-0 flex-shrink-0 w-full h-full px-4 py-1 pb-4 font-mono text-gray-400 bg-transparent border-0 border-none resize-none leading-inherit text-inherit focus:ring-0 focus:outline-none"
                readonly
                @click="dirty = false"
                @focus="dirty = false"
              />
            </div>
          </div>
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import { Splitpanes, Pane } from 'splitpanes'
import debounce from 'debounce'
import dedent from 'dedent'
import hotkeys from 'hotkeys-js'
import isMobile from 'is-mobile'
import * as rp from 'rustpython_wasm'

import Settings from './components/Settings'

import 'codemirror/mode/python/python'
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/emacs'
import 'codemirror/keymap/sublime'
import 'codemirror/keymap/vim'

const DEFAULT_SETTINGS = {
  fontSize: 16,
  indentUnit: 2,
  keyMap: 'default',
  lineHeight: 2,
}
const INITIAL_CODE = dedent`
  def fib(n):
    n1 = 0
    n2 = 1

    print(f"{n} numbers of Fibonacci sequence:")

    for i in range(n):
      print(f"\t{i + 1} => {n1}")
      n1, n2 = n2, n1 + n2

  def main():
    fib(10)

  main()
`
export default {
  name: 'App',
  components: {
    Pane,
    Settings,
    Splitpanes,
  },
  data: () => ({
    activeTab: 'editor',
    code: INITIAL_CODE,
    dirty: false,
    editor: null,
    isMd: false,
    output: '',
    settings: DEFAULT_SETTINGS,
    showSettings: false,
  }),
  computed: {
    isMac() {
      return navigator.userAgent.indexOf('Mac') !== -1
    },
  },
  watch: {
    isMd: {
      immediate: true,
      handler: function(isMd) {
        if (isMd) this.activeTab = 'editor'
      }
    }
  },
  mounted() {
    this.fetchSettings()
    this.initializeEditor()
    this.updateSize()
    this.run()

    window.addEventListener('resize', debounce(this.updateSize, 200))

    hotkeys(this.isMac ? 'cmd+,' : 'ctrl+,', (event) => {      
      this.showSettings = true
      event.preventDefault()
    })
  },
  unmounted() {
    window.removeEventListener('resize', debounce(this.updateSize, 200))

    hotkeys.unbind(this.isMac ? 'cmd+,' : 'ctrl+,')
  },
  methods: {
    fetchSettings() {
      if (!localStorage.settings) localStorage.settings = JSON.stringify(DEFAULT_SETTINGS)
      else localStorage.settings = JSON.stringify({ ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.settings) })
      this.settings = JSON.parse(localStorage.settings)
    },
    setSetting(key, value, editor = true) {
      this.settings[key] = value
      localStorage.settings = JSON.stringify(this.settings)
      if (editor) this.editor.setOption(key, value)
    },
    initializeEditor() {
      if (this.editor) this.editor.destroy()

      this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
        autofocus: true,
        extraKeys: {
          'Shift-Tab': 'indentLess',
          'Cmd-/': 'toggleComment',
          'Ctrl-/': 'toggleComment',
          'Cmd-,': () => this.showSettings = true,
          'Ctrl-,': () => this.showSettings = true,
          Tab: editor => {
            var spaces = Array(editor.getOption('indentUnit') + 1).join(' ')
            editor.replaceSelection(spaces)
          }
        },
        gutters: ["CodeMirror-linenumbers"],
        indentUnit: parseInt(this.settings.indentUnit),
        keyMap: isMobile() ? 'default' : this.settings.keyMap,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'text/x-python',
        styleActiveLine: true,
        theme: 'custom'
      })

      this.editor.on('change', debounce(editor => {
        this.code = editor.getValue()
        if (this.$emit) {
          this.$emit('input', this.code)
        }
        this.run()
      }, 200))
    },
    run() {
      this.output = ''

      try {
        rp.pyEval(this.code, { stdout: output => this.output += output })
      } catch (err) {
        let error = err
        if (err instanceof WebAssembly.RuntimeError) error = window.__RUSTPYTHON_ERROR || err
        this.output = error
        console.error(error)
      }

      if (!this.isMd) this.dirty = true
    },
    updateSize() {
      this.isMd = window.matchMedia('(min-width: 768px)').matches
    },
    isMobile,
  }
}
</script>
