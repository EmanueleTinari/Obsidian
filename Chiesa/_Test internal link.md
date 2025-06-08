<span>not gonna render here: [[internal link]]</span>
^cats

but it will render here: ![[parent file#^cats]]

>[!note]
><span>[[internal link|My rendered text]]</span>

<span class="BibleRef">[[Matteo 01-02|Matteo 1-2]]</span>


<span>
   <p style="text-align: right">
      some text with [[links]] and ~~formatting~~
   </p>
</span>

<a href="my file.md" class="internal-link">my file</a>

<a href="my file.md#^block1" class="internal-link">block name</a>
<a href="BibleRef" class="internal-link">Mt 01,7-11;12-17.21</a>
<a href="full-path-to-your-file.md" class="internal-link">Title</a>

```dataview
page = dv.page(dv.parse(_Test Footnote 01))

link = `<a href="${page.file.path}" class="internal-link">${page.file.name}</a>`
```
