


function escapecode(num){
    var a = new Array("日", "一", "二", "三", "四", "五", "六");
    return a[num];
}


function testXhr(){
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", "http://www.baidu.com/");
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
        }
        else
        {
        }
    };
    xhr.onerror = function (event)
    {
    };
    xhr.send();
}

function testConnect(){
    var host = "echo.websocket.org";
    //var port = 15010;
    var port = 0;
    jsclient.connect(host, port,
        function(){
            Log("connect success !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        },
        function(){
            Log("connect fail !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }
    );
}

function testSendText(){
    jsclient.gamenet.request(
        "testSendText",
        {test:1},
        function(rtn) {
            Log("TestTools.js testSendText() rtn:" + JSON.stringify(rtn));
        }
    );
}
function testSendBinary(){
    jsclient.gamenet.request(
        "testSendBinary",
        {text:"你好", age:18},
        function(rtn) {
            Log("TestTools.js testSendText() rtn:" + JSON.stringify(rtn));
        }
    );
}

function testLogin(){
    var f_login = function(mail, code, isLocalGuest){
        Log("Tools.js: f_login()");
        var loginData = code? {mail: mail, code: code}:mail;
        loginData.resVersion = jsclient.resVersion;
        loginData.app        = {appid:"com.coolgamebox.ahmj", os:cc.sys.os};
        loginData.remoteIP   = jsclient.remoteIP;
        Log("Tools.js f_login jsclient.remoteIP:" + jsclient.remoteIP);
        if(jsclient.openGaoDeMap){
            Log("Tools.js f_login() have GaoDeLocationSDK 1");
            var geogData = {};
            geogData.latitude = jsclient.native.GetLatitudePos();    //纬度
            geogData.longitude = jsclient.native.GetLongitudePos();  //经度
            loginData.geogData = geogData;
        }else{
            Log("Tools.js f_login() have GaoDeLocationSDK 0");
        }

        if(loginData.sex){
            Log("loginData.sex = " + loginData.sex);
        }else{
            Log("loginData.sex is null ");
        }

        jsclient.gamenet.request(
            "pkcon.handler.doLogin",
            loginData,
            function (rtn){
                Log("Tools.js: pkcon.handler.doLogin callback() START");
                Log("f_login result: " + rtn.result);
                Log("f_login rtn: " + JSON.stringify(rtn));
                var unblock = true;
                if (rtn.result == ZJHCode.Success) {
                    if(code){
                        sys.localStorage.setItem("loginData", JSON.stringify(loginData));

                        jsclient.data = rtn;
                        console.log(typeof jsclient.data.pinfo.uid);
                    }
                }
                else if(rtn.result == ZJHCode.playerNotFound) {
                    if(isLocalGuest) {
                        unblock = false;
                        getGuest();
                    }
                }
                else if(rtn.result == ZJHCode.serverFull) {

                }
                else if(rtn.result == ZJHCode.clientRestart) {

                }
                else if(rtn.result == ZJHCode.clientUpdate) {

                }
                //if(unblock) {
                //    Log("--------------fffffffffffffff---------------");
                //    jsclient.unblock(); // 去掉转菊花
                //}
                Log("Tools.js: pkcon.handler.doLogin callback() END");
            }
        );
    }

    var getGuest = function(){
        jsclient.gamenet.request(
            "login.handler.reqGuestID",
            { app:"zjh"},
            function(rtn){
                Log("Tool.js testLogin() rtn:" + JSON.stringify(rtn));
                if(0==rtn.result) {
                    sys.localStorage.setItem("guestData", JSON.stringify(rtn));
                    f_login(rtn.mail, rtn.code, false); // getGuest
                }
            }
        );
    }

    var guest = sys.localStorage.getItem('guestData');
    if(guest){
        guest=JSON.parse(guest);
    }
    if(!guest) {
        getGuest();
    } else if(guest.mail && guest.code) {
        f_login(guest.mail, guest.code, true);//guest login
    } else {
        getGuest();
    }

}

function testCreateRoom(){
    Log("Tools.js testCreateRoom() BEGIN");
    var param = {"round":"round80","mode":2,"chessMode":0,"gameInfoCfg":[{"cfgName":"hefei","cfgUserCntPerTbl":4,"cfgWithFeng":false,"cfgWithZhong":false,"cfgWithFaBai":false,"cfgWithYaoJiu":false,"cfgWithHui":false,"cfgHuiCard":0,"cfgWithJiaoPao":false,"cfgWithJiaoNao":false,"cfgWithJiaoPiao":false,"cfgCanHuHui":false,"cfgRemainedCardCnt":0,"cfgBanGangCardCnt":1,"cfgBanPengCardCnt":0,"cfgBanChiCardCnt":0,"cfgCanChi":false,"cfgCanPeng":false,"cfgCanMGang":false,"cfgCanAGang":true,"calcGangWithNoOneWin":false,"cfgCanEatHu":true,"cfgCalcAllGang":false,"cfgCalcDianGang":false,"cfgCanHu7":true,"cfgCanHu13Lan":false,"cfgCanHu13Yao":true,"cfgMultiplePao":true,"cfgWithGangPao":true,"cfgCanRobGang":false,"cfgNeedCheckBao":false,"cfgPerAGang":4,"cfgPerMGang":0,"cfgPerDGang":0,"cfgPerGangKaiHua":0,"cfgPerRobGang":0,"cfgBuhuaCards":[],"cfgNextZhuangOfHuangzhuangType":1,"cfgNextZhuangOfZhuangjiaWinType":1,"cfgNextZhuangOfXianjiaWinType":3,"cfgNextZhuangOfYiPaoDuoXiang":0,"cfgScoreBase":0,"cfgScoreMultiple":1,"cfgGuoPengNoPeng":false,"cfgGuoGangNoGang":true,"cfgMaiMa":0,"cfgPerMaiMaScore":0,"cfgMaiMaCards":[],"cfgIsSlidePutCard":true,"cfgNeedSortChiCard":false,"isNeedCharge":false,"cfgFanpai":false,"cfgCanFengHu":true,"cfgFanpaiTian":1,"cfgFanpaiDi":1},{"cfgName:":"laizi","cfgUserCntPerTbl":4,"cfgWithFeng":false,"cfgWithZhong":true,"cfgWithFaBai":false,"cfgWithYaoJiu":true,"cfgWithHui":true,"cfgHuiCard":71,"cfgWithJiaoPao":false,"cfgWithJiaoNao":false,"cfgWithJiaoPiao":true,"cfgCanHuHui":true,"cfgRemainedCardCnt":0,"cfgBanGangCardCnt":4,"cfgBanPengCardCnt":4,"cfgBanChiCardCnt":0,"cfgCanChi":false,"cfgCanPeng":true,"cfgCanMGang":true,"cfgCanAGang":true,"calcGangWithNoOneWin":true,"cfgCanEatHu":false,"cfgCalcAllGang":true,"cfgCalcDianGang":false,"cfgCanHu7":false,"cfgCanHu13Lan":false,"cfgCanHu13Yao":true,"cfgMultiplePao":true,"cfgWithGangPao":true,"cfgCanRobGang":true,"cfgNeedCheckBao":false,"cfgPerAGang":2,"cfgPerMGang":1,"cfgPerDGang":3,"cfgPerGangKaiHua":0,"cfgPerRobGang":0,"cfgBuhuaCards":[],"cfgNextZhuangOfHuangzhuangType":4,"cfgNextZhuangOfZhuangjiaWinType":1,"cfgNextZhuangOfXianjiaWinType":3,"cfgNextZhuangOfYiPaoDuoXiang":0,"cfgScoreBase":1,"cfgScoreMultiple":1,"cfgGuoPengNoPeng":false,"cfgGuoGangNoGang":false,"cfgMaiMa":0,"cfgPerMaiMaScore":1,"cfgMaiMaCards":[1,5,9,11,15,19,21,25,29,71],"cfgIsSlidePutCard":true,"cfgNeedSortChiCard":false,"isNeedCharge":true,"cfgFanpai":false,"cfgCanFengHu":true,"cfgFanpaiTian":1,"cfgFanpaiDi":1},{"cfgName:":"anqing","cfgUserCntPerTbl":4,"cfgWithFeng":true,"cfgWithZhong":true,"cfgWithFaBai":true,"cfgWithYaoJiu":true,"cfgWithHui":false,"cfgHuiCard":0,"cfgWithJiaoPao":false,"cfgWithJiaoNao":false,"cfgWithJiaoPiao":false,"cfgCanHuHui":false,"cfgRemainedCardCnt":0,"cfgBanGangCardCnt":1,"cfgBanPengCardCnt":0,"cfgBanChiCardCnt":0,"cfgCanChi":true,"cfgCanPeng":true,"cfgCanMGang":true,"cfgCanAGang":true,"calcGangWithNoOneWin":false,"cfgCanEatHu":true,"cfgCalcAllGang":false,"cfgCalcDianGang":false,"cfgCanHu7":true,"cfgCanHu13Lan":true,"cfgCanHu13Yao":true,"cfgMultiplePao":true,"cfgWithGangPao":true,"cfgCanRobGang":true,"cfgNeedCheckBao":true,"cfgPerAGang":2,"cfgPerMGang":1,"cfgPerDGang":1,"cfgPerGangKaiHua":0,"cfgPerRobGang":0,"cfgBuhuaCards":[61,71,81,91],"cfgNextZhuangOfHuangzhuangType":1,"cfgNextZhuangOfZhuangjiaWinType":1,"cfgNextZhuangOfXianjiaWinType":3,"cfgNextZhuangOfYiPaoDuoXiang":4,"cfgScoreBase":1,"cfgScoreMultiple":1,"cfgGuoPengNoPeng":true,"cfgGuoGangNoGang":false,"cfgMaiMa":0,"cfgPerMaiMaScore":0,"cfgMaiMaCards":[],"cfgIsSlidePutCard":true,"cfgNeedSortChiCard":false,"isNeedCharge":true,"cfgFanpai":false,"cfgCanFengHu":true,"cfgFanpaiTian":1,"cfgFanpaiDi":1,"roundName":"round80"},{"cfgName:":"huainan","cfgUserCntPerTbl":4,"cfgWithFeng":false,"cfgWithZhong":false,"cfgWithFaBai":false,"cfgWithYaoJiu":true,"cfgWithHui":false,"cfgHuiCard":0,"cfgWithJiaoPao":false,"cfgWithJiaoNao":false,"cfgWithJiaoPiao":false,"cfgCanHuHui":false,"cfgRemainedCardCnt":0,"cfgBanGangCardCnt":1,"cfgBanPengCardCnt":0,"cfgBanChiCardCnt":0,"cfgCanChi":false,"cfgCanPeng":true,"cfgCanMGang":true,"cfgCanAGang":true,"calcGangWithNoOneWin":true,"cfgCanEatHu":false,"cfgCalcAllGang":true,"cfgCalcDianGang":true,"cfgCanHu7":false,"cfgCanHu13Lan":false,"cfgCanHu13Yao":true,"cfgMultiplePao":false,"cfgWithGangPao":false,"cfgCanRobGang":true,"cfgNeedCheckBao":false,"cfgPerAGang":2,"cfgPerMGang":1,"cfgPerDGang":3,"cfgPerGangKaiHua":0,"cfgPerRobGang":6,"cfgBuhuaCards":[],"cfgNextZhuangOfHuangzhuangType":2,"cfgNextZhuangOfZhuangjiaWinType":1,"cfgNextZhuangOfXianjiaWinType":3,"cfgNextZhuangOfYiPaoDuoXiang":0,"cfgScoreBase":1,"cfgScoreMultiple":1,"cfgGuoPengNoPeng":true,"cfgGuoGangNoGang":true,"cfgMaiMa":0,"cfgPerMaiMaScore":1,"cfgMaiMaCards":[1,5,9,11,15,19,21,25,29],"cfgIsSlidePutCard":true,"cfgNeedSortChiCard":false,"isNeedCharge":false,"cfgFanpai":false,"cfgCanFengHu":true,"cfgFanpaiTian":1,"cfgFanpaiDi":1},{"cfgName:":"fuyang","cfgUserCntPerTbl":4,"cfgWithFeng":true,"cfgWithZhong":true,"cfgWithFaBai":true,"cfgWithYaoJiu":true,"cfgWithHui":false,"cfgHuiCard":0,"cfgWithJiaoPao":false,"cfgWithJiaoNao":false,"cfgWithJiaoPiao":false,"cfgCanHuHui":false,"cfgRemainedCardCnt":0,"cfgBanGangCardCnt":1,"cfgBanPengCardCnt":0,"cfgBanChiCardCnt":0,"cfgCanChi":false,"cfgCanPeng":true,"cfgCanMGang":true,"cfgCanAGang":true,"calcGangWithNoOneWin":false,"cfgCanEatHu":false,"cfgCalcAllGang":false,"cfgCalcDianGang":true,"cfgCanHu7":false,"cfgCanHu13Lan":false,"cfgCanHu13Yao":false,"cfgMultiplePao":false,"cfgWithGangPao":true,"cfgCanRobGang":true,"cfgNeedCheckBao":false,"cfgPerAGang":10,"cfgPerMGang":5,"cfgPerDGang":5,"cfgPerGangKaiHua":15,"cfgPerRobGang":10,"cfgBuhuaCards":[],"cfgNextZhuangOfHuangzhuangType":1,"cfgNextZhuangOfZhuangjiaWinType":1,"cfgNextZhuangOfXianjiaWinType":2,"cfgNextZhuangOfYiPaoDuoXiang":0,"cfgScoreBase":5,"cfgScoreMultiple":5,"cfgGuoPengNoPeng":false,"cfgGuoGangNoGang":false,"cfgMaiMa":0,"cfgPerMaiMaScore":0,"cfgMaiMaCards":[],"cfgIsSlidePutCard":true,"cfgNeedSortChiCard":false,"isNeedCharge":true,"cfgFanpai":true,"cfgCanFengHu":true,"cfgFanpaiTian":10,"cfgFanpaiDi":10}],"gameid":"ahmj"}
    jsclient.gamenet.request(
        "pkplayer.handler.CreateVipTable",
        param,
        function(rtn) {
            Log("app.js: jsclient.gamenet.request rtn: " + JSON.stringify(rtn));
            if(0==rtn.result){
            }
        }
    );
}


function testProtobuf(){
    var platform = jsclient.ProtoBufUtils.getEnumMessage(jsclient.ProtobufConfig.LoginProtocol, "GamePlatform").PLATFORM_WINDOWS;
    Log("TestTools.js loginRequest:" + (typeof platform));
    Log("TestTools.js loginRequest:" + platform);

    var loginRequest = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.LoginProtocol, "CLoginRequest");
    Log("TestTools.js loginRequest:" + (typeof loginRequest));
    Log("TestTools.js loginRequest:" + JSON.stringify(loginRequest));
    loginRequest.platform = platform;
    loginRequest.gameId = jsclient.Config.getGameId();
    loginRequest.uid = "10010";
    jsclient.Log.debug("login-->loginRequest:" + JSON.stringify(loginRequest));


    jsclient.HttpClientUtils.sendProtobufMessage(jsclient.RouteConfig.URL_LOGIN, loginRequest, function(response, responseText){
        jsclient.Log.debug("login-->responseText:" + responseText);
        var loginResponse = jsclient.ProtoBufUtils.decodeMessageHex(jsclient.ProtobufConfig.LoginProtocol, "SLoginResponse", responseText);

    });
    var loginResponse = jsclient.ProtoBufUtils.decodeMessageHex(jsclient.ProtobufConfig.LoginProtocol, "CLoginRequest", "0800100122053130303130");
    Log("typeof loginResponse:" + (typeof loginResponse));
    Log("loginResponse:" + JSON.stringify(loginResponse));
}

function testSendProtobufByWebSocket(){
    var platform = jsclient.ProtoBufUtils.getEnumMessage(jsclient.ProtobufConfig.LoginProtocol, "GamePlatform").PLATFORM_WINDOWS;
    var request = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.LoginProtocol, "CLoginRequest");
    request.platform = platform;
    request.gameId = jsclient.Config.getGameId();
    request.uid = "10010";
    Log("TestTools.js testSendProtobufByWebSocket() loginRequest:" + JSON.stringify(request));

    jsclient.gamenet.request(
        jsclient.RouteConfig.URL_LOGIN,
        jsclient.MessageIdConfig.Login_Request,
        request,
        function(rtn) {
            Log("TestTools.js testSendProtobufByWebSocket() rtn:" + JSON.stringify(rtn));
        }
    );
}

function testSendProtobufArrayTestByWebSocket(){
    var platform = jsclient.ProtoBufUtils.getEnumMessage(jsclient.ProtobufConfig.LoginProtocol, "GamePlatform").PLATFORM_WINDOWS;
    var request = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.LoginProtocol, "CArrayTestRequest");
    request.cards = [1,2,3,6,6,6,11,12,13,21,22,23,29];
    request.name = "mjhand";
    Log("TestTools.js testSendProtobufArrayTestByWebSocket() request:" + JSON.stringify(request));

    jsclient.gamenet.request(
        jsclient.RouteConfig.URL_ARRAY_TEST,
        jsclient.MessageIdConfig.ArrayTest_Request,
        request,
        function(rtn) {
            Log("TestTools.js testSendProtobufArrayTestByWebSocket() rtn:" + JSON.stringify(rtn));
            if(rtn){
                if(rtn.cards && rtn.cards.length > 0){
                    Log("TestTools.js testSendProtobufArrayTestByWebSocket rtn.cards[3]:" + rtn.cards[3]);
                }
            }
        }
    );
}


function testSendProtobufPlayerInfoByWebSocket(){
    Log("----0");
    var PlayerInfoMsg = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.PlayerProtocol, "PlayerInfo");
    Log("----1");
    var PlayerInfo_geogDataMsg = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.PlayerProtocol, "PlayerInfo_geogData");
    Log("----2");
    PlayerInfo_geogDataMsg.latitude = "65.3";
    PlayerInfo_geogDataMsg.longitude = "64.3";
    var PlayerInfo_appMsg = jsclient.ProtoBufUtils.newProtocolMessage(jsclient.ProtobufConfig.PlayerProtocol, "PlayerInfo_app");
    Log("----3");
    PlayerInfo_appMsg.appid = "com.coolgamebox.zjmj";
    PlayerInfo_appMsg.os = "Android";

    PlayerInfoMsg._id = 10001;
    PlayerInfoMsg.uid = 100001;
    PlayerInfoMsg.coin = 9;
    PlayerInfoMsg.money = 20;
    PlayerInfoMsg.appid = "com.coolgamebox.zjmj";
    PlayerInfoMsg.playNum = 3;
    PlayerInfoMsg.geogData = PlayerInfo_geogDataMsg;
    PlayerInfoMsg.app = PlayerInfo_appMsg;

    jsclient.gamenet.request(
        jsclient.RouteConfig.URL_PLAYER_IFNO,
        jsclient.MessageIdConfig.PlayerInfo_Request,
        request,
        function(rtn) {
            Log("TestTools.js testSendProtobufPlayerInfoByWebSocket() rtn:" + JSON.stringify(rtn));
        }
    );


    //optional int32 _id = 1;
    //optional int32 uid = 2;
    //optional int coin = 3;
    //optional int money = 4;
    //optional string appid = 5;
    //optional int32 playNum = 6;
    //optional string face = 7;
    //optional string members = 8;
    //optional string sendTime = 9;
    //optional string name = 10;
    //optional string appEnd = 11;
    //optional string resVersion = 12;
    //optional string remoteIP = 13;
    //optional string uKey = 14;
    //optional int32 sid = 15;
    //optional string fid = 16;
    //optional string did = 17;
    //optional PlayerInfo_geogData geogData = 18;//需要处理
    //optional string email = 19;
    //optional string openid = 20;
    //optional string nickname = 21;
    //optional int32 sex = 22;
    //optional string language = 23;
    //optional string city = 24;
    //optional string province = 25;
    //optional string country = 26;
    //optional string headimgurl = 27;
    //optional string privilege = 28;
    //optional string unionid = 29;
    //optional string lType = 30;
    //optional PlayerInfo_app app = 31;//需要处理
    //optional string os = 32;
    //optional string __route__ = 33;
}





