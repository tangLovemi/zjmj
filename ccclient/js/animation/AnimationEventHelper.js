/**
 * Created by chennq on 2014/11/6.
 */


/**
 * 动画帧事件 帮助类
 */
jsclient.AnimationEventHelper = cc.Class.extend({


    _sprite: null,
    _animation: null,

    _callback: null,
    _callbackTarget: null,

    _scheduleHelper: null,
    _scheduleInterval: 0.05,

    _lastFrameIndex: -1,

    ctor: function(sprite, animation, callback, callbackTarget, scheduleInterval){
        this._sprite = sprite;
        this._animation = animation;
        this._callback = callback;
        this._callbackTarget = callbackTarget;
        this._scheduleInterval = scheduleInterval || this._scheduleInterval;

        this._scheduleHelper = new jsclient.SchedulerHelper(this.onSpriteFrameLoaded, this);
    },

    startListenAnimationFrameEvent: function(){
        Log("startListenAnimationFrameEvent-->interval:" + this._scheduleInterval);
        this._scheduleHelper.startTimer(this._scheduleInterval);
    },

    stopListenAnimationFrameEvent: function(){
        this._scheduleHelper.cancelTimer();
    },

    onSpriteFrameLoaded: function(){
        // Log("onSpriteFrameLoaded...");

        var frames = this._animation.getFrames();

        // Log("onSpriteFrameLoaded-->frames length: " + frames.length);
        for (var i=0; i<frames.length; i++){
            if (this._sprite.isFrameDisplayed(frames[i].getSpriteFrame())){
                // Log("AnimationEventHelper invoke frame event:" + (i + 1));
                var frameIndex = (i + 1);
                if (this._lastFrameIndex != frameIndex){
                    this._lastFrameIndex = frameIndex;
                    jsclient.call(this._callback, this._callbackTarget, (i + 1), this._sprite);
                }
                break;
            }else{
//                Log("onSpriteFrameLoaded.isFrameDisplayed-->sprite: "
//                    + this._sprite.getTexture().getName() + ", " + i + ": " + frames[i].getSpriteFrame().getTexture().getName());
            }
        }
    }

});