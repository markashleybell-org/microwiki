## Line Breaks

Paragraphs are automatic. If you want a *single* line break (`<br />`), end the line with two spaces.

---

## Horizontal Rules

Add three or more hyphens to insert a horizontal rule.

<!-- language: none -->

    ---

---

## Bold and Italic

Surround text with single asterisks or underscores to italicise, double to make bold:

<!-- language: none -->

    *This is italicized*, and so is _this_.
    **This is bold**, and so is __this__.
    Use ***italics and bold together*** if you ___have to___.

Result:

*This is italicized*, and so is _this_.  
**This is bold**, and so is __this__.  
Use ***italics and bold together*** if you ___have to___.
    
---

## Links

Any of these will work:

<!-- language: none -->

    Here's an inline link to [Google](http://www.google.com/).
    Here's a reference-style link to [Google][1].
    Here's a very readable link to [Yahoo!][yahoo].

      [1]: http://www.google.com/
      [yahoo]: http://www.yahoo.com/

Result:

Here's an inline link to [Google](http://www.google.com/).  
Here's a reference-style link to [Google][1].  
Here's a very readable link to [Yahoo!][yahoo].

  [1]: http://www.google.com/
  [yahoo]: http://www.yahoo.com/

---

## Bulleted List:

<!-- language: none -->

    - Use a minus sign for a bullet
    + Or plus sign
    * Or an asterisk

Result:

- Use a minus sign for a bullet
+ Or plus sign
* Or an asterisk

---

## Numbered List:

<!-- language: none -->

    1. Numbered lists are easy
    2. Markdown keeps track of the numbers for you
    7. So this will be item 3.

Result:

1. Numbered lists are easy
2. Markdown keeps track of the numbers for you
7. So this will be item 3.

---

## Images

Images are exactly like links, but they have an exclamation point in front of them and the text is the `ALT` text:

<!-- language: none -->

    ![Valid XHTML](http://w3.org/Icons/valid-xhtml10)

Result:

![Valid XHTML](http://w3.org/Icons/valid-xhtml10)

---

## Code

Indent code snippets with four spaces and they will be automatically highlighted. It's probably best to do this in an editor and paste the whole thing in:

<!-- language: none -->

        function test() {
             alert('This is some JavaScript');
        }

Result:
  
<!-- language: js -->

    function test() {
         alert('This is some JavaScript');
    }

Most languages (e.g. C# or JavaScript) will be automatically highlighted. If you need to force a particular language, add a comment before the code block:

<!-- language: none -->

    <!-- language: sql -->

    SELECT * FROM Table WHERE ID = 11

Result:

<!-- language: lang-sql -->

    SELECT * FROM [tTable] WHERE ID = 11

Supported languages so far are `sql`, `css` and `none` (if you want plain grey monospaced text without the syntax highlighting).

You can also insert inline code snippets by surrounding text with backticks:

<!-- language: none -->

    This text will contain a `<html>` tag.

This text will contain a `<html>` tag.