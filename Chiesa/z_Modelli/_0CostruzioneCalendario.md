<%*

var start = new Date("2024-01-01")
var end =  new Date("2024-12-31")
var newend = end.setDate(end.getDate() + 1);
var end = new Date(newend);
while(start < end)
{
	var d = new Date(start);

	var curDay = d.getDate();
	var strDay = '' + curDay + '';
	if (curDay.toString().length == 1) {
		strDay = '0' + strDay;
	} 

	var curMonth = d.getMonth() + 1;
	var strMonth = '' + curMonth + '';
	if (curMonth.toString().length == 1) {
		strMonth = '0' + strMonth;
	}
	//console.log(a);
	tR += `[[Santi/${strMonth}/${strMonth}-${strDay}|Santi del giorno ${strDay}-${strMonth}]]\n`;
	var newDate = start.setDate(start.getDate() + 1);
	start = new Date(newDate);
}

%>