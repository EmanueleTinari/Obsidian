	$arrVers = @(
		@('Numero libro','1', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Genesi','AbbrIT','Gn;Gen;Ge','Nome libro LT','Liber Genesis','AbbrLT','Gen','Nome libro EN','Genesis','AbbrEN','Gen'),
		@('Numero libro','2', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Esodo','AbbrIT','Es;Eso;Eo','Nome libro LT','Liber Exodus','AbbrLT','Ex','Nome libro EN','Exodus','AbbrEN','Exod'),
		@('Numero libro','3', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Levitico','AbbrIT','Lv;Le','Nome libro LT','Liber Leviticus','AbbrLT','Lev','Nome libro EN','Leviticus','AbbrEN','Lev'),
		@('Numero libro','4', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Numeri','AbbrIT','Nm;Nu','Nome libro LT','Liber Numeri','AbbrLT','Num','Nome libro EN','Numbers','AbbrEN','Nun'),
		@('Numero libro','5', 'Testamento','Antico Testamento', 'Gruppo','Il Pentateuco', 'Nome libro IT','Deuteronomio','AbbrIT','Dt;Deut;De','Nome libro LT','Liber Deuteronomii','AbbrLT','Deut','Nome libro EN','Deuteronomy','AbbrEN','Deut'),
		@('Numero libro','6', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Giosuè','AbbrIT','Gs;Gios','Nome libro LT','Liber Josue','AbbrLT','Ios','Nome libro EN','Joshua','AbbrEN','Josh'),
		@('Numero libro','7', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Giudici','AbbrIT','Gdc; Giudic;Gc','Nome libro LT','Liber Judicum','AbbrLT','Iudc','Nome libro EN','Judges','AbbrEN','Judg'),
		@('Numero libro','8', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Rut','AbbrIT','Rt;Ru','Nome libro LT','Liber Ruth','AbbrLT','Ruth','Nome libro EN','Ruth','AbbrEN','Ruth'),
		@('Numero libro','9', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro di Samuele (=1 Re)','AbbrIT','1Sam;1 Sam;1S;ISam;I Sam;IS;I S','Nome libro LT','Liber Primus Regum','AbbrLT','1 Re','Nome libro EN','1 Samuel','AbbrEN','1 Sam'),
		@('Numero libro','10', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro di Samuele (=2 Re)','AbbrIT','2Sam;2 Sam;2S;IISam;II Sam;IIS;II S','Nome libro LT','Liber Secundus Regum','AbbrLT','2 Re','Nome libro EN','2 Samuel','AbbrEN','2 Sam'),
		@('Numero libro','11', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro dei Re (=3 Re)','AbbrIT','1Re;1 Re;1R;1 R;IRe;I Re;IR;I R','Nome libro LT','Liber Tertius Regum','AbbrLT','3 Re','Nome libro EN','1 Kings','AbbrEN','1 Kgs'),
		@('Numero libro','12', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro dei Re (=4 Re)','AbbrIT','2Re;2 Re;2R;2 R;IIRe;II Re;IIR;II R','Nome libro LT','Liber Quartus Regum','AbbrLT','4 Re','Nome libro EN','2 Kings','AbbrEN','2 Kgs'),
		@('Numero libro','13', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro delle Cronache (Paralipomeni)','AbbrIT','1Cr;1 Cr;I Cr;ICr','Nome libro LT','Liber Primus Paralipomenon','AbbrLT','1Par','Nome libro EN','1 Chronicles','AbbrEN','1 Chr'),
		@('Numero libro','14', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro delle Cronache (Paralipomeni)','AbbrIT','2Cr;2 Cr;II Cr;IICr','Nome libro LT','Liber Secundus Paralipomenon','AbbrLT','2Par','Nome libro EN','2 Chronicles','AbbrEN','2 Chr'),
		@('Numero libro','15', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Esdra (= 1 Esdra)','AbbrIT','Esd;Ed','Nome libro LT','Liber Esdræ','AbbrLT','Esd','Nome libro EN','Ezra','AbbrEN','Ezra'),
		@('Numero libro','16', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Neemia (= 2 Esdra)','AbbrIT','Ne','Nome libro LT','Liber Nehemiæ','AbbrLT','Neh','Nome libro EN','Nehemiah','AbbrEN','Neh'),
		@('Numero libro','17', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Tobia','AbbrIT','Tb;Tob;To','Nome libro LT','Liber Tobiæ','AbbrLT','Tob','Nome libro EN','Tobit','AbbrEN','Tob'),
		@('Numero libro','18', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Giuditta','AbbrIT','Gdt;Giudit','Nome libro LT','Liber Judith','AbbrLT','Iudt','Nome libro EN','Judith','AbbrEN','Jdt'),
		@('Numero libro','19', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Ester','AbbrIT','Est;Et','Nome libro LT','Liber Esther','AbbrLT','Esth','Nome libro EN','Esther','AbbrEN','Esth'),
		@('Numero libro','20', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Primo libro dei Maccabei','AbbrIT','1Mac;1 Mac;1Macc;1 Macc;IMac;I Mac;IMacc;I Macc;1M;1 M;IM;I M','Nome libro LT','Liber I Machabæorum','AbbrLT','1 Mach','Nome libro EN','1 Maccabees','AbbrEN','1 Macc'),
		@('Numero libro','21', 'Testamento','Antico Testamento', 'Gruppo','I libri storici', 'Nome libro IT','Secondo libro dei Maccabei','AbbrIT','2Mac;2 Mac;2Macc;2 Macc;IIMac;II Mac;IIMacc;II Macc;2M;2 M;IIM;II M','Nome libro LT','Liber II Machabæorum','AbbrLT','2 Mach','Nome libro EN','2 Maccabees','AbbrEN','2 Macc'),
		@('Numero libro','22', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Giobbe','AbbrIT','Gb;Giob','Nome libro LT','Liber Job','AbbrLT','Iob','Nome libro EN','Job','AbbrEN','Job'),
		@('Numero libro','23', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Salmi','AbbrIT','Sal;Sl','Nome libro LT','Liber Psalmorum','AbbrLT','Ps','Nome libro EN','Psalms','AbbrEN','Ps(s)'),
		@('Numero libro','24', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Proverbi','AbbrIT','Prv;Prov;P','Nome libro LT','Liber Proverbiorum','AbbrLT','Prov','Nome libro EN','Proverbs','AbbrEN','Prov'),
		@('Numero libro','25', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Qoelet (=Ecclesiaste)','AbbrIT','Qo;Ec;Q','Nome libro LT','Liber Ecclesiastes','AbbrLT','Eccle','Nome libro EN','Ecclesiastes','AbbrEN','Eccl'),
		@('Numero libro','26', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Cantico','AbbrIT','Ct;Ca;CC','Nome libro LT','Canticum Canticorum Salomonis','AbbrLT','Cant','Nome libro EN','Song of Songs','AbbrEN','Song'),
		@('Numero libro','27', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Sapienza','AbbrIT','Sap','Nome libro LT','Liber Sapientiæ','AbbrLT','Sap','Nome libro EN','Wisdom of Solomon','AbbrEN','Wis'),
		@('Numero libro','28', 'Testamento','Antico Testamento', 'Gruppo','I libri poetici e sapienziali', 'Nome libro IT','Siracide (= Ecclesiastico)','AbbrIT','Sir;Si','Nome libro LT','Ecclesiasticus Jesu, filii Sirach','AbbrLT','Eccli','Nome libro EN','Sirach/ Ecclesiasticus','AbbrEN','Sir'),
		@('Numero libro','29', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Isaia','AbbrIT','Is','Nome libro LT','Prophetia Isaiæ','AbbrLT','Isai;Isa','Nome libro EN','Isaiah','AbbrEN','Isa'),
		@('Numero libro','30', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Geremia','AbbrIT','Ger;Gr','Nome libro LT','Prophetia Jeremiæ','AbbrLT','Ier','Nome libro EN','Jeremiah','AbbrEN','Jer'),
		@('Numero libro','31', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Lamentazioni','AbbrIT','Lam;La','Nome libro LT','Lamentationes Jeremiæ Prophetæ','AbbrLT','Lam','Nome libro EN','Lamentations','AbbrEN','Lam'),
		@('Numero libro','32', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Baruc','AbbrIT','Bar;B','Nome libro LT','Prophetia Baruch','AbbrLT','Bar','Nome libro EN','Baruch','AbbrEN','Bar'),
		@('Numero libro','33', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Ezechiele','AbbrIT','Ez','Nome libro LT','Prophetia Ezechielis','AbbrLT','Ez','Nome libro EN','Ezekiel','AbbrEN','Ezek'),
		@('Numero libro','34', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti maggiori', 'Nome libro IT','Daniele','AbbrIT','Dn;Dan;Da','Nome libro LT','Prophetia Danielis','AbbrLT','Dan','Nome libro EN','Daniel','AbbrEN','Dan'),
		@('Numero libro','35', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Osea','AbbrIT','Os;O','Nome libro LT','Prophetia Osee','AbbrLT','Os','Nome libro EN','Hosea','AbbrEN','Hos'),
		@('Numero libro','36', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Gioele','AbbrIT','Gl;Gioe;Gi','Nome libro LT','Prophetia Joël','AbbrLT','Ioel','Nome libro EN','Joel','AbbrEN','Joel'),
		@('Numero libro','37', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Amos','AbbrIT','Am','Nome libro LT','Prophetia Amos','AbbrLT','Am','Nome libro EN','Amos','AbbrEN','Amos'),
		@('Numero libro','38', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Abdia','AbbrIT','Abd;Ad','Nome libro LT','Prophetia Abdiæ','AbbrLT','Abd','Nome libro EN','Obadiah','AbbrEN','Obad'),
		@('Numero libro','39', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Giona','AbbrIT','Gio;Gion','Nome libro LT','Prophetia Jonæ','AbbrLT','Ion','Nome libro EN','Jonah','AbbrEN','Jonah'),
		@('Numero libro','40', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Michea','AbbrIT','Mi','Nome libro LT','Prophetia Michææ','AbbrLT','Mic','Nome libro EN','Micah','AbbrEN','Mic'),
		@('Numero libro','41', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Naum','AbbrIT','Na','Nome libro LT','Prophetia Nahum','AbbrLT','Nah','Nome libro EN','Nahum','AbbrEN','Nah'),
		@('Numero libro','42', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Abacuc','AbbrIT','Ab;Abac;Aba;Ac;H','Nome libro LT','Prophetia Habacuc','AbbrLT','Hab','Nome libro EN','Habakkuk','AbbrEN','Hab'),
		@('Numero libro','43', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Sofonia','AbbrIT','Sof;So','Nome libro LT','Prophetia Sophoniæ','AbbrLT','Soph','Nome libro EN','Zephaniah','AbbrEN','Zeph'),
		@('Numero libro','44', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Aggeo','AbbrIT','Ag;Agg','Nome libro LT','Prophetia Aggæi','AbbrLT','Agg','Nome libro EN','Haggai','AbbrEN','Hag'),
		@('Numero libro','45', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Zaccaria','AbbrIT','Zc;Zac;Z','Nome libro LT','Prophetia Zachariæ','AbbrLT','Zach','Nome libro EN','Zechariah','AbbrEN','Zech'),
		@('Numero libro','46', 'Testamento','Antico Testamento', 'Gruppo','I libri profetici: Profeti minori', 'Nome libro IT','Malachia','AbbrIT','Ml;Mal','Nome libro LT','Prophetia Malachiæ','AbbrLT','Mal','Nome libro EN','Malachi','AbbrEN','Mal'),
		@('Numero libro','47', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Matteo Apostolo','AbbrIT','Mt;Mat','Nome libro LT','Evangelium secundum Matthæum','AbbrLT','Matteo','Nome libro EN','Matthew','AbbrEN','Matt'),
		@('Numero libro','48', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Marco','AbbrIT','Mc;Mar;Mr','Nome libro LT','Evangelium secundum Marcum','AbbrLT','Marco','Nome libro EN','Mark','AbbrEN','Mark'),
		@('Numero libro','49', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Luca','AbbrIT','Lc;Lu','Nome libro LT','Evangelium secundum Lucam','AbbrLT','Luca','Nome libro EN','Luke','AbbrEN','Luke'),
		@('Numero libro','50', 'Testamento','Nuovo Testamento', 'Gruppo','I Vangeli', 'Nome libro IT','Vangelo di san Giovanni Apostolo','AbbrIT','Gv;Giov','Nome libro LT','Evangelium secundum Joannem','AbbrLT','Io','Nome libro EN','John','AbbrEN','John'),
		@('Numero libro','51', 'Testamento','Nuovo Testamento', 'Gruppo','Atti', 'Nome libro IT','Atti degli Apostoli','AbbrIT','At','Nome libro LT','Actus Apostolorum','AbbrLT','Act','Nome libro EN','Acts','AbbrEN','Acts'),
		@('Numero libro','52', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Romani','AbbrIT','Rm;Ro','Nome libro LT','Epistola B. Pauli Apostoli ad Romanos','AbbrLT','Rom','Nome libro EN','Romans','AbbrEN','Rom'),
		@('Numero libro','53', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Prima lettera di san Paolo Apostolo ai Corinzi','AbbrIT','1Cor;1 Cor;I Cor;ICor;1Co;ICo;1 Co;I Co','Nome libro LT','Epistola B. Pauli Apostoli ad Corinthios Prima','AbbrLT','1Cor','Nome libro EN','1 Corinthians','AbbrEN','1 Cor'),
		@('Numero libro','54', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Seconda lettera di san Paolo Apostolo ai Corinzi','AbbrIT','2Cor;2 Cor;II cor;IICor;2Co;IICo;2 Co;II Co','Nome libro LT','Epistola B. Pauli Apostoli ad Corinthios Secunda','AbbrLT','2Cor','Nome libro EN','2 Corinthians','AbbrEN','2 Cor'),
		@('Numero libro','55', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Galati','AbbrIT','Gal;Ga','Nome libro LT','Epistola B. Pauli Apostoli ad Galatas','AbbrLT','Gal','Nome libro EN','Galatians','AbbrEN','Gal'),
		@('Numero libro','56', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo agli Efesini','AbbrIT','Ef','Nome libro LT','Epistola B. Pauli Apostoli ad Ephesios','AbbrLT','Eph','Nome libro EN','Ephesians','AbbrEN','Eph'),
		@('Numero libro','57', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Filippesi','AbbrIT','Fil;Fili;Fl','Nome libro LT','Epistola B. Pauli Apostoli ad Philippenses','AbbrLT','Phil','Nome libro EN','Philippians','AbbrEN','Phil'),
		@('Numero libro','58', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo ai Colossesi','AbbrIT','Col;Cl;Co','Nome libro LT','Epistola B. Pauli Apostoli ad Colossenses','AbbrLT','Col','Nome libro EN','Colossians','AbbrEN','Col'),
		@('Numero libro','59', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Prima Lettera di san Paolo Apostolo ai Tessalonicesi','AbbrIT','1Ts;1 Ts;1Te;1 Te;ITs;I Ts;ITe;I Te','Nome libro LT','Epistola B. Pauli Apostoli ad Thessalonicenses Prima','AbbrLT','1 Thess','Nome libro EN','1 Thessalonians','AbbrEN','1 Thess'),
		@('Numero libro','60', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Seconda Lettera di san Paolo Apostolo ai Tessalonicesi','AbbrIT','2Ts;2 Ts;2Te;2 Te;IITs;II Ts;IITe;II Te','Nome libro LT','Epistola B. Pauli Apostoli ad Thessalonicenses Secunda','AbbrLT','2 Thess','Nome libro EN','2 Thessalonians','AbbrEN','2 Thess'),
		@('Numero libro','61', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Prima Lettera di san Paolo Apostolo a Timoteo','AbbrIT','1Tm;1 Tm;1Ti;1 Ti;ITm;I Tm;ITi;I Ti','Nome libro LT','Epistola B. Pauli Apostoli ad Timotheum Prima','AbbrLT','1 Tim','Nome libro EN','1 Timothy','AbbrEN','1 Tim'),
		@('Numero libro','62', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Seconda Lettera di san Paolo Apostolo a Timoteo','AbbrIT','2Tm;2 Tm;2Ti;2 Ti;IITm;II Tm;IITi;II Ti','Nome libro LT','Epistola B. Pauli Apostoli ad Timotheum Secunda','AbbrLT','2 Tim','Nome libro EN','2 Timothy','AbbrEN','2 Tim'),
		@('Numero libro','63', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo a Tito','AbbrIT','Tt;Ti;Tit','Nome libro LT','Epistola B. Pauli Apostoli ad Titum','AbbrLT','Tit','Nome libro EN','Titus','AbbrEN','Titus'),
		@('Numero libro','64', 'Testamento','Nuovo Testamento', 'Gruppo','Le Lettere Paoline', 'Nome libro IT','Lettera di san Paolo Apostolo a Filemone','AbbrIT','Fm;File','Nome libro LT','Epistola B. Pauli Apostoli ad Philemonem','AbbrLT','Philem','Nome libro EN','Philemon','AbbrEN','Phlm'),
		@('Numero libro','65', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Lettera agli Ebrei','AbbrIT','Eb','Nome libro LT','Epistola B. Pauli Apostoli ad Hebræos','AbbrLT','Hebr','Nome libro EN','Hebrews','AbbrEN','Heb'),
		@('Numero libro','66', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Lettera di san Giacomo Apostolo','AbbrIT','Gc;Giac;Gia;Gm','Nome libro LT','Epistola Catholica B. Jacobi Apostoli','AbbrLT','Iac','Nome libro EN','James','AbbrEN','Jas'),
		@('Numero libro','67', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Prima Lettera di san Pietro Apostolo','AbbrIT','1Pt;1 Pt;1P;1 P;IP;I P','Nome libro LT','Epistola B. Petri Apostoli Prima','AbbrLT','1Pt','Nome libro EN','1 Peter','AbbrEN','1 Pet'),
		@('Numero libro','68', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Seconda Lettera di san Pietro Apostolo','AbbrIT','2Pt;2 Pt;2P;2 P;IIP;II P','Nome libro LT','Epistola B. Petri Apostoli Secunda','AbbrLT','2Pt','Nome libro EN','2 Peter','AbbrEN','2 Pet'),
		@('Numero libro','69', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Prima lettera di san Giovanni Apostolo ed Evangelista','AbbrIT','1Gv;1 Gv;I Gv;IGv;1G;1 G;IG;I G','Nome libro LT','Epistola B. Joannis Apostoli Prima','AbbrLT','I Io','Nome libro EN','1 John','AbbrEN','1 John'),
		@('Numero libro','70', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Seconda lettera di san Giovanni Apostolo ed Evangelista','AbbrIT','2Gv;2 Gv;II Gv;IIGv;2G;2 G;IIG;II G','Nome libro LT','Epistola B. Joannis Apostoli Secunda','AbbrLT','II Io','Nome libro EN','2 John','AbbrEN','2 John'),
		@('Numero libro','71', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Terza lettera di san Giovanni Apostolo ed Evangelista','AbbrIT','3Gv;3 Gv;III Gv;IIIGv;3G;3 G;IIIG;III G','Nome libro LT','Epistola B. Joannis Apostoli Tertia','AbbrLT','III Io','Nome libro EN','3 John','AbbrEN','3 John'),
		@('Numero libro','72', 'Testamento','Nuovo Testamento', 'Gruppo','Le altre Lettere Cattoliche', 'Nome libro IT','Lettera di san Giuda Apostolo','AbbrIT','Gd;Giuda','Nome libro LT','Epistola Catholica B. Judæ Apostoli','AbbrLT','Iud','Nome libro EN','Jude','AbbrEN','Jude'),
		@('Numero libro','73', 'Testamento','Nuovo Testamento', 'Gruppo','Scritti apocalittici e apocalittica', 'Nome libro IT','Apocalisse di san Giovanni Apostolo ed Evangelista','AbbrIT','Ap','Nome libro LT','Apocalypsis B. Joannis Apostoli','AbbrLT','Apoc','Nome libro EN','Revelation','AbbrEN','Rev')
	)

Set-Variable -Option Constant -Name 'startPage' -Value 'https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_index_lt.html';
$arrayBooksOldTestamentLinks	= @();
$arrayBooksNewTestamentLinks	= @();
$arrayBooksOldTestamentTitles	= @();
$arrayBooksNewTestamentTitles	= @();
$linkOldTestamentPage			= '';
$linkNewTestamentPage			= '';
$buildingString					= '';
$tmpFolder						= 'D:\\Documenti\\GitHub\\EmanueleTinari\\Obsidian\\Chiesa\\_01 - tmpBibleFolderDL\\';
$tipoTestamento					= '';
$bookTitle						= '';
$numeroLibro					= '';
$nomeLibroInLatino 				= '';
$abbreviazioneLibroInItaliano	= '';
$nomeLibroInItaliano 			= '';
$nomeCartella					= '';
$nomeFile						= '';
$numCapitolo					= '';
$numVersetto					= '';

Add-Type -AssemblyName "Microsoft.mshtml"
#creating the xmlHtpp system object              
$http_request = New-Object -ComObject Msxml2.XMLHTTP
$http_request.open('GET', $startPage, $false)
#Sending the request
$http_request.send()

if ( $http_request.status -eq 200 ) {

	#printing the request result
	Write-Output $http_request.statusText
	#printing the request text
	Write-Output $http_request.responseText
	#creating the html document object
	$html = New-Object -ComObject "HTMLFile"
	$html.IHTMLDocument2_write($http_request.responseText)
	$html.close()

	#getting the links to the Old Testament books
	$linksOldTestament = $html.getElementsByTagName('a')
	foreach ($link in $linksOldTestament) {
		if ($link.href -like 'https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_') {
			$arrayBooksOldTestamentLinks += $link.href
			$arrayBooksOldTestamentTitles += $link.innerText
		}
	}

	#getting the links to the New Testament books
	$linksNewTestament = $html.getElementsByTagName('a')
	foreach ($link in $linksNewTestament) {
		if ($link.href -like 'https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_') {
			$arrayBooksNewTestamentLinks += $link.href
			$arrayBooksNewTestamentTitles += $link.innerText
		}
	}

	#processing Old Testament books
	#for ($i = 0; $i -lt $arrayBooksOldTestamentLinks.Count; $i++) {
	#	$linkOldTestamentPage = $arrayBooksOldTestamentLinks[$i]
	#	$tipoTestamento = 'Antico Testamento'
	#	$bookTitle = $arrayBooksOldTestamentTitles[$i]
	#	ProcessBookLink -linkPage $linkOldTestamentPage -tipoTestamento $tipoTestamento -bookTitle $bookTitle
	#}

	#processing New Testament books
	for ($i = 0; $i -lt $arrayBooksNewTestamentLinks.Count; $i++) {
		$linkNewTestamentPage = $arrayBooksNewTestamentLinks[$i]
		$tipoTestamento = 'Nuovo Testamento'
		$bookTitle = $arrayBooksNewTestamentTitles[$i]
		ProcessBookLink -linkPage $linkNewTestamentPage -tipoTestamento $tipoTestamento -bookTitle $bookTitle
	}
} else {
	Write-Output "Error: Unable to fetch data from Vatican website."
}

