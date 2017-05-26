/**
 *
 * Desc:
 *    ActionInterval 扩展
 * User: chennq
 * Date: 13-11-4
 *
 */


jsclient.ActionIntervalUtils = {

    SHAKE_DEFAULT_DURATION: 0.5,
    SHAKE_DEFAULT_X_PERCENT: 0.01,
    SHAKE_DEFAULT_Y_PERCENT: 0.01,


    runShakeAction: function(target, duration, maxOffsetX, maxOffsetY){
        var size = target.getContentSize();
        var originalPosition = target.getPosition();

        duration = (duration == undefined) ? jsclient.ActionIntervalUtils.SHAKE_DEFAULT_DURATION : duration;
        if (duration <= 0){
            return;
        }

        maxOffsetX = maxOffsetX || size.width * jsclient.ActionIntervalUtils.SHAKE_DEFAULT_X_PERCENT;
        maxOffsetY = maxOffsetY || size.height * jsclient.ActionIntervalUtils.SHAKE_DEFAULT_Y_PERCENT;

        var perAnimationInterval = jsclient.PER_ANIMATION_INTEVAL || 0.02;
        var cnt = Math.floor(duration / perAnimationInterval);

        var planManager = new jsclient.SerialPlanManager();
        for (var i=0; i<cnt; i++){
            planManager.addPlan(
                perAnimationInterval,
                jsclient.ActionIntervalUtils._runSingleShakeAction,
                null,
                target,
                originalPosition,
                maxOffsetX,
                maxOffsetY
            );
        }
        planManager.addPlan(0, target.setPosition, target, originalPosition);

        planManager.execute();
    },

    /**
     * 上下移动特效（持续性）
     * @param target
     * @param duration
     * @param upDistance
     * @param downDistance
     * @returns {cc.RepeatForever}
     */
    runUpDownForEverAction: function(target, duration, upDistance, downDistance){
        var middlePosition = target.getPosition();
        var moveTo = cc.MoveTo.create(duration, cc.p(middlePosition.x, middlePosition.y + upDistance));
        var moveTo2 = cc.MoveTo.create(duration, cc.p(middlePosition.x, middlePosition.y - downDistance));
        var repeatForever = cc.RepeatForever.create(cc.Sequence.create(moveTo, moveTo2));
        target.runAction(repeatForever);

        return repeatForever;
    },

    recursiveChildrenAction: function(parent, action){
        var selChildren = parent.getChildren();
        if(selChildren){
            for(var i = 0; i< selChildren.length;i++){
                var item = selChildren[i];
                if (item){
                    item.runAction(action.clone());
                }
            }
        }
        parent.runAction(action);
    },

    setOpacityRecursiveChildren: function(parent, opacity){
        var selChildren = parent.getChildren();
        if(selChildren){
            for(var i = 0; i< selChildren.length;i++){
                var item = selChildren[i];
            }
        }
    },

    setOpacity: function(target, opacity){
        if (target && jsclient.hasFunction(target, "setOpacity")){
            target.setOpacity(opacity);
        }
    },

    _runSingleShakeAction: function(target, originalPosition, maxOffsetX, maxOffsetY){
        var offsetX = jsclient.RandomUtils.randomInt(-maxOffsetX, maxOffsetX);
        var offsetY = jsclient.RandomUtils.randomInt(-maxOffsetY, maxOffsetY);
        target.setPosition(cc.p(originalPosition.x + offsetX, originalPosition.y + offsetY));

        // Log("_runSingleShakeAction-->offsetX:" + offsetX + ", offsetY: " + offsetY);
    }

};

/**
 *  支持递归子节点的FadeIn
 * @type {*}
 */

/*
 windows 版本不支持   cc.ActionInterval.extend
 jsclient.ExtendFadeIn = cc.ActionInterval.extend({
*/
jsclient.ExtendFadeIn = cc.Class.extend({
    // 是否递归子节点
    _recursiveChilds: true,

    _target: null,

    _times: 10,

    _currentTime: 0,

    _perDelay: 0.1,

    _callFunc: null,

    init: function(target, duration, recursiveChilds, times, callFunc){
        this._target = target;
        this._currentTime = 0;
        this._duration = duration || 1;
        this._recursiveChilds = recursiveChilds || false;
        this._times = times || 10;
        this._callFunc = callFunc;
        this._perDelay = this._duration / this._times;
    },

    getAction: function(){
        var self = this;
        var prev = cc.CallFunc.create(function () {
            self.update(0);
        });

        for (var i=1; i<=this._times; i++){
            var delayTime = cc.DelayTime.create(this._perDelay);
            prev = cc.Sequence.create(prev, delayTime);


            var next = cc.CallFunc.create(function(){
                self.step();
            });
            prev = cc.Sequence.create(prev, next);
        }

        if(this._callFunc){
            var callFunc = (cc.CallFunc.create(function () {
                self._callFunc();
            }));
            prev = cc.Sequence.create(prev, callFunc);
        }

        return prev;
    },

    step: function (){
        this._currentTime ++;
        var time = 1 / this._times * this._currentTime;

        this.update(time);
    },

    /**
     * @param {Number} time time in seconds
     */
    update:function (time) {
        var opacity = this.getCurrentOpacity(time);
        if(this._target && typeof this._target.setOpacity == "function"){
            this._target.setOpacity(opacity);
        }
        if(this._recursiveChilds){
            this._setOpacityRecursiveChilds(this._target, opacity);
        }
    },

    getCurrentOpacity: function(time){
        return 255 * time;
    },

    /**
     * @return {cc.ActionInterval}
     */
    reverse:function () {
        return jsclient.ExtendFadeOut.create(this._duration, this._recursiveChilds);
    },

    setRecursiveChilds: function(recursiveChilds){
        this._recursiveChilds = recursiveChilds;
    },

    _setOpacityRecursiveChilds: function(parent, opacity){
        var selChildren = parent.getChildren();
        if(selChildren){
            for(var i = 0; i< selChildren.length;i++){
                var item = selChildren[i];
                if(item && typeof item.setOpacity == "function"){
                    item.setOpacity(opacity);
                    this._setOpacityRecursiveChilds(item, opacity);
                }
            }
        }
    }
});

/**
 *
 * @param target
 * @param duration
 * @param recursiveChilds
 * @param times
 * @returns {jsclient.ExtendFadeIn}
 */
jsclient.ExtendFadeIn.create = function (target, duration, recursiveChilds, times, callFunc) {
    var action = new jsclient.ExtendFadeIn();
    action.init(target, duration, recursiveChilds, times, callFunc);
    return action.getAction();
};

jsclient.ExtendFadeOut = jsclient.ExtendFadeIn.extend(/** @lends cc.FadeIn# */{

    // @override
    getCurrentOpacity: function(time){
        return 255 * (1 - time);
    },

    /**
     * @return {cc.ActionInterval}
     */
    reverse:function () {
        return jsclient.ExtendFadeIn.create(this._duration, this._recursiveChilds);
    }

});

/**
 *
 * @param target
 * @param duration
 * @param recursiveChilds
 * @param times
 * @returns {jsclient.ExtendFadeOut}
 */
jsclient.ExtendFadeOut.create = function (target, duration, recursiveChilds, times, callFunc) {
    var action = new jsclient.ExtendFadeOut();
    action.init(target, duration, recursiveChilds, times, callFunc);
    return action.getAction();
};
