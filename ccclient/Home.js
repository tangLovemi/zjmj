
function GetSelfHead() {
	var pinfo=jsclient.data.pinfo;
	return {uid:pinfo.uid,url:pinfo.headimgurl};
}

function changeLabelAtals(node,count) {
	return ;
	var changeLabelAtals_size = node.getVirtualRendererSize();
	var  stringnum = node.getString();
	var oneNumwith ;
	if (stringnum>999) {
		oneNumwith = changeLabelAtals_size.width /4;
	}else if(stringnum>99)
	{
		oneNumwith = changeLabelAtals_size.width /3;
	}else if(stringnum>9) {
		oneNumwith = changeLabelAtals_size.width /2;
	}else {
		oneNumwith = changeLabelAtals_size.width ;
	}
	var size=node.getVirtualRendererSize();
	if(count>999) {
		size.width= oneNumwith*4;
	}else if (count > 99) {
		size.width=  oneNumwith*3;
	}else if(count>9) {
		size.width=  oneNumwith*2;
	}else {
		size.width=  oneNumwith;
	}
	node.setSize(size);
	node.setString(count);
}

function homeRunText(node) {
	var length = node.stringLength * node.fontSize + node.getParent().getCustomSize().width;
	node.width = length;
	node.anchorX = 0;
	node.x += node.getParent().getCustomSize().width/2;
	var startPosX = node.x;
	var callback = function() {
		cc.log("callback");
		node.x = startPosX;
	}
	node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(length/150.0, cc.p(-length, 0)), cc.callFunc(callback))));
}

function initMJTexture(node){
	cc.log("Home.js: initMJTexture() START");
	var ID_arry = jsclient.majiang.randomCards();
	var used_arry=[];
	for (var i=0; i<ID_arry.length; i++) {
		var isused =false;
		for (var j = 0; j < used_arry.length; j++) {
			if(used_arry[j]==ID_arry[i]){
				isused =true;
			}
		}
		used_arry.push(ID_arry[i]);
		if (!isused){
			for (var j=0; j<5; j++) {
				var  img = new ccui.ImageView();
				setCardPic(img, ID_arry[i], j);
				doLayout(img,[0.01, 0.01], [0,2], [0,0], false, false);
				node.addChild(img);
			}
		}
	}
	cc.log("Home.js: initMJTexture() END");	
}

function GetGiftFlag() {
	var flag = jsclient.data.pinfo.recommendBy;
	if (flag != null)
		return flag;
	else
		return -1;
}

function newPlayerAwardTimer(dt) {
	--newPlayerAwardLeftTime;
	if (newPlayerAwardLeftTime <= 0) {
		newPlayerAwardBtn.unscheduleAllCallbacks();
		newPlayerAwardBtn.removeFromParent(true);
		newPlayerAwardBtn = null;
		newPlayerAwardLeftTime = null;
	}
}

var newPlayerAwardBtn = null, newPlayerAwardLeftTime = 99999;
var noticeNode, historyNode, broadcastNode;

