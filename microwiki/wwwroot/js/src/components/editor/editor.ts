import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark'

export function createEditor(editorElement: HTMLTextAreaElement) {
    const view = new EditorView({
        doc: editorElement.value,
        extensions: [
            oneDark,
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap]),
            markdown({ base: markdownLanguage }),
        ]
    });

    editorElement.parentNode.insertBefore(view.dom, editorElement);
    editorElement.style.display = 'none';

    if (editorElement.form) {
        editorElement.form.addEventListener("submit", () => {
            editorElement.value = view.state.doc.toString();
        })
    }

    //const editor = CodeMirror.fromTextArea(editorElement, {
    //    mode: 'gfm',
    //    theme: 'microwiki',
    //    indentUnit: 4,
    //    lineWrapping: true
    //});

    //editor.setSize(null, 600);

    //editor.setOption('extraKeys', {
    //    'Tab': 'indentMore',
    //    'Shift-Tab': 'indentLess'
    //});

    return view;
}
