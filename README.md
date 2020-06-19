# hours_of_operation
Manage hours of operation from JSON and display them in multiple ways.

## The JavaScript
This was created a function at a time as a proof-of-concept and, as such, the JS is not currently efficient. Fixing the JS is on this to-do list.

## To Do
* Create scrolling list of hours for the next 7-10 days, one day per line, as an option
* Make content embedded in table cells (title or span) available as tooltip to mobile devices.
* Have **regular hours** closed dates automatically show up under "Closings" header
* When tables split, container divs do not -- fix this.
* As an alternative to start and end dates to display calendars, provide way to limit display to this month and next month.
* Create interface to edit and maintain JSON file.
* Clean up code, combine functions, add visual design, and test.

## Done
* Create perpetual calendar with accessible tables (headers and scopes).
* Create structure for JSON.
* Produce calendars between given date ranges in JSON file.
* Add regular hours to calendar header.
* Add exceptions to data cells as object or array (visually and as text) including closed, reduced, extended, and open.
* Split tables when regular hours start/stop.
* Create "Today's Hours"
* Create list of regular hours from object or array.
* Test and mark all dates in lists and calendars as past, present, and future.
* Mark regular hour closings in calendars w/o additional JSON data.
* Allow upcoming hours to appear before the hours take effect.
* Create toggle to show or visually hide content in table cells.








