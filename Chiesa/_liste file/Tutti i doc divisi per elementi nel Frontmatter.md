---
creato: 02-05-2025T15:49:08
aggiornato: 09-05-2025_21:54:05
---

<!--  Sono stati inseriti più Dataview di controllo sui documenti presenti in archivio
	per verificare la presenza in ognuno di essi di tutti i TAG-->

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> cssclasses:</div>
> ```dataview
>TABLE file.folder AS "Cartella", cssclasses AS "Classe Css" FROM "" WHERE cssclasses = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> autore-doc:</div>
> ```dataview
>TABLE file.folder AS "Cartella", autore-doc AS "Autore del documento" FROM "" WHERE autore-doc = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> tipo-doc:</div>
> ```dataview
>TABLE file.folder AS "Cartella", tipo-doc AS "Tipo di documento" FROM "" WHERE tipo-doc = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> titolo-doc:</div>
> ```dataview
>TABLE file.folder AS "Cartella", titolo-doc AS "Titolo del documento" FROM "" WHERE titolo-doc = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> anno-doc:</div>
> ```dataview
>TABLE file.folder AS "Cartella", anno-doc AS "Titolo del documento" FROM "" WHERE anno-doc = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info] <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> data-doc:</div>
> ```dataview
>TABLE file.folder AS "Cartella", data-doc AS "Titolo del documento" FROM "" WHERE data-doc = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista")AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info] <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> tag:</div>
> ```dataview
>TABLE file.folder AS "Cartella", tags AS "Titolo del documento" FROM "" WHERE tags = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info] <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> licenza:</div>
> ```dataview
>TABLE file.folder AS "Cartella", Licenza AS "Titolo del documento" FROM "" WHERE Licenza = null AND !startswith(file.name, "_") AND !startswith(file.name, "Lista") AND !startswith(file.path, "_") AND !startswith(file.path, "z_") SORT file.name ASC
>```

> [!info] <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> :</div>
> ```dataview
>
>```

> [!info] <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> :</div>
> ```dataview
>
>```
