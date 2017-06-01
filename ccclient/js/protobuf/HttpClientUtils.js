/**
 *
 * HTTP请求客户端工具类
 * Created by chennq on 14-3-7.
 */


jsclient.HttpClientUtils = {
    _single: null,  // 是否单机
    _singleHandlers: {},   // 单机处理类

    _isNetwork: false,  // 是否联网

    _sendRequests: new jsclient.ArrayList(),    // 发送请求集合

    // 是否联网
    isNetwork: function(){
        return jsclient.HttpClientUtils._isNetwork;
    },

    // 发送hello报文
    sendHelloMessage: function(){
        var helloMessage = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.CommonProtocol, "CommonMessage");
        helloMessage.cmd = 1;
        helloMessage.data = new dcodeIO.ByteBuffer();
        var callback = function(response, responseText){
            jsclient.HttpClientUtils._isNetwork = true;
        };

        var timeoutCallback = function(){
            jsclient.HttpClientUtils._isNetwork = false;
        }

        jsclient.HttpClientUtils.sendProtobufMessage("/server/player/hello.do", helloMessage, callback, null, timeoutCallback);
    },

    sendProtobufMessage: function(url, message, callback, callbackTarget, timeoutCallback, timeoutCallbackTarget){
        Log("start sendProtobufMessage, url:" + (jsclient.Config.getServerWebUrl() + url));

        if (jsclient.HttpClientUtils.isSingle()){
            jsclient.HttpClientUtils._sendProtobufMessageToSingle(url, message, callback, callbackTarget);
        }else{
            var requestInfo = new jsclient.HttpClientRequestInfo(callback, callbackTarget, timeoutCallback, timeoutCallbackTarget);
            jsclient.HttpClientUtils._sendRequests.add(requestInfo);

            jsclient.HttpClientUtils._sendProtobufMessageToServer(url, message, requestInfo.callback, requestInfo);
            jsclient.HttpClientUtils._checkAndRemoveEndRequest();
        }
    },

    registerSingleHandler: function(url, handler, handlerTarget){
        if (!jsclient.HttpClientUtils._singleHandlers){
            jsclient.HttpClientUtils._singleHandlers = {};
        }
        jsclient.HttpClientUtils._singleHandlers[url] = [handler, handlerTarget];

        Log("registerSingleHandler-->url:" + url);
    },

    _sendProtobufMessageToSingle: function(url, message, callback, callbackTarget){
        var handlers = jsclient.HttpClientUtils._singleHandlers[url];
        if (handlers){
            Log("isSingle, url:" + url);
            jsclient.call(handlers[0], handlers[1], message, callback, callbackTarget);
        }else{
            Log("_sendProtobufMessageToSingle error: no handler-->url: " + url);
        }
    },

    _sendProtobufMessageToServer: function(url, message, callback, callbackTarget){
        var data = message.encodeHex();

        var xhr = new XMLHttpRequest();

        var sendUrl = jsclient.Config.getServerWebUrl() + url + "?t=" + new Date().getTime();
        xhr.open("POST", sendUrl, true);
        xhr.responseType = "arraybuffer";
//        xhr.setRequestHeader("Content-length", datas.byteLength);
//        xhr.setRequestHeader("Content-Type", "application/x-protobuf");

        xhr.timeout = 30000;
        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == 4) {//Ready State will be 4 when the document is loaded.
                if(xhr.status == 200) {
                    Log("send url:" + url + ", succeed");

                    jsclient.HttpClientUtils._isNetwork = true;
                    jsclient.call(callback, callbackTarget, xhr.response, xhr.responseText);
                } else { //An error occured
                    Log("send url:" + sendUrl + " error, error status :" + xhr.status);
                }
            }
        }
        // Log("send data:" + data);
        xhr.send("data=" + data);
    },

    _checkAndRemoveEndRequest: function(){
        var removeRequests = new jsclient.ArrayList();
        for (var i=0; i<jsclient.HttpClientUtils._sendRequests.length; i++){
            var requestInfo = jsclient.HttpClientUtils._sendRequests[i];
            if (requestInfo.isEnd()){
                removeRequests.add(requestInfo);
            }
        }

        for (var i=0; i<removeRequests.length; i++){
            var requestInfo = removeRequests[i];
            requestInfo.destroy();
            jsclient.HttpClientUtils._sendRequests.removeElement(requestInfo);
        }
    },

    isSingle: function(){
        //if (!jsclient.HttpClientUtils._single){
        //    var networkMode = jsclient.CsvConfigParser.getCommonConfigValue("NETWORK_MODE");
        //    jsclient.HttpClientUtils._single = (networkMode == "1");
        //}
        //return jsclient.HttpClientUtils._single;
        return jsclient.HttpClientUtils._single;
    }
};

jsclient.HttpClientRequestInfo = cc.Class.extend({

    TIME_OUT: 15000, // 超时时间

    _sendTime: -1,  // 发送时间（毫秒）

    _callback: null,
    _callbackTarget: null,

    _timeoutCallback: null,
    _timeoutCallbackTarget: null,

    _timeoutTimer: null,
    _isEnd: false,

    ctor: function(callback, callbackTarget, timeoutCallback, timeoutCallbackTarget){
        this._sendTime = jsclient.getCurrentMillSeconds();

        this._callback = callback;
        this._callbackTarget = callbackTarget;
        this._timeoutCallback = timeoutCallback;
        this._timeoutCallbackTarget = timeoutCallbackTarget;

        var self = this;
        var timeoutCallback = function(){
            self._isEnd = true;

            if (this._timeoutCallback){
                jsclient.call(this._timeoutCallback, this._timeoutCallbackTarget);
            }else{
                //jsclient.TipUtils.showSimpleTipByInfoCode("3");
                //delay time handle

            }
        }
        this._timeoutTimer = new jsclient.SchedulerHelper(timeoutCallback);
        this._timeoutTimer.startTimer(this.TIME_OUT / 1000, 0);
    },

    callback: function(response, responseText){
        Log("HttpClientRequestInfo.callback...");
        this._isEnd = true;
        this._timeoutTimer.cancelTimer();
        jsclient.call(this._callback, this._callbackTarget, response, responseText);
    },

    destroy: function(){
        this._timeoutTimer.cancelTimer();
    },

    isEnd: function(){
        if (this._isEnd){
            return true;
        }

        return jsclient.getCurrentMillSeconds() - this._sendTime >= this.TIME_OUT;
    }
});