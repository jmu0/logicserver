var shell = { 
    exec: require('child_process').exec,
    callback: undefined,
    cmd: function(cmd, callback){
        console.log('SHELL: '+cmd);
        shell.callback=callback;
        shell.exec(cmd,function(error,stdout,stderr){
            console.log("pc error: "+error);
            console.log('pc stdout: ' +stdout);
            console.log('pc stderro: '+stderr);
            if (shell.callback !== undefined)
                {   
                    shell.callback(stdout); 
                }   
        }); 
    },  
    puts: function(error, stdout, stderr){
        console.log("pc error: "+error);
        console.log('pc stdout: ' +stdout);
        console.log('pc stderro: '+stderr);
        return stdout;
    }   
};

function pc(props) {
    var pr;
    for (pr in props) {
        if (props.hasOwnProperty(pr)){
            this[pr]=props[pr];
        }
    }
}
pc.prototype = {
    wakeOnLan: function(){
        //LET OP: op arch linux moet het pakket wol geinstalleerd zijn
        //50:e5:49:be:e8:9e = htpc
        //c8:60:00:84:f5:e2 = htpc2 
        if (this.mac !== undefined){
            shell.cmd('wol ' + this.mac);
        } else {
            console.log("pc wakeonlan: geen mac adres gegeven");
        }
    },
    shutdown: function() {
        console.log('shutdown');
    },
    ssh: function(command){
        console.log(command);
    },
    test: function(wat) {
        console.log('test: '+wat);
    }
};
module.exports = pc;
