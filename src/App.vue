<template>
  <div class="flex flex-col h-screen">
    <header class="flex items-center justify-between px-4 h-14">
      <h1>
        <a
          class="flex items-center justify-center w-10 h-10 -ml-2 text-lg font-semibold text-gray-700 border border-transparent rounded-md select-none hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-400 focus:text-gray-400 focus:outline-none"
          href="/"
        >
          Py
        </a>
      </h1>

      <div class="flex items-center justify-end -mr-2 space-x-2">
        <button
          class="flex items-center justify-center w-10 h-10 text-gray-700 border border-transparent rounded-md hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 hover:text-gray-400 focus:text-gray-400 focus:outline-none"
          @click="showSettings = true"
        >
          <span class="sr-only">Settings</span>

          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <Settings
          :is-mobile="isMobile()"
          :settings="settings"
          :show="showSettings"
          @changed="setSetting($event.key, $event.value)"
          @close="showSettings = false"
        />
      </div>
    </header>

    <div class="flex flex-col flex-1 border-t border-gray-800 md:flex-row">
      <div class="flex flex-col flex-1 flex-shrink-0 md:flex-row">
        <div id="editor" class="flex flex-col flex-1 pt-2 -mb-2 md:pt-0 md:mb-0 md:-mr-2 md:pl-2">
          <div class="relative flex flex-col flex-1 -mt-2 md:mt-0 md:-ml-2">
            <header class="flex items-center px-4 py-4 space-x-2 border-b border-gray-800">
              <h3 class="text-xs font-semibold text-gray-700 uppercase select-none">Editor</h3>
            </header>

            <div class="flex-1">
              <textarea
                ref="editor"
                v-model="code"
              />
            </div>
          </div>
        </div>

        <div id="output" class="flex flex-col flex-1 pb-2 -mt-2 md:mt-0 md:-ml-2 md:pr-2 md:pb-0">
          <div class="flex flex-col flex-1 -mb-2 md:mb-0 md:-mr-2">
            <header class="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <h3 class="text-xs font-semibold text-gray-700 uppercase select-none">Output</h3>
            </header>

            <div class="flex-1">
              <textarea
                ref="output"
                class="absolute inset-0 flex-shrink-0 w-full h-full px-4 py-1 pb-4 font-mono leading-8 text-gray-400 bg-transparent border-0 border-none resize-none focus:ring-0 focus:outline-none"
                readonly
                v-model="output"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _CodeMirror from "codemirror";
import Split from 'split.js'
import debounce from 'debounce'
import dedent from 'dedent'
import isMobile from 'is-mobile'
import * as rp from 'rustpython_wasm'

import Settings from './components/Settings'

import 'codemirror/mode/python/python'
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/emacs'
import 'codemirror/keymap/sublime'
import 'codemirror/keymap/vim'

const DEFAULT_SETTINGS = {
  indentUnit: 2,
  keyMap: 'default',
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
const CodeMirror = window.CodeMirror || _CodeMirror

let editorInstance
let splitInstance

export default {
  name: 'App',
  components: {
    Settings,
  },
  data: () => ({
    code: INITIAL_CODE,
    isMd: false,
    output: '',
    settings: DEFAULT_SETTINGS,
    showSettings: false,
  }),
  created() {
    window.addEventListener('resize', debounce(this.initializeSplits, 200))
    window.addEventListener('resize', debounce(this.updateSize, 200))
  },
  mounted() {
    this.fetchSettings()
    this.initializeEditor()
    this.initializeSplits()
    this.updateSize()
    this.run()
  },
  unmounted() {
    window.removeEventListener('resize', debounce(this.initializeSplits, 200))
    window.removeEventListener('resize', debounce(this.updateSize, 200))
  },
  methods: {
    fetchSettings() {
      if (!localStorage.settings) localStorage.settings = JSON.stringify(DEFAULT_SETTINGS)
      this.settings = JSON.parse(localStorage.settings)
    },
    setSetting(key, value) {
      this.settings[key] = value
      localStorage.settings = JSON.stringify(this.settings)
      editorInstance.setOption(key, value)
    },
    initializeEditor() {
      if (editorInstance) editorInstance.destroy()

      editorInstance = CodeMirror.fromTextArea(this.$refs.editor, {
        autofocus: true,
        extraKeys: {
          'Ctrl-R': this.run,
          'Cmd-R': this.run,
          'Shift-Tab': 'indentLess',
          'Ctrl-/': 'toggleComment',
          'Cmd-/': 'toggleComment',
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

      editorInstance.on('change', debounce(editor => {
        this.code = editor.getValue()
        if (this.$emit) {
          this.$emit('input', this.code)
        }
        this.run()
      }, 200))
    },
    initializeSplits() {
      if (splitInstance) splitInstance.destroy()

      splitInstance = Split(['#editor', '#output'], {
        direction: window.innerWidth >= 768 ? 'horizontal' : 'vertical',
        minSize: [400, 400],
        elementStyle: (dimension, size, gutterSize) => {
          return {
            'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
          }
        },
        gutter: (index, direction) => {
          const gutter = document.createElement('div');
          if (direction === 'horizontal') {
            gutter.className = 'px-2 cursor-col-resize z-10'
            gutter.innerHTML = '<div class="w-px h-full bg-gray-800" />'
          } else {
            gutter.className = 'py-2 cursor-row-resize z-10'
            gutter.innerHTML = '<div class="w-full h-px bg-gray-800" />'
          }
          return gutter
        },
      })
    },
    run() {
      let vm = this
      vm.output = ''
      try {
        rp.pyEval(vm.code, { stdout: output => vm.output += output })
      } catch (err) {
        let error = err
        if (err instanceof WebAssembly.RuntimeError) error = window.__RUSTPYTHON_ERROR || err
        vm.output = error
        console.error(error)
      }
    },
    updateSize() {
      this.isMd = window.matchMedia('(min-width: 768px)').matches
    },
    isMobile,
  }
}
</script>
