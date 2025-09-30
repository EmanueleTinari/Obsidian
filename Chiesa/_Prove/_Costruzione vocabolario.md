---
creato: 16/05/2025 05:57:38
modificato: 09/07/2025 00:16:15
---



```dataviewjs

const dir = "Documenti";
// Replace with the folder or file to exclude
const exclude = "_";
const myYalm = "---"

const myFiles = await app.vault.getFiles()
    // Filter files within the specified folder and exclude file var
    .filter(
	    file => file.extension === 'md' &&
	    file.path.startsWith(dir) &&
	    !file.basename.startsWith(exclude)
	)
    //Sort by last modified time (descending)
	.sort((a, b) => a.name.localeCompare(b.name));

console.log(myFiles);
dv.list(myFiles.map(file => dv.fileLink(file.path)));

var numberFilesToElaborate = myFiles.length;
console.log("Number of files to elaborate: " + numberFilesToElaborate);

// Main loop throught all files found
for(var myFileCounter = 0; myFileCounter < ((myFiles.length)-9); myFileCounter++) {
	console.log("Elaborazione file n. " + (myFileCounter + 1) +
				" di " + numberFilesToElaborate + " : " +
				 myFiles[myFileCounter].basename);

	const myFileContent = await dv.io.load(myFiles[myFileCounter].path)
	//console.log("Content of " + myFiles[myFileCounter].basename + " file:\n" + myFileContent);
	
	var myFileLines = (myFileContent.match(/\n/g) || '').length + 1;
	console.log("Number of lines \(MATCH mode\) in " + myFiles[myFileCounter].basename + " file:\n" + myFileLines);

	var yalmCounter = 1
	var yalmTotal = 3;
	var extractedWords = [];
	var extractedLines = [];
	extractedLines = myFileContent.split('\n');
	console.log( "extractedLines var content: \n" + extractedLines );

	// Main loop throught all lines of every file
	Loop1:
		for ( var lineCounter = 0; lineCounter < extractedLines.length; lineCounter++ ) {
			console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" + extractedLines[lineCounter] );
	
			// myYalm = '---' loop should be in :
			// - n. 1, first line of Frontmatter,
			// - n. 2, last line of Frontmatter,
			// - n. 3, line divisors of text,
			// - n. 4, line divisors of Copyright info.
			// Se il valore della linea estratta è uguale alla variabile myYalm, cioè '---' e il contatore è 1:
			if ( extractedLines[lineCounter] === myYalm && yalmCounter == 1 ) {
				// siamo alla prima riga del Frontmatter, aggiungo 1 alla variabile yalmCounter
				yalmCounter++;
				console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" +
							 "SALTO\n" +
							  extractedLines[lineCounter] );
				// salto alla prossima riga
				continue Loop1;
			}
			// Se il valore della linea estratta NON è uguale alla variabile myYalm e il contatore è 1:
			else if ( extractedLines[lineCounter] !== myYalm && yalmCounter == 1 ) {
				// siamo dentro al Frontmatter, salto alla prossima riga
				console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" +
							 "SALTO\n" +
							  extractedLines[lineCounter] );
				continue Loop1;			
			}
			// Se il valore della linea estratta è uguale alla variabile myYalm e il contatore è 2:
			else if ( extractedLines[lineCounter] == myYalm && yalmCounter == 2 ) {
				// siamo all'ultima riga del Frontmatter, aggiungo 1 alla variabile yalmCounter
				yalmCounter++;
				console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" +
							 "SALTO\n" +
							  extractedLines[lineCounter] );
				// salto alla prossima riga
				continue Loop1;
			}
			// Se il valore della linea estratta è uguale alla variabile myYalm e il contatore è 3:
			else if ( extractedLines[lineCounter] == myYalm && yalmCounter == 3 ) {
				// siamo alla linea di divisione del testo da estrarre, aggiungo 1 alla variabile yalmCounter
				yalmCounter++;
				console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" +
							 "SALTO\n" +
							  extractedLines[lineCounter] );
				// salto alla prossima riga
				continue Loop1;			
			}
			// Se il valore della linea estratta NON è uguale alla variabile myYalm
			// e il contatore è 3, siamo dentro al testo da estrarre
			else if ( extractedLines[lineCounter] !== myYalm && yalmCounter == 3 ) {
				// se la linea estratta è vuota
				if ( extractedLines[lineCounter] === "" ) {
					console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" +
								 "Linea vuota, SALTO:\n" +
					 			  extractedLines[lineCounter] );
					// salto alla prossima riga
					continue Loop1;
				}
				// se la linea contiene una parentesi graffa
				else if ( extractedLines[lineCounter] !== "" && (extractedLines[lineCounter].includes( '{' )) ) {
					console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" +
								 "Parentesi graffa, SALTO:\n" +
								  extractedLines[lineCounter] );
					// salto alla prossima riga
					continue Loop1;
				}
				// se la linea contiene una parentesi graffa
				else if ( extractedLines[lineCounter] !== "" && !(extractedLines[lineCounter].includes( '{' )) ) {
					// carico la riga nell'Array
					extractedWords.push(extractedLines[lineCounter]);
					console.log( "Linea n. " + (lineCounter + 1) + " di " + extractedLines.length + ":\n" + extractedLines[lineCounter] );
					continue Loop1;
				}
			}
		}

	console.log("extractedWords: " + extractedWords);

	console.log("Numero di linee contate con la funzione lineCount:\n" + lineCount(myFileContent));

	function lineCount( text ) {
	    var nLines = 0;
	    for( var i = 0, n = text.length;  i < n;  ++i ) {
	        if( text[i] === '\n' ) {
	            ++nLines;
	        }
	    }
	    return nLines+1;
	}


	console.log("Numero di linee contate con la funzione lineCount:\n" + myFileContent.length);

	//var wordArray = [];
	//wordArray.push(myFileContent.match(/[\p{L}\p{N}\p{S}\p{M}]+/gu));
	//console.log("wordArray length: " + wordArray.length + "\n" + "contenuto:\n" + wordArray);
	
	//const allWords = myFileContent.match(/[\p{L}\p{N}\p{S}\p{M}]+/gu);
	//const filteredWords = allWords.filter( word => /^a/i.test(word) );
	//console.log("filteredWords: " + filteredWords);
//                                                ^ words starting with letter 'A'

	//var string = "0,1";
	//var stringArray = (new Function("return [" + wordArray + "];")());
	//console.log(stringArray);
	
	//var splitArray = [];
	//console.log("splitArray: " + splitArray);
	
	//var splitArray = (new Function("return [" + wordArray + "];")());

	//splitArray = wordArray.split(/\s*,\s*(?:,\s*)*/);
	//console.log("splitArray: " + splitArray);
	//let uniqueArray = [...new Set(wordArray)];
	//console.log(uniqueArray); // unique is ['A', 1, 2, '1']

//str.split(/[ ,.!?]+/).filter(Boolean);
}


```


```javascript




```
