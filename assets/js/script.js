//html variables
var currentDayEl = $('#currentDay');
var containerEl = $('.container');

function main() {
    currentDayEl.text(moment().format("dddd, MMMM Do"));
    var maxHours = 12; //8 hours displayed max 3 previous hours 1 present and 4 future
    var offsetHours = -3
    //create my times
    for (var hour = offsetHours; hour < maxHours + offsetHours; hour++){
        //div row that holds all the stuffs
        var timeRowEl = document.createElement('div');
        timeRowEl.setAttribute('class', 'row time-block');

        var hourEl = document.createElement('div');
        hourEl.setAttribute('class', 'col-sm-1 hour');
        var DescriptionEl = document.createElement('textarea');
        var saveBtnEl = document.createElement('button');
        saveBtnEl.setAttribute('class', 'col-sm-1 saveBtn');

        var timeAtIndex = formatMilitaryTime(moment().hour() + hour);
        hourEl.textContent = timeAtIndex;

        if (hour < 0) {
            DescriptionEl.setAttribute('class', 'col-sm-10 description past');
        } else if (hour == 0) {
            DescriptionEl.setAttribute('class', 'col-sm-10 description present');
        } else {
            DescriptionEl.setAttribute('class', 'col-sm-10 description future');
        }

        var saveIconEL = document.createElement('img')
        saveIconEL.setAttribute('src', './assets/images/saveicon.png')

        var tempArr = JSON.parse(localStorage.getItem('events'));
        if(tempArr != null) {
            for (let index = 0; index < tempArr.length; index++) {
                if ((hourEl.textContent == tempArr[index].eventTime) && (moment().dayOfYear() == tempArr[index].dayOfYear)) {
                    DescriptionEl.textContent = tempArr[index].eventDescription;
                    DescriptionEl.setAttribute('id', 'saved-item');
                }
            }
        }

        saveBtnEl.append(saveIconEL);
        timeRowEl.append(hourEl);
        timeRowEl.append(DescriptionEl);
        timeRowEl.append(saveBtnEl);

        containerEl.append(timeRowEl);
    }
}

function formatMilitaryTime(hour) {
    var suffix = '';

    if (hour > 23) {
        if (hour == 24) {
            hour = 12;
            suffix = 'AM';
        } else {
            hour -= 24;
            suffix = 'AM';
        }
    } else if (hour > 11) {
        if (hour == 12) {
            hour = 12;
            suffix = 'PM';
        } else {
            hour -= 12;
            suffix = 'PM';
        }
    } else if (hour < 1) {
        if (hour == 0) {
            hour = 12;
            suffix = 'AM';
        } else {
            hour += 12;
            suffix = 'PM';
        }
    } else {
        suffix = 'AM';
    }
    hour = hour + suffix;

    return hour
}

function saveEventData(event) {
    if (event.target.localName === "img"){ //if they click the icon in the button retarget it to the button its in
        event.target = event.target.parentElement;
    }
    if (event.target.type === "submit") { //only if button was clicked
        if (event.target.parentElement.children[1].value != ""){ //only if description has something in it
            tempArr = []; //initialize array
            if (localStorage.getItem('events') === null) { //if memory is empty make new array
                //make a new array
                tempArr = [
                    {
                        dayOfYear: moment().dayOfYear(),
                        eventTime: event.target.parentElement.firstChild.textContent,
                        eventDescription: event.target.parentElement.children[1].value,
                    }
                ];
            } else {
                //trying to add to current memeory
                tempArr = JSON.parse(localStorage.getItem('events'));
                if (event.target.parentElement.children[1].id == 'saved-item') {
                    console.log("noticed saved item attempting to delete the previous instance");
                    for (let index = 0; index < tempArr.length; index++) {
                        if ((tempArr[index].dayOfYear === moment().dayOfYear()) && (tempArr[index].eventTime === event.target.parentElement.firstChild.textContent)){
                            console.log("found the match at index:", index);

                            console.log(tempArr, "trying to delete index", index)
                            tempArrSliceFront = tempArr.slice(0, index);
                            console.log("slice at front: ", tempArrSliceFront)
                            tempArrSliceBack = tempArr.slice(index + 1, tempArr.length);
                            console.log("slice at back: ", tempArrSliceBack)
                            tempArr = [];
                            tempArr = tempArr.concat(tempArrSliceFront);
                            tempArr = tempArr.concat(tempArrSliceBack);
                            console.log(tempArr)
                        }
                    }
                }
                tempObject = {
                    dayOfYear: moment().dayOfYear(),
                    eventTime: event.target.parentElement.firstChild.textContent,
                    eventDescription: event.target.parentElement.children[1].value,
                }
                tempArr.push(tempObject);
            }
            event.target.parentElement.children[1].id = 'saved-item';
            localStorage.setItem('events', JSON.stringify(tempArr)) //convert array of objects to json
        }
    }

    return;
}

function init() {
    containerEl.on('click', saveEventData);
    main();
}

init();