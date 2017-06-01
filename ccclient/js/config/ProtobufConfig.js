/**
 * Created by chennq on 14-3-10.
 *
 * protobuf 配置文件
 */


jsclient.PROTO_DIR_NAME = "res/proto/";
jsclient.PROTO_GAME_PACKAGE_NAME = "com." + jsclient.Config.DOMAIN_NAME + ".proto";
jsclient.PROTO_SERVER_PACKAGE_NAME = "com." + jsclient.Config.DOMAIN_NAME + ".core.server.proto";

jsclient.ProtobufConfig = {
    LoginProtocol:"LoginProtocol"
};

jsclient.PROTO_SERVER_PACKAGE_PROTOCOLS = [];




jsclient.URLConfig = {
    URL_LOGIN: "/server/player/login.do",  //  登录
}