var HomeLayer=cc.Layer.extend({
	jsBind:{
		_event:{
			logout:function(){
				cc.log("Home.js: HomeLayer:eat:_event:logout()");
				if(jsclient.homeui){
					jsclient.homeui.removeFromParent(true);
					delete jsclient.homeui;
				}
			}
		},
		back:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		setting:{
			_layout:[[0.1,0.14],[1,1],[-0.7,-0.6]],
			_click:function(){
				var settringLayer = new  SettingLayer();
				settringLayer.setName("HomeClick");
				jsclient.Scene.addChild(settringLayer);
			}
		},
		help:{
			_layout:[[0.1,0.14],[1,1],[-1.9,-0.6]],
			_click:function(){
				//jsclient.openWeb({url:jsclient.remoteCfg.helpHeFeiUrl, help:true});
				//jsclient.ShowGuiZe({url:jsclient.remoteCfg.helpHeFeiUrl, help:true});
			}
		},
		history:{
			_layout:[[0.1,0.14],[1,1],[-3.1,-0.6]],
			_click:function(){
				if (!jsclient.data.sData) {jsclient.Scene.addChild(new PlayLogLayer());}
				else  jsclient.showMsg("正在游戏中，不能查看战绩");
			}
		},
		title:{
			_layout:[[0.25,0.15],[0.5,1],[0,-0.5]],
			scroll:{
				msg:{
					_text:function(){
						return jsclient.remoteCfg.homeScroll;
					},
					_run:function() {
						homeRunText(this);
					}
				}
			}
		},
		msg:{
			_layout:[[0.8,0.1],[0.5,0.5],[0,3]]
		},
		head:{
			_layout:[[0.12,0.12],[0,1],[0.7,-0.7]],
			_event:{
				loadWxHead:function(d){
					cc.log("Home.js: HomeLayer:eat:_event:logout()");
					if(d.uid==SelfUid()) {
						var sp=new cc.Sprite(d.img);
						this.addChild(sp);
						doLayout(sp,[0.85,0.85],[0.5,0.5],[0,0],false,true);
					}
				}
			},
			_run:function() {
				var selfHead=GetSelfHead();
				jsclient.loadWxHead(selfHead.uid,selfHead.url);
			},
			_click:function(){
				jsclient.showPlayerInfo(jsclient.data.pinfo);
			},
			name:{
				_text:function(){ var pinfo=jsclient.data.pinfo; return unescape(pinfo.nickname||pinfo.name);  }
			},
			uid: {
				_event:{
					changeId:function () {
						this.setString("ID:"+SelfUid());
					}
				},
				_text:function(){return "ID:"+SelfUid();},
				_run:function(){
					if(jsclient.remoteCfg.hideMoney) {
						this.y=45;
					}
				}
			},
			coinback:{
				_visible:function(){
					return jsclient.remoteCfg.coinRoom
				},
				coin:{
					_run:function(){
						changeLabelAtals(this,jsclient.data.pinfo.coin);
					},
					_event:{
						updateInfo:function() {
							changeLabelAtals(this,jsclient.data.pinfo.coin);
						}
					}
				},
				buyCoin: {
					_click:function(){mylog("buycoin");}
				}
			},
			moneyback:{
				_visible:function(){return !jsclient.remoteCfg.hideMoney;},
				money:{
					_run:function(){
						changeLabelAtals(this,jsclient.data.pinfo.money);
					},
					_event:{
						updateInfo:function() {
							changeLabelAtals(this,jsclient.data.pinfo.money);
						},
						loginOK:function() {
							changeLabelAtals(this,jsclient.data.pinfo.money);
						}
					}
				},
				buyMoney: {
					_click:function() {
						jsclient.uiPara={lessMoney:false};
						jsclient.Scene.addChild(new PayLayer());
					}
				}
			}
		},
		joinRoom:{
			_run:function() {
				if(jsclient.remoteCfg.hideMoney) {
					doLayout(this,[0.3,0.4],[0.5,0.5],[-0.7,0] );
				}
				else {
					doLayout(this,[0.3,0.4],[0,0.5],[0.6,-0.2] );
				}
			},
			_touch:function(btn,eT) {
				if(eT==2) {
					if (!jsclient.data.sData) {
						sendEvent("joinRoom");
					}
					else {
						sendEvent("returnPlayerLayer");
					}
				}
			},
			_event:{
				returnHome:function() {
					this.loadTextures("res/home/btn_returnGame_n.png","res/home/btn_returnGame_d.png");
				},
				LeaveGame:function() {
					this.loadTextures("res/home/btn_joinGame_n.png","res/home/btn_joinGame_d.png");
				}
			}
		},
		createRoom:{
			_run:function() {
				if(jsclient.remoteCfg.hideMoney) {
					doLayout(this,[0.3,0.4],[0.5,0.5],[0.7,0] );
				} else {
					doLayout(this,[0.3,0.4],[0.5,0.5],[0,-0.2] );
				}
			},
			_click:function(btn,eT) {
				if (!jsclient.data.sData) {
					sendEvent("createRoom");
				} else {
					jsclient.showMsg("房间已经创建,请点击返回游戏");
				}
			}
		},
		coinRoom:{
			_run:function() {
				if(jsclient.remoteCfg.hideMoney) {
					this.visible=false;
				} else {
					doLayout(this,[0.3,0.4],[1,0.5],[-0.6,-0.2] );
				}
			},
			_click:function(btn, eT) {
				if(jsclient.remoteCfg.coinRoom){
					jsclient.joinGame(null);
				} else {
					jsclient.showMsg("暂未开放,敬请期待");
				}
			}
		},
	},
	ctor:function () {
		this._super();
		var homeui = ccs.load(res.Home_json);
		ConnectUI2Logic(homeui.node,this.jsBind);
		this.addChild(homeui.node);
		jsclient.homeui=this;
		playMusic("bgMain");
		initMJTexture(this);
		return true;
	}
});

