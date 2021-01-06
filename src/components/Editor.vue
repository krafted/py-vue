<template>
  <div
    ref="editorContainer"
    class="flex-1 ml-safe-left"
    :style="{
      fontSize: `${app.settings.fontSize}px`,
      lineHeight: `${app.settings.lineHeight}rem`,
    }"
  />
</template>

<script>
import { inject, onMounted, ref } from 'vue'
import debounce from 'debounce'
import CodeMirror from 'codemirror'

import 'codemirror/mode/python/python'
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/emacs'
import 'codemirror/keymap/sublime'
import 'codemirror/keymap/vim'

export default {
  setup() {
    const app = inject('app')
    const editorContainer = ref(null)
    const editor = inject('editor')
    const content = inject('content')
    const isMobile = inject('isMobile')
    const showSettings = inject('showSettings')
    const run = inject('run')

    onMounted(() => {
      editor.value = CodeMirror(editorContainer.value, {
        autofocus: true,
        extraKeys: {
          'Shift-Tab': 'indentLess',
          'Cmd-/': 'toggleComment',
          'Ctrl-/': 'toggleComment',
          'Cmd-,': () => showSettings.value = true,
          'Ctrl-,': () => showSettings.value = true,
          Tab: editor => {
            var spaces = Array(editor.getOption('indentUnit') + 1).join(' ')
            editor.replaceSelection(spaces)
          }
        },
        gutters: ["CodeMirror-linenumbers"],
        indentUnit: parseInt(app.settings.indentUnit),
        keyMap: isMobile.value ? 'default' : app.settings.keyMap,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'text/x-python',
        styleActiveLine: true,
        theme: 'custom',
        value: content.value,
      })

      editor.value.on('change', debounce(e => {
        content.value = e.getValue()
        run()
      }))
    })

    return {
      app,
      editorContainer,
    }
  }
}
</script>
