currentTime = getDateTime();
console.log(dateTime);

// Create new [VAR mdOpenText] containing empty string.
var mdOpenText = "";
// Start building initial text string.
mdOpenText += ""
            + `\-\-\-`                                                 // Line 01
            + "\n"
            + `cssClasses\: docVat`                                  // Line 02
            + "\n"
            + `autore-doc\: \"\[\[ATTENZIONE\!\!\! Mettere l\'Autore \!\!\!\|ATTENZIONE\!\!\! Mettere l\'Autore \!\!\!\]\]\"`  // Line 03
            + "\n"
            + `tipo-doc\: \"\[\[ATTENZIONE\!\!\! Mettere il Tipo \!\!\!\|ATTENZIONE\!\!\! Mettere il Tipo \!\!\!\]\]"`                 // Line 0
            + "\n"
            + `titolo-doc\: ATTENZIONE\!\!\! Mettere il Titolo del documento \!\!\!`                 // Line 0
            + "\n"
            + `lingua-doc\: ATTENZIONE!!! Mettere la LINGUA del documento \!\!\!`                 // Line 0
            + "\n"
            + `lingua-orig\: ATTENZIONE\!\!\! Mettere la LINGUA ORIGINALE del documento \!\!\!`                 // Line 0
            + "\n"
            + `tags\:`                 // Line 0
            + "\n"
            + `  \- ATTENZIONE\!\!\! Mettere il TAG al TIPO di documento \!\!\!`                 // Line 0
            + "\n"
            + `  \- ATTENZIONE\!\!\! Mettere il TAG all'AUTORE del documento \!\!\!`                 // Line 0
            + "\n"
            + `  \- ATTENZIONE\!\!\! Mettere il TAG al TITOLO del documento \!\!\!`                 // Line 0
            + "\n"
            + `licenza\-doc\: Copyright \© Dicastero per la Comunicazione \- Libreria Editrice Vaticana`          // Line 0
            + "\n"
            + `licenza-nota: \© 2025 Emanuele Tinari under \"\[Creative Commons BY-NC-SA 4.0\]\(https:\/\/creativecommons.org\/licenses\/by-nc-sa\/4.0\/\)\"`                 // Line 0
            + "\n"
            + `url\-doc\: \"\[Link al documento sul sito del Vaticano\]\(ATTENZIONE\!\!\! Mettere il LINK al sito del documento \!\!\!\)\"`                         // Line 0
            + "\n"
            + `creato\: ` + currentTime                     // Line 0
            + "\n"
            + `aggiornato\: ` + currentTime                 // Line 0
            + "\n"
            + `\-\-\-`                 // Line 0
            + "\n"
            + "\n"
            + `\-\-\-`                 // Line 0
            + "\n";

console.log("Contenuto variabile mdOpenText:" + "\n" + mdOpenText);

// Create new [VAR mdCloseText] containing empty string.
var mdCloseText = "";
// Start building initial text string.
mdCloseText += ""
            + `---`                                                                         // Line 01
            + "\n"
            + `Copyright © Dicastero per la Comunicazione - Libreria Editrice Vaticana.`    // Line 02
            + "\n";
            + ` {  .diritti-autore }`                                                       // Line 03
            + "\n";


console.log("Contenuto variabile mdCloseText:" + "\n" + mdCloseText);


var startRoot = "https://www.vatican.va/archive/bible/nova_vulgata/documents/";
console.log("Contenuto variabile startRoot:" + "\n" + startRoot);

var allLink = document.getElementsByTagName('a');

var arrayData = [];

for( var linkCounter = 0; linkCounter < allLink.length; linkCounter ++ ) {
    console.log("Link n. " + linkCounter + " : " + allLink[linkCounter].getAttribute('href'));
    extractLink = "";
    extractLink = allLink[linkCounter].getAttribute('href');
    console.log("Link extract: " + extractLink);
    if (extractLink !== null) {
        console.log("var extractLink piena!");
        var strContent = 'nova';
        if (extractLink.startsWith(strContent) == true) {
            console.log("IF extract! " + "\n" + "Link n. " + linkCounter + "\n" + extractLink);
            navigateLink = startRoot + extractLink;
            arrayData.push(navigateLink);
        }
    }
}

console.log(arrayData);
var arrayLength = arrayData.length;
for (var arrayCounter = 0; arrayCounter < arrayLength; arrayCounter ++) {
    console.log(arrayData[arrayCounter]);
    navigateLink = arrayData[arrayCounter];
    window.open(navigateLink,"_self");
    goOn(8*(10 ** 9));  // 4 secs

    $("body").children("p").each(function(e,v){
        console.log($(v).text());
    });

    var paragraphs = document.getElementsByTagName("p");
    console.log(paragraphs);
    for(var i = 0; i < paragraphs.length; i++)
    {
        console.log(paragraphs[i].innerHTML);
    }
}

function goOn(secs) {
    let counter = 0;
    do {
        counter ++;
    } while (counter < secs);
    console.log(counter);
    // to run: goOn(8*(10 ** 9));  // 4 secs
}



function buildTXT() {    
    var htmlText = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Apri TXT in Notepad</title>
        </head>
        <body id="mainBody">
            <h1 style="color: lightGray; font-size: 40px; text-align: center;">Scarico il file txt ?</h1>
        </body>
    </html>`;
    var myUrl = URL.createObjectURL (new Blob ([htmlText], { type: "text/html" }));
    var myWindow = window.open (myUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
    myWindow.onload = function(){
        var universalBOM = "\uFEFF";
        var par = document.createElement('p');
        par.text = "Click qui sotto per scaricare il file di testo.";
        myWindow.document.body.appendChild(par);
        var link = document.createElement('a');
        link.setAttribute('download', 'ExtractData.txt');
        link.href = "data:attachment/csv;charset=utf-8,"+encodeURIComponent("" + universalBOM + globalStrToBuild);
        link.text = "Scarica..."
        link.style= "color:blue;" + "font-size:40px;"
        myWindow.document.body.appendChild(link);
        myWindow.document.body.setAttribute('style','background-color: black !important;');
    }
}

function getDateTime() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }

    // Format for my Obsidian: 07-05-2025T14:57:27
    var dateTime = day + '-' + month + '-' + year + '_' + hour + ':' + minute + ':' + second;
    // Format: 2025-05-07 14:57:27
    //var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
     return dateTime;
}