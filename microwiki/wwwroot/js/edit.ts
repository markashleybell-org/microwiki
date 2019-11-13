import bootbox from 'bootbox';
import { TagInput, ITag } from 'mab-bootstrap-taginput';
import { applyFormat, createEditor, updatePreview } from './components/editor';

import 'mab-bootstrap-taginput/css/standard.css';

declare var _ALL_TAGS: string[];

const editorElement = document.getElementById('Body') as HTMLTextAreaElement;

const editor = createEditor(editorElement);

const tagInputElements = document.getElementsByClassName('tag-input');

for (var i = 0; i < tagInputElements.length; i++) {
    new TagInput<string>({
        input: (tagInputElements[i] as HTMLElement),
        data: _ALL_TAGS || [],
        getId: item => item,
        getLabel: item => item,
        newItemFactory: label => Promise.resolve(label)
    });
}

export function format(key: string) {
    if (key == 'link') {
        bootbox.prompt({
            size: 'small',
            title: 'sdgasdgasdg',
            callback: r => {
                console.log(r);
                editor.focus();
                applyFormat(editor, key);
            }
        });
    } else {
        applyFormat(editor, key);
    }
}

$('.cm-format-button').on('click', e => {
    e.preventDefault();

    const formatName = $(e.target).data('format');

    format(formatName);
});

$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    if (e.target.id == 'preview-tab') {
        const tab = $(e.target);

        const tabContent = $(tab.attr('href'));

        const val = editor.getValue();

        updatePreview(val, tabContent);
    }
})

