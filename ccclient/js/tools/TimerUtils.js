/**
 * Created with JetBrains WebStorm.
 * User: yinfeng
 * Date: 13-8-31
 * Time: 上午11:41
 * To change this template use File | Settings | File Templates.
 */


jsclient.TimerUtils = {
    /**
     *
     * @param target  callback 的对象
     * @param callback 定时器回调函数
     * @param intervalu 间隔
     * @param repeat 重复次数， 0： 不重复即只执行一次, 不指定该参数则永久执行
     */
    setTimer: function(target, callback, interval, repeat){
        var scheduler = cc.Director.getInstance().getScheduler();
        var paused = false;
        var times =  (null != repeat) ? repeat : cc.REPEAT_FOREVER;
        var delay = interval;

        scheduler.scheduleCallbackForTarget(target, callback, interval, times, delay, paused);
    },


    cancelTimer: function(target, callback){
        var scheduler = cc.Director.getInstance().getScheduler();
        scheduler.unscheduleCallbackForTarget(target, callback);
    },

    pauseTimer: function(target){
        var scheduler = cc.Director.getInstance().getScheduler();
        scheduler.pauseTarget(target);
    },

    resumeTimer: function(target){
        var scheduler = cc.Director.getInstance().getScheduler();
        scheduler.resumeTarget(target);
    }
};


jsclient.NodeTimerUtils = {

    cancelTimer : function(target, callback){
        jsclient.TimerUtils.cancelTimer(target, callback);
    },

    setTimer: function(node, target, callback, interval, repeat){
        if(node._nodeTimerManager == null){
            node._nodeTimerManager = new jsclient.ArrayList();
            var nodeOnExit = node.onExit;

            // 退出时清除该Node的定时器
            node.onExit = function(){
                Log("Node scene onExit");

                nodeOnExit.call(this);

                var manager = this._nodeTimerManager;
                var len = manager.length;
                for(var i = len -1; i >= 0; i--){
                    var t = manager[i]["target"];
                    var c = manager[i]["callback"];
                    jsclient.TimerUtils.cancelTimer(t, c);
                }
                this._nodeTimerManager = null;
            }
        }
        var nodeTarget = {"target": target, "callback": callback};
        node._nodeTimerManager.add(nodeTarget);

        Log("NodeTimerUtil.setTimer");
        jsclient.TimerUtils.setTimer(target, callback, interval, repeat);
    }
};

/**
 * 定时计划帮助类
 */
jsclient.SchedulerHelper = cc.Class.extend({
    _arg1: null,
    _arg2: null,
    _arg3: null,
    _arg4: null,
    _timerFunc: null,
    _timerFuncTarget: null,

    ctor: function(timerFunc, timerFuncTarget, arg1, arg2, arg3, arg4){
        this.changeTimerArgs(arg1, arg2, arg3, arg4);
        this._timerFunc = timerFunc;
        this._timerFuncTarget = timerFuncTarget;
    },

    startTimer: function(interval, repeat){
        jsclient.TimerUtils.setTimer(this, this.onUpdate, interval, repeat);
    },

    cancelTimer: function(){
        // Log("SchedulerHelper.cancelTimer...");
        jsclient.TimerUtils.cancelTimer(this, this.onUpdate);
    },

    onUpdate: function(){
        // Log("onUpdate-->this:" + jsclient.reflectionToString(this));
        jsclient.call(this._timerFunc, this._timerFuncTarget,
            this._arg1, this._arg2, this._arg3, this._arg4);
    },

    changeTimerArgs: function(arg1, arg2, arg3, arg4){
        this._arg1 = arg1;
        this._arg2 = arg2;
        this._arg3 = arg3;
        this._arg4 = arg4;
        // Log("changeTimerArgs-->this:" + jsclient.reflectionToString(this));

    }


});