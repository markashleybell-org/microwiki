import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

// From https://github.com/lezer-parser/markdown/blob/a5f28b6611b149e3473c226e699c1f0b25239aa5/src/markdown.ts

export enum Type {
    Document = 1,

    CodeBlock,
    FencedCode,
    Blockquote,
    HorizontalRule,
    BulletList,
    OrderedList,
    ListItem,
    ATXHeading1,
    ATXHeading2,
    ATXHeading3,
    ATXHeading4,
    ATXHeading5,
    ATXHeading6,
    SetextHeading1,
    SetextHeading2,
    HTMLBlock,
    LinkReference,
    Paragraph,
    CommentBlock,
    ProcessingInstructionBlock,

    // Inline
    Escape,
    Entity,
    HardBreak,
    Emphasis,
    StrongEmphasis,
    Link,
    Image,
    InlineCode,
    HTMLTag,
    Comment,
    ProcessingInstruction,
    URL,

    // Smaller tokens
    HeaderMark,
    QuoteMark,
    ListMark,
    LinkMark,
    EmphasisMark,
    CodeMark,
    CodeText,
    CodeInfo,
    LinkTitle,
    LinkLabel
}

/* BEGIN Private Interfaces */

interface ICodeMirrorSelection {
    line: number;
    lineText: string;
    start: number;
    end: number;
    selectedText: string;
}

interface IFormattingOperation {
    [key: string]: (cm: EditorView, format: IEditorFormat, data?: any) => void;
    apply: (cm: EditorView, format: IEditorFormat, data?: any) => void;
    remove: (cm: EditorView, format: IEditorFormat, data?: any) => void;
}

interface IFormattingOperations {
    [key: string]: IFormattingOperation;
    inline: IFormattingOperation;
    block: IFormattingOperation;
}

/* END Private Interfaces */

/* BEGIN Public Interfaces */

export interface IEditorFormat {
    type: string;
    token?: string;
    before: string;
    after?: string;
    re?: RegExp;
    placeholder: string;
}

export interface IEditorFormats {
    [key: string]: IEditorFormat;
    h1: IEditorFormat;
    h2: IEditorFormat;
    h3: IEditorFormat;
    bold: IEditorFormat;
    italic: IEditorFormat;
    strikethrough: IEditorFormat;
    code: IEditorFormat;
    ol: IEditorFormat;
    ul: IEditorFormat;
    link: IEditorFormat;
    codeBlock: IEditorFormat;
    image: IEditorFormat;
}

export interface IEditorFormatTokens {
    [key: string]: string;
    'header-1': string;
    'header-2': string;
    'header-3': string;
    strong: string;
    em: string;
    strikethrough: string;
    comment: string;
}

export interface IHtmlLinkProperties {
    linkText: string;
    href: string;
    linkTitle?: string;
}

export interface IHtmlImageProperties {
    alt: string;
    url: string;
}

export interface ICodeBlockProperties {
    language: string;
}

export interface ICursorFormat {
    [key: string]: boolean;
    link: boolean;
    link_label: boolean;
    link_href: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    code: boolean;
    ol: boolean;
    ul: boolean;
}

export interface ICursorState {
    token: CodeMirror.Token;
    format: ICursorFormat;
}

/* END Public Interfaces */

/* BEGIN Private Constants */

const operations: IFormattingOperations = {
    inline: {
        apply: inlineApply,
        remove: inlineRemove
    },
    block: {
        apply: blockApply,
        remove: blockRemove
    }
};

/* END Private Constants */

/* BEGIN Public Constants */

