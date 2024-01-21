import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { microwikiTheme } from './theme';
import { syntaxTree } from '@codemirror/language';

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

    const tmp = (e: Event) => {
        const alt = (e as MouseEvent).getModifierState("Alt");

        if (alt) {
            const st = syntaxTree(view.state);
            const node = st.resolve(view.state.selection.main.from);

            console.log('Node: ' + node.type.name + ', Parent: ' + node.parent?.type.name); //, node);
        }
    };

    view.dom.addEventListener('click', tmp);

    editorElement.parentNode.insertBefore(view.dom, editorElement);
    editorElement.style.display = 'none';

    if (editorElement.form) {
        editorElement.form.addEventListener("submit", () => {
            editorElement.value = view.state.doc.toString();
        })
    }

    return view;
}
