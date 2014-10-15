/*global Home */
var http = require('http');
var fs = require('fs');

function parseUrl(url) {
    var split=url.split('/');
    var i;
    var q={
        'url':url,
    };
    if (url ==='/'){
        q.command='file';
        q.file='index.html';
    } else if (split[1]==='favicon.ico') {
        q.command='file';
        q.file=split[1];
    } else if (split[1]==='setcontrol'){
        if (split.lehgth<4) {
            q=false;
        } else { 
            q.command='setcontrol';
            q.device=split[2];
            q.value=split[3];
        }
    } else if (split[1]==='device'){
        if (split.lehgth<4) {
            q=false;
        } else { 
            q.command='device';
            q.value=split[split.length-1];
            q.device=split.splice(2,split.length-3);
        }
    } else {
        q.command=split[1];
        q.value="";
        for(i=2; i<split.length; i++){
            q.value += split[i]+"/";
        }
    }


    return q;
}

http.createServer(function(req,res) {
    res.writeHead(200, { 'Content-Type': 'text/html'});
    var query=parseUrl(req.url);
    if (query.command==='file') {
        var path = Home.rootpath+"ui/"+query.file;
        fs.exists(path, function(exists) {
            if (exists){
                var fileStream = fs.createReadStream(path);
                fileStream.on('data', function (data) {
                    res.write(data);
                });
                fileStream.on('end', function() {
                    res.end();
                });
            } else {
                res.end(path+' bestaat niet');
            }
        });
    }else if (query.command === 'setcontrol'){
        Home.ioclient.write('setcontrol ' + query.device + " " + query.value);
        res.end();
    } else if (query.command === 'device'){
        Home[query.device[0]][query.device[1]][query.device[2]].set(query.value);
        res.end();
    }else{
        res.end(JSON.stringify(query));
    }
}).listen(8888);
/* IPTABLES:
 * sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8888
 */
