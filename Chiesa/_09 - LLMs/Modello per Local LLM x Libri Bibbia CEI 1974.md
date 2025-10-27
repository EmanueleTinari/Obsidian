---
creato: 2025/08/09 07:20:05
modificato: 2025/08/10 14:47:21
---
Iniziamo un lavoro di conversione di file HTML della Bibbia CEI versione 1974 in formato markdown. 73 libri, centinaia di pagine HTML che seguono una struttura simile (ma non identica).Sto cercando di creare un template standardizzato per l'intera Bibbia.ci concentriamo esclusivamente sulla conversione HTML in markdown strutturato.
- IMPARA BENE TUTTI I SEGUENTI DATI, TIENILI SEMPRE PRESENTI DURANTE L'ELABORAZIONE DI OGNI FILE HTML CHE ANDRÒ AD INCOLLARE.
- NEL SUCCESSIVO FILE MD DI ESEMPIO CHE ANDRAI A LEGGERE, TIENI BEN PRESENTE LE RIGHE VUOTE E I COMMENTI CHE ANDRANNO TUTTI TOLTI.
	- Path principale del Vault di Obsidian.MD= "D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\"
- Il Vault principale contiene un subfolder: 'La Sacra Bibbia' con subfolders per ogni versione della Bibbia:
	- _File unici (subfolder usato per la versione completa della Bibbia in un file unico, con lo stesso nome del subfolder per quella versione + estensione '.md')
	- Folder+Versione CEI 1974	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\CEI 1974\'	link sorgente: 'https://www.bibbiaedu.it/CEI1974/'
	- Folder+Versione CEI 2008	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\CEI 2008\'	link sorgente: 'https://www.bibbiaedu.it/CEI2008/'
	- Folder+Versione Diodati	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Diodati\'	link sorgente: 'https://www.laparola.net/bibbia/'
	- Folder+Versione Interconfessionale	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Interconfessionale\'	link sorgente: 'https://www.bibbiaedu.it/INTERCONFESSIONALE/'
	- Folder+Versione Martini	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Martini\'	link sorgente: 'https://www.laparola.net/bibbia/' to compare with: 'https://sacrabibbia.altervista.org/index.php/bibbia/lettura/r/it/martini'
	- Folder+Versione Nova Vulgata	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Nova Vulgata\'	link sorgente: 'https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_index_lt.html'
	- Folder+Versione Nuova Diodati	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Nuova Diodati\'	link sorgente: 'https://www.laparola.net/bibbia/'
	- Folder+Versione Nuova Riveduta	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Nuova Riveduta\'	link sorgente: 'https://www.laparola.net/bibbia/'
	- Folder+Versione Nuova Riveduta 2020	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Nuova Riveduta 2020\'	link sorgente: 'https://www.laparola.net/bibbia/'
	- Folder+Versione Ricciotti	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Ricciotti\'	link sorgente: 'https://www.laparola.net/bibbia/'
	- Folder+Versione Riveduta	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Riveduta\'	link sorgente: 'https://www.laparola.net/bibbia/'
	- Folder+Versione Vulgata Latina	path: 'D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\La Sacra Bibbia\Vulgata Latina\'	link sorgente: 'https://sacrabibbia.altervista.org/index.php/bibbia/lettura/r/it/vulgata'
	- Tutti i riferimenti biblici nei miei file .md devono essere come negli esempi seguenti:
		- *<span class="BibleRef">[[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 01#1|Mt 1,1]]</span>*
		- *<span class="BibleRef">[[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 10#34-39|Matteo 10,34-39]]</span>*
		- *<span class="BibleRef">[[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Mc 08#1-6.9.12-17|Marco 8, 1-6.9.12-17]]</span>*
		(dove le informazioni essenziali sono tra `[[` e `|`).
	- Le footnote ai versetti sono scritte nel formato:
		- `[^ftn_Versione_LibroCapitolo,Versetto]`, e.g., `[^ftn_cei74_gn1,1]`.
		La Versione è specificata dopo il primo underscore, e il Libro-Capitolo-Versetto (esempio, 'gn1,1') è dopo il secondo underscore, senza spazi.
	- I Capitoli di ogni Versione della Bibbia, quindi ogni file MD (e.g., Genesi 1) sono formattati come segue:
		- Header 1 (H1) col numero di Capitolo e il suo nome in italiano, se si tratta di una Versione in Italiano, o in Latino se si tratta di una Versione in Latino (esempio, '# Genesi 1' o '# Genesis 1)
		- Ogni verso inizia con un Header 6 (H6) ('###### [numero del versetto]')
		- All'inizio di ogni verso, prima del testo dello stesso, il numero del Versetto è scritto così:
			'<span class=vrs>[Qui il numero del versetto]</span>'
		- Alcuni versi hanno delle note a piè pagina (Footnote) con collegamenti come il seguente: '[^ftn_cei74_gn1,1]', come spiegato anche sopra.
- Le mie Versioni della Bibbia (in questo ordine):
	- Vulgata Latina
	- Nova Vulgata
	- C.E.I. 1974
	- C.E.I. 2008
	- Interconfessionale
	- Ricciotti
	- Martini
	- Diodati
	- Riveduta
	- Nuova Diodati
	- Nuova Riveduta
	- Nuova Riveduta 2020


# Invio array contenente i nomi delle sottocartelle della cartella /CEI 1974/
# Nessuna sottocartella dovrà essere nominata diversamente o essercene una in più o in meno.
# Questo array è usato per definire la struttura delle directory.
arrSubFolders = [
    "AT - 01 Genesi",
    "AT - 02 Esodo",
    "AT - 03 Levitico",
    "AT - 04 Numeri",
    "AT - 05 Deuteronomio",
    "AT - 06 Giosuè",
    "AT - 07 Giudici",
    "AT - 08 Rut",
    "AT - 09 1 Samuele",
    "AT - 10 2 Samuele",
    "AT - 11 1 Re",
    "AT - 12 2 Re",
    "AT - 13 1 Cronache",
    "AT - 14 2 Cronache",
    "AT - 15 Esdra",
    "AT - 16 Neemia",
    "AT - 17 Tobia",
    "AT - 18 Giuditta",
    "AT - 19 Ester",
    "AT - 20 1 Maccabei",
    "AT - 21 2 Maccabei",
    "AT - 22 Giobbe",
    "AT - 23 Salmi",
    "AT - 24 Proverbi",
    "AT - 25 Qoelet",
    "AT - 26 Cantico",
    "AT - 27 Sapienza",
    "AT - 28 Siracide",
    "AT - 29 Isaia",
    "AT - 30 Geremia",
    "AT - 31 Lamentazioni",
    "AT - 32 Baruc",
    "AT - 33 Ezechiele",
    "AT - 34 Daniele",
    "AT - 35 Osea",
    "AT - 36 Gioele",
    "AT - 37 Amos",
    "AT - 38 Abdia",
    "AT - 39 Giona",
    "AT - 40 Michea",
    "AT - 41 Naum",
    "AT - 42 Abacuc",
    "AT - 43 Sofonia",
    "AT - 44 Aggeo",
    "AT - 45 Zaccaria",
    "AT - 46 Malachia",
    "NT - 47 Matteo",
    "NT - 48 Marco",
    "NT - 49 Luca",
    "NT - 50 Giovanni",
    "NT - 51 Atti",
    "NT - 52 Romani",
    "NT - 53 1 Corinzi",
    "NT - 54 2 Corinzi",
    "NT - 55 Galati",
    "NT - 56 Efesini",
    "NT - 57 Filippesi",
    "NT - 58 Colossesi",
    "NT - 59 1 Tessalonicesi",
    "NT - 60 2 Tessalonicesi",
    "NT - 61 1 Timoteo",
    "NT - 62 2 Timoteo",
    "NT - 63 Tito",
    "NT - 64 Filemone",
    "NT - 65 Ebrei",
    "NT - 66 Giacomo",
    "NT - 67 1 Pietro",
    "NT - 68 2 Pietro",
    "NT - 69 1 Giovanni",
    "NT - 70 2 Giovanni",
    "NT - 71 3 Giovanni",
    "NT - 72 Giuda",
    "NT - 73 Apocalisse"
]

# array contenente le informazioni sui libri della Bibbia
arrVers = [
    ['Numero libro','1', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Genesi','AbbrIT','Gn;Gen;Ge','Nome libro LT','Liber Genesis','AbbrLT','Gen','Nome libro EN','Genesis','AbbrEN','Gen'],
    ['Numero libro','2', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Esodo','AbbrIT','Es;Eso;Eo','Nome libro LT','Liber Exodus','AbbrLT','Ex','Nome libro EN','Exodus','AbbrEN','Exod'],
    ['Numero libro','3', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Levitico','AbbrIT','Lv;Le','Nome libro LT','Liber Leviticus','AbbrLT','Lev','Nome libro EN','Leviticus','AbbrEN','Lev'],
    ['Numero libro','4', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Numeri','AbbrIT','Nm;NÙ,'Nome libro LT','Liber Numeri','AbbrLT','Num','Nome libro EN','Numbers','AbbrEN','Nun'],
    ['Numero libro','5', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Deuteronomio','AbbrIT','Dt;Deut;De','Nome libro LT','Liber Deuteronomii','AbbrLT','Deut','Nome libro EN','Deuteronomy','AbbrEN','Deut'],
    ['Numero libro','6', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Giosuè','AbbrIT','Gs;Gios','Nome libro LT','Liber Josue','AbbrLT','Ios','Nome libro EN','Joshua','AbbrEN','Josh'],
    ['Numero libro','7', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Giudici','AbbrIT','Gdc; Giudic;Gc','Nome libro LT','Liber Judicum','AbbrLT','Iudc','Nome libro EN','Judges','AbbrEN','Judg'],
    ['Numero libro','8', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Rut','AbbrIT','Rt;RÙ,'Nome libro LT','Liber Ruth','AbbrLT','Ruth','Nome libro EN','Ruth','AbbrEN','Ruth'],
    ['Numero libro','9', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro di Samuele (=1 Re)','AbbrIT','1Sam;1 Sam;1S;ISam;I Sam;IS;I S','Nome libro LT','Liber Primus Regum','AbbrLT','1 Re','Nome libro EN','1 Samuel','AbbrEN','1 Sam'],
    ['Numero libro','10', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro di Samuele (=2 Re)','AbbrIT','2Sam;2 Sam;2S;IISam;II Sam;IIS;II S','Nome libro LT','Liber Secundus Regum','AbbrLT','2 Re','Nome libro EN','2 Samuel','AbbrEN','2 Sam'],
    ['Numero libro','11', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro dei Re (=3 Re)','AbbrIT','1Re;1 Re;1R;1 R;IRe;I Re;IR;I R','Nome libro LT','Liber Tertius Regum','AbbrLT','3 Re','Nome libro EN','1 Kings','AbbrEN','1 Kgs'],
    ['Numero libro','12', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro dei Re (=4 Re)','AbbrIT','2Re;2 Re;2R;2 R;IIRe;II Re;IIR;II R','Nome libro LT','Liber Quartus Regum','AbbrLT','4 Re','Nome libro EN','2 Kings','AbbrEN','2 Kgs'],
    ['Numero libro','13', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro delle Cronache (Paralipomeni)','AbbrIT','1Cr;1 Cr;I Cr;ICr','Nome libro LT','Liber Primus Paralipomenon','AbbrLT','1Par','Nome libro EN','1 Chronicles','AbbrEN','1 Chr'],
    ['Numero libro','14', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro delle Cronache (Paralipomeni)','AbbrIT','2Cr;2 Cr;II Cr;IICr','Nome libro LT','Liber Secundus Paralipomenon','AbbrLT','2Par','Nome libro EN','2 Chronicles','AbbrEN','2 Chr'],
    ['Numero libro','15', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Esdra (= 1 Esdra)','AbbrIT','Esd;Ed','Nome libro LT','Liber Esdræ','AbbrLT','Esd','Nome libro EN','Ezra','AbbrEN','Ezra'],
    ['Numero libro','16', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Neemia (= 2 Esdra)','AbbrIT','Ne','Nome libro LT','Liber Nehemiæ','AbbrLT','Neh','Nome libro EN','Nehemiah','AbbrEN','Neh'],
    ['Numero libro','17', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Tobia','AbbrIT','Tb;Tob;To','Nome libro LT','Liber Tobiæ','AbbrLT','Tob','Nome libro EN','Tobit','AbbrEN','Tob'],
    ['Numero libro','18', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Giuditta','AbbrIT','Gdt;Giudit','Nome libro LT','Liber Judith','AbbrLT','Iudt','Nome libro EN','Judith','AbbrEN','Jdt'],
    ['Numero libro','19', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Ester','AbbrIT','Est;Et','Nome libro LT','Liber Esther','AbbrLT','Esth','Nome libro EN','Esther','AbbrEN','Esth'],
    ['Numero libro','20', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro dei Maccabei','AbbrIT','1Mac;1 Mac;1Macc;1 Macc;IMac;I Mac;IMacc;I Macc;1M;1 M;IM;I M','Nome libro LT','Liber I Machabæorum','AbbrLT','1 Mach','Nome libro EN','1 Maccabees','AbbrEN','1 Macc'],
    ['Numero libro','21', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro dei Maccabei','AbbrIT','2Mac;2 Mac;2Macc;2 Macc;IIMac;II Mac;IIMacc;II Macc;2M;2 M;IIM;II M','Nome libro LT','Liber II Machabæorum','AbbrLT','2 Mach','Nome libro EN','2 Maccabees','AbbrEN','2 Macc'],
    ['Numero libro','22', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Giobbe','AbbrIT','Gb;Giob','Nome libro LT','Liber Job','AbbrLT','Iob','Nome libro EN','Job','AbbrEN','Job'],
    ['Numero libro','23', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Salmi','AbbrIT','Sal;Sl','Nome libro LT','Liber Psalmorum','AbbrLT','Ps','Nome libro EN','Psalms','AbbrEN','Ps(s)'],
    ['Numero libro','24', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Proverbi','AbbrIT','Prv;Prov;P','Nome libro LT','Liber Proverbiorum','AbbrLT','Prov','Nome libro EN','Proverbs','AbbrEN','Prov'],
    ['Numero libro','25', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Qoelet (=Ecclesiaste)','AbbrIT','Qo;Ec;Q','Nome libro LT','Liber Ecclesiastes','AbbrLT','Eccle','Nome libro EN','Ecclesiastes','AbbrEN','Eccl'],
    ['Numero libro','26', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Cantico','AbbrIT','Ct;Ca;CC','Nome libro LT','Canticum Canticorum Salomonis','AbbrLT','Cant','Nome libro EN','Song of Songs','AbbrEN','Song'],
    ['Numero libro','27', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Sapienza','AbbrIT','Sap','Nome libro LT','Liber Sapientiæ','AbbrLT','Sap','Nome libro EN','Wisdom of Solomon','AbbrEN','Wis'],
    ['Numero libro','28', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Siracide (= Ecclesiastico)','AbbrIT','Sir;Si','Nome libro LT','Ecclesiasticus Jesu, filii Sirach','AbbrLT','Eccli','Nome libro EN','Sirach/ Ecclesiasticus','AbbrEN','Sir'],
    ['Numero libro','29', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Isaia','AbbrIT','Is','Nome libro LT','Prophetia Isaiæ','AbbrLT','Isai;Isa','Nome libro EN','Isaiah','AbbrEN','Isa'],
    ['Numero libro','30', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Geremia','AbbrIT','Ger;Gr','Nome libro LT','Prophetia Jeremiæ','AbbrLT','Ier','Nome libro EN','Jeremiah','AbbrEN','Jer'],
    ['Numero libro','31', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Lamentazioni','AbbrIT','Lam;La','Nome libro LT','Lamentationes Jeremiæ Prophetæ','AbbrLT','Lam','Nome libro EN','Lamentations','AbbrEN','Lam'],
    ['Numero libro','32', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Baruc','AbbrIT','Bar;B','Nome libro LT','Prophetia Baruch','AbbrLT','Bar','Nome libro EN','Baruch','AbbrEN','Bar'],
    ['Numero libro','33', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Ezechiele','AbbrIT','Ez','Nome libro LT','Prophetia Ezechielis','AbbrLT','Ez','Nome libro EN','Ezekiel','AbbrEN','Ezek'],
    ['Numero libro','34', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Daniele','AbbrIT','Dn;Dan;Da','Nome libro LT','Prophetia Danielis','AbbrLT','Dan','Nome libro EN','Daniel','AbbrEN','Dan'],
    ['Numero libro','35', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Osea','AbbrIT','Os;O','Nome libro LT','Prophetia Osee','AbbrLT','Os','Nome libro EN','Hosea','AbbrEN','Hos'],
    ['Numero libro','36', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Gioele','AbbrIT','Gl;Gioe;Gi','Nome libro LT','Prophetia Joël','AbbrLT','Ioel','Nome libro EN','Joel','AbbrEN','Joel'],
    ['Numero libro','37', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Amos','AbbrIT','Am','Nome libro LT','Prophetia Amos','AbbrLT','Am','Nome libro EN','Amos','AbbrEN','Amos'],
    ['Numero libro','38', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Abdia','AbbrIT','Abd;Ad','Nome libro LT','Prophetia Abdiæ','AbbrLT','Abd','Nome libro EN','Obadiah','AbbrEN','Obad'],
    ['Numero libro','39', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Giona','AbbrIT','Gio;Gion','Nome libro LT','Prophetia Jonæ','AbbrLT','Ion','Nome libro EN','Jonah','AbbrEN','Jonah'],
    ['Numero libro','40', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Michea','AbbrIT','Mi','Nome libro LT','Prophetia Michææ','AbbrLT','Mic','Nome libro EN','Micah','AbbrEN','Mic'],
    ['Numero libro','41', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Naum','AbbrIT','Na','Nome libro LT','Prophetia Nahum','AbbrLT','Nah','Nome libro EN','Nahum','AbbrEN','Nah'],
    ['Numero libro','42', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Abacuc','AbbrIT','Ab;Abac;Aba;Ac;H','Nome libro LT','Prophetia Habacuc','AbbrLT','Hab','Nome libro EN','Habakkuk','AbbrEN','Hab'],
    ['Numero libro','43', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Sofonia','AbbrIT','Sof;So','Nome libro LT','Prophetia Sophoniæ','AbbrLT','Soph','Nome libro EN','Zephaniah','AbbrEN','Zeph'],
    ['Numero libro','44', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Aggeo','AbbrIT','Ag;Agg','Nome libro LT','Prophetia Aggæi','AbbrLT','Agg','Nome libro EN','Haggai','AbbrEN','Hag'],
    ['Numero libro','45', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Zaccaria','AbbrIT','Zc;Zac;Z','Nome libro LT','Prophetia Zachariæ','AbbrLT','Zach','Nome libro EN','Zechariah','AbbrEN','Zech'],
    ['Numero libro','46', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Malachia','AbbrIT','Ml;Mal','Nome libro LT','Prophetia Malachiæ','AbbrLT','Mal','Nome libro EN','Malachi','AbbrEN','Mal'],
    ['Numero libro','47', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Matteo Apostolo','AbbrIT','Mt;Mat','Nome libro LT','Evangelium secundum Matthæum','AbbrLT','Matteo','Nome libro EN','Matthew','AbbrEN','Matt'],
    ['Numero libro','48', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Marco','AbbrIT','Mc;Mar;Mr','Nome libro LT','Evangelium secundum Marcum','AbbrLT','Marco','Nome libro EN','Mark','AbbrEN','Mark'],
    ['Numero libro','49', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Luca','AbbrIT','Lc;LÙ,'Nome libro LT','Evangelium secundum Lucam','AbbrLT','Luca','Nome libro EN','Luke','AbbrEN','Luke'],
    ['Numero libro','50', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Giovanni Apostolo','AbbrIT','Gv;Giov','Nome libro LT','Evangelium secundum Joannem','AbbrLT','Io','Nome libro EN','John','AbbrEN','John'],
    ['Numero libro','51', 'Testamento','Nuovo Testamento', 'Gruppo','Atti', 'Nome libro IT','Atti degli Apostoli','AbbrIT','At','Nome libro LT','Actus Apostolorum','AbbrLT','Act','Nome libro EN','Acts','AbbrEN','Acts'],
    ['Numero libro','52', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Romani','AbbrIT','Rm;Ro','Nome libro LT','Epistola B. Pauli Apostoli ad Romanos','AbbrLT','Rom','Nome libro EN','Romans','AbbrEN','Rom'],
    ['Numero libro','53', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Prima lettera di san Paolo Apostolo ai Corinzi','AbbrIT','1Cor;1 Cor;I Cor;ICor;1Co;ICo;1 Co;I Co','Nome libro LT','Epistola B. Pauli Apostoli ad Corinthios Prima','AbbrLT','1Cor','Nome libro EN','1 Corinthians','AbbrEN','1 Cor'],
    ['Numero libro','54', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Seconda lettera di san Paolo Apostolo ai Corinzi','AbbrIT','2Cor;2 Cor;II cor;IICor;2Co;IICo;2 Co;II Co','Nome libro LT','Epistola B. Pauli Apostoli ad Corinthios Secunda','AbbrLT','2Cor','Nome libro EN','2 Corinthians','AbbrEN','2 Cor'],
    ['Numero libro','55', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Galati','AbbrIT','Gal;Ga','Nome libro LT','Epistola B. Pauli Apostoli ad Galatas','AbbrLT','Gal','Nome libro EN','Galatians','AbbrEN','Gal'],
    ['Numero libro','56', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo agli Efesini','AbbrIT','Ef','Nome libro LT','Epistola B. Pauli Apostoli ad Ephesios','AbbrLT','Eph','Nome libro EN','Ephesians','AbbrEN','Eph'],
    ['Numero libro','57', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Filippesi','AbbrIT','Fil;Fili;Fl','Nome libro LT','Epistola B. Pauli Apostoli ad Philippenses','AbbrLT','Phil','Nome libro EN','Philippians','AbbrEN','Phil'],
    ['Numero libro','58', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Colossesi','AbbrIT','Col;Cl;Co','Nome libro LT','Epistola B. Pauli Apostoli ad Colossenses','AbbrLT','Col','Nome libro EN','Colossians','AbbrEN','Col'],
    ['Numero libro','59', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Prima Lettera di san Paolo Apostolo ai Tessalonicesi','AbbrIT','1Ts;1 Ts;1Te;1 Te;ITs;I Ts;ITe;I Te','Nome libro LT','Epistola B. Pauli Apostoli ad Thessalonicenses Prima','AbbrLT','1 Thess','Nome libro EN','1 Thessalonians','AbbrEN','1 Thess'],
    ['Numero libro','60', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Seconda Lettera di san Paolo Apostolo ai Tessalonicesi','AbbrIT','2Ts;2 Ts;2Te;2 Te;IITs;II Ts;IITe;II Te','Nome libro LT','Epistola B. Pauli Apostoli ad Thessalonicenses Secunda','AbbrLT','2 Thess','Nome libro EN','2 Thessalonians','AbbrEN','2 Thess'],
    ['Numero libro','61', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Prima Lettera di san Paolo Apostolo a Timoteo','AbbrIT','1Tm;1 Tm;1Ti;1 Ti;ITm;I Tm;ITi;I Ti','Nome libro LT','Epistola B. Pauli Apostoli ad Timotheum Prima','AbbrLT','1 Tim','Nome libro EN','1 Timothy','AbbrEN','1 Tim'],
    ['Numero libro','62', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Seconda Lettera di san Paolo Apostolo a Timoteo','AbbrIT','2Tm;2 Tm;2Ti;2 Ti;IITm;II Tm;IITi;II Ti','Nome libro LT','Epistola B. Pauli Apostoli ad Timotheum Secunda','AbbrLT','2 Tim','Nome libro EN','2 Timothy','AbbrEN','2 Tim'],
    ['Numero libro','63', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo a Tito','AbbrIT','Tt;Ti;Tit','Nome libro LT','Epistola B. Pauli Apostoli ad Titum','AbbrLT','Tit','Nome libro EN','Titus','AbbrEN','Titus'],
    ['Numero libro','64', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo a Filemone','AbbrIT','Fm;File','Nome libro LT','Epistola B. Pauli Apostoli ad Philemonem','AbbrLT','Philem','Nome libro EN','Philemon','AbbrEN','Phlm'],
    ['Numero libro','65', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Lettera agli Ebrei','AbbrIT','Eb','Nome libro LT','Epistola B. Pauli Apostoli ad Hebræos','AbbrLT','Hebr','Nome libro EN','Hebrews','AbbrEN','Heb'],
    ['Numero libro','66', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Lettera di san Giacomo Apostolo','AbbrIT','Gc;Giac;Gia;Gm','Nome libro LT','Epistola Catholica B. Judæ Apostoli','AbbrLT','Iac','Nome libro EN','James','AbbrEN','Jas'],
    ['Numero libro','67', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Prima Lettera di san Pietro Apostolo','AbbrIT','1Pt;1 Pt;1P;1 P;IP;I P','Nome libro LT','Epistola B. Petri Apostoli Prima','AbbrLT','1Pt','Nome libro EN','1 Peter','AbbrEN','1 Pet'],
    ['Numero libro','68', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Seconda Lettera di san Pietro Apostolo','AbbrIT','2Pt;2 Pt;2P;2 P;IIP;II P','Nome libro LT','Epistola B. Petri Apostoli Secunda','AbbrLT','2Pt','Nome libro EN','2 Peter','AbbrEN','2 Pet'],
    ['Numero libro','69', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Prima lettera di san Giovanni Apostolo ed Evangelista','AbbrIT','1Gv;1 Gv;I Gv;IGv;1G;1 G;IG;I G','Nome libro LT','Epistola B. Joannis Apostoli Prima','AbbrLT','I Io','Nome libro EN','1 John','AbbrEN','1 John'],
    ['Numero libro','70', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Seconda lettera di san Giovanni Apostolo ed Evangelista','AbbrIT','2Gv;2 Gv;II Gv;IIGv;2G;2 G;IIG;II G','Nome libro LT','Epistola B. Joannis Apostoli Secunda','AbbrLT','II Io','Nome libro EN','2 John','AbbrEN','2 John'],
    ['Numero libro','71', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Terza lettera di san Giovanni Apostolo ed Evangelista','AbbrIT','3Gv;3 Gv;III Gv;IIIGv;3G;3 G;IIIG;III G','Nome libro LT','Epistola B. Joannis Apostoli Tertia','AbbrLT','III Io','Nome libro EN','3 John','AbbrEN','3 John'],
    ['Numero libro','72', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Lettera di san Giuda Apostolo','AbbrIT','Gd;Giuda','Nome libro LT','Epistola Catholica B. Judæ Apostoli','AbbrLT','Iud','Nome libro EN','Jude','AbbrEN','Jude'],
    ['Numero libro','73', 'Testamento','Nuovo Testamento', 'Gruppo','Scritti apocalittici e apocalittica', 'Nome libro IT','Apocalisse di san Giovanni Apostolo ed Evangelista','AbbrIT','Ap','Nome libro LT','Apocalypsis B. Joannis Apostoli','AbbrLT','Apoc','Nome libro EN','Revelation','AbbrEN','Rev']
]
Dalla riga seguente il primo capitolo del primo libro della Genesi in formato Markdown.md; Inserisco per ogni riga un commento che non andrà inserito nell'MD:
# Apertura Frontmatter
---
# css di stile per questo MD, mi raccomando su una sola riga, non andare a capo
cssclasses: bibbia
# versione della Bibbia che stiamo compilando in MD
versione: C.E.I. 1974
# Qui va indicato se il Libro che stiamo esaminando fa parte dell'Antico o del Nuovo Testamento
testamento: Antico
# Qui va indicato il gruppo a cui appartiene il Libro in esame: esaminare l'Array 'arrVers' per trovare il corrispondente
gruppo: Pentateuco
# Qui va messo il numero del Libro in esame, con zero iniziale se è un numero compreso tra 1 e 9 (01, 02, 03, 04, ...mi raccomando), confrontare i valori presenti nell'Array arrVers e l'Array arrSubFolders per trovare il numero che deve essere identico nel confronto, mi raccomando a 2 cifre totali con eventuale 0 iniziale
num-libro: 01
# Qui va messo il titolo del Libro secondo il valore (confrontato con l'altro Array arrVers) nell'Array arrSubFolders
tit-libro: Genesi
# Qui va messo il numero di capitolo che stiamo esaminando, con zero iniziale se è compreso tra 1 e 9 (01, 02, 03, 04, ...mi raccomando)
capitolo: 01
# Qui di seguito gli Alias. Sono stati creati dalle abbreviazioni, dal nome del Libro, sia Italiano, sia Latino, con alcune sistemazioni: crea elenco uguale se possibile per ogni Capitolo di ogni Libro
aliases:
  - Gn-01
  - Gn-1
  - Gn 01
  - Gn 1
  - Genesi 01
  - Genesi 1
  - Libro della Genesi 01
  - Libro della Genesi 1
  - Genesi, capitolo 01
  - Genesi, capitolo 1
  - Genesis 01
  - Genesis 1
  - Liber Genesis 01
  - Liber Genesis 1
  - Gen 01
  - Gen 1
# Qui vanno i Tag; l'importante è che tra ogni parola c'è un underscore (\_)
tags:
  - Antico_Testamento/Pentateuco/Genesi/Capitolo_1
  - Vecchio_Testamento/Pentateuco/Genesi/Capitolo_1
  - Antico_Testamento
  - Vecchio_Testamento
  - Il_Pentateuco
  - Pentateuco
  - Libro_della_Genesi
  - Genesi
  - Capitolo_2
# Qui lo stato del file: mettere sempre false, provvederò io dopo il controllo di ogni singolo file.MD creato a cambiarne il valore.
completato: false
# Il seguente valore nel Frontmatter è sempre uguale.
licenza-nota: Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
# L'indirizzo internet della pagina contenente il Capitolo in esame. Dovresti averlo in memoria.
url-testo: "[Link al testo](https://www.bibbiaedu.it/CEI1974/at/Gn/1/)"
# Qui mettiamo solo la parola creato:
creato: 
# Qui mettiamo solo la parola modificato:
modificato: 
# Qui chiudi il Frontmatter
---
# Riga vuota

# Qui la Versione che stiamo esaminando. Testo normale senza alcun Header
# (MI RACCOMANDO NON METTERE ALCUN HEADER SULLA RIGA SUCCESSIVA!)
Versione C.E.I. 1974:
#(MI RACCOMANDO NON METTERE ALCUN HEADER SULLA RIGA PRECEDENTE!)
# Qui comincia il menù dentro il Callout.
# Imparalo bene.
# Si fa grandissimo uso dei valori presenti nei due Array, arrVers e arrSubFolders.
# ATTENZIONE! Inserisco esempi per il menù superiore: prendi ed impara ma utilizza sempre e solo nomi ed abbreviazioni consone al Libro in esame, mai l'esempio fornito; esso serve solo per esempio.
# Esempio nel caso di Capitolo 1 (preso da Matteo 1, primo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/CEI 1974/NT - 46 Malachia/CEI 74 Malachia|↑ Malachia]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Matteo| ← Matteo]] | Matteo 1 | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 02|Matteo 2 →]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 28|Matteo 28 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Marco|Marco ↓]]
# Esempio nel caso di Capitolo 2 (preso da Matteo 2, secondo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/CEI 1974/NT - 46 Malachia/CEI 74 Malachia|↑ Malachia]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 01| ← Matteo 1]] | Matteo 2 | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 03|Matteo 3 →]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 28|Matteo 28 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Marco|Marco ↓]]
# Esempio nel caso di Capitolo 2 (preso da Genesi 2, secondo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/Indice generale della Sacra Bibbia|↑ Indice generale della Sacra Bibbia]] | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 01| ← Genesi 1]] <span class="bianco">| Genesi 2 |</span> [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 03|Genesi 3 →]] | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 50|Genesi 50 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 02 Esodo/CEI 74 Esodo|Esodo ↓]]
# Esempio nel caso di Capitolo 3 (preso da Matteo 3, terzo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/CEI 1974/NT - 46 Malachia/CEI 74 Malachia|↑ Malachia]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 01|⇤ Matteo 1]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 02| ← Matteo 2]] | Matteo 3 | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 04|Matteo 4 →]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 28|Matteo 28 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Marco|Marco ↓]]
# Esempio nel caso di Capitolo 3 (preso da Genesi 3, terzo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/Indice generale della Sacra Bibbia|↑ Indice generale della Sacra Bibbia]] | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 03| ← Genesi 2]] <span class="bianco">| Genesi 3 |</span> [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 04|Genesi 4 →]] | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 50|Genesi 50 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 02 Esodo/CEI 74 Esodo|Esodo ↓]]
# Esempio nel caso di Capitolo 4 (preso da Matteo 4, quarto capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/CEI 1974/NT - 46 Malachia/CEI 74 Malachia|↑ Malachia]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 01|⇤ Matteo 1]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 03| ← Matteo 3]] | Matteo 4 | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 05|Matteo 5 →]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 28|Matteo 28 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Marco|Marco ↓]]
# Esempio nel caso di Capitolo 27 (preso da Matteo 27, penultio capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/CEI 1974/NT - 46 Malachia/CEI 74 Malachia|↑ Malachia]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 01|⇤ Matteo 1 ]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 26| ← Matteo 26]] | Matteo 27 | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 28|Matteo 28 →]] | [[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Marco|Marco ↓]]
# Esempio nel caso di Capitolo 28 (preso da Matteo 28, ultimo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/CEI 1974/NT - 46 Malachia/CEI 74 Malachia|↑ Malachia]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 01|⇤ Matteo 1 ]] | [[La Sacra Bibbia/CEI 1974/NT - 47 Matteo/CEI 74 Mt 27| ← Matteo 27]] | Matteo 28 | [[La Sacra Bibbia/CEI 1974/NT - 48 Marco/CEI 74 Marco|Marco →]]
# Esempio nel caso di Capitolo 1 (preso da Genesi 1, primo capitolo del Libro):
> [!indice-libro-biblico]- [[La Sacra Bibbia/Indice generale della Sacra Bibbia| ← Indice generale della Sacra Bibbia]] | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Genesi| ← Genesi]] <span class="bianco">| Genesi 1 |</span> [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 02|Genesi 2 →]] | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 50|Genesi 50 ⇥]] | [[La Sacra Bibbia/CEI 1974/NT - 02 Esodo/CEI 74 Esodo|Esodo ↓]]
>> <span class="verde">Altre versioni:</span>
>>
>> Vulgata Latina, [[La Sacra Bibbia/Vulgata Latina/AT - 01 Genesi/VL Gn 01|Genesis 1]]
>> Nova Vulgata, [[La Sacra Bibbia/Nova Vulgata/AT - 01 Genesi/NV Gn 01|Genesis 1]]
>> C.E.I 2008, [[La Sacra Bibbia/CEI 2008/AT - 01 Genesi/CEI 08 Gn 01|Genesi 1]]
>> Interconfessionale, [[La Sacra Bibbia/Interconfessionale/AT - 01 Genesi/INT Gn 01|Genesi 1]]
>> Martini, [[La Sacra Bibbia/Martini/AT - 01 Genesi/MRT Gn 01|Genesi 1]]
>> Ricciotti, [[La Sacra Bibbia/Ricciotti/AT - 01 Genesi/RCT Gn 01|Genesi 1]]
>> Diodati, [[La Sacra Bibbia/Diodati/AT - 01 Genesi/D Gn 01|Genesi 1]]
>> Nuova Diodati, [[La Sacra Bibbia/Nuova Diodati/AT - 01 Genesi/ND Gn 01|Genesi 1]]
>> Riveduta, [[La Sacra Bibbia/Riveduta/AT - 01 Genesi/RIV Gn 01|Genesi 1]]
>> Nuova Riveduta, [[La Sacra Bibbia/Nuova Riveduta/AT - 01 Genesi/NRIV Gn 01|Genesi 1]]
>> Nuova Riveduta 2020, [[La Sacra Bibbia/Nuova Riveduta 2020/AT - 01 Genesi/RIV20 Gn 01|Genesi 1]]
# Qui comincia il testo del capitolo. Innanzitutto mettiamo il capitolo in elaborazione come Header 1 (H1). Mi raccomando questo sarà l'unico H1 di tutto il file, non ce ne sono altri
# Genesi 1

***
# Qui comincia il testo vero e proprio suddiviso in versetti. Mi raccomando, sostituisci OGNI apostrofo che dovresti incontrare che sia un backtrick (`) con un apostrofo normale ('); ogni spazio ad inizio o fine versetto inutile, eliminalo; ogni spazio dopo l'apertura delle virgolette (" ), eliminalo; ogni spazio prima della chiusura delle virgolette ( "), eliminalo; mi raccomando!
###### 1
<span class=vrs>1</span>In principio Dio creò il cielo e la terra. [^ftn_cei74_gn1,1]
###### 2
<span class=vrs>2</span>La terra era informe e deserta e le tenebre ricoprivano l'abisso e lo spirito di Dio aleggiava sulle acque.
###### 3
<span class=vrs>3</span>Dio disse: "Sia la luce!". E la luce fu.
###### 4
<span class=vrs>4</span>Dio vide che la luce era cosa buona e separò la luce dalle tenebre
###### 5
<span class=vrs>5</span>e chiamò la luce giorno e le tenebre notte. E fu sera e fu mattina: primo giorno.
###### 6
<span class=vrs>6</span>Dio disse: "Sia il firmamento in mezzo alle acque per separare le acque dalle acque".
###### 7
<span class=vrs>7</span>Dio fece il firmamento e separò le acque, che sono sotto il firmamento, dalle acque, che son sopra il firmamento. E così avvenne.
###### 8
<span class=vrs>8</span>Dio chiamò il firmamento cielo. E fu sera e fu mattina: secondo giorno.
###### 9
<span class=vrs>9</span>Dio disse: "Le acque che sono sotto il cielo, si raccolgano in un solo luogo e appaia l'asciutto". E così avvenne.
###### 10
<span class=vrs>10</span>Dio chiamò l'asciutto terra e la massa delle acque mare. E Dio vide che era cosa buona.
###### 11
<span class=vrs>11</span>E Dio disse: "La terra produca germogli, erbe che producono seme e alberi da frutto, che facciano sulla terra frutto con il seme, ciascuno secondo la sua specie". E così avvenne:
###### 12
<span class=vrs>12</span>la terra produsse germogli, erbe che producono seme, ciascuna secondo la propria specie e alberi che fanno ciascuno frutto con il seme, secondo la propria specie. Dio vide che era cosa buona.
###### 13
<span class=vrs>13</span>E fu sera e fu mattina: terzo giorno.
##### Ornato del cielo e della terra.

###### 14
<span class=vrs>14</span>Dio disse: "Ci siano luci nel firmamento del cielo, per distinguere il giorno dalla notte; servano da segni per le stagioni, per i giorni e per gli anni
###### 15
<span class=vrs>15</span>e servano da luci nel firmamento del cielo per illuminare la terra". E così avvenne:
###### 16
<span class=vrs>16</span>Dio fece le due luci grandi, la luce maggiore per regolare il giorno e la luce minore per regolare la notte, e le stelle.
###### 17
<span class=vrs>17</span>Dio le pose nel firmamento del cielo per illuminare la terra
###### 18
<span class=vrs>18</span>e per regolare giorno e notte e per separare la luce dalle tenebre. E Dio vide che era cosa buona.
###### 19
<span class=vrs>19</span>E fu sera e fu mattina: quarto giorno.
###### 20
<span class=vrs>20</span>Dio disse: "Le acque brulichino di esseri viventi e uccelli volino sopra la terra, davanti al firmamento del cielo".
###### 21
<span class=vrs>21</span>Dio creò i grandi mostri marini e tutti gli esseri viventi che guizzano e brulicano nelle acque, secondo la loro specie, e tutti gli uccelli alati secondo la loro specie. E Dio vide che era cosa buona.
###### 22
<span class=vrs>22</span>Dio li benedisse: "Siate fecondi e moltiplicatevi e riempite le acque dei mari; gli uccelli si moltiplichino sulla terra".
###### 23
<span class=vrs>23</span>E fu sera e fu mattina: quinto giorno.
###### 24
<span class=vrs>24</span>Dio disse: "La terra produca esseri viventi secondo la loro specie: bestiame, rettili e bestie selvatiche secondo la loro specie". E così avvenne:
###### 25
<span class=vrs>25</span>Dio fece le bestie selvatiche secondo la loro specie e il bestiame secondo la propria specie e tutti i rettili del suolo secondo la loro specie. E Dio vide che era cosa buona.
##### Creazione dell'uomo.

###### 26
<span class=vrs>26</span>E Dio disse: "Facciamo l'uomo a nostra immagine, a nostra somiglianza, e domini sui pesci del mare e sugli uccelli del cielo, sul bestiame, su tutte le bestie selvatiche e su tutti i rettili che strisciano sulla terra". [^ftn_cei74_gn1,26]
###### 27
<span class=vrs>27</span>Dio creò l'uomo a sua immagine;<br>a immagine di Dio lo creò;<br>maschio e femmina li creò. [^ftn_cei74_gn1,27]
###### 28
<span class=vrs>28</span>Dio li benedisse e disse loro:<br>"Siate fecondi e moltiplicatevi,<br>riempite la terra;<br>soggiogatela e dominate<br>sui pesci del mare<br>e sugli uccelli del cielo<br>e su ogni essere vivente,<br>che striscia sulla terra".
###### 29
<span class=vrs>29</span>E Dio disse: "Ecco, io vi do ogni erba che produce seme e che è su tutta la terra e ogni albero in cui è il frutto, che produce seme: saranno il vostro cibo.
###### 30
<span class=vrs>30</span>A tutte le bestie selvatiche, a tutti gli uccelli del cielo e a tutti gli esseri che strisciano sulla terra e nei quali è alito di vita, io do in cibo ogni erba verde". E così avvenne.
###### 31
<span class=vrs>31</span>Dio vide quanto aveva fatto, ed ecco, era cosa molto buona. E fu sera e fu mattina: sesto giorno.

***

[[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Genesi|Genesi]] | Genesi 1 | [[La Sacra Bibbia/CEI 1974/AT - 01 Genesi/CEI 74 Gn 02|Genesi 2 →]]

***

NOTE:

[^ftn_cei74_gn1,1]: Poiché la **Sacra** Scrittura non ha lo scopo di dare informazioni scientifiche sulle origini dell’universo e dell’uomo, prima in *<span class="BibleRef">[[Gn 1,1|1,1]]</span>* e *<span class="BibleRef">[[Gn 2,4a|2,4a]]</span>* in maniera schematica, poi in *<span class="BibleRef">[[Gn 2,4b-25|2,4b-25]]</span>* con un racconto più arcaico e vivace, sono inculcate alcune verità fondamentali: unicità di Dio che crea tutto ed è distinto dal mondo, bontà di tutte le cose create, particolare dignità della creatura umana.
[^ftn_cei74_gn1,26]: Dio si consiglia con se stesso o con la core celeste, per creare un essere che gli somigli per le sue doti spirituali e lo rappresenti come dominatore delle creature inferiori.
	Cfr. *<span class="BibleRef">[[Sal 8,6-7|Sal 8,6-7]]</span>*.
[^ftn_cei74_gn1,27]: Cfr. *<span class="BibleRef">[[Mt 19,4|Mt 19,4]]</span>*.
	Cfr. *<span class="BibleRef">[[Mc 10,6|Mc 10,6]]</span>*.

- Se troverai eventuali TAG multipli (esempio <br><br>), mettine uno solo (esempio: <br>)
- Mi raccomando le note a piè pagina che abbiano il testo del file HTML inoltrato e non il testo negli esempi!
ATTENZIONE SPECIFICA:

- NON inserire alcun Header (H1, H2, H3, ecc.) prima, dopo o in corrispondenza della frase "Versione C.E.I. 1974:". Questa frase deve essere scritta esclusivamente come testo normale, senza alcun markup di intestazione.
- NON inserire alcuna data o ora nei campi creato: e modificato: del Frontmatter. Lascia i campi vuoti o con il valore esatto come definito dal template (es. creato: e modificato: senza alcun timestamp), non aggiungere né modificare i valori automatici.
- Tutti i commenti, spazi vuoti, righe extra o elementi non presenti nel testo originale devono essere eliminati.
- Il testo deve essere esattamente conforme al formato richiesto dal template, senza aggiunte, rimozioni o modifiche strutturali non esplicitamente richieste.

- Importantissimi sono anche usare i medesimi caratteri di fine riga solo come nel modello e non aggiungerne altri in alcun punto del testo.

Incollo qui di seguito il file HTML da elaborare in base a quanto sopra scritto e detto.
Rammenta il Markdown di formattarlo come segue:
```markdown
...file md creato
```

File HTML da elaborare:

<div class="container main"><div class="row"><main role="main" class="col-sm-12 col-lg-9 px-0 "><div class="verses-container" data-info="modifica05"><div class="d-none d-print-block logo-for-print mb-3"><title>BibbiaEDU-logo</title></div><h1 class="lowfi">CEI 1974 - Antico Testamento - Pentateuco - Genesi - 4</h1><h2 class="book-title text-to-speech">Genesi</h2><span data-chapters-id="1235" class="text-to-speech verse_chapter_text type-3"></span><span class="chapter-numeric"><span class="verse_chapter type-3">4</span><span data-verses-id="415" class="verse" id="verse_415"><span class="text-to-speech"><sup><span class="verse_number">1</span></sup><!--<sup>1</sup>--> Adamo si unì a Eva sua moglie, la quale concepì e partorì Caino e disse: "Ho acquistato un uomo dal Signore". </span></span><div class="collapse notes" id="notes_415"><div class="inline-note verse-rif-415"><div class="container-note"><a href="#notes_415" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div></span><span data-verses-id="470" class="verse" id="verse_470"><span class="text-to-speech"><sup><span class="verse_number">2</span></sup><!--<sup>2</sup>--> Poi partorì ancora suo fratello Abele. Abele era pastore di greggi e Caino lavoratore del suolo.<br></span></span><div class="collapse notes" id="notes_470"><div class="inline-note verse-rif-470"><div class="container-note"><a href="#notes_470" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="510" class="verse" id="verse_510"><span class="text-to-speech"><sup><span class="verse_number">3</span></sup><!--<sup>3</sup>--> Dopo un certo tempo, Caino offrì frutti del suolo in sacrificio al Signore; </span></span><div class="collapse notes" id="notes_510"><div class="inline-note verse-rif-510"><div class="container-note"><a href="#notes_510" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="515" class="verse" id="verse_515"><span class="text-to-speech"><sup><span class="verse_number">4</span></sup><!--<sup>4</sup>--> anche Abele offrì primogeniti del suo gregge e il loro grasso. Il Signore gradì Abele e la sua offerta, </span></span><div class="collapse notes" id="notes_515"><div class="inline-note verse-rif-515"><div class="container-note"><a href="#notes_515" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="520" class="verse" id="verse_520"><span class="text-to-speech"><sup><span class="verse_number">5</span></sup><!--<sup>5</sup>--> ma non gradì Caino e la sua offerta. Caino ne fu molto irritato e il suo volto era abbattuto. </span></span><div class="collapse notes" id="notes_520"><div class="inline-note verse-rif-520"><div class="container-note"><a href="#notes_520" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="525" class="verse" id="verse_525"><span class="text-to-speech"><sup><span class="verse_number">6</span></sup><!--<sup>6</sup>--> Il Signore disse allora a Caino: "Perché sei irritato e perché è abbattuto il tuo volto? </span></span><div class="collapse notes" id="notes_525"><div class="inline-note verse-rif-525"><div class="container-note"><a href="#notes_525" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="530" class="verse" id="verse_530"><span class="text-to-speech"><sup><span class="verse_number">7</span></sup><!--<sup>7</sup>--> Se agisci bene, non dovrai forse tenerlo alto? Ma se non agisci bene, il peccato è accovacciato alla tua porta; verso di te è la sua bramosia, ma tu dòminala". </span></span><div class="collapse notes" id="notes_530"><div class="inline-note verse-rif-530"><div class="container-note"><a href="#notes_530" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="535" class="verse with_note" id="verse_535"><span class="text-to-speech"><button aria-label="Mostra nota" data-target="#notes_535" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case3">8</button><!--<sup>8</sup>--> Caino disse al fratello Abele: "Andiamo in campagna!". Mentre erano in campagna, Caino alzò la mano contro il fratello Abele e lo uccise. </span></span><div class="collapse notes" id="notes_535"><div class="inline-note verse-rif-535"><div class="container-note"><a href="#notes_535" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a><div data-notes-id="6742" class="note-under-container"><span class="note-verse-identificative">4,8</span><span class="note-id_6742 usfm_note-new"><!--8--><!--note_verses_label-->Il peccato, entrato nel mondo, comincia a dilagare: cfr. <a title="vai a Gn 6,5.11" href="/CEI1974/at/Gn/6/?sel=6,5.11" target="_self" data-target="683745b3b9be4" data-tech-info-lt="NO-LIB-1">6,5.11</a><span class="verses target hide-if-no-js" id="683745b3b9be4"></span>.</span></div></div></div></div><span data-verses-id="540" class="verse" id="verse_540"><span class="text-to-speech"><sup><span class="verse_number">9</span></sup><!--<sup>9</sup>--> Allora il Signore disse a Caino: "Dov`è Abele, tuo fratello?". Egli rispose: "Non lo so. Sono forse il guardiano di mio fratello?". </span></span><div class="collapse notes" id="notes_540"><div class="inline-note verse-rif-540"><div class="container-note"><a href="#notes_540" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="420" class="verse" id="verse_420"><span class="text-to-speech"><sup><span class="verse_number">10</span></sup><!--<sup>10</sup>--> Riprese: "Che hai fatto? La voce del sangue di tuo fratello grida a me dal suolo! </span></span><div class="collapse notes" id="notes_420"><div class="inline-note verse-rif-420"><div class="container-note"><a href="#notes_420" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="425" class="verse" id="verse_425"><span class="text-to-speech"><sup><span class="verse_number">11</span></sup><!--<sup>11</sup>--> Ora sii maledetto lungi da quel suolo che per opera della tua mano ha bevuto il sangue di tuo fratello. </span></span><div class="collapse notes" id="notes_425"><div class="inline-note verse-rif-425"><div class="container-note"><a href="#notes_425" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="430" class="verse" id="verse_430"><span class="text-to-speech"><sup><span class="verse_number">12</span></sup><!--<sup>12</sup>--> Quando lavorerai il suolo, esso non ti darà più i suoi prodotti: ramingo e fuggiasco sarai sulla terra". </span></span><div class="collapse notes" id="notes_430"><div class="inline-note verse-rif-430"><div class="container-note"><a href="#notes_430" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="435" class="verse" id="verse_435"><span class="text-to-speech"><sup><span class="verse_number">13</span></sup><!--<sup>13</sup>--> Disse Caino al Signore: "Troppo grande è la mia colpa per ottenere perdono! </span></span><div class="collapse notes" id="notes_435"><div class="inline-note verse-rif-435"><div class="container-note"><a href="#notes_435" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="440" class="verse" id="verse_440"><span class="text-to-speech"><sup><span class="verse_number">14</span></sup><!--<sup>14</sup>--> Ecco, tu mi scacci oggi da questo suolo e io mi dovrò nascondere lontano da te; io sarò ramingo e fuggiasco sulla terra e chiunque mi incontrerà mi potrà uccidere". </span></span><div class="collapse notes" id="notes_440"><div class="inline-note verse-rif-440"><div class="container-note"><a href="#notes_440" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="445" class="verse" id="verse_445"><span class="text-to-speech"><sup><span class="verse_number">15</span></sup><!--<sup>15</sup>--> Ma il Signore gli disse: "Però chiunque ucciderà Caino subirà la vendetta sette volte!". Il Signore impose a Caino un segno, perché non lo colpisse chiunque l`avesse incontrato. </span></span><div class="collapse notes" id="notes_445"><div class="inline-note verse-rif-445"><div class="container-note"><a href="#notes_445" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="450" class="verse" id="verse_450"><span class="text-to-speech"><sup><span class="verse_number">16</span></sup><!--<sup>16</sup>--> Caino si allontanò dal Signore e abitò nel paese di Nod, ad oriente di Eden.<br><br><br><b>Stirpe di Caino.</b></span></span><div class="collapse notes" id="notes_450"><div class="inline-note verse-rif-450"><div class="container-note"><a href="#notes_450" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="455" class="verse" id="verse_455"><span class="text-to-speech"><sup><span class="verse_number">17</span></sup><!--<sup>17</sup>--> Ora Caino si unì alla moglie che concepì e partorì Enoch; poi divenne costruttore di una città, che chiamò Enoch, dal nome del figlio. </span></span><div class="collapse notes" id="notes_455"><div class="inline-note verse-rif-455"><div class="container-note"><a href="#notes_455" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="460" class="verse" id="verse_460"><span class="text-to-speech"><sup><span class="verse_number">18</span></sup><!--<sup>18</sup>--> A Enoch nacque Irad; Irad generò Mecuiael e Mecuiael generò Metusael e Metusaèl generò Lamech. </span></span><div class="collapse notes" id="notes_460"><div class="inline-note verse-rif-460"><div class="container-note"><a href="#notes_460" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="465" class="verse with_note" id="verse_465"><span class="text-to-speech"><button aria-label="Mostra nota" data-target="#notes_465" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case3">19</button><!--<sup>19</sup>--> Lamech si prese due mogli: una chiamata Ada e l`altra chiamata Zilla. </span></span><div class="collapse notes" id="notes_465"><div class="inline-note verse-rif-465"><div class="container-note"><a href="#notes_465" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a><div data-notes-id="6031" class="note-under-container"><span class="note-verse-identificative">4,19</span><span class="note-id_6031 usfm_note-new"><!--19--><!--note_verses_label-->Primo caso di poligamia contro le primitive intenzioni di Dio.</span></div></div></div></div><span data-verses-id="475" class="verse" id="verse_475"><span class="text-to-speech"><sup><span class="verse_number">20</span></sup><!--<sup>20</sup>--> Ada partorì Iabal: egli fu il padre di quanti abitano sotto le tende presso il bestiame. </span></span><div class="collapse notes" id="notes_475"><div class="inline-note verse-rif-475"><div class="container-note"><a href="#notes_475" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="480" class="verse" id="verse_480"><span class="text-to-speech"><sup><span class="verse_number">21</span></sup><!--<sup>21</sup>--> Il fratello di questi si chiamava Iubal: egli fu il padre di tutti i suonatori di cetra e di flauto. </span></span><div class="collapse notes" id="notes_480"><div class="inline-note verse-rif-480"><div class="container-note"><a href="#notes_480" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="485" class="verse" id="verse_485"><span class="text-to-speech"><sup><span class="verse_number">22</span></sup><!--<sup>22</sup>--> Zilla a sua volta partorì Tubalkain, il fabbro, padre di quanti lavorano il rame e il ferro. La sorella di Tubalkain fu Naama.<br><br></span></span><div class="collapse notes" id="notes_485"><div class="inline-note verse-rif-485"><div class="container-note"><a href="#notes_485" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="490" class="verse with_note" id="verse_490"><span class="text-to-speech"><button aria-label="Mostra nota" data-target="#notes_490" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case3">23</button><!--<sup>23</sup>--> Lamech disse alle mogli:<br><br>Ada e Zilla, ascoltate la mia voce;<br>mogli di Lamech, porgete l`orecchio al mio dire:<br>Ho ucciso un uomo per una mia scalfittura<br>e un ragazzo per un mio livido.<br></span></span><div class="collapse notes" id="notes_490"><div class="inline-note verse-rif-490"><div class="container-note"><a href="#notes_490" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a><div data-notes-id="6297" class="note-under-container"><span class="note-verse-identificative">4,23</span><span class="note-id_6297 usfm_note-new"><!--23--><!--note_verses_label-->Dopo il peccato, dilaga anche la violenza.</span></div></div></div></div><span data-verses-id="495" class="verse" id="verse_495"><span class="text-to-speech"><sup><span class="verse_number">24</span></sup><!--<sup>24</sup>--> Sette volte sarà vendicato Caino<br>ma Lamech settantasette".<br><br></span></span><div class="collapse notes" id="notes_495"><div class="inline-note verse-rif-495"><div class="container-note"><a href="#notes_495" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="500" class="verse" id="verse_500"><span class="text-to-speech"><sup><span class="verse_number">25</span></sup><!--<sup>25</sup>--> Adamo si unì di nuovo alla moglie, che partorì un figlio e lo chiamò Set. "Perché - disse - Dio mi ha concesso un`altra discendenza al posto di Abele, poiché Caino l`ha ucciso".<br></span></span><div class="collapse notes" id="notes_500"><div class="inline-note verse-rif-500"><div class="container-note"><a href="#notes_500" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div><span data-verses-id="505" class="verse" id="verse_505"><span class="text-to-speech"><sup><span class="verse_number">26</span></sup><!--<sup>26</sup>--> Anche a Set nacque un figlio, che egli chiamò Enos. Allora si cominciò ad invocare il nome del Signore.<br><br><br><br></span></span><div class="collapse notes" id="notes_505"><div class="inline-note verse-rif-505"><div class="container-note"><a href="#notes_505" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle show-note case4 close-open-note"><span class="icon-close-offcanvas"></span></a></div></div></div></div><div class="notes-container"><p class="notes-first-header"><span class="notes-head">Note al testo</span></p><div class="notes-area"><span data-notes-id="6742" class="footer_notes" id="footer_notes_6742"><div class="usfm_note mb-1 mb-nope note-id-6742 is-cross-0"><span class="note-verse-identificative">4,8</span><!--8--><!--note_verses_label-->Il peccato, entrato nel mondo, comincia a dilagare: cfr. <a title="vai a Gn 6,5.11" href="/CEI1974/at/Gn/6/?sel=6,5.11" target="_self" data-target="683745b45dd5b" data-tech-info-lt="NO-LIB-1">6,5.11</a><span class="verses target hide-if-no-js" id="683745b45dd5b"></span>.</div></span><span data-notes-id="6031" class="footer_notes" id="footer_notes_6031"><div class="usfm_note mb-1 mb-nope note-id-6031 is-cross-0"><span class="note-verse-identificative">4,19</span><!--19--><!--note_verses_label-->Primo caso di poligamia contro le primitive intenzioni di Dio.</div></span><span data-notes-id="6297" class="footer_notes" id="footer_notes_6297"><div class="usfm_note mb-1 mb-nope note-id-6297 is-cross-0"><span class="note-verse-identificative">4,23</span><!--23--><!--note_verses_label-->Dopo il peccato, dilaga anche la violenza.</div></span></div></div><div class="container d-none d-md-block"><div class="row"><div class="col-sm-6"><div class="left-split split"><a aria-label="Capitolo Precedente" href="/CEI1974/at/Gn/3/"><span class="chptr-bottom-nav icon-arrow-back"></span> Capitolo 3</a></div></div><div class="col-sm-6 "><div class="right-split split"><a aria-label="Capitolo Successivo" href="/CEI1974/at/Gn/5/">Capitolo 5 <span class="chptr-bottom-nav icon-arrow-next"></span></a></div></div></div></div></main></div></div>