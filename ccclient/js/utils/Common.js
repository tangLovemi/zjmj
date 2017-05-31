/**
 * Created with JetBrains WebStorm.
 * User: yinfeng
 * Date: 13-7-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */

var jsclient = jsclient || {};

jsclient.getRootLayer = function(node){
    var root = node;

    var count = 0;
    var MAX_COUNT = 100;
    while(root.getParent() && count < MAX_COUNT){
        root = root.getParent();
        count ++;
    }
    return root;
};

jsclient.inherits = function (childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;
};

jsclient.concatObjectProperties = function(dstObject, srcObject){
    if(!dstObject)
        dstObject = {};

    if (!srcObject){
        return dstObject;
    }

    for(var selKey in srcObject){
        dstObject[selKey] = srcObject[selKey];
    }
    return dstObject;
};

jsclient.createClickEffect = function(node, imagePath) {
    imagePath = (imagePath == null) ? "ccbResources/common/frame/frame_dianji_guangxiaoy.png" : imagePath;
    var halo = jsclient.SpriteUtils.create(imagePath);
    var itemSize = node.getContentSize();

    halo.setPosition(cc.p(itemSize.width/2, itemSize.height/2));
    node.addChild(halo, 99);
    halo.setScale(0);

    var scaleTo = cc.ScaleTo.create(0.2, 1);
    var fadeOut = cc.FadeOut.create(0.1);
    var removeSelf = cc.CallFunc.create(function(sender) {
        sender.removeFromParent(true);
    });
    halo.runAction(cc.Sequence.create(scaleTo, fadeOut, removeSelf));
}


jsclient.call = function(callback, object, arg1, arg2, arg3, arg4){
    if(null != callback){
        if(null!= object){
            if (arg4 == undefined && arg3 == undefined && arg2 == undefined && arg1 == undefined){
                return callback.call(object);
            }else if (arg4 == undefined && arg3 == undefined && arg2 == undefined){
                return callback.call(object, arg1);
            }else if (arg4 == undefined && arg3 == undefined){
                return callback.call(object, arg1, arg2);
            }else if (arg4 == undefined){
                return callback.call(object, arg1, arg2, arg3);
            }else{
                return callback.call(object, arg1, arg2, arg3, arg4);
            }
        }else{
            if (arg4 == undefined && arg3 == undefined && arg2 == undefined && arg1 == undefined){
                return callback();
            }else if (arg4 == undefined && arg3 == undefined && arg2 == undefined){
                return callback(arg1);
            }else if (arg4 == undefined && arg3 == undefined){
                return callback(arg1, arg2);
            }else if (arg4 == undefined){
                return callback(arg1, arg2, arg3);
            }else{
                return callback(arg1, arg2, arg3, arg4);
            }
        }
    }else{
        // Log("lb.call callback is null");
    }
};

jsclient.reflectionToString = function(object, recursive, recursiveDeepNum){
    var str = "";
    if (object){
        for (var name in object) {
            if( typeof object[name] != "function"){
                var property = object[name];

                recursiveDeepNum = recursiveDeepNum || 0;
                if (typeof property == 'object' && recursive && recursiveDeepNum < 5){
                    str += name + "{" + jsclient.reflectionToString(property, true, recursiveDeepNum++) + "}, ";
                }else{
                    if (property && property["toString"]){
                        str += name + "[" + object[name].toString() + "], ";
                    }else{
                        str += name + "[" + object[name] + "], ";
                    }
                }
            }
        }
    }
    return str;
};

jsclient.retain = function(node){
    if( typeof node["retain"] == "function"){
        node.retain();
    }else{
        Log("node has not a method named retain")
    }
};

jsclient.release = function(node){
    if( typeof node["release"] == "function"){
        node.release();
    }else{
        Log("node has not a method named release")
    }
};

jsclient.getCurrentMillSeconds = function(){
    return new Date().getTime();
};

jsclient.hasFunction = function(target, funcName){
    if (target && typeof target[funcName] == "function"){
        return true;
    }
    return false;
};


jsclient.toColor3b = function(color){
    if (color.length != 6){
        Log("color's length must be 6.");
        return null;
    }
    var r = parseInt("0x" + color.substring(0, 2));
    var g = parseInt("0x" + color.substring(2, 4));
    var b = parseInt("0x" + color.substring(4, 6));

    var c3b = cc.c3b(r, g, b);
    Log("toColor3b-->color:" + color + ", c3b:" + jsclient.reflectionToString(c3b));
    return c3b;
};

jsclient.getScreenshotOfCurrentScene = function(imageName) {
    // 截图
    var winSize = cc.Director.getInstance().getWinSize();
    var render = cc.RenderTexture.create(winSize.width, winSize.height);
    render.begin();
    cc.Director.getInstance().getRunningScene().visit();
    render.end();

    if(sys.platform === "browser") {
        cc.log("RenderTexture's saveToFile doesn't suppport on HTML5");
        return;
    }

    var namePNG = ((imageName == undefined) ? "screenshot" : imageName) + ".png";
    render.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG);
    return cc.FileUtils.getInstance().getWritablePath() + namePNG;
}
