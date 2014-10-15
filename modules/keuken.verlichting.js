/*global Home */
module.exports = {
    plafond1: {
        device: 'kaku',
        control: 20,
        on: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',on');
        },
        off: function(){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+',off');
        },
        dim: function(dim){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+','+dim);
        },
        set: function(value){
            Home.ioclient.write('setcontrol '+this.device+' '+this.control+','+value);
        }
    }
};
