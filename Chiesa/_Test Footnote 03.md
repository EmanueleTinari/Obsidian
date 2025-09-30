# Footnote How-To
## Method 1
The standard syntax for a footnote[^fn1] indicator in Markdown is ``[^fn1]``. The footnote resides in the same document as the primary text. YoÙll likely wish to put these at the end of the document. Preface each footnote with similar code, but with a terminal colon, e.g.:  ``[^fn1]:``

In Read mode[^fn3], these placeholders will be replaced with sequential numbers from 1, no matter what numbers you actually use. This makes it impossible to have numbering continue from one document to the next.

## Method 2
However, there are other methods one can use in Obsidian, thanks to extended syntax that goes beyond standard Markdown. For example, one can link to a footnote [\[1\]](Footnotes#^fn-footnote) in a document using a block ID with this code: ``[\[1\]](Footnotes#^fn-footnote)``

Note that the square brackets must be escaped with a backslash in order to appear literally. In Read mode this appears as a nice floating window. The advantage here is that the anchor text can be anything you wish.

Well, almost. Oddly, I can't get a superscript to work[\[^1\]](Footnotes#^fn-footnote). The caret just appears, whether escaped or not. Try this code: ``[\[^1\]](Footnotes#^fn-footnote)``

## Method 3
 You can also use transclusion to insert arbitrary blocks of text into the primary document, from the second document. Try this code: ``![[Footnotes#^fn-transclusion]]``.

![[Footnotes#^fn-transclusion]]

### Footnotes
[^fn1]: This is a standard Markdown footnote.
[^fn3]: And this is another content-free footnote.