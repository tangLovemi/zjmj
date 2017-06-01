/* 广播一个事件出去 */
function sendEvent(eName,ePara){
    Log("eventMgr.js: ==========>>>>>>>>> sendEvent() START evtName: " + eName);
    cc.eventManager.dispatchCustomEvent(eName,ePara);
}


/* 布局函数 pct:缩放 pos:相对屏幕位置  off:自身偏移倍数*/
function doLayout(wgt, pct, pos, off, isMax, isPar) {
    var screen=jsclient.size;
    var cutsize={width:0,height:0};
    var scPar=1;
    if(isPar) {
        var min={};
        var psize= {width:wgt.parent.width,height:wgt.parent.height};      //wgt.parent.getSize();
        scPar=wgt.parent.scale;

        cutsize.width=Math.max(0,(psize.width*scPar-screen.width)/2);
        cutsize.height=Math.max(0,(psize.height*scPar-screen.height)/2);

        min.width=Math.min(screen.width,psize.width*scPar);
        min.height=Math.min(screen.height,psize.height*scPar);
        screen=min;
        //mylog(screen.width+" "+screen.height);
    }

    var size={width:wgt.width,height:wgt.height}; //wgt.getSize();
    var sw=screen.width*pct[0]/size.width;
    var sh=screen.height*pct[1]/size.height;

    if(isMax==true) {
        var sc = Math.max(sw, sh);
        sw=sc;
        sh=sc;
    }
    else if(isMax==2) {
    }
    else if(sw!=0 && sh!=0) {
        var sc=Math.min(sw, sh);
        sw=sc;
        sh=sc;
    }
    else {
        var sc=Math.max(sw, sh);
        sw=sc;
        sh=sc;
    }
    
    sw/=scPar;
    sh/=scPar;
    wgt.scaleX=sw;
    wgt.scaleY=sh;
    wgt.setPosition( cutsize.width /scPar+screen.width *pos[0]/scPar + off[0]*size.width *sw,
        cutsize.height/scPar+screen.height*pos[1]/scPar + off[1]*size.height*sh);
    //Log("sw = " +  sw);
    //Log("sh = " +  sh);
    //Log("sx = " + sw);
    //Log("sy = " + sh);
    //Log("x = " + (cutsize.width/scPar+screen.width*pos[0]/scPar +off[0]*size.width*sw));
    //Log("y = " + (cutsize.height/scPar+screen.height*pos[1]/scPar+off[1]*size.height*sh));
}

/* 绑定UI事件 */
function BindUIEvent(pjs, node, evt, func) {
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: evt,
        callback: function(et) {
            func.call(node, et.getUserData(), evt);
        }}), node);
    if("resize"==evt) {
        func.call(node);
    }
}

/* 绑定函数 */
var bindFunction={
    /* 用户自定义事件 */
    _event:function(pjs, node, js) {
        for(var evt in js) {
            BindUIEvent(pjs, node, evt, js[evt]);
            //cc.eventManager.addCustomListener(evt,func);
        }
    },
    /* 触摸事件 */
    _touch:function(pjs, node, js) {
        node.addTouchEventListener(js, node);
    },
    /* 点击事件 */
    _click:function(pjs, node, js) {
        node.addTouchEventListener(function(btn, eT) {
            if(2==eT) {
                js(btn, eT);
            }
        },node);
    },
    /* 是否可见 */
    _visible:function(pjs, node, js) {
        if(typeof js=="function"){
            node.visible=js();
        }
        else{
            node.visible=js;
        }
    },
    /* 键盘事件 */
    _keyboard:function(pjs,node,js) {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: js.onKeyPressed,
            onKeyReleased:js.onKeyReleased,
        }, node);
    },
    /* checkBox事件 */
    _check:function(pjs, node, js) {
        node.addEventListener(js, pjs);
    },
    /* 布局 */
    _layout:function(pjs, node, js) {
        var ar=[node];
        for(var i=0; i<js.length; i++){
            ar.push(js[i]);
        }
        BindUIEvent(pjs, node, "resize", function(){
            doLayout.apply(node, ar);
        });
    },
    /* 设置文本Label专用 */
    _text:function(pjs, node, js) {
        node.setString(js())
    },
    /* ? */
    _run:function(pjs, node, js) {
        js.call(node);
    },
    /* 滑动事件? */
    _slider:function(pjs, node, js) {
        node.addEventListener(js, node);
    },
    /* 添加事件监听 */
    _listener:function(pjs, node, js) {
        node.addEventListener(js, node);
    }
}

/* 绑定UI和对应的逻辑 */
function ConnectUI2Logic(node, js) {
    if(node==null){
        return;
    }
    for(var cd in js) {
        if(cd.substr(0,1)=="_") {
            var func = bindFunction[cd];
            if(func){
                func(js, node, js[cd]);
            }
        }
        else {
            ConnectUI2Logic( node.getChildByName(cd), js[cd]);
        }
    }
    js._node = node;
}
