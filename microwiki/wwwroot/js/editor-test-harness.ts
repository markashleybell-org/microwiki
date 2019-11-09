import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';

const editorElement = document.getElementById('Body') as HTMLTextAreaElement;

const editor = CodeMirror.fromTextArea(editorElement, {
    mode: "gfm",
    theme: "microwiki",
    indentUnit: 4,
    lineWrapping: true
});

editor.setSize(null, 600);
