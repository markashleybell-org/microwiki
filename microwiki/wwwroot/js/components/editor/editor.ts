import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';

export function createEditor(editorElement: HTMLTextAreaElement) {
    const editor = CodeMirror.fromTextArea(editorElement, {
        mode: "gfm",
        theme: "microwiki",
        indentUnit: 4,
        lineWrapping: true
    });

    editor.setSize(null, 600);

    return editor;
}
