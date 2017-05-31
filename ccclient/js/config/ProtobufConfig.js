/**
 * Created by chennq on 14-3-10.
 *
 * protobuf 配置文件
 */


jsclient.PROTO_DIR_NAME = "proto/";
jsclient.PROTO_GAME_PACKAGE_NAME = "com.sumi.proto";
jsclient.PROTO_SERVER_PACKAGE_NAME = "com.sumi.core.server.proto";

jsclient.ProtobufConfig = {
    CommonProtocol: "CommonProtocol",
    LoginProtocol:"LoginProtocol"
};

jsclient.PROTO_SERVER_PACKAGE_PROTOCOLS = [jsclient.ProtobufConfig.CommonProtocol];