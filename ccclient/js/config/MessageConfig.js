
jsclient.MessageIdConfig = {
    Login_Request:1001,
    Login_Response:1002,
};

jsclient.MessageConfig = [
    {messageId:jsclient.MessageIdConfig.Login_Request, routeName:jsclient.RouteConfig.URL_LOGIN, protoName:jsclient.ProtobufConfig.LoginProtocol, messageName:"CLoginRequest"},
    {messageId:jsclient.MessageIdConfig.Login_Response, routeName:jsclient.RouteConfig.URL_LOGIN, protoName:jsclient.ProtobufConfig.LoginProtocol, messageName:"SLoginResponse"},
]

jsclient.getMessageInfoByMessageId = function (messageId) {
    if(!messageId){
        return null;
    }
    for(var info in jsclient.MessageConfig){
        if(messageId == info.messageId){
            return info;
        }
    }
}


jsclient.getRouteNameByMessageId = function (messageId) {
    var info = jsclient.getMessageInfoByMessageId(messageId);
    if(!info){
        return null;
    }
    return info.routeName;
}
jsclient.getProtoNameByMessageId = function (messageId) {
    var info = jsclient.getMessageInfoByMessageId(messageId);
    if(!info){
        return null;
    }
    return info.protoName;
}
jsclient.getMessageNameByMessageId = function (messageId) {
    var info = jsclient.getMessageInfoByMessageId(messageId);
    if(!info){
        return null;
    }
    return info.messageName;
}