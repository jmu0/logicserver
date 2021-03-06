module.exports = [{
    "hostname": "htpc",
    "type": "pc",
    "room": "boven",
    "alive": false,
    "vlcAlive": false,
    "description": "pc jos boven",
    "vlcStartCommand": "export DISPLAY=:0.0; /usr/bin/vlc --aspect-ratio 16:9 --fullscreen --extraintf rc --rc-host htpc:9876",
    "vlcKillCommand": "killall vlc",
    "shutdownCommand": "sudo shutdown -hP now",
    "mac": "50:e5:49:be:e8:9e",
    "translate": []
}, {
    "hostname": "htpc1",
    "type": "pc",
    "room": "kamer",
    "alive": false,
    "vlcAlive": false,
    "description": "pc woonkamer jos",
    "vlcStartCommand": "export DISPLAY=:0.0; /usr/bin/vlc --aspect-ratio 16:9 --fullscreen --extraintf rc --rc-host htpc1:9876",
    "vlcKillCommand": "killall vlc",
    "shutdownCommand": "sudo shutdown -hP now",
    "mac": "c0:3f:d5:6b:3f:e0",
    "translate": []
}, {
    "hostname": "htpc2",
    "type": "pc",
    "room": "slaapkamer",
    "alive": false,
    "vlcAlive": false,
    "description": "pc slaapkamer jos",
    "vlcStartCommand": "export DISPLAY=:0.0; /usr/bin/vlc --aspect-ratio 16:9 --fullscreen --extraintf rc --rc-host htpc2:9876",
    "vlcKillCommand": "killall vlc",
    "shutdownCommand": "sudo shutdown -hP now",
    "mac": "c8:60:00:84:f5:e2",
    "translate": []
}, {
    "hostname": "josmac",
    "type": "pc",
    "room": "kamer",
    "alive": false,
    "vlcAlive": false,
    "discription": "macbook air van jos (ubuntu)",
    "vlcStartCommand": "export DISPLAY=:0.0; /usr/bin/vlc --aspect-ratio 16:9 --fullscreen --extraintf rc --rc-host josmac:9876",
    "vlcKillCommand": "killall vlc",
    "shutdownCommand": "sudo shutdown -hP now",
    "translate": [],
    "mac": "98:fe:94:43:e5:a6"
    // "discription": "macbook air van jos (osx)",
    // "vlcStartCommand": "export DISPLAY=:0.0; /Applications/VLC.app/Contents/MacOS/VLC --aspect-ratio=16:9 --fullscreen --extraintf=rc --rc-host=josmac:9876",
    // "vlcKillCommand": "killall -9 VLC",
    // "shutdownCommand": "sudo shutdown -h now",
    // "translate": [{
    //     "from": "/home/jos",
    //     "to": "/Users/jos/mediaserver"
    // }]
}];
