/**
 * Created by chennq on 14-3-21.
 * 粒子效果工具类
 */

jsclient.PARTICLE_OFFSET = jsclient.PARTICLE_OFFSET || cc.p(0, 0);

jsclient.ParticleUtils = {

    /**
     * 添加粒子节点
     * @param particleName
     * @param parentNode
     * @param position
     */
    createParticle: function(particleName, position){
        var piperParticle = cc.ParticleSystem.create(particleName);
        piperParticle.setAnchorPoint(cc.p(0.5, 0.5));
        piperParticle.setPosition(cc.p(position.x + jsclient.PARTICLE_OFFSET.x, position.y + jsclient.PARTICLE_OFFSET.y));
        piperParticle.setPositionType(cc.PARTICLE_TYPE_RELATIVE);
        piperParticle.setAutoRemoveOnFinish(true);
        return piperParticle;
    },

    /**
     * 创建拖尾效果
     * @param motionStreakConfig  配置
     * @param duration  总时长
     * @param followNode  跟随节点
     * @returns {cc.MotionStreak}
     */
    createMotionStreak: function(motionStreakConfig, followNode, duration, interval) {
        var texture = motionStreakConfig.texture;
        if (typeof texture === "string"){
            texture = cc.TextureCache.getInstance().addImage(texture);
        }

        var stroke = motionStreakConfig.stroke || texture.getContentSize().width;
        var color = motionStreakConfig.color || cc.c3b(255, 255, 255);
        var minSeg = motionStreakConfig.minSeg || 0.1;
        var fade = motionStreakConfig.fade || Math.min(0.5, duration / 2);

        var motionStreak = cc.MotionStreak.create(
            fade,
            minSeg,
            stroke,
            color,
            motionStreakConfig.texture
        );

        if (followNode){
            var position = jsclient.ParticleUtils._getMotionStreakFollowPosition(followNode);
            motionStreak.setPosition(position);
            var scheduler = new jsclient.SchedulerHelper(
                function(mk){
                    try{
                        mk.setPosition(jsclient.ParticleUtils._getMotionStreakFollowPosition(followNode));
                    }catch(e){
                        Log("motionStreak setPosition error :" + e);
                    }
                },
                null,
                motionStreak
            );
            motionStreak.scheduler = scheduler;

            interval = interval || 0.01;
            var times = Math.floor(duration / interval) - 1;
            scheduler.startTimer(interval, times);

            if (duration && duration > 0){
                jsclient.TimerUtils.setTimer(scheduler, scheduler.cancelTimer, duration, 0);
            }
        }

        return motionStreak;
    },

    /**
     * 创建拖尾效果配置
     * @param texture 所使用的纹理图片
     * @param [optional] fade  消隐动画时长
     * @param [optional] color 顶点颜色值，
     * @param [optional] minSeg 拖尾条带相邻顶点间的最小距离
     * @param [optional] stroke 拖尾条带的宽度
     * @returns {}
     */
    createMotionStreakConfig: function(texture, fade, color, minSeg, stroke){
        return {
            texture: texture,
            fade: fade,
            color: color,
            minSeg: minSeg,
            stroke: stroke
        };
    },


    _getMotionStreakFollowPosition: function(followNode){
        var position = followNode.convertToWorldSpace(
            cc.p(followNode.getContentSize().width / 2, followNode.getContentSize().height / 2)
        );
        return position;
    }

};
