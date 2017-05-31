/**
 * Created with JetBrains WebStorm.
 * User: yinfeng
 * Date: 13-8-1
 * Time: 下午2:04
 * To change this template use File | Settings | File Templates.
 */

jsclient.PROTO_DIR_NAME = jsclient.PROTO_DIR_NAME || "res/proto/";
jsclient.PROTO_GAME_PACKAGE_NAME = jsclient.PROTO_GAME_PACKAGE_NAME || "com." + jsclient.Config.DOMAIN_NAME + ".proto";
jsclient.PROTO_SERVER_PACKAGE_NAME = jsclient.PROTO_SERVER_PACKAGE_NAME || "com." + jsclient.Config.DOMAIN_NAME + ".core.server.proto";
jsclient.PROTO_SERVER_PACKAGE_PROTOCOLS = jsclient.PROTO_SERVER_PACKAGE_PROTOCOLS || [];

jsclient.ProtoBufUtils = (function () {

    var ProtoBufUtils = function () {
    };

    jsclient.FileUtils.addSearchPath(jsclient.PROTO_DIR_NAME);

    ProtoBufUtils.protofiles = [];

    ProtoBufUtils.initAllProtocolFiles = function(){
        for (var key in jsclient.ProtobufConfig){
            this.getProtocolFromFile(key);
            Log("init protocol file :" + key);
        }
    };

    ProtoBufUtils.getProtocolFromFile = function (key) {

        if (!ProtoBufUtils.protofiles[key]) {
            var file = jsclient.PROTO_DIR_NAME + jsclient.ProtobufConfig[key] + ".proto";
            var packageName = jsclient.PROTO_GAME_PACKAGE_NAME;
            if (jsclient.PROTO_SERVER_PACKAGE_PROTOCOLS.indexOf(key) != -1){
                packageName = jsclient.PROTO_SERVER_PACKAGE_NAME;
            }
            if (packageName) {
                ProtoBufUtils.protofiles[key] = ProtoBufUtils._getProtocolFromFile(file, packageName);
            } else {
                return null;
            }
        }

        return  ProtoBufUtils.protofiles[key];
    };

    ProtoBufUtils.decodeMessage = function(protocolName, messageName, data){
        var Protocol = jsclient.ProtoBufUtils.getProtocolFromFile(protocolName);
        return Protocol[messageName].decode(data);
    };

    ProtoBufUtils.decodeMessageHex = function(protocolName, messageName, hexData){
        var Protocol = jsclient.ProtoBufUtils.getProtocolFromFile(protocolName);
        try{
            return Protocol[messageName].decodeHex(hexData);
        }catch(e){
            Log("decodeMessageHex error-->messageName:" + messageName + ", hexData:" + hexData);
            throw e;
        }
    };

    ProtoBufUtils.newProtocolMessage = function(protocolName, messageName, param){
        var Protocol = jsclient.ProtoBufUtils.getProtocolFromFile(protocolName);
        if (param){
            return new Protocol[messageName](param);
        }else{
            return new Protocol[messageName]();
        }
    };

    // 经常用到的命令消息协议
    ProtoBufUtils.getEnumMessage = function(protocolName, enumName){
        var Protocol = jsclient.ProtoBufUtils.getProtocolFromFile(protocolName);
        return Protocol[enumName];
    };

    // 经常用到的命令消息协议
    ProtoBufUtils.Cmd = function(){
        return ProtoBufUtils.getProtocolFromFile(jsclient.ProtobufConfig.CommonProtocol).Cmd;
    };

    ProtoBufUtils.ResultCodeProtocol = function(){
        return  ProtoBufUtils.getProtocolFromFile("ResultCodeProtocol").ResultCode;
    };

    ProtoBufUtils.isSuccess = function(result){
        var ResultCodeProtocol = ProtoBufUtils.getProtocolFromFile("ResultCodeProtocol");
        if(ResultCodeProtocol.ResultCode.SUCCESS == result){
            return true;
        }

        return false;
    };

    ProtoBufUtils.getSuccessResult = function(){
        var ResultCodeProtocol = ProtoBufUtils.getProtocolFromFile(jsclient.ProtobufConfig.ResultCodeProtocol);
        return ResultCodeProtocol.ResultCode.SUCCESS;
    };

    ProtoBufUtils.getResultCode = function(code){
        var ResultCodeProtocol = ProtoBufUtils.getProtocolFromFile(jsclient.ProtobufConfig.ResultCodeProtocol);
        return ResultCodeProtocol.ResultCode[code];
    };

    ProtoBufUtils.getErrorText = function(result){
        return "未知错误:" + result;
    };


    ProtoBufUtils._getProtoBufUtilsFromString = function (text, path) {
        var message =  dcodeIO.ProtoBuf.loadProto(text).build(path);
        return message;
    };

    ProtoBufUtils._getProtocolFromFile = function (fileName, path) {
        var message =  dcodeIO.ProtoBuf.loadProtoFile(fileName).build(path);
        return message;
    };

    return ProtoBufUtils;
}());