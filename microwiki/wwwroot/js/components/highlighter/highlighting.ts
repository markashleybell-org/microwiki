import hljs from 'highlight.js/lib/highlight';

import cs from 'highlight.js/lib/languages/cs';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import powershell from 'highlight.js/lib/languages/powershell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('cs', cs);
hljs.registerLanguage('css', css);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('ps', powershell);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('xml', xml);

const supportedLanguages: string[] = hljs.listLanguages();

export function highlightElement(i: number, el: HTMLElement) {
    const code = $(el);
    code.addClass('hljs');
    if (code.is('[class^=language]')) {
        el.innerHTML = hljs.highlightAuto(el.innerText, supportedLanguages).value;
    }
}
