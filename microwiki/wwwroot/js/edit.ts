import { Modal } from 'bootstrap';
import { TagInput } from 'mab-bootstrap-taginput';
import 'mab-bootstrap-taginput/css/standard.css';
import { addEventListener, addDelegatedEventListener } from './common';
import {
    applyFormat,
    createCodeBlock,
    createEditor,
    createImage,
    createLink,
    getImageData,
    getLinkData,
    ICodeBlockProperties,
    IHtmlImageProperties,
    IHtmlLinkProperties,
    removeLink,
    updatePreview
} from './components/editor';

declare const _ALL_TAGS: string[];

const editorElement = document.getElementById('Body') as HTMLTextAreaElement;

const editor = createEditor(editorElement);

editor.setOption('extraKeys', {
    'Tab': 'indentMore',
    'Shift-Tab': 'indentLess',
    'Ctrl-B': () => applyFormat(editor, 'bold'),
    'Ctrl-I': () => applyFormat(editor, 'italic'),
    'Home': 'goLineLeft',
    'End': 'goLineRight'
});

const tagInputElements = document.getElementsByClassName('tag-input');

for (const tagInputElement of tagInputElements) {
    const tagInput = new TagInput<string>({
        input: (tagInputElement as HTMLElement),
        data: _ALL_TAGS || [],
        getId: item => item,
        getLabel: item => item,
        newItemFactory: label => Promise.resolve(label)
    });
}

// TODO: Refactor modal code
const linkModalElement = document.getElementById('editor-link-modal');
const linkModal = new Modal(linkModalElement);

addDelegatedEventListener(linkModalElement, '.btn-success', 'click', () => {
    const text = linkModalElement.find('input[name="link-text"]').val() as string;
    const url = linkModalElement.find('input[name="link-url"]').val() as string;
    const title = linkModalElement.find('input[name="link-title"]').val() as string;

    const data: IHtmlLinkProperties = { linkText: text, href: url };

    if (title) {
        data.linkTitle = title;
    }

    createLink(editor, data);

    linkModal.hide();
});

addDelegatedEventListener(linkModalElement, '.btn-danger', 'click', () => {
    // TODO: Confirm?
    removeLink(editor);

    linkModal.hide();
});

addEventListener(linkModalElement, 'shown.bs.modal', e => {
    const textInput = linkModalElement.find('input[name="link-text"]');

    if ((textInput.val() as string).trim() !== '') {
        linkModalElement.find('input[name="link-url"]').focus();
    } else {
        textInput.focus();
    }
});

addEventListener(linkModalElement, 'hidden.bs.modal', e => {
    editor.focus();
});

const codeBlockModalElement = document.getElementById('editor-code-block-modal');
const codeBlockModal = new Modal(codeBlockModalElement);

addDelegatedEventListener(codeBlockModalElement, '.btn-success', 'click', () => {
    const language = codeBlockModalElement.find('select[name="code-block-language"]').val() as string;

    const data: ICodeBlockProperties = { language: language };

    createCodeBlock(editor, data);

    codeBlockModal.hide();
});

addEventListener(codeBlockModalElement, 'hidden.bs.modal', e => {
    editor.focus();
});

const imageModalElement = document.getElementById('editor-image-modal');
const imageModal = new Modal(imageModalElement);

addDelegatedEventListener(imageModalElement, '.btn-success', 'click', () => {
    const url = imageModalElement.find('input[name="image-url"]').val() as string;
    const alt = imageModalElement.find('input[name="image-alt"]').val() as string;

    const data: IHtmlImageProperties = { alt: alt, url: url };

    createImage(editor, data);

    imageModal.hide();
});

addEventListener(imageModalElement, 'shown.bs.modal', e => {
    imageModalElement.find('input[name="image-url"]').focus();
});

addEventListener(imageModalElement, 'hidden.bs.modal', e => {
    editor.focus();
});

function resetLinkModalFields() {
    linkModalElement.find('input[name="link-text"]').val(null);
    linkModalElement.find('input[name="link-url"]').val(null);
    linkModalElement.find('input[name="link-title"]').val(null);
}

function resetImageModalFields() {
    imageModalElement.find('input[name="image-alt"]').val(null);
    imageModalElement.find('input[name="image-url"]').val(null);
}

export function format(key: string) {
    if (key === 'link') {
        resetLinkModalFields();

        const linkData = getLinkData(editor);

        if (linkData) {
            linkModalElement.find('input[name="link-text"]').val(linkData.linkText);
            linkModalElement.find('input[name="link-url"]').val(linkData.href);
            linkModalElement.find('input[name="link-title"]').val(linkData.linkTitle);
        } else {
            linkModalElement.find('input[name="link-text"]').val(editor.getSelection());
        }

        linkModal.show();
    } else if (key === 'image') {
        resetImageModalFields();

        const imageData = getImageData(editor);

        if (imageData) {
            imageModalElement.find('input[name="image-alt"]').val(imageData.alt);
            imageModalElement.find('input[name="image-url"]').val(imageData.url);
        } else {
            imageModalElement.find('input[name="image-alt"]').val(editor.getSelection());
        }

        imageModal.show();
    } else if (key === 'codeBlock') {
        codeBlockModal.show();
    } else {
        applyFormat(editor, key);
    }
}

$('.cm-format-button').on('click', e => {
    e.preventDefault();

    const formatName = $(e.target).data('format');

    format(formatName);
});

$('a[data-toggle="tab"]').on('show.bs.tab', e => {
    if (e.target.id === 'preview-tab') {
        const tab = $(e.target);

        const tabContent = $(tab.attr('href'));

        const val = editor.getValue();

        updatePreview(val, tabContent);
    }
});
