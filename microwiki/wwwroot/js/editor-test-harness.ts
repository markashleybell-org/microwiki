import { applyFormat, createEditor, EditorFormats, updatePreview } from './components/editor';

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

$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    // console.log(e.target);
    // console.log(e.relatedTarget);

    if (e.target.id == 'preview-tab') {
        const tab = $(e.target);

        const tabContent = $(tab.attr('href'));

        const val = editor.getValue();

        updatePreview(val, tabContent);
    }
})

