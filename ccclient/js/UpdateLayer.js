(function () {

    var loadingBarNode;
    var loadingBarHeadNode;

    //* 设置进度条 *
    function setProgressPercent(p) {
        Log("Update.js: setProgressPercent() START p = " + p);
        loadingBarNode.setPercent(p);
        loadingBarHeadNode.setVisible(false);
        if (p > 20 && p <= 100) {
            loadingBarHeadNode.setVisible(true);
            loadingBarHeadNode.setPositionX((p/100)*loadingBarNode.getContentSize().width);
        }
    }


    UpdateLayer = cc.Layer.extend({
        jsBind: {
            back: {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
            },
            titleBg: {
                _layout: [[0.5, 1], [0.5, 1.2], [0, -1.5]]
            },
            loadPanel: {
                _run: function () {
                    this.anchorX = 0.5;
                    this.anchorY = 0.5;
                },
                _layout: [[0.5, 0], [0.5, 0.2], [0, 0]],
                bar: {
                    _run: function () {
                        loadingBarNode = this;
                    },
                    barHead: {
                        _run: function () {
                            loadingBarHeadNode = this;
                        }
                    }
                }
            },
            testBtn1:{
                _layout: [[0.2, 0.2], [0.5, 0.5], [-1.8, 0]],
                _click:function(){
                    testConnect();
                }
            },
            testBtn2:{
                _layout: [[0.2, 0.2], [0.5, 0.5], [0, 0]],
                _click:function(){
                    testLogin();
                }
            },
            testBtn3:{
                _layout: [[0.2, 0.2], [0.5, 0.5], [1.8, 0]],
                _click:function(){
                    testCreateRoom();
                }
            },

        },
        ctor: function () {
            this._super();
            var updateui = ccs.load(res.Update_json);
            ConnectUI2Logic(updateui.node, this.jsBind);
            this.addChild(updateui.node);
            jsclient.updateui = this;
            setProgressPercent(66);

            testXhr();

            jsclient.initGameNet();




            return true;
        }
    });
})();