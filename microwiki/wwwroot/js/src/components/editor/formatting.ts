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

export type FormatValidator = (editor: EditorView, node: SyntaxNode) => boolean;

const noopValidator: FormatValidator = () => true;

export const Formatter: Record<Format, FormatValidator> = {
    bold: (editor, node) => {
        if (editor.state.selection.main.empty
            || node.type.id === NodeType.URL) {
            return false;
        }

        const changes: ChangeSpec[] = [];

        console.log(node.type);

        if (node.type.id === NodeType.StrongEmphasis) {
            changes.push({ from: node.from, to: node.from + 2, insert: '' });
            changes.push({ from: node.to - 2, to: node.to, insert: '' });

            // changes.push(editor.state.replaceSelection(t2));


            console.log(changes);

            editor.dispatch({
                changes
            });

            return true;
        }

        // editor.dispatch(editor.state.replaceSelection(text));
        return true;
    },
    italic: noopValidator,
    strikethrough: noopValidator,
    code: noopValidator,
    codeBlock: noopValidator,
    h2: noopValidator,
    h3: noopValidator,
    ul: noopValidator,
    ol: noopValidator,
    link: noopValidator,
    image: noopValidator,
}
