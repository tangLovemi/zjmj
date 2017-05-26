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
    URL_GET_RANKINGLIST: "/serve/friendship/getRankingList.do",  // 获取排行榜
    URL_GET_ANNOUNCEMENTS: "/server/mail/getAnnouncements.do",  // 获取公告
    URL_GET_MAILS: "/server/mail/getMailList.do",  // 获取邮件
    URL_RECV_LOGIN_REWARD: "/server/player/recvLoginReward.do",    // 领取签到奖励

    URL_GET_PASS_CHECKPOINTS: "/server/checkpoint/getPassCheckpoints.do",  // 获取通过的关卡数据
    URL_COMPOSE_KEYS: "/server/checkpoint/composeKeys.do",  // 合成钥匙
    URL_UNLOCK_CHECKPOINT: "/server/checkpoint/unlockCheckpoint.do",  // 解锁关卡

    URL_BUY_ENERGY: "/server/shop/buyEnergy.do",  // 购买精力
    URL_BUY_PROPS: "/server/shop/buyProps.do",    // 购买道具
    URL_UPGRADE_PLAYER: "/server/player/upgrade.do",    // 术士升级
    URL_BUY_L_CURRENCY: "/server/shop/buyLCurrency.do",    // 购买水晶
    URL_BUY_MATERIAL: "/server/shop/buyMaterial.do",    // 购买材料

    URL_GET_FUBEN_INFOS: "/server/game/getFubenInfos.do",  // 获取副本信息
    URL_START_GAME: "/server/game/startGame.do",  // 启动游戏
    URL_STOP_GAME: "/server/game/stopGame.do",  // 结束游戏

    URL_PET_UPGRADE: "/server/pet/upgrade.do",  // 宠物升级
    URL_PET_EVOLVE: "/server/pet/evolve.do",    // 宠物进化
    URL_PET_ACTIVATE_CIRCLE: "/server/pet/activateCircle.do",  // 激活法阵
    URL_PET_STRENGTHEN: "/server/pet/strengthen.do",  // 灵魂强化
    URL_PET_COMPOSITE: "/server/pet/composite.do",  // 宠物合成
    URL_PET_SET_MAIN_PET: "/server/pet/setMainPet.do",  // 设置主战宠物

    URL_TASK_LIST: "/server/task/getTaskList.do",  // 获取任务列表
    URL_TASK_RECV_REWARD: "/server/task/receiveTaskReward.do",  // 领取任务奖励

    URL_LOTTERY_LIST: "/server/lottery/getLotteryList.do",  //获取抽奖列表
    URL_LOTTERY_RECV_DATA: "/server/lottery/lottery.do",         //获取抽奖结果数据

    URL_RUNES_LIST_DATA:"/server/rune/getRunes.do",         //获取符石的详细数据
    URL_RUNES_UPGRADE:"/server/rune/upgrade.do",            //符石进阶结果
    URL_RUNES_ADVRESEARCH:"/server/rune/advResearch.do",  //符石高级研究

    URL_FRIENDSHIP_BIND_ACCOUNT:"/server/friendship/bindCommAccount.do",  //绑定账号
    URL_FRIENDSHIP_INVITE_FRIEND:"/server/friendship/inviteFriend.do",  //邀请好友
    URL_FRIENDSHIP_INVITE_ONLINE:"/server/friendship/inviteOnline.do",  //邀请上线

    URL_GET_ALL_TUTORIAL_INFO:"/server/tutorial/getAllTutorialInfos.do",  //获取新教程信息
    URL_UPDATE_TUTORIAL_INFO:"/server/tutorial/updateTutorialInfo.do",  //更新新手教程

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