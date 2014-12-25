/*jslint todo:true */
/*global Home */

function Schedule(when) {
    this.when = when;
    if (when instanceof Date) {
        this.parseDate(when);
    } else if (typeof when === 'string') {
        this.parseCronString(when);
    } else {
        this.parseObject(when);
    }
}
Schedule.prototype = {
    second: [],
    minute: [],
    hour: [],
    dayOfWeek: [],
    dayOfMonth: [],
    month: [],
    year: [],
    timeToNext: function(){
        //TODO: figure out next event
        var timeMS = -1;
        var now = new Date();
        var next = new Date(now); //1 milisecond before now
        var i = false;
        var diff;
        //check year
        if (this.year.length > 0) {
            this.year.forEach(function(y){
                if (y >= now.getFullYear() && (i > y || i === false)){ i  = y; }
            });
            console.log('year: ' + i);
        }
        if (i) { next.setFullYear(i); }
        //check month
        i = false;
        if (this.month.length > 0) {
            this.month.forEach(function(y){
                if (i > y + 12 || i === false) { i = y + 12; }
            });
            if (i) { i -= 12; }
            console.log('month: ' + i);
        }
        if (i) { next.setMonth(i); }
        //check day (dayOfMonth + dayOfWeek)
        i = false; 
        if (this.dayOfMonth.length > 0) {
            this.dayOfMonth.forEach(function(y){
                //TODO: zoals bij hr/min/sec
                if (y >= now.getDate() && (i > y || i === false)) { i  = y; }
                console.log('loop dayofmonth '+y);
            });
            if (i) { i = i - now.getDate(); } //i = days from now
            console.log('dayofmonth '+i);
        }
        if (this.dayOfWeek.length > 0) {
            var dow = now.getDay();
            if (dow === 0) { dow = 7; } //sunday = 7, not 0
            this.dayOfWeek.forEach(function(y){
                diff = y - dow;
                if (diff < 0) { diff += 7; }
                if (diff < i || i === null) { i = diff; }
                console.log("y:"+y+" dow:"+dow+" diff:"+diff+" i:"+i);
            });
            console.log('dayofweek '+ i);
        }
        if (i !== false) { 
            console.log('day: ' + (now.getDate() + i));
            next.setDate(now.getDate() + i);
        }
        //check hour
        i = false;
        if (this.hour.length > 0) {
            var h = now.getHours();
            this.hour.forEach(function(y){
                diff = y - h;
                if (diff < 0) { diff += 24; }
                if (diff < i || i === false) { i = diff; }
            });
            if (i) { 
                i = h + i; 
                if (i===24) { i = 0; }
            }
            console.log('hour: '+i);
        }
        if (i !== false) { next.setHours(i); }
        //check minutes
        i = false;
        if (this.minute.length > 0) {
            var min = now.getMinutes();
            this.minute.forEach(function(y){
                diff = y - min;
                if (diff < 0) { diff += 60; }
                if (diff < i || i === false) { i = diff; }
                //console.log("y:"+y+" min:"+min+" diff:"+diff+" i:"+i);
            });
            if (i) { 
                i = min + i; 
                if (i===60) { i = 0; }
            }
            console.log('minutes: ' + i);
        }
        if (i !== false) { next.setMinutes(i); }
        //check seconds
        i = false;
        if (this.second.length > 0) {
            var sec = now.getSeconds() + 1;
            this.second.forEach(function(y){
                diff = y - sec;
                if (diff < 0) { diff += 60; }
                if (diff < i || i === false) { i = diff;}
            });
            if (i) { 
                i = sec + i; 
                if (i===60) { i = 0; }
            }
            console.log('seconds: '+i);
        }
        if (i !== false) { next.setSeconds(i); }

        timeMS = next.getTime() - now.getTime();
        //DEBUG: 
        if (this.name) { console.log(this.name); }
        console.log("now:  " + now);
        console.log("next: " + next + " in " + timeMS + " ms"); 
        //
        return timeMS; 
    },
    parseObject: function(o) {
        if (o.year && o.year instanceof Array) { this.year = o.year; }
        if (o.month && o.month instanceof Array) { this.month = o.month; }
        if (o.dayOfMonth && o.dayOfMonth instanceof Array) { this.dayOfMonth = o.dayOfMonth; }
        if (o.dayOfWeek && o.dayOfWeek instanceof Array) { this.dayOfWeek = o.dayOfWeek; }
        if (o.hour && o.hour instanceof Array) { this.hour = o.hour; }
        if (o.minute && o.minute instanceof Array) { this.minute = o.minute; }
        if (o.second && o.second instanceof Array) { this.second = o.second; }
        if (o.name) { this.name = o.name; }
    },
    parseDate: function(d){
        if (d instanceof Date) {
            this.year = [ d.getFullYear() ];
            this.month = [ d.getMonth() ];
            this.hour = [ d.getHours() ];
            this.minute = [ d.getMinutes() ];
            this.second = [ d.getSeconds() ];
        }
    },
    parseCronString: function(s) {
        //TODO: parse cron string
        s=false; return s;
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
    when: "",
    what: undefined,
    countCompleted: 0,
    once: false,
    schedule: undefined,
    eventName: 'task',
    scheduleTask: function(){
        if ((this.once===true && this.countCompleted > 0) === false) {
            var that = this;
            var time = this.schedule.timeToNext();
            if (time > 0) {
                setTimeout(function() {
                    that.what(); //trigger callback
                    if (global.Home) {
                        Home.events.trigger(that.eventName);
                    }
                    that.countCompleted++;
                    that.scheduleTask(); //next task
                },time);
            }
        }
    }
};

module.exports = {
    Task: Task,
    Schedule: Schedule
};

