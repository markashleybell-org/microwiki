import Dropzone from 'dropzone';
import { TagInput } from 'mab-bootstrap-taginput';
import 'mab-bootstrap-taginput/css/standard.css';
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
const linkModal = $('#editor-link-modal');

linkModal.modal({
    show: false
});

linkModal.on('click', '.btn-success', () => {
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

linkModal.on('click', '.btn-danger', () => {
    // TODO: Confirm?
    removeLink(editor);

    linkModal.modal('hide');
});

linkModal.on('shown.bs.modal', e => {
    const textInput = linkModal.find('input[name="link-text"]');

    if ((textInput.val() as string).trim() !== '') {
        linkModal.find('input[name="link-url"]').focus();
    } else {
        textInput.focus();
    }
});

linkModal.on('hidden.bs.modal', e => {
    editor.focus();
});

const codeBlockModal = $('#editor-code-block-modal');

codeBlockModal.modal({
    show: false
});

codeBlockModal.on('click', '.btn-success', () => {
    const language = codeBlockModal.find('select[name="code-block-language"]').val() as string;

    const data: ICodeBlockProperties = { language: language };

    createCodeBlock(editor, data);

    codeBlockModal.modal('hide');
});

codeBlockModal.on('hidden.bs.modal', e => {
    editor.focus();
});

const imageModal = $('#editor-image-modal');

imageModal.modal({
    show: false
});

imageModal.on('click', '.btn-success', () => {
    const url = imageModal.find('input[name="image-url"]').val() as string;
    const alt = imageModal.find('input[name="image-alt"]').val() as string;

    const data: IHtmlImageProperties = { alt: alt, url: url };

    createImage(editor, data);

    imageModal.modal('hide');
});

imageModal.on('shown.bs.modal', e => {
    imageModal.find('input[name="image-url"]').focus();
});

imageModal.on('hidden.bs.modal', e => {
    editor.focus();
});

function resetLinkModalFields() {
    linkModal.find('input[name="link-text"]').val(null);
    linkModal.find('input[name="link-url"]').val(null);
    linkModal.find('input[name="link-title"]').val(null);
}

function resetImageModalFields() {
    imageModal.find('input[name="image-alt"]').val(null);
    imageModal.find('input[name="image-url"]').val(null);
}

export function format(key: string) {
    if (key === 'link') {
        resetLinkModalFields();

        const linkData = getLinkData(editor);

        if (linkData) {
            linkModal.find('input[name="link-text"]').val(linkData.linkText);
            linkModal.find('input[name="link-url"]').val(linkData.href);
            linkModal.find('input[name="link-title"]').val(linkData.linkTitle);
        } else {
            linkModal.find('input[name="link-text"]').val(editor.getSelection());
        }

        linkModal.modal('show');
    } else if (key === 'image') {
        resetImageModalFields();

        const imageData = getImageData(editor);

        if (imageData) {
            imageModal.find('input[name="image-alt"]').val(imageData.alt);
            imageModal.find('input[name="image-url"]').val(imageData.url);
        } else {
            imageModal.find('input[name="image-alt"]').val(editor.getSelection());
        }

        imageModal.modal('show');
    } else if (key === 'codeBlock') {
        codeBlockModal.modal('show');
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

Dropzone.autoDiscover = false;

var zone = new Dropzone('.editor-dropzone', {
    paramName: 'UploadedFile',
    previewTemplate: '<div class="dz-preview dz-file-preview"></div>'
});

zone.on('success', (file: any, response: any) => {
    const data: IHtmlImageProperties = { alt: null, url: response.uploadedFileName };

    createImage(editor, data);
});

editor.on('drop', function (data, e) {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        const file = files[0] as Dropzone.DropzoneFile;
        zone.addFile(file);
    }
});

document.onpaste = function (event) {
    var items = event.clipboardData.items;

    for (let k in items) {
        var item = items[k];
        if (item.kind === 'file') {
            var tmp = item.getAsFile() as Dropzone.DropzoneFile;
            zone.addFile(tmp);
        }
    }
}
