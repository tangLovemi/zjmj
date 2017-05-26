/**
 * Created with JetBrains WebStorm.
 * User: yinfeng
 * Date: 13-11-29
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */

jsclient.Plan = function(seconds, callback, callbackObject, arg1, arg2, arg3, arg4){
    this.seconds = seconds;
    this.callback = callback;
    this.callbackObject = callbackObject;
    this.arg1 = arg1;
    this.arg2 = arg2;
    this.arg3 = arg3;
    this.arg4 = arg4;
};

jsclient.PlanManager = cc.Class.extend({
    _allPlans: null,
    _running: false,
    _executedPlans: null,

    ctor: function(){
        this._allPlans = new jsclient.ArrayList();
        this._executedPlans = new jsclient.ArrayList();
        this._running = false;
    }
});

jsclient.SerialPlanManager = jsclient.PlanManager.extend({

    ctor: function(){
        this._super();
    },

    /**
     *
     * @param seconds  执行完几秒后再执行下一项计划
     * @param callback
     * @param callbackObject
     */
    addPlan: function(seconds, callback, callbackObject, arg1, arg2, arg3, arg4){
        var plan = new jsclient.Plan(seconds, callback, callbackObject, arg1, arg2, arg3, arg4);
        this._allPlans.add(plan);
    },

    /**
     * 添加空计划
     * @param seconds
     */
    addEmptyPlan: function(seconds){
        var plan = new jsclient.Plan(seconds, null, null);
        this._allPlans.add(plan);
    },

    execute: function(){
        this._running = true;
        this._execute();
    },

    getTotalExecuteTime: function(){
        var executeTime = 0;
        for (var i=0; i<this._allPlans.length; i++){
            executeTime += this._allPlans[i].seconds;
            // Log("getTotalExecuteTime->time:" + this._allPlans[i].seconds + ", plan:" + this._allPlans[i].callback);
        }
        return executeTime;
    },

    getLeftExecuteTime: function(){
        return this.getTotalExecuteTime();
    },

    stopExecute: function(){
        this._running = false;
    },

    clearAllPlans: function(){
        this._allPlans.clear();
        this._executedPlans.clear();
    },

    _execute: function(){
        if(!this._running){
            // Log("Stop running.");
            return;
        }

        if(this._allPlans.length == 0){
            this._running = false;
            return;
        }

        var curExecutePlan = this._allPlans[0];
        var callback = curExecutePlan.callback;
        var object = curExecutePlan.callbackObject;

        // 执行本次计划项目
        try{
            this._callFunction(callback, object, curExecutePlan.arg1, curExecutePlan.arg2, curExecutePlan.arg3, curExecutePlan.arg4);
        }catch(e){
            Log("SerialPlanManager.execute-->error:" + e + ", func:" + callback);
        }

        this._allPlans.remove(0);
        this._executedPlans.add(curExecutePlan);

        if(this._allPlans.length == 0){
            // 全部执行完毕
            this._allPlans.clear();
            this._running = false;
            return;
        }

        var nextTime = curExecutePlan.seconds;
        // Log("execute next play after: " + nextTime + ", curIndex:" + this._curIndex);

        var self = this;
        if(nextTime > 0){
            jsclient.TimerUtils.setTimer(this, function(){
                self._execute();
            }, nextTime, 0);
        }else{
            // 立即执行下一个计划
            this._execute();
        }
    },

    _callFunction: function(callback, callbackObject, arg1, arg2, arg3, arg4){
        jsclient.call(callback, callbackObject, arg1, arg2, arg3, arg4);
    }

});
