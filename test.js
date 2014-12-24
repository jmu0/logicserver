var s = require('./modules/scheduler.js');
var t = new s.Task(1, function(){
    console.log(new Date());
});
