<template>
  <div class="flex h-screen flex-col">
    <header class="flex items-center justify-between px-4 h-14">
      <h1 class="text-lg font-semibold text-gray-700">
        <a href="/">Py</a>
      </h1>

      <div class="flex items-center justify-end hidden"> <!-- TODO: Remove `hidden` when settings added -->
        <button class="rounded-md border border-transparent w-10 h-10 flex items-center justify-center hover:bg-black focus:bg-black focus:border-gray-800 hover:border-gray-800 text-gray-700 hover:text-gray-400 focus:text-gray-400 focus:outline-none">
          <span class="sr-only">Settings</span>

          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>

    <div class="flex flex-col md:flex-row flex-1 border-t border-gray-800">
      <div class="flex flex-1 flex-shrink-0 flex-col md:flex-row">
        <div id="editor" class="flex flex-col flex-1 -mb-2 pt-2 md:pt-0 md:mb-0 md:-mr-2 md:pl-2">
          <div class="flex-1 flex flex-col relative -mt-2 md:mt-0 md:-ml-2">
            <header class="border-b border-gray-800 flex items-center space-x-2 px-4 py-4">
              <h3 class="text-xs uppercase font-semibold text-gray-700 select-none">Editor</h3>
            </header>

            <div class="flex-1">
              <textarea
                ref="editor"
                v-model="code"
              />
            </div>
          </div>
        </div>

        <div id="output" class="flex flex-col flex-1 -mt-2 pb-2 md:mt-0 md:-ml-2 md:pr-2 md:pb-0">
          <div class="flex flex-1 flex-col -mb-2 md:mb-0 md:-mr-2">
            <header class="border-b border-gray-800 flex items-center justify-between px-4 py-4">
              <h3 class="text-xs uppercase font-semibold text-gray-700 select-none">Output</h3>
            </header>

            <div class="flex-1">
              <textarea
                ref="output"
                class="absolute inset-0 h-full w-full bg-transparent flex-shrink-0 resize-none px-4 pb-4 font-mono focus:outline-none text-gray-400 leading-8"
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
import * as rp from 'rustpython_wasm'

import 'codemirror/mode/python/python'
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/vim'

const INITIAL_CODE = dedent`
  def fib(n):
    n1 = 0
    n2 = 1

    print(f"{n} numbers of Fibonacci sequence:")

    for i in range(n):
      print(f"=> {n1}")
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
  data: () => ({
    code: INITIAL_CODE,
    output: '',
  }),
  created() {
    window.addEventListener('resize', this.initializeSplits)
  },
  mounted() {
    this.initializeEditor()
    this.initializeSplits()
    this.run()
  },
  unmounted() {
    window.removeEventListener('resize', this.initializeSplits)
  },
  methods: {
    initializeEditor() {
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
        indentUnit: 2,
        keyMap: 'vim',
        lineNumbers: true,
        lineWrapping: true,
        mode: 'text/x-python',
        styleActiveLine: true,
        theme: 'custom'
      })

      editorInstance.on('change', debounce(editor => {
        this.code = editor.getValue();
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
        minSize: [250, 250],
        elementStyle: (dimension, size, gutterSize) => {
          return {
            'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
          }
        },
        gutter: (index, direction) => {
          const gutter = document.createElement('div');
          if (direction === 'horizontal') {
            gutter.className = 'px-2 cursor-col-resize z-10'
            gutter.innerHTML = '<div class="h-full w-px bg-gray-800" />'
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
        rp.pyEval(vm.code, {
          stdout: output => {
            vm.output += output;
          }
        })
      } catch (err) {
        let error = err
        if (err instanceof WebAssembly.RuntimeError) {
          error = window.__RUSTPYTHON_ERROR || err
        }

        vm.output = error
        console.error(error)
      }
    }
  }
}
</script>
