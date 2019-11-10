import marked from 'marked';
import { highlightElement } from '../highlighter';

marked.setOptions({
    highlight: null,
    langPrefix: 'language-'
});

export function updatePreview(markdown: string, preview: JQuery) {
    preview.html(marked(markdown));
    preview.find('pre code').each(highlightElement);
}
