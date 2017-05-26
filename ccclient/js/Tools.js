

function Log(lg){
    if( cc.sys.OS_WINDOWS != cc.sys.os ){
        return;
    }
    //console.log(lg);
    cc.log(lg);
}

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
            Log("-------------------1");
        }
        else
        {
            Log("-------------------2");
        }
    };
    xhr.onerror = function (event)
    {
        Log("-------------------3");
    };
    xhr.send();
}

function testConnect(){
    var host = "114.55.253.227";
    var port = 15010;
    jsclient.connect(host, port,
        function(){
            Log("connect success !!!");
        },
        function(){
            Log("connect fail !!!");
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
