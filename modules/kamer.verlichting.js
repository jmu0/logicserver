/*global Home */
module.exports = {
    plafond1: {
        device: 'kaku',
        control: 15,
        on: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',on');
        },
        off: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',off');
        },
        dim: function(dim){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+','+dim);
        }
    },
    plafond2: {
        device: 'kaku',
        control: 16,
        on: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',on');
        },
        off: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',off');
        },
        dim: function(dim){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+','+dim);
        }
    },
    spot1: {
        device: 'kaku',
        control: 11,
        on: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',on');
        },
        off: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',off');
        },
        dim: function(dim){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+','+dim);
        }
    },
    staand: {
        device: 'kaku',
        control: 12,
        on: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',on');
        },
        off: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',off');
        },
        dim: function(dim){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+','+dim);
        }
    }
};
