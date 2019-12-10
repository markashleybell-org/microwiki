import bsCustomFileInput from 'bs-custom-file-input';

bsCustomFileInput.init();

$('.delete-upload').on('click', e => {
    const message = 'Are you sure you want to delete this file?\n\n'
        + 'Like, REALLY, TOTALLY, COMPLETELY SURE ?\n\n'
        + 'Type YES into the box below and click OK to confirm.\n';
    const result = prompt(message, 'NO');
    return result === 'YES';
});
