

```dataview
TABLE without id
out AS "File ancora da creare", file.link as "File di origine"
FLATTEN file.outlinks as out
WHERE !(out.file) AND !contains(meta(out).path, "/")
SORT out ASC
```

