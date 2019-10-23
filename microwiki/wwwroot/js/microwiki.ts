import marked from 'marked';
import { TagInput, ITag } from 'mab-bootstrap-taginput';

import 'mab-bootstrap-taginput/css/standard.css';

// TODO: Split out editor from main script
import hljs from 'highlight.js/lib/highlight';

import cs from 'highlight.js/lib/languages/cs';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

declare var _ALL_TAGS: string[];
declare var _ALL_TAGS_MERGE: ITag[];

export const moveDocumentButton = $('#move-document-button');
export const moveDocumentModal = $('#move-document-modal');

moveDocumentModal.modal({ show: false });

moveDocumentButton.on('click', e => {
    e.preventDefault();

    const a = $(e.currentTarget);

    const data: any = {
        currentDocumentId: a.data('id'),
        currentDocumentTitle: a.data('title')
    }

    $.ajax({
        url: '/wiki/movedocumentmodal',
        data: data,
        dataType: 'html',
        type: 'GET',
        cache: false,
        success: html => {
            moveDocumentModal.html(html);
            moveDocumentModal.modal('show');
        }
    });
});

moveDocumentModal.on('click', 'a.document', e => {
    e.preventDefault();

    var a = $(e.currentTarget);

    var data: any = {
        id: moveDocumentButton.data('id'),
        newParentID: a.data('id')
    };

    $.ajax({
        url: '/wiki/move',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: data => { window.location.href = data.newLocation; }
    });
});

hljs.registerLanguage('cs', cs);
hljs.registerLanguage('css', css);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('plain', plaintext);
hljs.registerLanguage('ps', powershell);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('xml', xml);

const supportedLanguages: string[] = hljs.listLanguages();

marked.setOptions({
    highlight: null,
    langPrefix: 'language-'
});

function highlightElement(i: number, el: HTMLElement) {
    const code = $(el);
    code.addClass('hljs');
    if (code.is('[class^=language]')) {
        el.innerHTML = hljs.highlightAuto(el.innerText, supportedLanguages).value;
    }
}

function debounce(callback: (...args: any[]) => void, time: number): () => void {
    let interval: any;

    return (...args: any[]) => {
        clearTimeout(interval);

        interval = setTimeout(() => {
            interval = null;
            callback(...args);
        }, time);
    };
}

const bodyInput = $('[name=Body]');
const bodyEditor = $('.body-editor-editor');
const preview = $('.body-preview');

const updateInterval = 500;

function updatePreview(scrollPosition: number) {
    const val = bodyEditor.val() as string;
    preview.html(marked(val));
    preview.find('pre code').each(highlightElement);

    setTimeout(() => {
        console.log(scrollPosition);
        preview.get(0).scrollTo(0, scrollPosition);
    }, 10);
}

if (bodyEditor.length) {
    bodyEditor.on('change keyup', debounce(e => {
        updatePreview(preview.get(0).scrollTop);
    }, updateInterval));
} else {
    $('pre code').each(highlightElement);
}

const bodyEditorModal = $('.body-editor-modal').modal({ show: false });

bodyEditorModal.on('click', '.btn-success', e => {
    bodyInput.val(bodyEditor.val());
    bodyEditorModal.modal('hide');
});

$('.body-editor-open').on('click', e => {
    bodyEditorModal.modal('show');
    bodyEditor.val(bodyInput.val());
    updatePreview(0);
});

$('.delete-page').on('click', e => {
    const result = prompt('Are you sure you want to delete this page and all of its ancestors?\n\nLike, REALLY, TOTALLY, COMPLETELY SURE?\n\nType YES into the box below and click OK to confirm.\n', 'NO');
    return result === 'YES';
});

$('.delete-upload').on('click', e => {
    const result = prompt('Are you sure you want to delete this file?\n\nLike, REALLY, TOTALLY, COMPLETELY SURE?\n\nType YES into the box below and click OK to confirm.\n', 'NO');
    return result === 'YES';
});

$('.custom-file-input').on('change', e => {
    const input = $(e.target);
    const fileName = (input.val() as string).split('\\').pop();
    input.siblings('.custom-file-label').addClass('selected').html(fileName);
});

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

const tagMergeInputElements = document.getElementsByClassName('tag-input-merge');

for (var i = 0; i < tagMergeInputElements.length; i++) {
    new TagInput<ITag>({
        input: (tagMergeInputElements[i] as HTMLElement),
        data: _ALL_TAGS_MERGE || [],
        getId: item => item.id,
        getLabel: item => item.label,
        allowNewTags: false
    });
}
