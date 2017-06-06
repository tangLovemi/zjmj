
function GameNet() {
	var pomelo_ioError="io-error";
	var pomelo_onKick="onKick";
	var pomelo_error="error";
	var pomelo_close="close";
	var pomelo_disconnect="disconnect";
	var pomelo_reconnect="reconnect";
	var pomelo_heartbeatTimeout="heartbeat timeout";

    var pomelo = window.pomelo;

    var  reqPingPong = [];
	var  reqStart=Date.now();
	var  lastTableCmd = null;
	/*  */
    function ComputePingPong() {
		//Log("gamenet.js: ComputePingPong()");
	    //Log("gamenet.js: interval： " + JSON.stringify(Date.now()-reqStart));
	    reqPingPong.push(Date.now()-reqStart);
	    //Log("gamenet.js: reqPingPong: " + JSON.stringify(reqPingPong));
	    if(reqPingPong.length>5){
		    reqPingPong.splice(0,1);
	    }
	    var pingpong=0;
	    for(var i=0;i<reqPingPong.length;i++){
		    pingpong+=reqPingPong[i];
	    }
	    jsclient.reqPingPong=pingpong/reqPingPong.length;
	    //Log("gamenet.js: jsclient.reqPingPong: " + jsclient.reqPingPong);
	}
	/*  */
    this.SetCallBack = function (evt, cb) {
	    Log("gamenet.js: SetCallBack() start: evt:" + evt);
        pomelo.off(evt);
		if(cb)
        pomelo.on(evt, function (data) {
			Log("Gamenet.js: ==============================>>>>>>>>>>>>>>>> server broadcast msg: " + evt);
			if(lastTableCmd==evt) {
				lastTableCmd=null; 
				ComputePingPong();
			}
			if(cc.sys.OS_WINDOWS==cc.sys.os) {
				//Log(evt + " :@@@: " + JSON.stringify(data));
			}
			cb(data); // 统一注册: function (d){sendEvent("QueueNetMsg",[evt,d]);}
		});
    }
	/*  */
	this.QueueNetMsgCallback=function(evt) {
		Log("gamenet.js: GameNet().QueueNetMsgCallback() evt:" + evt);
		this.SetCallBack(evt, function(d){sendEvent("QueueNetMsg",[evt,d]);});
	}

	this.unQueueNetMsgCallback = function (evt) {
		Log("gamenet.js: GameNet().unQueueNetMsgCallback() evt:" + evt);
		pomelo.off(evt);
	}

    //* 连接网络请求 *
    this.connect = function (host,port,f_ok,f_fail) {
	    Log("gamenet.js: GameNet().connect()");
		reqPingPong=[];
		pomelo.disconnect();
		this.SetCallBack(pomelo_disconnect,f_fail);
        pomelo.init({
            host: host,
            port: port,
            log: false
        }, f_ok);
    }
    //* 断开网络请求 *
    this.disconnect=function() {
	    Log("gamenet.js: GameNet().disconnect()");
		this.SetCallBack(pomelo_disconnect);
		pomelo.disconnect();
	}
    //* 发送网络请求 *
    this.request = function( type, msg, cb ) {
		Log("gamenet.js: GameNet().request() ================================================ START");
        Log("type: " + type);
        Log("msg : " + JSON.stringify(msg));
		//Log("cb : " + cb);
	    try {
			reqStart=Date.now();
		    Log("gamenet.js: GameNet().request(): arguments.length:" + arguments.length);
			if (2 == arguments.length) {
				pomelo.notify(type, msg); /* "通知"不需要服务器给回馈 */
				lastTableCmd = null;
				if("pkroom.handler.tableMsg"==type) {
					//Log("gamenet.js: GameNet().request(): set lastTableCmd= " + msg.cmd);
					lastTableCmd=msg.cmd;
				}
			} else {
				Log("gamenet.js: GameNet().request(): pomelo.request()");
				pomelo.request(type, msg, function(rtn) { /* "请求"需要服务器给回馈 */
					Log("gamenet.js: GameNet().request(): Anonymous func() called");
					ComputePingPong();
				    if(cc.sys.OS_WINDOWS==cc.sys.os){
					    Log(type + " # " + (Date.now()-reqStart) + " " + JSON.stringify(rtn));
				    }
				    cb(rtn);
			   });
			}
	    }catch(e){
		    sendEvent("disconnect",2);
		}
	    Log("gamenet.js: GameNet().request() ================================================ END");
    }
	/*  */
	this.resetCallback = function() {
		Log("gamenet.js: resetCallback() START");
		this.SetCallBack(pomelo_ioError, 			function (data) { });
		this.SetCallBack(pomelo_onKick, 			function (data) { });
		this.SetCallBack(pomelo_error, 				function (data) { });
		this.SetCallBack(pomelo_close, 				function (data) { });
		this.SetCallBack(pomelo_disconnect, 			function (data){ });
		this.SetCallBack(pomelo_reconnect, 		  	function (data){ });
		this.SetCallBack(pomelo_heartbeatTimeout, 		function(){ });
		Log("gamenet.js: resetCallback() END");
	}
	/*  */
    this.resetCallback();	
	//Object.defineProperty(this,"connected",{get:function(){return 1==pomelo.socket.readyState;}});
}
