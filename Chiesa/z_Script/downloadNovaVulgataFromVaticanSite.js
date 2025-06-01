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



















// == Part 1: Setup and Fetch Book List ==
console.log("Magisterium AI: Initializing script...");

// --- Helper Functions ---
async function fetchHtmlAsText(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} for ${url}`);
            throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching HTML:", error.message);
        throw error; // Re-throw to be caught by caller
    }
}

function parseHtml(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, "text/html");
}

function formatTextForCsv(text) {
    let processedText = text.replace(/"/g, '""'); // Escape double quotes by doubling them
    // Enclose in double quotes if it contains comma, newline, or already had a (now escaped) double quote
    if (processedText.includes(',') || processedText.includes('\n') || processedText.includes('"')) {
        processedText = `"${processedText}"`;
    }
    return processedText;
}

// --- Core Logic Functions ---
async function getBookLinks(mainPageUrl) {
    console.log("Fetching book links from:", mainPageUrl);
    let htmlText;
    try {
        htmlText = await fetchHtmlAsText(mainPageUrl);
    } catch (e) {
        return []; // Return empty if fetch fails
    }

    const doc = parseHtml(htmlText);
    const links = [];
    const baseUrl = mainPageUrl.substring(0, mainPageUrl.lastIndexOf('/') + 1);

    // Selector for links to individual books
    // Example: <a href="nova-vulgata_NT_evang._matthaeum_lt.html">
    const linkElements = doc.querySelectorAll('a[href*="nova-vulgata_NT_"][href$="_lt.html"]');
    
    linkElements.forEach(a => {
        const href = a.getAttribute('href');
        // Exclude the link to the main New Testament index page itself
        if (href && !href.includes('novum-testamentum_lt.html')) {
            let bookName = a.textContent.trim();
            if (!bookName) { // Fallback if <a> tag is empty
                bookName = href.replace(/nova-vulgata_NT_|_lt.html/g, '')
                               .replace(/evang._/g, 'Evangelium Secundum ')
                               .replace(/._/g, ' ')
                               .replace(/_/g, ' ')
                               .replace(/\s+/g, ' ') // Normalize spaces
                               .trim();
            }
            links.push({
                name: bookName,
                url: new URL(href, baseUrl).href
            });
        }
    });
    console.log(`Found ${links.length} book links.`);
    return links;
}

async function processBook(bookUrl, bookName) {
    console.log(`Processing book: ${bookName} (${bookUrl})`);
    let htmlText;
    try {
        htmlText = await fetchHtmlAsText(bookUrl);
    } catch (e) {
        return `Error: Could not fetch content for ${bookName}. ${e.message}`;
    }

    const doc = parseHtml(htmlText);
    let csvContent = "Line,Text\n";
    let lineNumber = 1;

    // Verses are typically in <p align="justify"> or <p align="JUSTIFY"> tags.
    // The attribute value might be case-sensitive depending on browser/parser, so check both.
    const verseElements = doc.querySelectorAll('p[align="justify"], p[align="JUSTIFY"]');
    
    if (verseElements.length === 0) {
        console.warn(`No verse paragraphs found with 'p[align="justify"]' or 'p[align="JUSTIFY"]' for ${bookName}. Check page structure.`);
        // Attempt a more generic paragraph selector if specific one fails, though this might grab unwanted text.
        // For now, we'll rely on the specific selectors.
        // const alternativeVerses = doc.querySelectorAll('body p'); // Example broader selector
        // console.log(`Attempting fallback selector, found ${alternativeVerses.length} paragraphs.`);
        // alternativeVerses.forEach(pElement => { ... });
    }

    verseElements.forEach(pElement => {
        const text = pElement.textContent.trim();
        if (text) { // Ensure there's text content
            csvContent += `${lineNumber},${formatTextForCsv(text)}\n`;
            lineNumber++;
        }
    });

    if (lineNumber === 1) { // Only header was added
        return `Warning: No text lines extracted for ${bookName}. The CSV will be empty except for the header. This might indicate a change in the website structure for this book or an issue with selectors.`;
    }
    console.log(`Extracted ${lineNumber - 1} lines for ${bookName}.`);
    return csvContent;
}

async function copyToClipboard(text, bookName) {
    try {
        await navigator.clipboard.writeText(text);
        console.log(`CSV content for "${bookName}" copied to clipboard!`);
        alert(`CSV content for "${bookName}" has been copied to your clipboard.

