import { Modal, Tab } from 'bootstrap';
import { TagInput } from 'mab-bootstrap-taginput';
import 'mab-bootstrap-taginput/css/standard.css';
import { dom } from './dom';
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

// TODO: Implement DOM.val()?
function getInputByName(parent: Element, name: string): HTMLInputElement {
    return parent.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

function getInputValueByName(parent: Element, name: string): string {
    return getInputByName(parent, name).value;
}

// TODO: Refactor modal code
const linkModalElement = dom('#editor-link-modal');
const linkModal = new Modal(linkModalElement.get(0));

linkModalElement.onchild('.btn-success', 'click', () => {
    // TODO: Implement .val()?
    const text = getInputValueByName(linkModalElement.get(0), 'link-text');
    const url = getInputValueByName(linkModalElement.get(0), 'link-url');
    const title = getInputValueByName(linkModalElement.get(0), 'link-title');

    const data: IHtmlLinkProperties = { linkText: text, href: url };

    if (title) {
        data.linkTitle = title;
    }

    createLink(editor, data);

    linkModal.hide();
});

linkModalElement.onchild('.btn-danger', 'click', () => {
    // TODO: Confirm?
    removeLink(editor);

    linkModal.hide();
});

linkModalElement.on('shown.bs.modal', e => {
    const textInput = getInputByName(linkModalElement.get(0), 'link-text');

    if (textInput.value.trim() !== '') {
        getInputByName(linkModalElement.get(0), 'link-url').focus();
    } else {
        textInput.focus();
    }
});

linkModalElement.on('hidden.bs.modal', e => {
    editor.focus();
});

const codeBlockModalElement = dom('#editor-code-block-modal');
const codeBlockModal = new Modal(codeBlockModalElement.get(0));

codeBlockModalElement.onchild('.btn-success', 'click', () => {
    const language = (codeBlockModalElement.get(0).querySelector('select[name="code-block-language"]') as HTMLInputElement).value;

    const data: ICodeBlockProperties = { language: language };

    createCodeBlock(editor, data);

    codeBlockModal.hide();
});

codeBlockModalElement.on('hidden.bs.modal', e => {
    editor.focus();
});

const imageModalElement = dom('#editor-image-modal');
const imageModal = new Modal(imageModalElement.get(0));

imageModalElement.onchild('.btn-success', 'click', () => {
    const url = getInputValueByName(imageModalElement.get(0), 'image-url');
    const alt = getInputValueByName(imageModalElement.get(0), 'image-alt');

    const data: IHtmlImageProperties = { alt: alt, url: url };

    createImage(editor, data);

    imageModal.hide();
});

imageModalElement.on('shown.bs.modal', e => {
    getInputByName(imageModalElement.get(0), 'image-url').focus();
});

imageModalElement.on('hidden.bs.modal', e => {
    editor.focus();
});

function resetLinkModalFields() {
    getInputByName(linkModalElement.get(0), 'link-text').value = null;
    getInputByName(linkModalElement.get(0), 'link-url').value = null;
    getInputByName(linkModalElement.get(0), 'link-title').value = null;
}

function resetImageModalFields() {
    getInputByName(imageModalElement.get(0), 'image-alt').value = null;
    getInputByName(imageModalElement.get(0), 'image-url').value = null;
}

export function format(key: string) {
    if (key === 'link') {
        resetLinkModalFields();

        const linkData = getLinkData(editor);

        if (linkData) {
            getInputByName(linkModalElement.get(0), 'link-text').value = linkData.linkText;
            getInputByName(linkModalElement.get(0), 'link-url').value = linkData.href;
            getInputByName(linkModalElement.get(0), 'link-title').value = linkData.linkTitle;
        } else {
            getInputByName(linkModalElement.get(0), 'link-text').value = editor.getSelection();
        }

        linkModal.show();
    } else if (key === 'image') {
        resetImageModalFields();

        const imageData = getImageData(editor);

        if (imageData) {
            getInputByName(imageModalElement.get(0), 'image-alt').value = imageData.alt;
            getInputByName(imageModalElement.get(0), 'image-url').value = imageData.url;
        } else {
            getInputByName(imageModalElement.get(0), 'image-alt').value = editor.getSelection();
        }

        imageModal.show();
    } else if (key === 'codeBlock') {
        codeBlockModal.show();
    } else {
        applyFormat(editor, key);
    }
}

dom('.cm-format-button').on('click', e => {
    e.preventDefault();

    const button = e.target as HTMLElement;

    const formatName = button.getAttribute('data-format');

    format(formatName);
});

// TODO: Figure out how to fit this in
const tabElements = [].slice.call(document.querySelectorAll('a[data-toggle="tab"]'));

tabElements.forEach(el => {
    const tab = new Tab(el);

    el.addEventListener('click', (e: Event) => {
        e.preventDefault();
        tab.show();
    })
})

dom('a[data-toggle="tab"]').on('show.bs.tab', e => {
    const tab = e.target as HTMLElement;

    if (tab.id === 'preview-tab') {
        const tabSelector = tab.getAttribute('href');

        const tabContent = document.querySelector(tabSelector) as HTMLElement;

        const val = editor.getValue();

        updatePreview(val, tabContent);
    }
});
