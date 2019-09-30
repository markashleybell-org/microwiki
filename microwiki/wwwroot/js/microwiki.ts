import marked from 'marked';

// TODO: Split out editor from main script
import hljs from 'highlight.js/lib/highlight';

import cs from 'highlight.js/lib/languages/cs';
import css from  'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import sql from  'highlight.js/lib/languages/sql';
import xml from  'highlight.js/lib/languages/xml';

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
hljs.registerLanguage('xml', xml);

const supportedLanguages: string[] = hljs.listLanguages();

marked.setOptions({
    highlight: null,
    gfm: false,
    langPrefix: 'language-'
});

function highlightElement(i: number, el: HTMLElement) {
    $(el).addClass('hljs');
    el.innerHTML = hljs.highlightAuto(el.innerText, supportedLanguages).value;
}

function updatePreview() {
    const val = bodyEditor.val() as string;
    preview.html(marked(val));
    preview.find('pre code').each(highlightElement);
}

const bodyEditor = $('#Body-Editor');
const preview = $('.body-preview');

if (bodyEditor.length) {
    // updatePreview();

    bodyEditor.on('change keyup keypress keydown', e => {
        updatePreview();
    });
} else {
    $('pre code').each(highlightElement);
}
