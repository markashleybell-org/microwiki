import { highlightElement } from './components/highlighter';
import { deleteWithConfirmation, getDeleteConfirmationMessage } from './common';

$('pre code').each(highlightElement);

export const moveDocumentButton = $('#move-document-button');
export const moveDocumentModal = $('#move-document-modal');

moveDocumentModal.modal({ show: false });

moveDocumentButton.on('click', e => {
    e.preventDefault();

    const a = $(e.currentTarget);

    const data: any = {
        currentDocumentId: a.data('id'),
        currentDocumentTitle: a.data('title')
    };

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

    const a = $(e.currentTarget);

    const data: any = {
        id: moveDocumentButton.data('id'),
        newParentID: a.data('id')
    };

    $.ajax({
        url: '/wiki/move',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: response => { window.location.href = response.newLocation; }
    });
});

$('.delete-page').on('click', e => {
    e.preventDefault();

    const button = e.target as HTMLButtonElement;
    const fileName = button.getAttribute('data-pagetitle');

    const getMessage = () => getDeleteConfirmationMessage('page', fileName);

    deleteWithConfirmation(button.form, 'Delete Page', getMessage);
});

$('.custom-file-input').on('change', e => {
    const input = $(e.target);
    const fileName = (input.val() as string).split('\\').pop();
    input.siblings('.custom-file-label').addClass('selected').html(fileName);
});
