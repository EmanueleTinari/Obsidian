
```dataviewjs
dv.table(["✓", "File", "mtime", "ctime", "tags", "folder"], dv.pages("#Altri_documenti")
  .sort(b => b.file.mtime, "desc")
  .map(b => ["<input type='checkbox' checked>", b.file.link, b.file.mtime, b.file.ctime, b.tags, b.file.folder]))
```

