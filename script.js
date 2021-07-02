//html variables
var currentDayEl = $('#currentDay');
var containerEl = $('.container');

//set moment date

function main() {
    currentDayEl.text(moment().format("dddd, MMMM Do"));
    var maxHours = 8; //8 hours displayed max 3 previous hours 1 present and 4 future
    var offsetHours = -3
    //create my times
    for (var hour = offsetHours; hour < maxHours + offsetHours; hour++){
        //div row that holds all the stuffs
        var timeRowEl = document.createElement('div');
        timeRowEl.setAttribute('class', 'row time-block');
    
        var hourEl = document.createElement('div');
        hourEl.setAttribute('class', 'col-sm-1 hour');
        var timeEl = document.createElement('textarea');
        timeEl.setAttribute('class', 'col-sm-10 description');
        var saveBtnEl = document.createElement('button');
        saveBtnEl.setAttribute('class', 'col-sm-1 saveBtn');
    
        formatMilitaryTime(hour)
    
        timeRowEl.append(hourEl);
        timeRowEl.append(timeEl);
        timeRowEl.append(saveBtnEl);
    
        containerEl.append(timeRowEl);
    }
}

function formatMilitaryTime(currentIndex) {
    var suffix = '';
    var hour = moment().hour() + currentIndex;

    if (hour > 23) {
        if (hour == 24) {
            hour = 12;
            suffix = ' AM';
        } else {
            hour -= 24;
            suffix = ' AM';
        }
    } else if (hour > 11) {
        if (hour == 12) {
            hour = 12;
            suffix = ' PM';
        } else {
            hour -= 12;
            suffix = ' PM';
        }
    } else if (hour < 1) {
        if (hour == 0) {
            hour = 12;
            suffix = ' AM';
        } else {
            hour += 12;
            suffix = ' PM';
        }
    } else {
        suffix = ' AM';
    }
    hour = hour + suffix;

    return hour
}

main();