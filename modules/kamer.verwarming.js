/*global Home */
module.exports = {
    radiator1: {
        control: 'di2',
        device: 'arduino01',
        on: function() {
            Home.ioserver.write('setcontrol '+this.device+' '+this.control+'=1');
        },
        off: function() {
            Home.ioserver.write('setcontrol '+this.device+' '+this.control+'=0');
        }
    },
    radiator2: {
        control: 'di3',
        device: 'arduino01',
        on: function() {
            Home.ioserver.write('setcontrol '+this.device+' '+this.control+'=1');
        },
        off: function() {
            Home.ioserver.write('setcontrol '+this.device+' '+this.control+'=0');
        }
    },
    radiator3: {
        control: 'di4',
        device: 'arduino01',
        on: function() {
            Home.ioserver.write('setcontrol '+this.device+' '+this.control+'=1');
        },
        off: function() {
            Home.ioserver.write('setcontrol '+this.device+' '+this.control+'=0');
        }
    }
};
