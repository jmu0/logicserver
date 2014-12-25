var s = require('./modules/scheduler.js');
var g = "";

var when = new Date();
when.setSeconds(when.getSeconds() + 2);

/*
var d = new s.Task(when, function(){
    console.log("DATE EVENT");
});
*/
/*
var test1= {
    name: "test1: halve minuut",
    year: [ 2014 ],
    dayOfMonth: [24],
    second: [0,30]
};

var t1 = new s.Task(test1, function(){
    console.log(t1.name + ' TIMER EVENT');
});
*/

var test2= {
    name: "test1: elk kwartier",
    year: [ 2014 ],
    dayOfMonth: [24,25],
    minute: [0,15,30,45],
    second: [0]
};
var t2 = new s.Task(test2, function(){
    console.log(t2.name + ' TIMER EVENT');
});

var test3= {
    name: "test1: middernacht",
    year: [ 2014 ],
    dayOfMonth: [22],
    dayOfWeek: [3,4,5],
    hour: [0],
    minute: [0],
    second: [0]
};
var t3 = new s.Task(test3, function(){
    console.log(t3.name + ' TIMER EVENT');
});
