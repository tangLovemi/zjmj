/**
 * Created by chennq on 14-3-10.
 *
 * 动画工具类
 */

jsclient.AnimationFileConfig = jsclient.AnimationFileConfig || {};
jsclient.TAG_ANIMATION = jsclient.IdUtils.generateUniqueTag();

jsclient.AnimationUtils = {

    /**
     * 缓存动画资源
     */
    cacheAnimations: function(){
        for (var key in jsclient.AnimationFileConfig){
            var animationFile = jsclient.AnimationFileConfig[key];
            jsclient.AnimationUtils.cacheAnimation(animationFile);
        }
    },

    cacheAnimation: function(animationFile){
        cc.AnimationCache.getInstance().addAnimations(animationFile); //添加帧动画文件
        // Log("add Animation File to cache: " + animationFile);
    },

    removeAnimation: function(animationName){
        cc.AnimationCache.getInstance().removeAnimation(animationName);
        // Log("remove cache animation: " + animationName);
    },

    hasAnimation: function(animationName){
        return !!cc.AnimationCache.getInstance().getAnimation(animationName);
    },

    runAnimationForever: function(animationName, target){
        var animation = jsclient.AnimationUtils.createAnimation(animationName);   //获取帧动画
        var action = cc.RepeatForever.create(animation);
        target.runAction(action);

        return action;
    },

    runAnimation: function(animationName, target){
        var animation = jsclient.AnimationUtils.createAnimation(animationName);   //获取帧动画
        target.runAction(animation);

        return animation;
    },

    /**
     * 运行animation, 根据
     * @param animationName
     * @param parentNode
     * @param position
     * @param isCenterPosition 是否为居中坐标
     */
    runAnimationWithPositionAndEffectScale: function(animationName, parentNode, position, isCenterPosition, callback, callbackTarget){
        var animationTarget = jsclient.AnimationUtils.runAnimationWithPosition(animationName, parentNode, position, isCenterPosition, callback, callbackTarget);
        animationTarget.setScale(jsclient.AnimationScaleConfig.EFFECT_SCALE);
        return animationTarget;
    },

    /**
     * 运行animation,
     * @param animationName
     * @param parentNode
     * @param position
     * @param isCenterPosition 是否为居中坐标
     */
    runAnimationWithPosition: function(animationName, parentNode, position, isCenterPosition, callback, callbackTarget){
        var animation = cc.AnimationCache.getInstance().getAnimation(animationName);   //获取帧动画
        var target = cc.Sprite.createWithSpriteFrame(animation.getFrames()[0].getSpriteFrame());
        var size = target.getContentSize();

        if (isCenterPosition){
            target.setPosition(position);
        }else {
            target.setPosition(cc.p(position.x + size.width / 2, position.y + size.height / 2));
        }
        // Log("runAnimationWithPosition-->animationName:" + animationName + ", position:" + jsclient.reflectionToString(target.getPosition()));
        target.setAnchorPoint(cc.p(0.5, 0.5));
        parentNode.addChild(target, 999, jsclient.TAG_ANIMATION);

        var animate = cc.Animate.create(animation);
        var callFunc = cc.CallFunc.create(function(){
            target.removeFromParent();
            jsclient.call(callback, callbackTarget);
        });
        var sequence = cc.Sequence.create(animate, callFunc);
        target.runAction(sequence);

        return target;
    },

    stopAnimation: function(target){
        var animationTarget = target.getChildByTag(jsclient.TAG_ANIMATION);
        if (animationTarget){
            animationTarget.removeFromParent();
        }
    },

    createAnimation : function (animationName) {
        try {
            return cc.Animate.create(cc.AnimationCache.getInstance().getAnimation(animationName));
        }catch(e){
            Log("createAnimation error: animationName:" + animationName);
        }
    }

};