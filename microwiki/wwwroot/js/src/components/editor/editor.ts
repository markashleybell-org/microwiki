import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { microwikiTheme } from './theme';

export function createEditor(editorElement: HTMLTextAreaElement, formattingKeymap: KeyBinding[]) {
    const keyMaps = [
        ...(defaultKeymap.filter(b => b.key === 'Ctrl-i')),
        ...historyKeymap,
        ...formattingKeymap,
        indentWithTab
    ];

    const view = new EditorView({
        doc: editorElement.value,
        extensions: [
            EditorView.lineWrapping,
            microwikiTheme,
            history(),
            indentUnit.of('    '),
            keymap.of(keyMaps),
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

    return view;
}
