import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { SyntaxNode } from "@lezer/common"
import { ChangeSpec, Transaction, TransactionSpec } from '@codemirror/state'

// From https://github.com/lezer-parser/markdown/blob/a5f28b6611b149e3473c226e699c1f0b25239aa5/src/markdown.ts
export enum NodeType {
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
    LinkLabel,

    // Extensions
    StrikeThrough = 51
}

export enum FormattingType {
    Inline,
    Block
}

export type Format =
    | "bold"
    | "italic"
    | "strikethrough"
    | "code"
    | "codeBlock"
    | "h2"
    | "h3"
    | "ul"
    | "ol"
    | "link"
    | "image"

export const NodeTypeForFormat: Record<Format, NodeType> = {
    bold: NodeType.StrongEmphasis,
    italic: NodeType.Emphasis,
    strikethrough: NodeType.StrikeThrough,
    code: NodeType.InlineCode,
    codeBlock: NodeType.CodeBlock,
    h2: NodeType.ATXHeading2,
    h3: NodeType.ATXHeading3,
    ul: NodeType.BulletList,
    ol: NodeType.OrderedList,
    link: NodeType.Link,
    image: NodeType.Image,
}

export type Formatter = (editor: EditorView, node: SyntaxNode) => boolean;
export type FormatGuard = (editor: EditorView, node: SyntaxNode) => boolean;

const noopFormatter: Formatter = () => true;
const noopFormatGuard: FormatGuard = () => true;

interface MarkupSpecification {
    nodeType: NodeType;
    beforeContentMarkup: string;
    afterContentMarkup: string;
    placeholderContent?: string;
}

function createFormatter(guard: FormatGuard, spec: MarkupSpecification): Formatter {
    return (editor, node) => {
        if (guard(editor, node)) {
            return false;
        }

        const changes: ChangeSpec[] = [];
        const sel = editor.state.selection.main;

        if (node.type.id === spec.nodeType) {
            changes.push({ from: node.from, to: node.from + spec.beforeContentMarkup.length, insert: '' });
            changes.push({ from: node.to - spec.afterContentMarkup.length, to: node.to, insert: '' });
        } else {
            changes.push({ from: sel.from, insert: spec.beforeContentMarkup });
            changes.push({ from: sel.to, insert: spec.afterContentMarkup });
        }

        console.log(node.type);
        // console.log(changes);

        editor.dispatch({
            changes
        });

        return true;
    };
}

function createGuard(...disallow: NodeType[]): FormatGuard {
    return (e, n) => e.state.selection.main.empty || disallow.indexOf(n.type.id) !== -1;
}

const standardInlineGuard = createGuard(NodeType.URL, NodeType.Image, NodeType.CodeText, NodeType.InlineCode);

function createHeadingGuard(headingNodeType: NodeType): FormatGuard {
    const headingTypes = [
        NodeType.ATXHeading1,
        NodeType.ATXHeading2,
        NodeType.ATXHeading3,
        NodeType.ATXHeading4,
        NodeType.ATXHeading5,
        NodeType.ATXHeading6
    ].filter(t => t !== headingNodeType);

    return (e, n) => standardInlineGuard(e, n) || n.type.id === NodeType.Paragraph || headingTypes.indexOf(n.type.id) !== -1;
}

const boldSpec = { nodeType: NodeType.StrongEmphasis, beforeContentMarkup: '**', afterContentMarkup: '**' };
const italicSpec = { nodeType: NodeType.Emphasis, beforeContentMarkup: '_', afterContentMarkup: '_' };
const strikeThroughSpec = { nodeType: NodeType.StrikeThrough, beforeContentMarkup: '~~', afterContentMarkup: '~~' };
const h2Spec = { nodeType: NodeType.ATXHeading2, beforeContentMarkup: '## ', afterContentMarkup: '' };
const h3Spec = { nodeType: NodeType.ATXHeading3, beforeContentMarkup: '### ', afterContentMarkup: '' };

export const Formatter: Record<Format, Formatter> = {
    bold: createFormatter(standardInlineGuard, boldSpec),
    italic: createFormatter(standardInlineGuard, italicSpec),
    strikethrough: createFormatter(standardInlineGuard, strikeThroughSpec),
    code: noopFormatter,
    codeBlock: noopFormatter,
    h2: createFormatter(createHeadingGuard(NodeType.ATXHeading2), h2Spec),
    h3: createFormatter(createHeadingGuard(NodeType.ATXHeading3), h3Spec),
    ul: noopFormatter,
    ol: noopFormatter,
    link: noopFormatter,
    image: noopFormatter,
}