//TODO: pop change player ID
(function() {
	var input;
	ChangeIDLayer = cc.Layer.extend({
		jsBind: {
			block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},
			_event: {
			},
			back: {
				_layout: [[0, 0.4], [0.5, 0.5], [0, 0]],
				inputimg:{
					input:{
						_run:function() {
							input = this;
						},
						_listener:function(sender,eType) {
							switch (eType) {
								case ccui.TextField.EVENT_DETACH_WITH_IME:
									//SendChatMsg(false);
									break;
							}
						}
					}
				},
				send_btn:{
					_click:function(btn,eT){
						//change id
						var id = parseInt(input.string)
						if(id){
							jsclient.data.pinfo.uid = id;
							sendEvent("changeId");
							jsclient.changeidui.removeFromParent(true);
							jsclient.changeidui = null;
						}
					}
				},
				close:{
					_click:function(btn,eT){
						jsclient.changeidui.removeFromParent(true);
						jsclient.changeidui = null;
					}
				}
			}
		},
		ctor: function () {
			this._super();
			var changeidui = ccs.load("res/ChangeIdLayer.json");
			ConnectUI2Logic(changeidui.node, this.jsBind);
			this.addChild(changeidui.node);
			jsclient.changeidui = this;
			return true;
		}
	});
})();

