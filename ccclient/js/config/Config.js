/**
 *  通用配置
 */

var jsclient = jsclient || {};

jsclient.Config = {

    /**
     * 服务器IP
	*/
    SERVER_IP : "192.168.0.128",

    VERSION_NUMBER : "V0.1.0",
    /**
     * 服务器端口
     */
    //SERVER_PORT : 9000,
    SERVER_PORT : 9976,

    /**
     *   服务器HTTP端口
     */
    WEB_PORT : 8080,

    /**
     * 上下文路径
     */
    WEB_CONTEXT_PATH : "/homeDefenseStats",

    URL_LOGIN: "/server/player/login.do",  //  登录

    getGameId: function(){
        var GameId = jsclient.ProtoBufUtils.getEnumMessage(jsclient.ProtobufConfig.LoginProtocol, "GameId");
        return GameId.GAME_HOME_DEFENSE;
    },

    getWsUrl : function(){
        return "ws://" + jsclient.Config.SERVER_IP + ":" + jsclient.Config.SERVER_PORT;
    },

    getServerWebUrl: function(){
        return "http://" + jsclient.Config.SERVER_IP + ":" + jsclient.Config.WEB_PORT + jsclient.Config.WEB_CONTEXT_PATH;
    },

    getServerMessageUrl: function(){
        return jsclient.Config.getServerWebUrl() + "/homeDefenseStats/serverMessage";
    }


};