Paste it into Notepad and save as a .csv file (remember to use UTF-8 encoding).`);
    } catch (err) {
        console.error(`Failed to copy text for "${bookName}": `, err);
        alert(`Failed to copy CSV for "${bookName}" to clipboard. See console for error. You may need to enable clipboard permissions for this site or copy the text manually from the console log below.`);
        console.log(`---BEGIN CSV CONTENT for ${bookName}---`);
        console.log(text);
        console.log(`---END CSV CONTENT for ${bookName}---`);
    }
}

// --- Global Variables and Initialization ---
var allBookLinks = []; // Use var for console accessibility if re-running parts
var currentBookIndex = 0;
const mainVaticanUrl = "https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_novum-testamentum_lt.html";

async function initializeBookProcessing() {
    console.log("Magisterium AI: Starting initialization...");
    document.body.style.cursor = 'wait'; // Indicate processing
    allBookLinks = []; // Reset if re-initializing
    currentBookIndex = 0; // Reset if re-initializing

    try {
        allBookLinks = await getBookLinks(mainVaticanUrl);
        if (allBookLinks.length > 0) {
            console.log(`Found ${allBookLinks.length} books. Ready to process the first book.`);
            console.log("To process the first book, call: await processAndCopyNextBook();");
            alert(`Initialization complete!\nFound ${allBookLinks.length} books.

To process the first book ("${allBookLinks.name}"), type the following command into the console and press Enter:

await processAndCopyNextBook();`);
        } else {
            console.error("No book links found. Check the main URL or selectors in getBookLinks function.");
            alert("Could not find any book links. Please check the console for errors. The website structure might have changed.");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
        alert("An error occurred during initialization. Check the console for details.");
    } finally {
        document.body.style.cursor = 'default';
    }
}

console.log("Magisterium AI: Part 1 loaded. Call 'await initializeBookProcessing();' to fetch the book list.");
// End of Part 1





//After Pasting and Running Part 1:

// You should see messages in the console indicating that Part 1 is loaded.
// Now, type the following command into the console and press Enter to fetch the list of books:

    // javascript await initializeBookProcessing();

// An alert should pop up telling you how many books were found and instructing you on how to process the first one.







// == Part 2: Process Next Book and Copy to Clipboard ==
// This function is already defined in Part 1. You just need to call it.
// The command to call is: await processAndCopyNextBook();

async function processAndCopyNextBook() {
    if (typeof allBookLinks === 'undefined' || allBookLinks.length === 0) {
        console.log("Book list not initialized. Please run 'await initializeBookProcessing();' first (ensure Part 1 was executed).");
        alert("Initialization not done or failed. Please ensure Part 1 of the script was executed successfully and then run 'await initializeBookProcessing();'.");
        return;
    }

    if (currentBookIndex >= allBookLinks.length) {
        console.log("All books have been processed.");
        alert("All books have been processed!");
        return;
    }

    const bookToProcess = allBookLinks[currentBookIndex];
    console.log(`--- Starting processing for book ${currentBookIndex + 1} of ${allBookLinks.length}: ${bookToProcess.name} ---`);
    alert(`Now processing: ${bookToProcess.name} (${bookToProcess.url}).\nThis may take a moment. Click OK to continue.`);
    
    document.body.style.cursor = 'wait';
    let csvData;
    try {
        csvData = await processBook(bookToProcess.url, bookToProcess.name);
    } catch (error) {
        console.error(`Critical error processing book ${bookToProcess.name}:`, error);
        alert(`A critical error occurred while processing ${bookToProcess.name}. Check the console. You can try the next book.`);
        csvData = `Error: Critical error processing ${bookToProcess.name}. ${error.message}`;
    } finally {
        document.body.style.cursor = 'default';
    }
    

    if (csvData.startsWith("Error:") || csvData.startsWith("Warning:")) {
        console.error(csvData); // Log the error/warning message
        // Alert is handled by copyToClipboard or processBook for specific errors
        // If it's a warning, we might still want to try copying.
        if (csvData.startsWith("Error:")) {
             alert(csvData + "\nCheck the console for details. You can try processing the next book.");
        } else { // It's a warning, e.g. no lines extracted
            await copyToClipboard(csvData, bookToProcess.name); // Still copy the header + warning
        }
    } else {
        await copyToClipboard(csvData, bookToProcess.name);
    }

    currentBookIndex++;

    if (currentBookIndex < allBookLinks.length) {
        console.log(`Ready for the next book: ${allBookLinks[currentBookIndex].name}.`);
        console.log("To process it, call 'await processAndCopyNextBook();' again.");
        alert(`Processing of "${bookToProcess.name}" is complete.

Ready for the next book: "${allBookLinks[currentBookIndex].name}".

To process it, type the following command into the console and press Enter:

await processAndCopyNextBook();`);
    } else {
        console.log("All books have been processed.");
        alert("Congratulations! All books have been processed.");
    }
}

//


