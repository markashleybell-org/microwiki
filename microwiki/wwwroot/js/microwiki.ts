import { TagInput, ITag } from 'mab-bootstrap-taginput';
import { highlightElement } from './components/highlighter';

import 'mab-bootstrap-taginput/css/standard.css';

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

$('pre code').each(highlightElement);

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
