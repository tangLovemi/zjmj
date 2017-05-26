/**
 * Created by chennq on 14-3-10.
 *
 * sprite 工具类
 */

jsclient.SpriteConfig = jsclient.SpriteConfig || {};
jsclient.NOT_LAZY_SPRITES = jsclient.NOT_LAZY_SPRITES || [];

jsclient.SpriteUtils = {

    // 更改默认的纹理像素格式 TO RGBA4444
    changeDefaultAlphaPixelFormatToRGBA4444: function(){
        // Log("_changeDefaultAlphaPixelFormatToRGBA4444...");
        cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_PIXELFORMAT_RGBA4444);
    },

    // 更改默认的纹理像素格式 TO RGBA8888
    changeDefaultAlphaPixelFormatToRGBA8888: function(){
        // Log("_changeDefaultAlphaPixelFormatToRGBA8888...");
        cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_PIXELFORMAT_RGBA8888);
    },

    cachedCannotLazySprites: function(){
        for (var i=0; i<jsclient.NOT_LAZY_SPRITES.length; i++){
            cc.SpriteFrameCache.getInstance().addSpriteFrames(jsclient.NOT_LAZY_SPRITES[i]);
            Log("cache sprite:" + jsclient.NOT_LAZY_SPRITES[i]);
        }
    },

    /**
     * 缓存
     */
    cacheSprites: function(){
        for (var key in jsclient.SpriteConfig){
            jsclient.SpriteUtils.cacheSprite(jsclient.SpriteConfig[key]);
        }
    },

    cacheSprite: function(fileName){
        jsclient.SpriteUtils._checkAlphaPixelFormat(fileName);

        cc.SpriteFrameCache.getInstance().addSpriteFrames(fileName);
        // Log("cache sprite:" + fileName);
    },

    removeCacheSprite: function(fileName){
        cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile(fileName);

        var textureKey = fileName.replace(".plist", ".png");
        cc.TextureCache.getInstance().removeTextureForKey(textureKey);

        // Log("remove cache sprite:" + fileName);
    },

    getSpriteFrame: function(spriteFrameName){
        return cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrameName);
    },

    getTexture: function(spriteFrameName){
        return jsclient.SpriteUtils.createWithSpriteFrameName(spriteFrameName).getTexture();
    },

    createWithSpriteFrameName: function(spriteFrameName){
        return cc.Sprite.createWithSpriteFrameName(spriteFrameName);
    },

    createWithAnimation: function(animationName){
        var animation = cc.AnimationCache.getInstance().getAnimation(animationName);   //获取帧动画
        return cc.Sprite.createWithSpriteFrame(animation.getFrames()[0].getSpriteFrame());
    },

    /**
     * 替换SpriteFrame
     * @param sprite
     * @param newFrameName
     */
    replaceSpriteFrame: function(sprite, newFrameName){
        if (newFrameName){
            var spriteFrame = jsclient.SpriteUtils.getSpriteFrame(newFrameName);
            if (spriteFrame){
                try{
                    // Log("replace frame:" + spriteFrame);
                    sprite.setDisplayFrame(spriteFrame);
                }catch(e){
                    Log("replaceSpriteFrame error, newFrameName:" + newFrameName + ", error:" + e);
                }
            }else{
                Log("spriteFrame is null:" + newFrameName);
            }
        }else{
            Log("newFrameName is null:" + newFrameName);
        }
    },

    replaceMenuItemSpriteFrame: function(menuItem, newFrameFrame){
        var normalSprite = jsclient.SpriteUtils.createWithSpriteFrameName(newFrameFrame);
        menuItem.setNormalImage(normalSprite);

        var selectedSprite = jsclient.SpriteUtils.createWithSpriteFrameName(newFrameFrame);
        menuItem.setSelectedImage(selectedSprite);
    },

    _checkAlphaPixelFormat: function(fileName){
        var rgba4444Configs = jsclient.SpriteAlphaPixelFormatConfig.RGBA4444;
        if (rgba4444Configs){
            for (var i=0; i<rgba4444Configs.length; i++){
                if (rgba4444Configs[i].test(fileName)){
                    jsclient.SpriteUtils.changeDefaultAlphaPixelFormatToRGBA4444();
                    return;
                }
            }
        }

        jsclient.SpriteUtils.changeDefaultAlphaPixelFormatToRGBA8888();
    }
};