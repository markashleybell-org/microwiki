import { TagInput, ITag } from 'mab-bootstrap-taginput';
import { applyFormat, createEditor, createLink, getLinkData, removeLink, updatePreview } from './components/editor';

import 'mab-bootstrap-taginput/css/standard.css';
import { IHtmlLinkProperties } from './components/editor/formatting';

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

const linkModal = $('#modal');

linkModal.modal({
    show: false
});

linkModal.on("click", ".btn-primary", function () {
    const text = linkModal.find('input[name="link-text"]').val() as string;
    const url = linkModal.find('input[name="link-url"]').val() as string;
    const title = linkModal.find('input[name="link-title"]').val() as string;

    const data: IHtmlLinkProperties = { linkText: text, href: url };

    if (title) {
        data.linkTitle = title;
    }

    createLink(editor, data);

    linkModal.modal('hide');
});

linkModal.on("click", ".btn-danger", function () {
    // TODO: Confirm?
    removeLink(editor);

    linkModal.modal('hide');
});

linkModal.on('hidden.bs.modal', e => {
    editor.focus();
});

export function format(key: string) {
    if (key == 'link') {
        const linkData = getLinkData(editor);

        if (linkData) {
            linkModal.find('input[name="link-text"]').val(linkData.linkText);
            linkModal.find('input[name="link-url"]').val(linkData.href);
            linkModal.find('input[name="link-title"]').val(linkData.linkTitle);
        } else {
            linkModal.find('input[name="link-text"]').val(editor.getSelection());
        }

        linkModal.modal('show');
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

