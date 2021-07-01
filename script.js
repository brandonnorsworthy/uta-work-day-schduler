//html variables
var currentDayEl = $('#currentDay');
console.log($('#currentDay'));

//set moment date
currentDayEl.text(moment().format("dddd, MMMM Do"));