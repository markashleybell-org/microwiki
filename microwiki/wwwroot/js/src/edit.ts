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

function getInputByName(parent: HTMLElement, name: string): HTMLInputElement {
    return parent.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

function getInputValueByName(parent: HTMLElement, name: string): string {
    return getInputByName(parent, name).value;
}

// TODO: Refactor modal code
const linkModalElement = document.getElementById('editor-link-modal');
const linkModal = new Modal(linkModalElement);

addDelegatedEventListener(linkModalElement, '.btn-success', 'click', () => {
    const text = getInputValueByName(linkModalElement, 'link-text');
    const url = getInputValueByName(linkModalElement, 'link-url');
    const title = getInputValueByName(linkModalElement, 'link-title');

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
    const textInput = getInputByName(linkModalElement, 'link-text');

    if (textInput.value.trim() !== '') {
        getInputByName(linkModalElement, 'link-url').focus();
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
    const language = (codeBlockModalElement.querySelector('select[name="code-block-language"]') as HTMLInputElement).value;

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
    const url = getInputValueByName(imageModalElement, 'image-url');
    const alt = getInputValueByName(imageModalElement, 'image-alt');

    const data: IHtmlImageProperties = { alt: alt, url: url };

    createImage(editor, data);

    imageModal.hide();
});

addEventListener(imageModalElement, 'shown.bs.modal', e => {
    getInputByName(imageModalElement, 'image-url').focus();
});

addEventListener(imageModalElement, 'hidden.bs.modal', e => {
    editor.focus();
});

function resetLinkModalFields() {
    getInputByName(linkModalElement, 'link-text').value = null;
    getInputByName(linkModalElement, 'link-url').value = null;
    getInputByName(linkModalElement, 'link-title').value = null;
}

function resetImageModalFields() {
    getInputByName(imageModalElement, 'image-alt').value = null;
    getInputByName(imageModalElement, 'image-url').value = null;
}

export function format(key: string) {
    if (key === 'link') {
        resetLinkModalFields();

        const linkData = getLinkData(editor);

        if (linkData) {
            getInputByName(linkModalElement, 'link-text').value = linkData.linkText;
            getInputByName(linkModalElement, 'link-url').value = linkData.href;
            getInputByName(linkModalElement, 'link-title').value = linkData.linkTitle;
        } else {
            getInputByName(linkModalElement, 'link-text').value = editor.getSelection();
        }

        linkModal.show();
    } else if (key === 'image') {
        resetImageModalFields();

        const imageData = getImageData(editor);

        if (imageData) {
            getInputByName(imageModalElement, 'image-alt').value = imageData.alt;
            getInputByName(imageModalElement, 'image-url').value = imageData.url;
        } else {
            getInputByName(imageModalElement, 'image-alt').value = editor.getSelection();
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

    const formatName = e.target.getAttribute('data-format');

    format(formatName);
});

$('a[data-toggle="tab"]').on('show.bs.tab', e => {
    if (e.target.id === 'preview-tab') {
        const tab = e.target.getAttribute('href');

        const tabContent = document.querySelector(tab) as HTMLElement;

        const val = editor.getValue();

        updatePreview(val, tabContent);
    }
});