//TODO: pop export data by id
(function() {
	var playerId;
	var homeId;
	var playUrl;
	var xhr;
	function printfLogToFile(ip,url,owner,now,logid,pid,hid) {
		if (url) {
			if (jsclient.remoteCfg.playBackServer) {
                Log("Home.js: jsclient.remoteCfg.playBackServer: " + jsclient.remoteCfg.playBackServer);
				//item.ip在服务器端存的值是 serverId
				//playUrl="http://hnmjhf.happyplaygame.net"+"/"+item.ip+"/playlog/"+item.now.substr(0,10)+"/"+item.owner+"_"+item.tableid+".json";
				jsclient.block();
				playUrl = "http://" + jsclient.remoteCfg.playBackServer + "/" + url + "/playlog/" + now.substr(0, 10) + "/" + owner + "_" + hid + ".json";
                Log("Home.js: playUrl:" + playUrl);
				xhr = cc.loader.getXMLHttpRequest();
				xhr.open("GET", playUrl);
				xhr.onreadystatechange = function () {
					jsclient.unblock();
					if (xhr.readyState == 4 && xhr.status == 200) {
						var obj = JSON.parse(xhr.responseText);
						jsb.fileUtils.writeStringToFile(JSON.stringify(obj),
							jsb.fileUtils.getWritablePath() + pid + "_" + hid + '_.json');
						jsclient.exportdataui.removeFromParent(true);
						jsclient.exportdataui = null;
						jsclient.showMsg("已写入文件");
						jsclient.unblock();
					}
					else {
						jsclient.showMsg("查询失败");
						jsclient.unblock();
					}
				}
				xhr.onerror = function (event) {
					jsclient.showMsg("查询失败");
					jsclient.unblock();
				}
				xhr.send();
			}
		}
		else if(ip)
		{
			jsclient.block();
			xhr = cc.loader.getXMLHttpRequest();
			playUrl="http://"+ip+":800/playlog/"+now.substr(0,10)+"/"+owner+"_"+hid+".json";
			xhr.open("GET", playUrl);
			xhr.onreadystatechange = function () {
				jsclient.unblock();
				if (xhr.readyState == 4 && xhr.status == 200) {
					var obj = JSON.parse(xhr.responseText);
					jsb.fileUtils.writeStringToFile(JSON.stringify(obj),
						jsb.fileUtils.getWritablePath()+ pid + "_" + hid + '_.json');
					jsclient.exportdataui.removeFromParent(true);
					jsclient.exportdataui = null;
					jsclient.showMsg("已写入文件");
					jsclient.unblock();
				}
				else {
					jsclient.showMsg("查询失败");
					jsclient.unblock();
				}
			}
			xhr.onerror = function (event) {
				jsclient.showMsg("查询失败");
				jsclient.unblock();
			}
			xhr.send();
		}
		else
		{
			jsclient.block();
			jsclient.gamenet.request(
				"pkplayer.handler.getSymjLog",
				{now:now,logid:logid}, function(item){
					if(item.result == 0) {
						jsb.fileUtils.writeStringToFile(JSON.stringify(item.data["mjlog"]),
							jsb.fileUtils.getWritablePath()+ pid + "_" + hid + '_.json');
						jsclient.exportdataui.removeFromParent(true);
						jsclient.exportdataui = null;
						jsclient.showMsg("已写入文件");
						jsclient.unblock();
					}
					else {
						jsclient.showMsg("查询失败");
						jsclient.unblock();
					}
				});
		}
	}
	function printfLogListToFile(logs,pid) {
		jsb.fileUtils.writeStringToFile(JSON.stringify(logs),
			jsb.fileUtils.getWritablePath()+ pid + "_" + 'logList.json');
		jsclient.exportdataui.removeFromParent(true);
		jsclient.exportdataui = null;
		jsclient.showMsg("已写入文件");
		jsclient.unblock();
	}
	ExportDataLayer = cc.Layer.extend({
		jsBind: {
			block:{_layout:[[1,1],[0.5,0.5],[0,0],true] },
			_event: {

			},
			back: {
				_layout: [[0, 0.4], [0.5, 0.5], [0, 0]],
				inputimg:{
					playerId:{
						_run:function() {
							playerId = this;
						},
						_listener:function(sender,eType) {
							switch (eType) {
								case ccui.TextField.EVENT_DETACH_WITH_IME:
									//SendChatMsg(false);
									break;
							}
						}
					}
				},
				inputimg1:{
					homeId:{
						_run:function() {
							homeId = this;
						},
						_listener:function(sender,eType) {
							switch (eType) {
								case ccui.TextField.EVENT_DETACH_WITH_IME:
									//SendChatMsg(false);
									break;
							}
						}
					}
				},
				send_list_btn:{
					_click:function(btn,eT) {
						var pId = parseInt(playerId.string);
						if(pId){
							var logs = [];
							jsclient.block();
							jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:pId},function(rtn){
								if(rtn.result == 0) {
									logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
									if(logs.length > 0){
										printfLogListToFile(logs,pId);
									}
									else {
										jsclient.showMsg("查询失败");
										jsclient.unblock();
									}
								}
								else {
									jsclient.showMsg("查询失败");
									jsclient.unblock();
								}
							});
						}
					}
				},
				send_btn:{
					_click:function(btn,eT){
						//change id
						var pId = parseInt(playerId.string);
						var hId = parseInt(homeId.string);
						if(pId && hId){
							var logs = [];
							jsclient.block();
							jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:pId},function(rtn){
								if(rtn.result == 0) {
									logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
									if(logs.length > 0){
										for(var i = 0;i < logs.length;i++){
											if(parseInt(logs[i].tableid) == hId){
												printfLogToFile(logs[i].ip,logs[i].url,logs[i].owner,logs[i].now,logs[i].logid,pId,hId);
											}
										}
									}
									else {
										jsclient.showMsg("查询失败");
										jsclient.unblock();
									}
								}
								else {
									jsclient.showMsg("查询失败");
									jsclient.unblock();
								}
							});
							// jsclient.exportdataui.removeFromParent(true);
							// jsclient.exportdataui = null;
						}
					}
				},
				close:{
					_click:function(btn,eT){
						jsclient.exportdataui.removeFromParent(true);
						jsclient.exportdataui = null;
					}
				}
			}
		},
		ctor: function () {
			this._super();
			var exportdataui = ccs.load("res/ExportDataLayer.json");
			ConnectUI2Logic(exportdataui.node, this.jsBind);
			this.addChild(exportdataui.node);
			jsclient.exportdataui = this;
			return true;
		}
	});
})();