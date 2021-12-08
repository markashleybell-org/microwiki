import Dropzone from 'dropzone';
import { Modal, Tab } from 'bootstrap';
import { TagInput } from 'mab-bootstrap-taginput';
import { IFileUploadResponse, tagItemTemplate } from './common';
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
import { DOM, dom } from 'mab-dom';

declare const _ALL_TAGS: string[];

const imageFileExtensions: string[] = ['jpg', 'jpeg', 'gif', 'png', 'webp'];

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
        newItemFactory: label => Promise.resolve(label),
        itemTemplate: tagItemTemplate
    });
}

interface IModalOptions {
    primaryAction: (element: DOM, modal: Modal) => void;
    secondaryAction?: (element: DOM, modal: Modal) => void;
    onShown?: (element: DOM, modal: Modal) => void;
}

function initEditorModal(selector: string, options: IModalOptions): [DOM, Modal] {
    const modalElement = dom(selector);
    const modal = new Modal(modalElement.get(0));

    modalElement.onchild('.btn-success', 'click', () => {
        options.primaryAction(modalElement, modal);
    });

    if (options.secondaryAction) {
        modalElement.onchild('.btn-danger', 'click', () => {
            options.secondaryAction(modalElement, modal);
        });
    }

    modalElement.on('hidden.bs.modal', e => {
        editor.focus();
    });

    return [modalElement, modal];
}

const linkModalOptions: IModalOptions = {
    primaryAction: (el, modal) => {
        const text = el.find('[name=link-text]').val();
        const url = el.find('[name=link-url]').val();
        const title = el.find('[name=link-title]').val();

        const data: IHtmlLinkProperties = { linkText: text, href: url };

        if (title) {
            data.linkTitle = title;
        }

        createLink(editor, data);

        modal.hide();
    },
    secondaryAction: (el, modal) => {
        removeLink(editor);

        modal.hide();
    },
    onShown: (el, modal) => {
        const textInput = el.find('[name=link-text]');

        if (textInput.val().trim() !== '') {
            el.find('[name=link-url]').focus();
        } else {
            textInput.focus();
        }
    }
};

const codeBlockModalOptions: IModalOptions = {
    primaryAction: (el, modal) => {
        const language = el.find('select[name="code-block-language"]').val();

        const data: ICodeBlockProperties = { language: language };

        createCodeBlock(editor, data);

        modal.hide();
    }
};

const imageModalOptions: IModalOptions = {
    primaryAction: (el, modal) => {
        const url = imageModalElement.find('[name=image-url]').val();
        const alt = imageModalElement.find('[name=image-alt]').val();

        const data: IHtmlImageProperties = { alt: alt, url: url };

        createImage(editor, data, false);

        imageModal.hide();
    },
    onShown: (el, modal) => {
        el.find('[name=image-url]').focus();
    }
};

const [linkModalElement, linkModal] = initEditorModal('#editor-link-modal', linkModalOptions);
const [codeBlockModalElement, codeBlockModal] = initEditorModal('#editor-code-block-modal', codeBlockModalOptions);
const [imageModalElement, imageModal] = initEditorModal('#editor-image-modal', imageModalOptions);

function resetLinkModalFields() {
    linkModalElement.find('[name=link-text]').val(null);
    linkModalElement.find('[name=link-url]').val(null);
    linkModalElement.find('[name=link-title]').val(null);
}

function resetImageModalFields() {
    imageModalElement.find('[name=image-alt]').val(null);
    imageModalElement.find('[name=image-url]').val(null);
}

export function format(key: string) {
    if (key === 'link') {
        resetLinkModalFields();

        const linkData = getLinkData(editor);

        if (linkData) {
            linkModalElement.find('[name=link-text]').val(linkData.linkText);
            linkModalElement.find('[name=link-url]').val(linkData.href);
            linkModalElement.find('[name=link-title]').val(linkData.linkTitle);
        } else {
            linkModalElement.find('[name=link-text]').val(editor.getSelection());
        }

        linkModal.show();
    } else if (key === 'image') {
        resetImageModalFields();

        const imageData = getImageData(editor);

        if (imageData) {
            imageModalElement.find('[name=image-alt]').val(imageData.alt);
            imageModalElement.find('[name=image-url]').val(imageData.url);
        } else {
            imageModalElement.find('[name=image-alt]').val(editor.getSelection());
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

const tabs = dom('a[data-toggle="tab"]');

tabs.each(el => {
    const tab = new Tab(el.get());

    el.on('click', e => {
        e.preventDefault();
        tab.show();
    });
});

tabs.on('show.bs.tab', e => {
    const tab = e.target as HTMLElement;

    if (tab.id === 'preview-tab') {
        const tabSelector = tab.getAttribute('href');

        const tabContent = document.querySelector(tabSelector) as HTMLElement;

        const val = editor.getValue();

        updatePreview(val, tabContent);
    }
});

Dropzone.autoDiscover = false;

var zone = new Dropzone('.editor-dropzone', {
    paramName: 'UploadedFile',
    previewTemplate: `
<div class="dz-preview dz-file-preview">
    <div class="progress">
        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
    </div>
</div>`
});

zone.on('success', (file: any, response: IFileUploadResponse) => {
    if (imageFileExtensions.indexOf(response.extension) !== -1) {
        const data: IHtmlImageProperties = {
            alt: 'ALT TAG GOES HERE',
            url: response.url
        };

        createImage(editor, data, true);
    } else {
        const data: IHtmlLinkProperties = {
            linkTitle: 'LINK TITLE GOES HERE',
            linkText: response.filename,
            href: response.url
        };

        createLink(editor, data);
    }

    zone.removeFile(file);

    console.log(file);
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
};
