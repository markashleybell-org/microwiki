import { applyFormat, createEditor, EditorFormats } from './components/editor';

const editorElement = document.getElementById('Body') as HTMLTextAreaElement;

export const editor = createEditor(editorElement);

export { EditorFormats };

export function format(key: string) {
    applyFormat(editor, key);
}

$('.cm-format-button').on('click', e => {
    e.preventDefault();

    const formatName = $(e.target).data('format');

    format(formatName);
});


