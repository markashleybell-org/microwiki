import marked from 'marked';
import { TagInput, ITag } from 'mab-bootstrap-taginput';

import 'mab-bootstrap-taginput/css/standard.css';

import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';

const editorElement = document.getElementById('Body') as HTMLTextAreaElement;

const editor = CodeMirror.fromTextArea(editorElement, {
    mode: "gfm",
    theme: "monokai",
    indentUnit: 4,
    lineWrapping: true
});

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

interface IEditorSelection {
    start: number;
    end: number;
}

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

let selection: IEditorSelection = {
    start: 0,
    end: 0
};

const bodyEditorElement = $('.body-editor-editor').get(0) as HTMLTextAreaElement;

function getEditorSelection() {
    selection.start = bodyEditorElement.selectionStart;
    selection.end = bodyEditorElement.selectionEnd;
    console.log('getEditorSelection', selection);
}

function selectionExists() {
    return selection.start != null && selection.start > -1 && selection.end != null && selection.end > -1;
}

function setEditorSelection() {
    console.log('setEditorSelection', selection);
    // We have to use null checking rather than falsy, because 0 is falsy, 
    // but the selection start/end positions could both quite legitimately be 0...
    if (selectionExists()) {
        bodyEditorElement.setSelectionRange(selection.start, selection.end);
    }
}

function toggleFormatting(formatting: [string, string, boolean]) {
    const [before, after, canBeToggled] = formatting;

    const start = bodyEditorElement.selectionStart;
    const end = bodyEditorElement.selectionEnd;
    const value = bodyEditorElement.value;

    let contentBeforeSelection = value.slice(0, start);
    const selectedText = value.slice(start, end);
    let contentAfterSelection = value.slice(end, value.length);

    let updatedContent: string;

    const charsBeforeSelection = contentBeforeSelection.slice(contentBeforeSelection.length - before.length);
    const charsAfterSelection = contentAfterSelection.slice(0, after.length);

    // If this text is already surrounded by the same formatting chars, remove them
    if (canBeToggled && charsBeforeSelection === before && charsAfterSelection === after) {
        updatedContent = contentBeforeSelection.slice(0, contentBeforeSelection.length - before.length)
            + selectedText
            + contentAfterSelection.slice(after.length, contentAfterSelection.length);

        selection.start -= before.length;
        selection.end -= before.length;
    } else {
        updatedContent = contentBeforeSelection
            + before
            + selectedText
            + after
            + contentAfterSelection;

        selection.start += before.length;
        selection.end += before.length;
    }

    bodyEditorElement.value = updatedContent;

    setEditorSelection();
}

$('.body-editor-editor').on('select', getEditorSelection).on('blur', e => {
    if (e.relatedTarget) {
        const elementBeingFocused = e.relatedTarget as HTMLElement;
        const formattingButtonWasClicked = elementBeingFocused.classList.contains('body-editor-button');
        if (!formattingButtonWasClicked) {
            selection.start = null;
            selection.end = null;
        }
    }
    console.log('editor onBlur', selection);
});

function getFormatting(action: 'bold' | 'italic' | 'code-inline'): [string, string, boolean] {
    switch (action) {
        case 'bold':
            return ['**', '**', true];
        case 'italic':
            return ['*', '*', true];
        case 'code-inline':
            return ['`', '`', true];
    }
}

$('.body-editor-button')
    .on('click', e => {
        e.preventDefault();
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText
        const action = $(e.target).data('action');
        
        if (selectionExists()) {
            bodyEditor.focus();
            setEditorSelection();
            if (action === 'code-block') {
                // TODO: Try and detect the language
                toggleFormatting(['```\n', '\n```', false]);
            } else if (action === 'convert-code-block') {
                const lines = bodyEditorElement.value
                    .slice(selection.start, selection.end)
                    .split('\n')
                    .map(line => line.substring(4))
                    .join('\n');
                bodyEditorElement.setRangeText('```\n' + lines + '\n```');
            } else {
                toggleFormatting(getFormatting(action));
            }
            console.log('editor button onClick', selection);
            updatePreview(preview.get(0).scrollTop);
        }
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
