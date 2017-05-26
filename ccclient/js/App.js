//* 重启游戏 *
jsclient.restartGame=function() {
    Log("app.js: jsclient.restartGame()");
    if(jsclient.gamenet)
        jsclient.gamenet.disconnect();
    sendEvent("restartGame");
}

jsclient.initGameNet=function(){
    if(!jsclient.gamenet){
        jsclient.gamenet = new GameNet();
    }
}

jsclient.connect=function(host, port, successCb, failCb){
    jsclient.gamenet.connect(host, port, successCb, failCb);
}