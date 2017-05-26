var GameScene = cc.Scene.extend({
    jsBind:{
        _event:{
        },
        _keyboard: {
            onKeyPressed: function (key, event) {
            },
            onKeyReleased: function (key, event) {
                Log("App.js: JSScene:_keyboard:onKeyReleased()");
                if(key==82){
                    jsclient.restartGame();
                }
                if(key == 67 && jsclient.homeui){
                    jsclient.exportDataLayer();
                }
            }
        }
    },
    onEnter: function () {
        this._super();
        ConnectUI2Logic(this, this.jsBind);
        this.addChild(new UpdateLayer());
    }
});