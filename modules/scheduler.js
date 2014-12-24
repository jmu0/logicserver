/*jslint todo:true */

function Schedule(when) {
    this.when = when;
    //TODO: set time paremeters 
}
Schedule.prototype = {
    once: false,
    countCompleted: 0,
    second: [],
    minute: [],
    hour: [],
    dayOfWeek: [],
    dayOfMonth: [],
    month: [],
    year: [],
    timeToNext: function(){
        //TODO: cron-like scheduling
        var timeMS = 1000;

        this.countCompleted++;
        return timeMS; 
    }
};

function Task (when, what) {
    this.when = when;
    if (when instanceof Schedule) {
        this.schedule = when;
    } else {
        this.schedule = new Schedule(when);
    }
    this.what = what; //callback function
    this.scheduleTask();
}
Task.prototype = {
    scheduleTask: function(){
        var that = this;
        var time = this.schedule.timeToNext();
        if (time > 0) {
            setTimeout(function() {
                that.what(); 
                that.scheduleTask();
            },time);
        }
        //DEBUG: console.log('task scheduled');
    }
};

module.exports = {
    Task: Task,
    Schedule: Schedule
};

