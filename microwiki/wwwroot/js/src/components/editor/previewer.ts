import { Marked } from 'marked';
// import { markedHighlight } from "marked-highlight";
import { highlightElement } from '../highlighter';

// const marked = new Marked(
//     markedHighlight({
//         langPrefix: 'language-',
//         highlight(code, lang, info) {
//             return code;
//         }
//     })
// );

const marked = new Marked();

export async function updatePreview(markdown: string, preview: HTMLElement) {
    preview.innerHTML = await marked.parse(markdown);
    preview.querySelectorAll('pre code').forEach(highlightElement);
}
