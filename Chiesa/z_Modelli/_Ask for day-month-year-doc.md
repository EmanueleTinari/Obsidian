<%*

let isDayDocCorrect	= true;
var dayDoc			= "";

while (isDayDocCorrect) {
	// wait for user input
	var tmpDay = await tp.system.prompt("Insert document publication day");
	// tmpDay variable contains user answer
	console.log("tmpDay var value: " + tmpDay);
	// https://stackoverflow.com/a/14636638/4805093
	// check tmpDay var value, this should be an integer number from 1 to 31
	if ( tmpDay === "" || !tmpDay ) {
		// user not insert nothing
		console.log("tmpDay is empty: " + tmpDay);
		var question = "Day value is empty. Do you want to repeat, leave field empty or exit?";
		console.log("const question: " + question);
		var chose = await tp.system.suggester(['Repeat ask for day document', 'Leave field empty', 'Exit'],['Repeat ask for day document', 'Leave field empty', 'Exit'], false, question);
		console.log("const answer: " + chose);
		if (chose === 'Repeat ask for day document')
		{
			console.log("const chose: " + chose);
			chose		= '';
			question	= '';
		}
		else if (chose === 'Leave field empty')
		{
			console.log("const chose: " + chose);
			dayDoc			= tmpDay;
			chose			= '';
			question		= '';
			isDayDocCorrect	= false;
		}
		else if (chose === 'Exit')
		{
			console.log("const chose: " + chose);
			chose			= '';
			question		= '';
			isDayDocCorrect	= false;
			return;
		}
	}
	else if ( isNaN(tmpDay) ) {
		// no it is NOT numeric
		console.log("tmpDay is NOT numeric: " + tmpDay);
	}
	else {
		// yes it is numeric
		if ( tmpDay % 1 === 0 ) {
			// yes it's an integer
			if ( tmpDay >= 1 && tmpDay <= 31 ) {
				// yes it's in range 1-31
				// https://stackoverflow.com/a/6454237/4805093
				if ( tmpDay <= 9 ) {
					// if value in var start with one or more 0, remove it
					while(tmpDay.charAt(0) === '0') {
						tmpDay = tmpDay.substring(1);
					}
					// yes is a number less or equal than 9
					console.log("tmpDay less or equal than 9: " + tmpDay);
					dayDoc			= '0' + tmpDay;
					tmpDay			= '';
					isDayDocCorrect	= false;
				}
				else if ( tmpDay >= 10 ) {
					// if value in var start with one or more 0, remove it
					while(tmpDay.charAt(0) === '0') {
						tmpDay = tmpDay.substring(1);
					}
					// yes is a number more or equal than 10
					console.log("tmpDay more or equal than 10: " + tmpDay);
					dayDoc			= tmpDay;
					tmpDay			= '';
					isDayDocCorrect	= false;
				}
			}
			else {
				// no it is NOT in range 1-31
				console.log("tmpDay is NOT in range 1 - 31: " + tmpDay);
			}
		}
		else {
			// no it is NOT an integer
			console.log("tmpDay is NOT an integer: " + tmpDay);
		}
	}
}

console.log("Content of variable dayDoc: " + dayDoc);

let isMonthDocCorrect	= true;
var monthDoc			= "";

