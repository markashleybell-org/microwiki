import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { microwikiTheme } from './theme';
import { syntaxTree } from '@codemirror/language';
import { NodeType } from './formatting';

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

    const tmp = (_: Event) => {
        const st = syntaxTree(view.state);
        const node = st.resolve(view.state.selection.main.from);

        //const t = NodeType.Document;

        //switch (node.type.id) {
        //    case NodeType.Link:
        //        console.log('link');
        //        break;
        //}

        // console.log(node.type.name, node.parent?.type.name); //, node);
    };

    view.dom.addEventListener('click', tmp);
    view.dom.addEventListener('keyup', tmp);

    editorElement.parentNode.insertBefore(view.dom, editorElement);
    editorElement.style.display = 'none';

    if (editorElement.form) {
        editorElement.form.addEventListener("submit", () => {
            editorElement.value = view.state.doc.toString();
        })
    }

    return view;
}
