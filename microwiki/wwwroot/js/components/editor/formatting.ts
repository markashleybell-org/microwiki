import * as CodeMirror from 'codemirror';

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
    code: IEditorFormat;
    ol: IEditorFormat;
    ul: IEditorFormat;
}

export interface IEditorFormatTokens {
    [key: string]: string;
    'header-1': string;
    'header-2': string;
    'header-3': string;
    strong: string;
    em: string;
    comment: string;
}

export const EditorFormats: IEditorFormats = {
    h1: { type: 'block', token: 'header-1', before: '#', re: /^#\s+/, placeholder: 'Heading' },
    h2: { type: 'block', token: 'header-2', before: '##', re: /^##\s+/, placeholder: 'Heading' },
    h3: { type: 'block', token: 'header-3', before: '###', re: /^###\s+/, placeholder: 'Heading' },
    bold: { type: 'inline', token: 'strong', before: '**', after: '**', placeholder: 'bold text' },
    italic: { type: 'inline', token: 'em', before: '_', after: '_', placeholder: 'italic text' },
    code: { type: 'inline', token: 'code', before: '`', after: '`', placeholder: 'inline code' },
    ol: { type: 'block', before: '1. ', re: /^\d+\.\s+/, placeholder: 'List' },
    ul: { type: 'block', before: '* ', re: /^[\*\-]\s+/, placeholder: 'List' }
};

export const EditorFormatTokens: IEditorFormatTokens = {
    'header-1': 'h1',
    'header-2': 'h2',
    'header-3': 'h3',
    'strong': 'bold',
    'em': 'italic',
    'comment': 'code'
};

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
    code: boolean;
    ol: boolean;
    ul: boolean;
}

export interface ICursorState {
    token: CodeMirror.Token;
    format: ICursorFormat;
}

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
            code: false,
            ol: false,
            ul: false
        }
    };
}

export function getCursorState(cm: CodeMirror.Editor) {
    const pos = cm.getCursor('start');
    const cs = createEmptyCursorState();
    const token = cs.token = cm.getTokenAt(pos);
    if (!token.type) {
        return cs;
    }
    const tokens = token.type.split(' ');
    tokens.forEach(t => {
        // console.log(t);
        if (EditorFormatTokens[t]) {
            cs.format[EditorFormatTokens[t]] = true;
            return;
        }
        switch (t) {
            case 'link':
                cs.format.link = true;
                cs.format.link_label = true;
                break;
            case 'string':
                cs.format.link = true;
                cs.format.link_href = true;
                break;
            case 'variable-2':
                const text = cm.getLine(pos.line);
                if (/^\s*\d+\.\s/.test(text)) {
                    cs.format.ol = true;
                } else {
                    cs.format.ul = true;
                }
                break;
        }
    });
    return cs;
}

export function inlineApply(cm: CodeMirror.Editor, format: IEditorFormat) {
    const startPoint = cm.getCursor('start');
    const endPoint = cm.getCursor('end');

    cm.replaceSelection(format.before + cm.getSelection() + format.after);

    startPoint.ch += format.before.length;
    endPoint.ch += format.after.length;
    cm.setSelection(startPoint, endPoint);
    cm.focus();
}

export function inlineRemove(cm: CodeMirror.Editor, format: IEditorFormat) {
    const startPoint = cm.getCursor('start');
    const endPoint = cm.getCursor('end');
    const line = cm.getLine(startPoint.line);

    let startPos = startPoint.ch;
    while (startPos) {
        if (line.substr(startPos, format.before.length) === format.before) {
            break;
        }
        startPos--;
    }

    let endPos = endPoint.ch;
    while (endPos <= line.length) {
        if (line.substr(endPos, format.after.length) === format.after) {
            break;
        }
        endPos++;
    }

    const start = line.slice(0, startPos);
    const mid = line.slice(startPos + format.before.length, endPos);
    const end = line.slice(endPos + format.after.length);
    cm.replaceRange(start + mid + end, { line: startPoint.line, ch: 0 }, { line: startPoint.line, ch: line.length + 1 });
    cm.setSelection({ line: startPoint.line, ch: start.length }, { line: startPoint.line, ch: (start + mid).length });
    cm.focus();
}

export function blockApply(cm: CodeMirror.Editor, format: IEditorFormat) {
    const startPoint = cm.getCursor('start');
    const line = cm.getLine(startPoint.line);
    const text = format.before + ' ' + (line.length ? line : format.placeholder);
    cm.replaceRange(text, { line: startPoint.line, ch: 0 }, { line: startPoint.line, ch: line.length + 1 });
    cm.setSelection({ line: startPoint.line, ch: format.before.length + 1 }, { line: startPoint.line, ch: text.length });
    cm.focus();
}

export function blockRemove(cm: CodeMirror.Editor, format: IEditorFormat) {
    const startPoint = cm.getCursor('start');
    const line = cm.getLine(startPoint.line);
    const text = line.replace(format.re, '');
    cm.replaceRange(text, { line: startPoint.line, ch: 0 }, { line: startPoint.line, ch: line.length + 1 });
    cm.setSelection({ line: startPoint.line, ch: 0 }, { line: startPoint.line, ch: text.length });
    cm.focus();
}

export function linkApply(cm: CodeMirror.Editor, data: IHtmlLinkProperties) {
    cm.replaceSelection('[' + data.linkText + '](' + data.href + (data.linkTitle ? ' "' + data.linkTitle + '"' : '') + ')');
}

export function linkRemove(cm: CodeMirror.Editor) {
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

    const start = line.slice(0, startPos);
    const mid = line.slice(startPos, endPos + 1);
    const end = line.slice(endPos + 1);

    const linkText = mid.replace(/\[(.*?)\]\(.*?\)/, '$1');

    cm.replaceRange(start + linkText + end, { line: startPoint.line, ch: 0 }, { line: startPoint.line, ch: line.length + 1 });
    cm.setSelection({ line: startPoint.line, ch: start.length }, { line: startPoint.line, ch: (start + linkText).length });
}

interface IFormattingOperation {
    [key: string]: (cm: CodeMirror.Editor, format: IEditorFormat, data?: any) => void;
    apply: (cm: CodeMirror.Editor, format: IEditorFormat, data?: any) => void;
    remove: (cm: CodeMirror.Editor, format: IEditorFormat, data?: any) => void;
}

interface IFormattingOperations {
    [key: string]: IFormattingOperation;
    inline: IFormattingOperation;
    block: IFormattingOperation;
}

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

export function applyFormat(cm: CodeMirror.Editor, key: string, data?: any) {
    const cs = getCursorState(cm);
    // console.log(cs);
    const format = EditorFormats[key];
    operations[format.type][(cs.format[key] ? 'remove' : 'apply')](cm, format, data);
}

export interface IHtmlLinkProperties {
    linkText: string;
    href: string;
    linkTitle?: string;
}

export function getLinkData(cm: CodeMirror.Editor): IHtmlLinkProperties {
    const pos = cm.getCursor('start');
    const token = cm.getTokenAt(pos);

    let data: IHtmlLinkProperties = null;

    if (token.type && (token.type === 'link' || token.type.indexOf('url') > -1)) {
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

        cm.setSelection({ line: startPoint.line, ch: startPos }, { line: startPoint.line, ch: endPos + 1 });
    }

    return data;
}

export function createLink(cm: CodeMirror.Editor, properties: IHtmlLinkProperties) {
    linkApply(cm, properties);
}

export function removeLink(cm: CodeMirror.Editor) {
    linkRemove(cm);
}
