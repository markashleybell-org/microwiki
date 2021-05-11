import { Modal } from 'bootstrap';
import { highlightElement } from './components/highlighter';
import { addEventListener, addDelegatedEventListener, deleteWithConfirmation, getDeleteConfirmationMessage } from './common';

document.querySelectorAll('pre code').forEach(highlightElement);

export const moveDocumentButton = document.getElementById('move-document-button');

export const moveDocumentModalElement = document.getElementById('move-document-modal');
export const moveDocumentModal = new Modal(moveDocumentModalElement);

const deletePageButton = document.querySelectorAll('.delete-page');

addEventListener(moveDocumentButton, 'click', e => {
    e.preventDefault();

    const a = (e.currentTarget as HTMLElement);

    fetch(`/wiki/movedocumentmodal?currentDocumentId=${a.getAttribute('data-id')}&currentDocumentTitle=${a.getAttribute('data-title')}`, { method: 'GET' })
        .then(async response => {
            moveDocumentModalElement.querySelector('.modal-body').innerHTML = await response.text();
            moveDocumentModal.show();
        }).catch(error => {
            // Handle error
        });
});

addDelegatedEventListener(moveDocumentModalElement, 'a.document', 'click', e => {
    e.preventDefault();

    const a = (e.currentTarget as HTMLElement);

    const data: any = {
        id: moveDocumentButton.getAttribute('data-id'),
        newParentID: a.getAttribute('data-id')
    };

    fetch('/wiki/move', { method: 'POST', body: data })
        .then(async response => {
            const result = await response.json();
            window.location.href = result.newLocation;
        }).catch(error => {
            // Handle error
        });
});

addEventListener(deletePageButton, 'click', e => {
    e.preventDefault();

    const button = e.target as HTMLButtonElement;
    const fileName = button.getAttribute('data-pagetitle');

    const getMessage = () => getDeleteConfirmationMessage('page', fileName);

    deleteWithConfirmation(button.form, 'Delete Page', getMessage);
});
