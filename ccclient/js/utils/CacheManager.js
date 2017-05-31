/**
 * Created by chennq on 14-3-12.
 *
 * 缓存管理（防作弊）
 */

jsclient.Cachable = cc.Class.extend({

    toCacheString: function(){
        return JSON.stringify(this);
    },

    parseFromCacheString: function(str){
        var obj = JSON.parse(str);
        jsclient.concatObjectProperties(this, obj);
    },

    toProtobufMessage: function(){
        var obj = {};
        for (var key in this){
            if( typeof this[key] != "function") {
                var messageKey = key;
                if (messageKey.indexOf("_") == 0) {
                    messageKey = messageKey.substring(1);
                }

                var value = this[key];
                if (typeof value == 'object' && jsclient.hasFunction(value, "toProtobufMessage")) {
                    value = value.toProtobufMessage();
                }else if (typeof value == 'array'){
                    var arr = [];
                    for (var i=0; i<value.length; i++){
                        if (jsclient.hasFunction(value[i], "toProtobufMessage")){
                            arr.push(value[i].toProtobufMessage());
                        }else{
                            arr.push(value[i]);
                        }
                    }
                    value = arr;
                }

                obj[messageKey] = value;
            }
        }
        // Log("jsclient.Cachable.toProtobufMessage-->message:" + jsclient.reflectionToString(obj));

        return obj;
    },

    getClass: function(){
        return null;
    }
});

jsclient.CacheManager = {
    _caches : {},
    _cacheClasses: {},

    putCache: function(key, cacheObject){
        jsclient.CacheManager._caches[key] = this._encodeCacheObject(key, cacheObject);
        // Log("putCache-->_caches:" + jsclient.reflectionToString(jsclient.CacheManager._caches));
    },

    getCache: function(key){
        var cacheObject = jsclient.CacheManager._caches[key];
        if (cacheObject){
            return this._decodeCacheObject(key, this._caches[key]);
        }
        return null;
    },

    removeCache: function(key){
        delete this._caches[key];
    },

    _encodeCacheObject: function(key, cacheObject){
        if (cacheObject instanceof jsclient.Cachable){
            var str = cacheObject.toCacheString();
            var clz = cacheObject.getClass();
            if (str && clz){
                jsclient.CacheManager._cacheClasses[key] = clz;
                return str;
            }
        }
        return cacheObject;
    },

    _decodeCacheObject: function(key, cacheObject){
        var clz = jsclient.CacheManager._cacheClasses[key];
        if (clz){
            var object = new clz();
            object.parseFromCacheString(cacheObject);
            // Log("_decodeCacheObject-->clz:" + clz + ", object:" + jsclient.reflectionToString(object));
            return object;
        }

        return cacheObject;
    }
};
