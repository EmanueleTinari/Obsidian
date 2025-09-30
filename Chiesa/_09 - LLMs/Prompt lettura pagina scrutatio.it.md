---
creato: 2025/09/21 16:36:34
modificato: 2025/09/21 16:36:34
---
Leggi la pagina internet all'indirizzo: "https://www.scrutatio.it/bibbia/lettura/it/martini/72/1"
Componi un markdown.md, separato in due parti, per usarli attraverso il programma ObsidianMD:
PRIMA PARTE:
è tutta la parte ad inizio capitolo in grassetto; mettila all'inizio ma senza Header né grassetto. Ci penserò io successivamente a creare un'introduzione per ogni capitolo;
SECONDA PARTE:
\n
Header 1: {Nome libro in Italiano + numero capitolo "Esempio: Genesi 1"}\n
\n
{***}\n
\n
Header 6: {numero versetto "Esempio 1"}\n
{<span class=vrs>numero versetto "Esempio 1"</span>}Testo del versetto. Se presente per questo versetto una nota a piè di pagina, quello che segue è il link interno:  [^ftn_MRT_gn1,1] dove gn è l'abbreviazione del Libro e 1,1 è capitolo,versetto; a piè pagina avremo la nota [^ftn_MRT_gn1,1]: + testo della nota.
Il separatore dopo l'ultimo versetto e la prima nota a piè pagina è il seguente:
\n
{***}\n
\n
\n
\n
{***}\n
\n
NOTE\n
\n
Vi sono anche nel codice HTML della pagina dei button con class="btn btn-link btn-sm"; essi contengono un link e un testo: ad esempio alla fine di Genesi 1,1 c'è un button con testo "Sir 17,3-4". Tutti questi riferimenti incrociati li mettiamo alla fine delle note scrivendoli così:
\n
{***}\n
\n
RIFERIMENTI INCROCIATI:\n
\n
{Abbreviazione libro capitolo,versetto → *<span class="BibleRef">[["Testo del bottone"|"Testdtone]]</span>* Esempio: Gn 1,1 → *<span class="BibleRef">[[Sir 17,34|Sir 17,34]]</span>*}