while (isMonthDocCorrect) {
	// wait for user input
	var tmpMonth = await tp.system.prompt("Insert document publication month");
	// tmpMonth variable contains user answer
	console.log("tmpMonth var value: " + tmpMonth);
	// check tmpMonth var value, this should be an integer number from 1 to 12
	if ( tmpMonth === "" || !tmpMonth ) {
		// user not insert nothing
		console.log("tmpMont is empty: " + tmpMonth);
		var question = "Month value is empty. Do you want to repeat, leave field empty or exit?";
		console.log("const question: " + question);
		var chose = await tp.system.suggester(['Repeat ask for month document', 'Leave field empty', 'Exit'],['Repeat ask for month document', 'Leave field empty', 'Exit'], false, question);
		console.log("const answer: " + chose);
		if (chose === 'Repeat ask for month document')
		{
			console.log("const chose: " + chose);
			chose		= '';
			question	= '';
		}
		else if (chose === 'Leave field empty')
		{
			console.log("const chose: " + chose);
			monthDoc			= tmpMonth;
			chose				= '';
			question			= '';
			isMonthDocCorrect	= false;
		}
		else if (chose === 'Exit')
		{
			console.log("const chose: " + chose);
			chose				= '';
			question			= '';
			isMonthDocCorrect	= false;
			return;
		}
	}
	else if (isNaN(tmpMonth)) {
		// no it is NOT numeric
		console.log("tmpMonth is NOT numeric: " + tmpMonth);
	}
	else {
		// yes it is numeric
		if ( tmpMonth % 1 === 0 ) {
			// yes it's an integer
			if ( tmpMonth >= 1 && tmpMonth <= 12 ) {
				// yes it's in range 1-12
				if ( tmpMonth <= 9 ) {
					// if value in var start with one or more 0, remove it
					while(tmpMonth.charAt(0) === '0') {
						tmpMonth = tmpMonth.substring(1);
					}
					// yes is a number less or equal than 9
					console.log("tmpMonth less or equal than 9: " + tmpMonth);
					monthDoc			= '0' + tmpMonth;
					tmpMonth			= '';
					isMonthDocCorrect	= false;
				}
				else if ( tmpMonth >= 10 ) {
					// if value in var start with one or more 0, remove it
					while(tmpMonth.charAt(0) === '0') {
						tmpMonth = tmpMonth.substring(1);
					}
					// yes is a number more or equal than 10
					console.log("tmpMonth more or equal than 10: " + tmpMonth);
					monthDoc			= tmpMonth;
					tmpMonth			= '';
					isMonthDocCorrect	= false;
				}
			}
			else {
				// no it is NOT in range 1-12
				console.log("tmpMonth is NOT in range 1 - 12: " + tmpMonth);
			}
		}
		else {
			// no it is NOT an integer
			console.log("tmpMonth is NOT an integer: " + tmpMonth);
		}
	}
}

console.log("Content of variable monthDoc: " + monthDoc);

let isYearDocCorrect	= true;
var yearDoc				= "";
// returns the next year
var nextYear			= new Date().getFullYear() + 1
console.log("nextYear var value: " + nextYear);

while (isYearDocCorrect) {
	// wait for user input
	var tmpYear = await tp.system.prompt("Insert document publication year");
	// tmpYear variable contains user answer
	console.log("tmpYear var value: " + tmpYear);
	// check tmpYear var value, this should be an integer number from 50 to next year
	if ( tmpYear === "" || !tmpYear ) {
		// user not insert nothing
		console.log("tmpYear is empty: " + tmpYear);
		var question = "Year value is empty. Do you want to repeat, leave field empty or exit?";
		console.log("const question: " + question);
		var chose = await tp.system.suggester(['Repeat ask for year document', 'Leave field empty', 'Exit'],['Repeat ask for year document', 'Leave field empty', 'Exit'], false, question);
		console.log("const answer: " + chose);
		if (chose === 'Repeat ask for year document')
		{
			console.log("const chose: " + chose);
			chose		= '';
			question	= '';
		}
		else if (chose === 'Leave field empty')
		{
			console.log("const chose: " + chose);
			yearDoc				= tmpYear;
			chose				= '';
			question			= '';
			isYearDocCorrect	= false;
		}
		else if (chose === 'Exit')
		{
			console.log("const chose: " + chose);
			chose				= '';
			question			= '';
			isYearDocCorrect	= false;
			return;
		}
	}
	if (isNaN(tmpYear)) {
		// no it is NOT numeric
		console.log("tmpYear is NOT numeric: " + tmpYear);
	}
	else {
		// yes it is numeric
		if ( tmpYear % 1 === 0 ) {
			// yes it's an integer
			if ( tmpYear >= 50 && tmpYear <= nextYear ) {
					// if value in var start with one or more 0, remove it
					while(tmpYear.charAt(0) === '0') {
						tmpYear = tmpYear.substring(1);
					}
					// yes it's in range 50 - next year
					console.log("tmpYear is in range 50 - " + nextYear + ": " + tmpYear);
					yearDoc				= tmpYear;
					tmpYear				= '';
					isYearDocCorrect	= false;
			}
			else {
				// no it is NOT in range 50 - next year
				console.log("tmpYear is NOT in range 50 - " + nextYear + ": " + tmpYear);
			}
		}
		else {
			// no it is NOT an integer
			console.log("tmpYear is NOT an integer: " + tmpYear);
		}
	}
}

console.log("Content of variable yearDoc: " + yearDoc);

if (dayDoc){
	if (monthDoc){
		if (yearDoc){
			var dateDoc = yearDoc + '/' + monthDoc + '/' + dayDoc
			console.log("Content of variable dateDoc: " + dateDoc);
		}
	}
}
-%>

`giorno-doc: <% dayDoc %>`
`mese-doc: <% monthDoc %>`
`anno-doc: <% yearDoc %>`
`data-doc: <% dateDoc %>`
