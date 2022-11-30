import { EditorView, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { microwikiTheme } from './theme';

export function createEditor(editorElement: HTMLTextAreaElement) {
    const view = new EditorView({
        doc: editorElement.value,
        extensions: [
            microwikiTheme,
            history(),
            indentUnit.of('    '),
            keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
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
