import bsCustomFileInput from 'bs-custom-file-input';
import { addEventListener, deleteWithConfirmation, getDeleteConfirmationMessage } from './common';

bsCustomFileInput.init();

const uploadDeleteButton = document.querySelectorAll('.delete-upload');

addEventListener(uploadDeleteButton, 'click', e => {
    e.preventDefault();

    const button = e.target as HTMLButtonElement;
    const fileName = button.getAttribute('data-filename');

    const getMessage = () => getDeleteConfirmationMessage('file', fileName);

    deleteWithConfirmation(button.form, 'Delete File', getMessage);
});


