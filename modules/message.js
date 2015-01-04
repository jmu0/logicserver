/*jslint todo: true */
/*global Home */

module.exports = {
    //TODO: implement filter???
    handlers: {},
    on: function(message, callback) {
        if (this.handlers[message] === undefined) {
            this.handlers[message] = [];
        }
        this.handlers[message].push(callback);
    },
    publish: function(message, data){
        //DEBUG:  
        if (Home.debug) { console.log('Publish message: ' + message); console.log(data); }
        if (this.handlers[message] !== undefined){
            this.handlers[message].forEach(function(handler){
                handler(data);
            });
        }
    }
};
