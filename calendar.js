$(function () {
	// load JSON
	$.getJSON("calendar.json", function (cal) {
		console.log(cal);

		// Today's DATE yyyy-mm-dd in MULTIPLE FORMATS
		var today = new Date();
		var dd = today.getDate();
		var mmJs = today.getMonth();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		if (mmJs < 10) {
			mmJs = '0' + mmJs;
		}
		todaysDateJs = yyyy + "-" + mmJs + "-" + dd;
		todaysDate = yyyy + "-" + mm + "-" + dd;
		todaysDateJsComp = todaysDateJs.replace(/-/g, '');
		todaysDateComp = todaysDate.replace(/-/g, '');
		var allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		// get dates from JSON to START and END CALENDARS
		var calJsonStart1 = cal[0].showHours[0].start;
		var [yearStart1, monthStart1, dayStart1] = calJsonStart1.split("-");
		monthStart = monthStart1 < 10 ? '0' + monthStart1 : monthStart1;
		var calJsonStart = yearStart1 + "-" + monthStart + "-" + dayStart1;
		var calJsonEnd1 = cal[0].showHours[0].end;
		var [yearEnd1, monthEnd1, dayEnd1] = calJsonEnd1.split("-");
		monthEnd = monthEnd1 < 10 ? '0' + monthEnd1 : monthEnd1;
		var calJsonEnd = yearEnd1 + "-" + monthEnd + "-" + dayEnd1;

		// create array of calenders ids between start and stop, like 2020-1 : stackoverflow: https://stackoverflow.com/questions/30464628/javascript-get-all-months-between-two-dates
		dateRange(calJsonStart, calJsonEnd);
		function dateRange(calFirst, calLast) {
			start = calFirst.split('-');
			end = calLast.split('-');
			var startYear = parseInt(start[0]);
			var endYear = parseInt(end[0]);
			var dates = [];
			console.log(dates);

			// get data to make a table for each month
			$("#calendar").append("<h2>Calendars");
			for (var iY = startYear; iY <= endYear; iY++) { // iY = iteratorYear
				var endMonth = iY != endYear ? 11 : parseInt(end[1]) - 1;
				var startMonth = iY === startYear ? parseInt(start[1]) - 1 : 0;
				for (var iM = startMonth; iM <= endMonth; iM = iM > 12 ? iM % 12 || 11 : iM + 1) { // iM = iteratorMonth

					// determine month's first day of week
					var day = (new Date(iY, iM).getDay()) + 1;

					// number of days in month
					function daysInMonth(iYy, displayMonthy) {
						return new Date(iYy, displayMonthy + 1, 0).getDate();
					}
					var days = daysInMonth(iY, iM);
					dates.push([iY, iM].join('-'));

					// https://stackoverflow.com/questions/2483719/get-weeks-in-month-through-javascript
					// For weeks that that start on SUNDAY
					if (day === 1) {
						function weekCount(year, monthNumber) {
							// monthNumber is in the range 1 - 12
							var firstOfMonth = new Date(year, monthNumber, 1);
							var lastOfMonth = new Date(year, monthNumber + 1, 0);
							var used = firstOfMonth.getDay() + lastOfMonth.getDate();
							return Math.ceil(used / 7);
						}
						var numberOfWeeks = weekCount(iY, iM);
					}
					// Weeks that start on Monday
					else if (day === 2) {
						function weekCount(year, monthNumber) {
							// monthNumber is in the range 1..12
							var firstOfMonth = new Date(year, monthNumber, 1);
							var lastOfMonth = new Date(year, monthNumber + 1, 0);
							var used = firstOfMonth.getDay() + lastOfMonth.getDate();
							return Math.ceil(used / 7);
						}
						var numberOfWeeks = weekCount(iY, iM);
					}
					// Weeks that start on Tuesday-Saturday
					else if (day >= 3 && day <= 7) {
						function weekCount(year, monthNumber, startDayOfWeek) {
							// monthNumber is in the range 1..12
							// Get the first day of week week day (0: Sunday, 1: Monday, ...)
							var firstDayOfWeek = startDayOfWeek || 0;
							var firstOfMonth = new Date(year, monthNumber, 1);
							var lastOfMonth = new Date(year, monthNumber + 1, 0);
							var numberOfDaysInMonth = lastOfMonth.getDate();
							var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;
							var used = firstWeekDay + numberOfDaysInMonth;
							return Math.ceil(used / 7);
						}
						var numberOfWeeks = weekCount(iY, iM);
					}

					// BUILD the CALENDAR TABLE with the data collected above
					//var allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					var monthTableName = allMonths[iM];
					var monthTableId2 = iM + 1; // adjusting the table month iterator so January has an id of yyyy-01
					var monthTableId = monthTableId2 < 10 ? '0' + monthTableId2 : monthTableId2;

					$("#calendar").append('<div class="calendar-box"><table id="table-' + iY + "-" + monthTableId + "-" + daysInMonth(iY, iM) + '" class="standard">');

					$("#table-" + iY + "-" + monthTableId + "-" + daysInMonth(iY, iM)).append("<caption>" + monthTableName + " " + iY);
					$("#table-" + iY + "-" + monthTableId + "-" + daysInMonth(iY, iM)).append('<tr><th scope="col" data-day="0">Sun</th><th scope="col" data-day="1">Mon</th><th scope="col" data-day="2">Tue</th><th scope="col" data-day="3">Wed</th><th scope="col" data-day="4">Thu</th><th scope="col" data-day="5">Fri</th><th scope="col" data-day="6">Sat</th></tr>');

					for (var tr = 1; tr <= numberOfWeeks; tr++) {
						$("#table-" + iY + "-" + monthTableId + "-" + daysInMonth(iY, iM)).append("<tr data-week='" + tr + "'>");
						for (td = 1; td < 8; td++) {
							$("table#table-" + iY + "-" + monthTableId + "-" + daysInMonth(iY, iM) + " tr[data-week='" + tr + "']").append("<td><span class='cell-wrap'><span class='date-box'>");
						}
					}

					$("#table-" + iY + "-" + monthTableId + "-" + daysInMonth(iY, iM) + " td")
						// number the table cells
						.attr("data-cell", function (arr) {
							return arr + 1;
						})
						.each(function () {
							// get the value of this data cell
							var dataAttr = parseInt($(this).attr("data-cell"));
							// take the cell number, subtract position of first day plus 1, plus 1 again
							var dataAttr2 = dataAttr - day + 1;
							// normalize dates less than 10 to have a preceding 0
							var dataAttr3 = dataAttr2 < 10 ? '0' + dataAttr2 : dataAttr2;
							var monthCal2 = iM + 1; // adjusting the Cell month iterator so January has an id of yyyy-01-dd
							var monthCal = monthCal2 < 10 ? '0' + monthCal2 : monthCal2;
							//var monthCal = iM < 10 ? '0' + iM : iM;
							if (dataAttr2 < 1 || dataAttr2 > days) {
								$(this).children(".date-box").text();
							} else {
								$(this).find(".date-box").text(dataAttr2);
								$(this).attr("id", "cell-" + iY + "-" + monthCal + "-" + dataAttr3).children(".cell-wrap").append("<span class='exception'> ");
							}
						});
				} // end month iterator iM
			} // end year iterator iY
			return dates;
		} // end dateRange function that creates CALENDAR tables


		// modify calendar table CELLS to indicate exceptions (CLOSED, REDUCED, EXTENDED)
		for (var i = 0; i < cal[0].actualHours[0].exceptions.length; i++) {
			// find all closings for calendar table
			if (cal[0].actualHours[0].exceptions[i].type === "closed") {

				var closedDateJs = cal[0].actualHours[0].exceptions[i].date;
				if (Array.isArray(closedDateJs) === false) {
					var [yearJS, monthJS, dayJS] = closedDateJs.split("-");
					var closedDate = yearJS + "-" + monthJS + "-" + dayJS;
					$("#cell-" + closedDate).addClass("closed").attr("title", "closed for " + cal[0].actualHours[0].exceptions[i].message);
					$("#cell-" + closedDate + " .exception").html(" closed for " + cal[0].actualHours[0].exceptions[i].message);
				}
				if (Array.isArray(closedDateJs) === true) {
					/* Start CL############################################################################################################################################################################ */
					//alert("Calendar closed in array item : " + i);

					var clArrayLength = cal[0].actualHours[0].exceptions[i].date.length - 1;
					var clArrayFirst = cal[0].actualHours[0].exceptions[i].date[0];
					var clArrayLast = cal[0].actualHours[0].exceptions[i].date[clArrayLength];
					//alert("CALENDAR closed in array item : " + i + " = " + clArrayFirst + " - " + clArrayLast + " : " + cal[0].actualHours[0].exceptions[i].message);

					// https://stackoverflow.com/questions/17943977/dates-between-two-dates              
					var dayCL = 1000 * 60 * 60 * 24;
					date1 = new Date(clArrayFirst);
					date2 = new Date(clArrayLast);
					var between = [];
					var diff = (date2.getTime() - date1.getTime()) / dayCL;
					for (var iCL = 0; iCL <= diff; iCL++) {
						var xx = date1.getTime() + dayCL * iCL;
						var yy = new Date(xx);
						var yy2 = yy.getMonth() + 1;
						var yy3 = yy2 < 10 ? '0' + yy2 : yy2;
						var yy4 = yy.getDate() + 1;
						var yy5 = yy4 < 10 ? '0' + yy4 : yy4;
						var between2 = yy.getFullYear() + "-" + yy3 + "-" + yy5;

						between.push(yy.getFullYear() + "-" + yy3 + "-" + yy5);
						$("#cell-" + between2).addClass("closed").attr("title", "closed: " + cal[0].actualHours[0].exceptions[i].message);
						$("#cell-" + between2 + " .exception").html(" closed: " + cal[0].actualHours[0].exceptions[i].message);

					}

					/* End CL ############################################################################################################################################################################# */
				}
			}
			// find all reduced for calendar table
			else if (cal[0].actualHours[0].exceptions[i].type === "reduced") {
				var reducedDateJs = cal[0].actualHours[0].exceptions[i].date;
				if (Array.isArray(reducedDateJs) === false) {
					var [yearJS, monthJS, dayJS] = reducedDateJs.split("-");
					var reducedDate = yearJS + "-" + monthJS + "-" + dayJS;
					$("#cell-" + reducedDate).addClass("reduced").attr("title", "reduced hours: " + cal[0].actualHours[0].exceptions[i].message);
					$("#cell-" + reducedDate + " .exception").html(" reduced hours: " + cal[0].actualHours[0].exceptions[i].message);
				}
				if (Array.isArray(reducedDateJs) === true) {
					/* Start RE ########################################################################################################################################################################## */

					var reArrayLength = cal[0].actualHours[0].exceptions[i].date.length - 1;
					var reArrayFirst = cal[0].actualHours[0].exceptions[i].date[0];
					var reArrayLast = cal[0].actualHours[0].exceptions[i].date[reArrayLength];
					//alert("CALENDAR reduced in array item : " + i + " = " + reArrayFirst + " - " + reArrayLast + " : " + cal[0].actualHours[0].exceptions[i].message);

					// https://stackoverflow.com/questions/17943977/dates-between-two-dates              
					var dayRE = 1000 * 60 * 60 * 24;
					date1 = new Date(reArrayFirst);
					date2 = new Date(reArrayLast);
					var between = [];
					var diff = (date2.getTime() - date1.getTime()) / dayRE;
					for (var iRE = 0; iRE <= diff; iRE++) {
						var xx = date1.getTime() + dayRE * iRE;
						var yy = new Date(xx);
						var yy2 = yy.getMonth() + 1;
						var yy3 = yy2 < 10 ? '0' + yy2 : yy2;
						var yy4 = yy.getDate() + 1;
						var yy5 = yy4 < 10 ? '0' + yy4 : yy4;
						var between2 = yy.getFullYear() + "-" + yy3 + "-" + yy5;

						between.push(yy.getFullYear() + "-" + yy3 + "-" + yy5);
						$("#cell-" + between2).addClass("reduced").attr("title", "reduced hours: " + cal[0].actualHours[0].exceptions[i].message);
						$("#cell-" + between2 + " .exception").html(" reduced hours: " + cal[0].actualHours[0].exceptions[i].message);
					}

					/* End RE ############################################################################################################################################################################ */
				}
			}
			// find all extended for calendar table
			else if (cal[0].actualHours[0].exceptions[i].type === "extended") {
				var extendedDateJs = cal[0].actualHours[0].exceptions[i].date;
				if (Array.isArray(extendedDateJs) === false) {
					var [yearJS, monthJS, dayJS] = extendedDateJs.split("-");
					var extendedDate = yearJS + "-" + monthJS + "-" + dayJS;
					$("#cell-" + extendedDate).addClass("extended").attr("title", "extended hours: " + cal[0].actualHours[0].exceptions[i].message);
					$("#cell-" + extendedDate + " .exception").html(" extended hours: " + cal[0].actualHours[0].exceptions[i].message);
				}
				if (Array.isArray(extendedDateJs) === true) {
					/* Start EX ########################################################################################################################################################################## */
					//alert("CALENDAR extended in array item : " + i);

					var exArrayLength = cal[0].actualHours[0].exceptions[i].date.length - 1;
					var exArrayFirst = cal[0].actualHours[0].exceptions[i].date[0];
					var exArrayLast = cal[0].actualHours[0].exceptions[i].date[exArrayLength];
					//alert("CALENDAR closed in array item : " + i + " = " + exArrayFirst + " - " + exArrayLast + " : " + cal[0].actualHours[0].exceptions[i].message);

					// https://stackoverflow.com/questions/17943977/dates-between-two-dates              
					var dayEX = 1000 * 60 * 60 * 24;
					date1 = new Date(exArrayFirst);
					date2 = new Date(exArrayLast);
					var between = [];
					var diff = (date2.getTime() - date1.getTime()) / dayEX;
					for (var iEX = 0; iEX <= diff; iEX++) {
						var xx = date1.getTime() + dayEX * iEX;
						var yy = new Date(xx);
						var yy2 = yy.getMonth() + 1;
						var yy3 = yy2 < 10 ? '0' + yy2 : yy2;
						var yy4 = yy.getDate() + 1;
						var yy5 = yy4 < 10 ? '0' + yy4 : yy4;
						var between2 = yy.getFullYear() + "-" + yy3 + "-" + yy5;

						between.push(yy.getFullYear() + "-" + yy3 + "-" + yy5);
						$("#cell-" + between2).addClass("extended").attr("title", "extended: " + cal[0].actualHours[0].exceptions[i].message);
						$("#cell-" + between2 + " .exception").html(" extended: " + cal[0].actualHours[0].exceptions[i].message);

					}
					/* End EX ########################################################################################################################################################################### */
				}
			}

			// delete content in "empty" cells
			$("span.date-box:empty").parents("td").text("");

		} // end exceptions in calendar table

		// find today's date
		$("#cell-" + todaysDate + " .date-box").addClass("today").attr({
			'aria-current': 'date'
		});

		// fade past days
		$("td").each(function () {
			var dateTdId = $(this).attr("id");
			if (dateTdId !== undefined) {
				dateTdId = dateTdId.replace('cell-', '');
				if (dateTdId < todaysDate) {
					$(this).addClass("past");
				}
			}
		});

		// delete past months
		var pastMonths = yyyy + "-" + mm + "-" + dd;
		$("table").each(function () {
			var monthId = $(this).attr("id");
			monthId = monthId.replace('table-', '');
			if (monthId < pastMonths) {
				$(this).addClass("delete_month");
			}
		});

		// get today's date
		//var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var dayIndex = new Date().getDay();
		var dayName = dayNames[dayIndex];
		//var allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var monthIndex = new Date().getMonth();
		var monthName = allMonths[monthIndex];
		var dayOfMonth = new Date().getDate();
		$("#todays_hours").append("<h2>Today's Hours</h2><p id='todaysHours'>Hours for " + dayName + ", " + monthName + " " + dayOfMonth + ": ");

		// Regular hours start
		function regularHoursList(hoursType, hoursI) {
			$("#hours_type").append("<h2>" + hoursType + " Hours ");

			var regularHoursDisplayStart1 = cal[0].regularHours[hoursI].beginDisplay;
			var [regularHoursDisplayStartYYYY, regularHoursDisplayStartMM1, regularHoursDisplayStartDDn] = regularHoursDisplayStart1.split("-");
			var regularHoursDisplayStartMMn = Number(regularHoursDisplayStartMM1) - 1;
			var regularHoursDisplayStartDD = Number(regularHoursDisplayStartDDn);
			var regularDisplayStartMonth = allMonths[regularHoursDisplayStartMMn];
			//var regularDisplayStartDate = regularDisplayStartMonth + " " + regularHoursDisplayStartDD + ", " + regularHoursDisplayStartYYYY;

			var regularHoursStart1 = cal[0].regularHours[hoursI].start;
			var [regularHoursStartYYYY, regularHoursStartMM1, regularHoursStartDDn] = regularHoursStart1.split("-");
			var regularHoursStartMMn = Number(regularHoursStartMM1) - 1;
			var regularHoursStartDD = Number(regularHoursStartDDn);
			var regularStartMonth = allMonths[regularHoursStartMMn];
			var regularStartDate = regularStartMonth + " " + regularHoursStartDD + ", " + regularHoursStartYYYY;
			var regularHoursEnd1 = cal[0].regularHours[hoursI].end;
			var [regularHoursEndYYYY, regularHoursEndMM1, regularHoursEndDDn] = regularHoursEnd1.split("-");
			var regularHoursEndMMn = Number(regularHoursEndMM1) - 1;
			var regularHoursEndDD = Number(regularHoursEndDDn);
			var regularEndMonth = allMonths[regularHoursEndMMn];
			var regularEndDate = regularEndMonth + " " + regularHoursEndDD + ", " + regularHoursEndYYYY;
			$("#hours_type").append("<p>In effect from " + regularStartDate + " to " + regularEndDate + ".");
			$("#hours_type").append("<ul>");
			for (var i = 0; i < cal[0].regularHours[hoursI].hours.length; i++) {

				var regularDay = cal[0].regularHours[hoursI].hours[i].day;
				var regularDayName = dayNames[regularDay];
				if (regularDay === dayIndex) {
					$("#todaysHours").append("<span id='todays_hours_are'>" + cal[0].regularHours[hoursI].hours[i].hours);
					// this next line is a hack -- friday hours not showing in list on a friday -- WHY? still looking.
					if (Array.isArray(regularDay) === false) {
						$("#hours_type ul").append("<li><span class='date'>" + regularDayName + ": </span> <span class='space'></span> <span class='hours'>" + cal[0].regularHours[hoursI].hours[i].hours);
					}
				} else if (Array.isArray(regularDay) === false) {
					$("#hours_type ul").append("<li><span class='date'>" + regularDayName + ": </span> <span class='space'></span> <span class='hours'>" + cal[0].regularHours[hoursI].hours[i].hours);
				}
				if (Array.isArray(regularDay)) {
					for (var iA = 0; iA < cal[0].regularHours[hoursI].hours[i].day.length; iA++) {
						var arrayDay = cal[0].regularHours[hoursI].hours[i].day[iA];
						var firstItem = cal[0].regularHours[hoursI].hours[i].day[0];
						var arrayLength = cal[0].regularHours[hoursI].hours[i].day.length - 1;

						var lastItem = cal[0].regularHours[hoursI].hours[i].day[arrayLength];
						var dayNameFirst = dayNames[firstItem];
						var dayNameLast = dayNames[lastItem];
						if (dayIndex === arrayDay) {
							$("#todaysHours").append("<span id='todays_hours_are'>" + cal[0].regularHours[hoursI].hours[i].hours);
						}
					}
					$("#hours_type ul").append("<li><span class='date'>" + dayNameFirst + " - " + dayNameLast + ": </span> <span class='space'></span> <span class='hours'>" + cal[0].regularHours[hoursI].hours[i].hours);
				}
			}

			// Begin Clone and Split Months
			for (var i = 0; i < cal[0].regularHours.length; i++) {
				var startRegTest = cal[0].regularHours[i].start;
				var [startRegYYYY, startRegMM, startRegDD] = startRegTest.split("-");
				var startRegDDn = Number(startRegDD);
				if (startRegDDn > 1) {
					var startRegMoLastDay = new Date(startRegYYYY, startRegMM, 0).getDate();
					var endRegTestDDn = startRegDDn - 1;
					var endRegTestDD = endRegTestDDn < 10 ? '0' + endRegTestDDn : endRegTestDDn;

					$("#table-" + startRegYYYY + "-" + startRegMM + "-" + startRegMoLastDay).addClass("split-end").clone().removeAttr("id").attr("id", "table-" + startRegYYYY + "-" + startRegMM + "-" + endRegTestDD).addClass("split-start").removeClass("split-end").insertBefore("#table-" + startRegYYYY + "-" + startRegMM + "-" + startRegMoLastDay);

					for (var iCelln = 0; iCelln < $("table#table-" + startRegYYYY + "-" + startRegMM + "-" + startRegMoLastDay + "  td").length; iCelln++) {
						iCellnn = iCelln + 1;
						iCell = iCellnn < 10 ? '0' + iCellnn : iCellnn;
						if (iCell <= endRegTestDD) {
							$(".split-end td#cell-" + startRegYYYY + "-" + startRegMM + "-" + iCell).addClass("DELETE-CELL").text("");
						}
						if (iCell > endRegTestDD) {
							$(".split-start td#cell-" + startRegYYYY + "-" + startRegMM + "-" + iCell).addClass("DELETE-CELL").text("");
						}
						$('tr').filter(
							function () {

								return $(this).find('td').length == $(this).find('td:empty').length;
							}).hide();
						$(function () {
							$("tr:has(th):not(:has(td))").show();
						});
					}
				}
			}
			// end clone and split months
			for (var iE = 0; iE < cal[0].actualHours[0].exceptions.length; iE++) {
				var exceptionDate = cal[0].actualHours[0].exceptions[iE].date;
				if (exceptionDate === todaysDate) {
					$("#todays_hours_are").text(cal[0].actualHours[0].exceptions[iE].message);
				}
			}
		} // end regular hours

		//UPCOMING HOURS
		function regularUpcomingHoursList(hoursType, hoursI) {
			$("#upcoming_hours_type").append("<h2> Upcoming " + hoursType + " Hours ");

			var regularHoursDisplayStart1 = cal[0].regularHours[hoursI].beginDisplay;
			var [regularHoursDisplayStartYYYY, regularHoursDisplayStartMM1, regularHoursDisplayStartDDn] = regularHoursDisplayStart1.split("-");
			var regularHoursDisplayStartMMn = Number(regularHoursDisplayStartMM1) - 1;
			var regularHoursDisplayStartDD = Number(regularHoursDisplayStartDDn);
			var regularDisplayStartMonth = allMonths[regularHoursDisplayStartMMn];
			//var regularDisplayStartDate = regularDisplayStartMonth + " " + regularHoursDisplayStartDD + ", " + regularHoursDisplayStartYYYY;

			var regularHoursStart1 = cal[0].regularHours[hoursI].start;
			var [regularHoursStartYYYY, regularHoursStartMM1, regularHoursStartDDn] = regularHoursStart1.split("-");
			var regularHoursStartMMn = Number(regularHoursStartMM1) - 1;
			var regularHoursStartDD = Number(regularHoursStartDDn);
			var regularStartMonth = allMonths[regularHoursStartMMn];
			var regularStartDate = regularStartMonth + " " + regularHoursStartDD + ", " + regularHoursStartYYYY;
			var regularHoursEnd1 = cal[0].regularHours[hoursI].end;
			var [regularHoursEndYYYY, regularHoursEndMM1, regularHoursEndDDn] = regularHoursEnd1.split("-");
			var regularHoursEndMMn = Number(regularHoursEndMM1) - 1;
			var regularHoursEndDD = Number(regularHoursEndDDn);
			var regularEndMonth = allMonths[regularHoursEndMMn];
			var regularEndDate = regularEndMonth + " " + regularHoursEndDD + ", " + regularHoursEndYYYY;
			$("#upcoming_hours_type").append("<p>In effect from " + regularStartDate + " to " + regularEndDate + ".");
			$("#upcoming_hours_type").append("<ul>");
			for (var i = 0; i < cal[0].regularHours[hoursI].hours.length; i++) {

				var regularDay = cal[0].regularHours[hoursI].hours[i].day;
				var regularDayName = dayNames[regularDay];
				if (regularDay === dayIndex) {
					//$("#todaysHours").append("<span id='todays_hours_are'>" + cal[0].regularHours[hoursI].hours[i].hours);
					// this next line is a hack -- friday hours not showing in list on a friday -- WHY? still looking.
					if (Array.isArray(regularDay) === false) {
						$("#upcoming_hours_type ul").append("<li><span class='date'>" + regularDayName + ": </span> <span class='space'></span> <span class='hours'>" + cal[0].regularHours[hoursI].hours[i].hours);
					}
				} else if (Array.isArray(regularDay) === false) {
					$("#upcoming_hours_type ul").append("<li><span class='date'>" + regularDayName + ": </span> <span class='space'></span> <span class='hours'>" + cal[0].regularHours[hoursI].hours[i].hours);
				}
				if (Array.isArray(regularDay)) {
					for (var iA = 0; iA < cal[0].regularHours[hoursI].hours[i].day.length; iA++) {
						var arrayDay = cal[0].regularHours[hoursI].hours[i].day[iA];
						var firstItem = cal[0].regularHours[hoursI].hours[i].day[0];
						var arrayLength = cal[0].regularHours[hoursI].hours[i].day.length - 1;
						var lastItem = cal[0].regularHours[hoursI].hours[i].day[arrayLength];
						var dayNameFirst = dayNames[firstItem];
						var dayNameLast = dayNames[lastItem];
						if (dayIndex === arrayDay) {
							//$("#todaysHours").append("<span id='todays_hours_are'>" + cal[0].regularHours[hoursI].hours[i].hours);
						}
					}
					$("#upcoming_hours_type ul").append("<li><span class='date'>" + dayNameFirst + " - " + dayNameLast + ": </span> <span class='space'></span> <span class='hours'>" + cal[0].regularHours[hoursI].hours[i].hours);
				}
			}
		}

		// Test for exceptions in TODAY'S HOURS
		for (var iH = 0; iH < cal[0].regularHours.length; iH++) {
			var startDisplayRegHours = cal[0].regularHours[iH].start;
			var startUpcomingRegHours = cal[0].regularHours[iH].beginDisplay;
			var endRegHours = cal[0].regularHours[iH].end;
			if (startUpcomingRegHours < todaysDate && startDisplayRegHours > todaysDate) {
				//alert("upcoming = " + startUpcomingRegHours);
				regularUpcomingHoursList(cal[0].regularHours[iH].name, iH);
			}
			if (startDisplayRegHours < todaysDate && endRegHours > todaysDate) {
				regularHoursList(cal[0].regularHours[iH].name, iH);
			}
		}

		// Regular hours end

		/* start list */
		$("#exceptions").append("<div id='exceptions-closed'><h2>Closings</h2><ul>");
		$("#exceptions").append("<div id='exceptions-reduced'><h2>Reduced Hours</h2><ul>");
		$("#exceptions").append("<div id='exceptions-extended'><h2>Extended Hours</h2><ul>");
		$("#exceptions").append("<div id='exceptions-open'><h2>Special Openings</h2><ul>");

		function dateConversion(exceptionTypeId) {
			var exceptionDateConvert1 = cal[0].actualHours[0].exceptions[i5].date;
			if (Array.isArray(exceptionDateConvert1) === false) {
				if (exceptionDateConvert1 >= calJsonStart1 && exceptionDateConvert1 <= calJsonEnd1) {
					var [exceptionYear, exceptionMonth1, exceptionDate] = exceptionDateConvert1.split("-");
					var exceptionMonth = parseInt(exceptionMonth1) - 1;
					var exceptionDate = Number(exceptionDate);
					$("#exceptions-" + exceptionTypeId + " ul").append("<li id='list-" + cal[0].actualHours[0].exceptions[i5].date + "'><span class='date'>" + allMonths[exceptionMonth] + " " + exceptionDate + ", " + exceptionYear + ": </span> <span class='space'></span> <span class='hours'> " + cal[0].actualHours[0].exceptions[i5].message + "</span>");
				}
			}
			if (Array.isArray(exceptionDateConvert1) === true) {
				/* START EXCEPTION LIST ############################################################################################################################################################## */
				//alert("exception in array item " + i5);

				var reArrayLength = cal[0].actualHours[0].exceptions[i5].date.length - 1;
				var reArrayFirst = cal[0].actualHours[0].exceptions[i5].date[0];
				var reArrayLast = cal[0].actualHours[0].exceptions[i5].date[reArrayLength];
				if ((reArrayFirst >= calJsonStart1 && reArrayFirst <= calJsonEnd1) || (reArrayLAst >= calJsonStart1 && reArrayLast <= calJsonEnd1)) {
					var [exceptionYearStart, exceptionMonth1Start, exceptionDateStart] = reArrayFirst.split("-");
					var [exceptionYearEnd, exceptionMonth1End, exceptionDateEnd] = reArrayLast.split("-");

					var exceptionMonthStart = parseInt(exceptionMonth1Start) - 1;
					var exceptionDateStart = Number(exceptionDateStart);
					var exceptionMonthEnd = parseInt(exceptionMonth1End) - 1;
					var exceptionDateEnd = Number(exceptionDateEnd);

					//alert("LIST exception in array item : " + i5 + " = " + reArrayFirst + " - " + reArrayLast + " : " + " " + exceptionTypeId + " " + cal[0].actualHours[0].exceptions[i5].message);                

					$("#exceptions-" + exceptionTypeId + " ul").append("<li id='list-" + cal[0].actualHours[0].exceptions[i5].date[reArrayLength] + "'><span class='date'>" + allMonths[exceptionMonthStart] + " " + exceptionDateStart + ", " + exceptionYearStart + " - " + allMonths[exceptionMonthEnd] + " " + exceptionDateEnd + ", " + exceptionYearEnd + ": </span> <span class='space'></span> <span class='hours'> " + cal[0].actualHours[0].exceptions[i5].message + "</span>");
				}

				/* End EXCEPTION LIST ############################################################################################################################################################## */
			}
		}

		for (var i5 = 0; i5 < cal[0].actualHours[0].exceptions.length; i5++) {
			var exceptionType = cal[0].actualHours[0].exceptions[i5].type;
			if (exceptionType === "closed") {
				dateConversion("closed");
			} else if (exceptionType === "reduced") {
				dateConversion("reduced");
			} else if (exceptionType === "extended") {
				dateConversion("extended");
			} else if (exceptionType === "open") {
				dateConversion("open");
			}
		}

		// List items are past, present, or future
		$("#exceptions li ").each(function () {
			var eventDate1 = $(this).attr("id");
			var eventDate = eventDate1.replace("list-", "");
			if (eventDate < todaysDate) {
				$(this).addClass("past");
			} else if (eventDate === todaysDate) {
				$(this).addClass("present");
			} else if (eventDate > todaysDate) {
				$(this).addClass("future");
			} else {
				return true;
			}
		});

		var deleteExceptionGroups = ["exceptions-extended", "exceptions-reduced", "exceptions-closed", "exceptions-open"];
		var deleteExceptionGroupsLength = deleteExceptionGroups.length;
		for (var iDE = 0; iDE < deleteExceptionGroupsLength; iDE++) {
			if ($("div#" + deleteExceptionGroups[iDE] + "  li").length == $("div#" + deleteExceptionGroups[iDE] + "  li.past").length) {
				$("div#" + deleteExceptionGroups[iDE] + "  li").closest("div").addClass("past");
			}
			if ($("div#" + deleteExceptionGroups[iDE] + "  ul").children("li").length === 0) {
				$("div#" + deleteExceptionGroups[iDE] + "  ul").closest("div").addClass("past");
			}
		}

		for (var iHT = 0; iHT < $("#calendar table").length; iHT++) {} // iHT = iterator Hours Type 
		$("table").each(function () {
			var attrId = $(this).attr('id');
			attrId = attrId.replace(/table-/g, '');
			for (var i = 0; i < cal[0].regularHours.length; i++) {
				var regtypeStart = cal[0].regularHours[i].start;
				var regtypeEnd = cal[0].regularHours[i].end;
				if (attrId >= regtypeStart && attrId <= regtypeEnd) {
					var regType = cal[0].regularHours[i].name;
					$("#table-" + attrId + " caption").append(" (" + regType + " Hours)");
					$("#table-" + attrId).addClass(regType);
					//$("#table-" + attrId).addClass(regType.toLowerCase());  
				}
			}
		});
		/* End Assign Regular Hours Type to Calendars */

		// ADD HOURS TO CALENDAR HEADER
		for (var iHT2 = 0; iHT2 < cal[0].regularHours.length; iHT2++) {
			console.log(cal[0].regularHours[iHT2].name);
			for (var iDH = 0; iDH < cal[0].regularHours[iHT2].hours.length; iDH++) {
				var regularDay2 = cal[0].regularHours[iHT2].hours[iDH].day;
				console.log(iHT2 + " " + iDH + " " + regularDay2);
				if (Array.isArray(regularDay2) === false) {
					//$("table." + cal[0].regularHours[iHT2].name + " [data-day='" + cal[0].regularHours[iHT2].hours[iDH].day + "']").append("<br><span class='hours-in-header'> HOURS");
					var daysWHours = cal[0].regularHours[iHT2].hours[iDH].day;
					var daysHours = cal[0].regularHours[iHT2].hours[iDH].hours;
					$("table." + cal[0].regularHours[iHT2].name + " [data-day='" + daysWHours + "']").append("<br><span class='hours-in-header'>" + daysHours);
				}
				if (Array.isArray(regularDay2)) {
					for (var iA3 = 0; iA3 < cal[0].regularHours[iHT2].hours[iDH].day.length; iA3++) {
						var daysWHours2 = cal[0].regularHours[iHT2].hours[iDH].day[iA3];
						var daysHours2 = cal[0].regularHours[iHT2].hours[iDH].hours;
						$("table." + cal[0].regularHours[iHT2].name + " [data-day='" + daysWHours2 + "']").append("<br><span class='hours-in-header'>" + daysHours2);
					}
				}
			}
		}

		// add closed to calendar for regular hours
		$('th:contains("closed"), th:contains("Closed")').addClass('closed-th');
		for (var iRC = 0; iRC < 8; iRC++) {
			$('.closed-th').each(function () {
				var regClosed = $(this).data('day');
				regClosed2 = Number(regClosed);
				regClosed3 = (regClosed2 + 1) + (7 * iRC);
				$(this).parent("tr").siblings("tr").children("td[data-cell='" + regClosed3 + "']").children(".cell-wrap").parent("td").addClass("closed").attr("title", "Closed");
				$(this).parent("tr").siblings("tr").children("td[data-cell='" + regClosed3 + "']").children(".cell-wrap").children(".exception").text(" Closed");
			});
		}

		// modify calendar table CELLS to indicate exceptions (SPECIAL OPENINGS)
		for (var i = 0; i < cal[0].actualHours[0].exceptions.length; i++) {
			// find all special openings for calendar table
			if (cal[0].actualHours[0].exceptions[i].type === "open") {
				var openDateJs = cal[0].actualHours[0].exceptions[i].date;
				//alert(openDateJs);
				var [yearJS, monthJS, dayJS] = openDateJs.split("-");
				var openDate = yearJS + "-" + monthJS + "-" + dayJS;
				$("#cell-" + openDate).addClass("open").removeClass("closed").attr("title", "open for " + cal[0].actualHours[0].exceptions[i].message);
				$("#cell-" + openDate + " .exception").html(" open for " + cal[0].actualHours[0].exceptions[i].message);
			}

		} // end exceptions in calendar table

		// create toggle button to show 

		$(".calendar-box table").before("<button>Show Details<span class='visually-hidden'> for </span>");
		$("button").each(function () {
			var buttonTxt = $(this).next("table").children("caption").text();
            var buttonId2 = $(this).next("table").attr("id");
            var buttonId = buttonId2.replace("table-", "");
            $(this).attr("id", "button-" + buttonId);
			$(this).children("span").append(buttonTxt);
		});

		$("button").on("click keypress", function () {

			if ($(this).next("table").hasClass("standard") === true) {
				var buttonTxt = $(this).next("table").children("caption").text();
				$(this).next("table").removeClass("standard");
				$(this).html("Hide Details<span class='visually-hidden'> for " + buttonTxt + "</span>");
				return false;
			} else if ($(this).next("table").hasClass("standard") === false) {
				var buttonTxt = $(this).next("table").children("caption").text();
				$(this).next("table").addClass("standard");
				$(this).html("Show Details<span class='visually-hidden'> for " + buttonTxt + "</span>");
				return false;
			}
		});
        //var pastMonths = yyyy + "-" + mm + "-" + dd;
		$("button").each(function () {
			var monthId = $(this).attr("id");
			monthId = monthId.replace('button-', '');
			if (monthId < pastMonths) {
				$(this).addClass("delete_month");
			}
		});

	}); // ends json  
});