export const EditorFormats: IEditorFormats = {
    h1: { type: 'block', token: 'header-1', before: '#', re: /^#\s+/, placeholder: 'Heading' },
    h2: { type: 'block', token: 'header-2', before: '##', re: /^##\s+/, placeholder: 'Heading' },
    h3: { type: 'block', token: 'header-3', before: '###', re: /^###\s+/, placeholder: 'Heading' },
    bold: { type: 'inline', token: 'strong', before: '**', after: '**', placeholder: 'bold text' },
    italic: { type: 'inline', token: 'em', before: '_', after: '_', placeholder: 'italic text' },
    strikethrough: { type: 'inline', token: 'strikethrough', before: '~~', after: '~~', placeholder: 'deleted text' },
    code: { type: 'inline', token: 'code', before: '`', after: '`', placeholder: 'inline code' },
    ol: { type: 'block', before: '1.', re: /^\d+\.\s+/, placeholder: 'List' },
    ul: { type: 'block', before: '*', re: /^[\*\-]\s+/, placeholder: 'List' },
    link: { type: 'inline', before: '[', after: ')', placeholder: 'link text' },
    codeBlock: { type: 'inline', before: '```{LANG}\n', after: '\n```', placeholder: 'code' },
    image: { type: 'inline', before: '![', after: ')', placeholder: 'image' },
};

export const EditorFormatTokens: IEditorFormatTokens = {
    'header-1': 'h1',
    'header-2': 'h2',
    'header-3': 'h3',
    'strong': 'bold',
    'em': 'italic',
    'strikethrough': 'strikethrough',
    'comment': 'code'
};

/* END Public Constants */

/* BEGIN Private Functions */

function createEmptyCursorState(): ICursorState {
    return {
        token: null,
        format: {
            link: false,
            link_label: false,
            link_href: false,
            h1: false,
            h2: false,
            h3: false,
            bold: false,
            italic: false,
            strikethrough: false,
            code: false,
            ol: false,
            ul: false
        }
    };
}

function getCmSelection(cm: EditorView): ICodeMirrorSelection {
    const start = cm.state.selection.main.from;
    const end = cm.state.selection.main.to;
    const line = cm.state.doc.lineAt(start);

    return {
        line: line.number,
        lineText: line.text,
        start: start,
        end: end,
        selectedText: cm.state.sliceDoc(start, end)
    };
}

function moveCmSelection(cm: EditorView, selection: ICodeMirrorSelection, moveStartBy: number, moveEndBy: number): void {
    setCmSelection(cm, selection, selection.start + moveStartBy, selection.end + moveEndBy);
}

function setCmSelection(cm: EditorView, selection: ICodeMirrorSelection, start: number, end: number): void {
    cm.dispatch({ selection: { anchor: start, head: end } });
}

function replaceCmLine(cm: EditorView, selection: ICodeMirrorSelection, replacement: string): void {
    cm.dispatch(cm.state.replaceSelection(replacement));
}

function findFormattingRange(selection: ICodeMirrorSelection, format: IEditorFormat): [number, number] {
    let startPos = selection.start;

    while (startPos) {
        if (selection.lineText.substr(startPos, format.before.length) === format.before) {
            break;
        }
        startPos--;
    }

    let endPos = selection.end;

    while (endPos <= selection.lineText.length) {
        if (selection.lineText.substr(endPos, format.after.length) === format.after) {
            break;
        }
        endPos++;
    }

    return [startPos, endPos];
}

function getCursorState(cm: EditorView) {
    const pos = cm.state.selection.main.from;
    const cs = createEmptyCursorState();
    //const token = cs.token = cm.state.doc.get(pos);

    //if (!token.type) {
    //    return cs;
    //}

    //const tokens = token.type.split(' ');

    //tokens.forEach(t => {
    //    if (EditorFormatTokens[t]) {
    //        cs.format[EditorFormatTokens[t]] = true;
    //        return;
    //    }
    //    switch (t) {
    //        case 'link':
    //            cs.format.link = true;
    //            cs.format.link_label = true;
    //            break;
    //        case 'string':
    //            cs.format.link = true;
    //            cs.format.link_href = true;
    //            break;
    //        case 'variable-2':
    //            const text = cm.getLine(pos.line);
    //            if (/^\s*\d+\.\s/.test(text)) {
    //                cs.format.ol = true;
    //            } else {
    //                cs.format.ul = true;
    //            }
    //            break;
    //    }
    //});

    return cs;
}

/* END Private Functions */

/* BEGIN Public Functions */

export function inlineApply(cm: EditorView, format: IEditorFormat) {
    const sel = getCmSelection(cm);

    const text = format.before + sel.selectedText + format.after;

    cm.dispatch(cm.state.replaceSelection(text));

    moveCmSelection(cm, sel, format.before.length, format.after.length);

    cm.focus();
}

export function inlineRemove(cm: EditorView, format: IEditorFormat) {
    const sel = getCmSelection(cm);

    const [startPos, endPos] = findFormattingRange(sel, format);

    const start = sel.lineText.slice(0, startPos);
    const mid = sel.lineText.slice(startPos + format.before.length, endPos);
    const end = sel.lineText.slice(endPos + format.after.length);

    replaceCmLine(cm, sel, start + mid + end);

    setCmSelection(cm, sel, start.length, (start + mid).length);

    cm.focus();
}

export function blockApply(cm: EditorView, format: IEditorFormat) {
    const sel = getCmSelection(cm);

    const text = `${format.before} ${(sel.lineText.length ? sel.lineText : format.placeholder)}`;

    replaceCmLine(cm, sel, text);

    setCmSelection(cm, sel, format.before.length + 1, text.length);

    cm.focus();
}

export function blockRemove(cm: EditorView, format: IEditorFormat) {
    const sel = getCmSelection(cm);

    // TODO: Why do this with regex only in this case?
    const text = sel.lineText.replace(format.re, '');

    cm.dispatch({ changes: { from: 0, to: sel.lineText.length + 1, insert: text } });

    setCmSelection(cm, sel, 0, text.length);

    cm.focus();
}

export function linkApply(cm: EditorView, data: IHtmlLinkProperties) {
    const text = '[' + data.linkText + '](' + data.href + (data.linkTitle ? ' "' + data.linkTitle + '"' : '') + ')';

    cm.dispatch(cm.state.replaceSelection(text));

    cm.focus();
}

export function linkRemove(cm: EditorView) {
    const sel = getCmSelection(cm);

    const [startPos, endPos] = findFormattingRange(sel, EditorFormats.link);

    const start = sel.lineText.slice(0, startPos);
    const mid = sel.lineText.slice(startPos, endPos + 1);
    const end = sel.lineText.slice(endPos + 1);

    const linkText = mid.replace(/\[(.*?)\]\(.*?\)/, '$1');

    replaceCmLine(cm, sel, start + linkText + end);

    cm.dispatch({ selection: { anchor: start.length } });

    cm.focus();
}

export function codeBlockApply(cm: EditorView, data: ICodeBlockProperties) {
    const format: IEditorFormat = Object.assign({}, EditorFormats.codeBlock);

    format.before = format.before.replace(/\{LANG\}/gi, data.language);

    inlineApply(cm, format);
}

export function imageApply(cm: EditorView, data: IHtmlImageProperties, appendNewLine: boolean) {
    const text = '![' + (data.alt || '') + '](' + data.url + ')' + (appendNewLine ? '\n' : '');

    cm.dispatch(cm.state.replaceSelection(text));

    cm.focus();
}

export function applyFormat(cm: EditorView, key: string, data?: any) {
    const cs = getCursorState(cm);
    // console.log(cs);
    const st = syntaxTree(cm.state);

    const type = st.resolve(cm.state.selection.main.from).type;

    console.log(type);

    const format = EditorFormats[key];
    operations[format.type][(cs.format[key] ? 'remove' : 'apply')](cm, format, data);
}

export function getLinkData(cm: EditorView): IHtmlLinkProperties {
    const pos = cm.state.selection.main.from;

    let data: IHtmlLinkProperties = null;

    /*
    const token = cm.getTokenAt(pos);

    if (token.type && (token.type.indexOf('link') > -1 || token.type.indexOf('url') > -1)) {
        const startPoint = cm.getCursor('start');
        const endPoint = cm.getCursor('end');
        const line = cm.getLine(startPoint.line);

        let startPos = startPoint.ch;
        while (startPos) {
            startPos--;
            if (line.charAt(startPos) === '[') {
                break;
            }
        }

        let endPos = endPoint.ch;
        while (endPos <= line.length) {
            if (line.charAt(endPos) === ')') {
                break;
            }
            endPos++;
        }

        const linkMarkdown = line.slice(startPos, endPos + 1);

        const linkPattern = /\[(.*?)\]\(([^\s]*)(?:\s+"(.*?)")?\)/m;
        const match = linkPattern.exec(linkMarkdown);

        if (match) {
            // matched text: match[0]
            // match start: match.index
            // capturing group n: match[n]

            data = {
                linkText: match[1],
                href: match[2]
            };

            if (match[3]) {
                data.linkTitle = match[3];
            }
        }

        cm.dispatch({ selection: { anchor: startPos, head: endPos + 1 } });
    }
    */

    return data;
}

export function createLink(cm: EditorView, properties: IHtmlLinkProperties) {
    linkApply(cm, properties);
}

export function removeLink(cm: EditorView) {
    linkRemove(cm);
}

export function createCodeBlock(cm: EditorView, properties: ICodeBlockProperties) {
    codeBlockApply(cm, properties);
}

export function getImageData(cm: EditorView): IHtmlImageProperties {
    const pos = cm.state.selection.main.from;

    let data: IHtmlImageProperties = null;

    /*
    const token = cm.getTokenAt(pos);



    if (token.type && (token.type.indexOf('image') > -1 || token.type.indexOf('url') > -1)) {
        const startPoint = cm.getCursor('start');
        const endPoint = cm.getCursor('end');
        const line = cm.getLine(startPoint.line);

        let startPos = startPoint.ch;
        while (startPos) {
            startPos--;
            if (line.charAt(startPos) === '!') {
                break;
            }
        }

        let endPos = endPoint.ch;
        while (endPos <= line.length) {
            if (line.charAt(endPos) === ')') {
                break;
            }
            endPos++;
        }

        const imageMarkdown = line.slice(startPos, endPos + 1);

        const imagePattern = /!\[([^\s]*)\]\(([^\)]+)\)/m;
        const match = imagePattern.exec(imageMarkdown);

        if (match) {
            // matched text: match[0]
            // match start: match.index
            // capturing group n: match[n]

            data = {
                alt: match[1],
                url: match[2]
            };
        }

        cm.dispatch({ selection: { anchor: startPos, head: endPos + 1 } });
    }
    */

    return data;
}

export function createImage(cm: EditorView, properties: IHtmlImageProperties, appendNewLine: boolean) {
    imageApply(cm, properties, appendNewLine);
}

/* END Public Functions */
