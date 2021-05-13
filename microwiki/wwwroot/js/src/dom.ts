export function dom(selector: string) {
    return new DOM(selector);
}

class DOM {
    private el: Element[];

    constructor(public selectorOrElement: string | Element | NodeListOf<Element>) {
        if (typeof selectorOrElement === 'string') {
            this.el = [].slice.call(document.querySelectorAll(selectorOrElement as string));
        } else if (selectorOrElement instanceof Element) {
            this.el = [selectorOrElement as Element];
        } else {
            this.el = [].slice.call(selectorOrElement as NodeListOf<Element>);
        }
    }

    public onchild(childSelector: string, event: string, handler: (e: Event) => void): void {
        if (!this.el) {
            return;
        }

        const delegatedHandler = (e: Event) => {
            if ((e.target as Element).matches(childSelector)) {
                handler(e);
            }
        };

        this.el.forEach(el => el.addEventListener(event, delegatedHandler));
    }

    public on(event: string, handler: (e: Event) => void): void {
        if (!this.el) {
            return;
        }

        this.el.forEach(el => el.addEventListener(event, handler));
    }

    public data(key: string): string {
        return this.el.map(el => el.getAttribute('data-' + key)).join();
    }

    public get(index: number): Element {
        return this.el[index];
    }
}
