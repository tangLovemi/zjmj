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
    ResultCodeProtocol: "ResultCodeProtocol",
    PlayerProtocol: "PlayerProtocol",
    DemoProtocol: "DemoProtocol",
    CmdProtocol: "CmdProtocol",
    LoginProtocol: "LoginProtocol",
    MailProtocol: "MailProtocol",
    ShopProtocol: "ShopProtocol",
    FriendshipProtocol: "FriendshipProtocol",
    CheckpointProtocol: "CheckpointProtocol",
    GameProtocol: "GameProtocol",
    BagProtocol: "BagProtocol",
    PetProtocol: "PetProtocol",
    TaskProtocol:"TaskProtocol",
    LotteryProtocol:"LotteryProtocol",
    RuneProtocol:"RuneProtocol",
    TutorialProtocol:"TutorialProtocol"
};

jsclient.PROTO_SERVER_PACKAGE_PROTOCOLS = [jsclient.ProtobufConfig.CommonProtocol];