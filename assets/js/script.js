//html variables
var currentDayEl = $('#currentDay');
var containerEl = $('.container');

//runs after events are initialized fills out rows with content
function main() {
    currentDayEl.text(moment().format("dddd, MMMM Do")); //on start create the up-to-date title at the top
    var maxHours = 8; //8 hours a day
    var offsetHours = 9 //start at 9am
    //create my times
    for (var hour = offsetHours; hour <= maxHours + offsetHours; hour++){ //loop over every hour and create a row for every hour
        //div row that holds all the stuffs
        var timeRowEl = document.createElement('div');
        timeRowEl.setAttribute('class', 'row time-block');

        //the 3 objects in the row to fill
        var hourEl = document.createElement('div');
        hourEl.setAttribute('class', 'col-sm-1 hour');
        var DescriptionEl = document.createElement('textarea');
        var saveBtnEl = document.createElement('button');
        saveBtnEl.setAttribute('class', 'col-sm-1 saveBtn');

        //format the time to usable format like 9am or 5pm
        var timeAtIndex = formatMilitaryTime(hour);
        hourEl.textContent = timeAtIndex; //set textcontent on time to the formatted version

        if (hour < moment().hour()) { //if below current time then its past that time
            DescriptionEl.setAttribute('class', 'col-sm-10 description past');
        } else if (hour == moment().hour()) { //if the hour is equivalent then its that hour
            DescriptionEl.setAttribute('class', 'col-sm-10 description present');
        } else { //anything else hasnt been reached so its the future
            DescriptionEl.setAttribute('class', 'col-sm-10 description future');
        }

        var saveIconEL = document.createElement('img') //add the image for the save button
        saveIconEL.setAttribute('src', './assets/images/saveicon.png')
        saveBtnEl.append(saveIconEL); //slap the image onto the save button

        var tempArr = JSON.parse(localStorage.getItem('events')); //check if theres a event at this timeslot on this day
        if(tempArr != null) { //as long as its not empty try
            for (let index = 0; index < tempArr.length; index++) { //loop over all saved events
                if ((hourEl.textContent == tempArr[index].eventTime) && (moment().dayOfYear() == tempArr[index].dayOfYear)) {
                    DescriptionEl.textContent = tempArr[index].eventDescription;
                    DescriptionEl.setAttribute('id', 'saved-item');
                }
            }
        }

        //append items into the row in correct order
        timeRowEl.append(hourEl);
        timeRowEl.append(DescriptionEl);
        timeRowEl.append(saveBtnEl);

        //append rows onto the container
        containerEl.append(timeRowEl);
    }

    return;
}

function formatMilitaryTime(hour) {
    var suffix = '';

    if (hour > 23) { //if over 24 hours reset back to morning
        if (hour == 24) {//if midnight make it 12am
            hour = 12;
            suffix = 'AM';
        } else { //after midnight is morning so subtract 24
            hour -= 24;
            suffix = 'AM';
        }
    } else if (hour > 11) { //anything over noon subtract 12 to get back to normal format
        if (hour == 12) { //if 12 make it 12pm
            hour = 12;
            suffix = 'PM';
        } else { //anything after 12 just subtract 12 to get to normal single digits
            hour -= 12;
            suffix = 'PM';
        }
    } else if (hour < 1) { //if its below 1 it would be night time
        if (hour == 0) { //0 hour is 12am so set it
            hour = 12;
            suffix = 'AM';
        } else { //anything else is pm of previous night so add 12 cause negative and add pm
            hour += 12;
            suffix = 'PM';
        }
    } else { //everything else is normal hour (1-11) so just add am
        suffix = 'AM';
    }
    hour = hour + suffix; //add the suffix that was chosen

    return hour
}

//on click of a button trigger a save event scenario
function saveEventData(event) {
    if (event.target.localName === "img"){ //if they click the icon
        event.target = event.target.parentElement; //reset the target as the button itself
    }
    if (event.target.type === "submit") { //only if button was clicked (cause it could be the textbox or something in the container)
        if (event.target.parentElement.children[1].value != ""){ //only if description has something in it
            var tempArr = []; //initialize array
            if (localStorage.getItem('events') === null) { //if memory is empty make new array
                //make a new array because we dont have one
                tempArr = [{ //array of objects
                        dayOfYear: moment().dayOfYear(), //day of the year in 365 format so dont have to look at months or month days
                        eventTime: event.target.parentElement.firstChild.textContent, //set as 9am or 5pm format
                        eventDescription: event.target.parentElement.children[1].value, //whatever text is in the textbox
                    }];
            } else {
                //trying to add to current memeory
                tempArr = JSON.parse(localStorage.getItem('events')); //fill array with exsisting memory
                if (event.target.parentElement.children[1].id == 'saved-item') { //if item is tagged as already having data stored delete previous
                    for (let index = 0; index < tempArr.length; index++) { //go find the data that was already stored in this timeslot
                        if ((tempArr[index].dayOfYear === moment().dayOfYear()) && (tempArr[index].eventTime === event.target.parentElement.firstChild.textContent)){
                            tempArrSliceFront = tempArr.slice(0, index);
                            tempArrSliceBack = tempArr.slice(index + 1, tempArr.length);
                            tempArr = []; //set array back to empty
                            tempArr = tempArr.concat(tempArrSliceFront); //everything before the current index
                            tempArr = tempArr.concat(tempArrSliceBack); //everything after the current index
                        }
                    }
                }
                tempObject = { //temp object to build out the new data to add to the array
                    dayOfYear: moment().dayOfYear(), //day of the year in 365 format so dont have to look at months or month days
                    eventTime: event.target.parentElement.firstChild.textContent, //set as 9am or 5pm format
                    eventDescription: event.target.parentElement.children[1].value, //whatever text is in the textbox
                }
                tempArr.push(tempObject); //push new data into the array to be stored with other stuff
            }
            event.target.parentElement.children[1].id = 'saved-item'; //tag saved descriptions so we remember to erase previous data if overwritten
            localStorage.setItem('events', JSON.stringify(tempArr)) //convert array of objects to json and store it
        }
    }

    return;
}

//initialize the event click for the save button
function init() {
    containerEl.on('click', saveEventData);
    main(); //call to start creating objects
}

init();