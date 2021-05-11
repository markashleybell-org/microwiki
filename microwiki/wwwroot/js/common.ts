import Swal from 'sweetalert2';

export function addDelegatedEventListener(selector: HTMLElement | NodeListOf<Element>, childSelector: string, event: string, handler: (e: Event) => void) {
    const delegatedHandler = (e: Event) => {
        if ((e.target as Element).matches(childSelector)) {
            handler(e);
        }
    };

    if (selector instanceof HTMLElement) {
        selector.addEventListener(event, delegatedHandler);
    } else {
        (selector as NodeListOf<Element>).forEach(el => el.addEventListener(event, delegatedHandler));
    }
}

export function addEventListener(selector: HTMLElement | NodeListOf<Element>, event: string, handler: (e: Event) => void): void {
    if (selector instanceof HTMLElement) {
        selector.addEventListener(event, handler);
    } else {
        (selector as NodeListOf<Element>).forEach(el => el.addEventListener(event, handler));
    }
}

export function debounce(callback: (...args: any[]) => void, time: number): () => void {
    let interval: any;

    return (...args: any[]) => {
        clearTimeout(interval);

        interval = setTimeout(() => {
            interval = null;
            callback(...args);
        }, time);
    };
}

export function getDeleteConfirmationMessage(thing: string, name: string) {
    return `<code>${name}</code><br />
<br />
Are you sure you want to delete this ${thing}?<br />
Like, REALLY, TOTALLY, COMPLETELY SURE?<br />
<br />
Type YES below and click DELETE NOW to confirm.`;
}

export function deleteWithConfirmation(form: HTMLFormElement, title: string, getConfirmationMessage: () => string) {
    Swal.fire({
        title: title,
        html: getConfirmationMessage(),
        icon: null,
        input: 'text',
        confirmButtonText: 'DELETE NOW',
        showCancelButton: true,
        buttonsStyling: false,
        reverseButtons: true,
        customClass: {
            icon: 'swal2-icon-small',
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-secondary mr-3'
        },
        inputValidator: (value) => {
            if (value !== 'YES') {
                return 'You must type YES into the box to confirm.'
            }
        }
    }).then(r => {
        if (r.value === 'YES') {
            form.submit();
        }
    });
}
