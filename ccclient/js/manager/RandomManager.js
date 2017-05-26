/**
 * Created by chennq on 2014/7/29.
 */


jsclient.RandomStrategyType = {
    RANDOM_STRATEGY_SINGLE_PROBABILITY: 1,
    RANDOM_STRATEGY_ARRAY_PROBABILITY: 2,
    RANDOM_STRATEGY_GROUP: 3
};

/**
 * 随机策略管理 工厂
 */
jsclient.RandomManagerFactory = {

    _randomStrategies: {},

    registerRandomStrategy: function(key, randomStrategyType, arg1, arg2, arg3, arg4){
        var clz = jsclient.RandomManagerFactory.getRandomStrategyClass(randomStrategyType);
        var randomStrategy = null;
        if (clz){
            // Log("registerRandomStrategy-->key:" + key + ", clz: " + clz);
            randomStrategy = new clz(arg1, arg2, arg3, arg4);
            jsclient.RandomManagerFactory._randomStrategies[key] = randomStrategy;
        }else{
            Log("registerRandomStrategy error: found not RandomStrategyClass[" + randomStrategyType + "]");
        }
        return randomStrategy;
    },

    hasRegisterRandomStrategy: function(key){
        return !!jsclient.RandomManagerFactory._randomStrategies[key];
    },

    getRandomValue: function(key){
        var randomStrategy = jsclient.RandomManagerFactory.getRandomStrategy(key);
        if (randomStrategy){
            return randomStrategy.getRandomValue();
        }
        return null;
    },

    isHappen: function(key){
        var randomStrategy = jsclient.RandomManagerFactory.getRandomStrategy(key);
        if (randomStrategy){
            return randomStrategy.isHappen();
        }
        return false;
    },

    getRandomStrategy: function(key){
        var randomStrategy = jsclient.RandomManagerFactory._randomStrategies[key];

        if (randomStrategy){
            return randomStrategy;
        }else{
            Log("getRandomStrategy return null.");
            return null;
        }
    },

    getRandomStrategyClass: function(randomStrategyType){
        switch(parseInt(randomStrategyType)){
            case jsclient.RandomStrategyType.RANDOM_STRATEGY_SINGLE_PROBABILITY:
                return jsclient.RandomBySingleProbability;

            case jsclient.RandomStrategyType.RANDOM_STRATEGY_ARRAY_PROBABILITY:
                return jsclient.RandomByArrayProbability;

            case jsclient.RandomStrategyType.RANDOM_STRATEGY_GROUP:
                return jsclient.RandomByGroup;

        }

        return null;
    }


};

/**
 * 随机策略（基类）
 */
jsclient.BaseRandomStrategy = cc.Class.extend({

    ctor: function(){
    },

    // 获取随机值
    // subclass override it
    getRandomValue: function(){
        return null;
    },

    // 是否发生
    // subclass override it
    isHappen: function(){
        return null;
    }
});

/**
 * 根据概率（单一概率）
 * @type {*|void|Function}
 */
jsclient.RandomBySingleProbability = jsclient.BaseRandomStrategy.extend({

    _probability: 0,
    _range: 100,

    ctor: function(probability, range){
        this._probability = probability;
        this._range = range;
    },

    isHappen: function(){
        return jsclient.RandomUtils.isHappen(this._probability, this._range);
    }
});

/**
 * 根据概率（一组概率）
 * @type {*|void|Function}
 */
jsclient.RandomByArrayProbability = jsclient.BaseRandomStrategy.extend({

    _randomSources: [],
    _probabilityKey: "",
    _denominatorKey: "",

    ctor: function(randomSources, probabilityKey, denominatorKey){
        this._randomSources = randomSources;
        this._probabilityKey = probabilityKey;
        this._denominatorKey = denominatorKey;
    },

    getRandomValue: function(){
        return jsclient.RandomUtils.randomArrayByProbabilities(this._randomSources, this._probabilityKey, this._denominatorKey);
    }
});

/**
 * 伪随机， 一组一组的生成随机值
 * @type {*|void|Function}
 */
jsclient.RandomByGroup = jsclient.BaseRandomStrategy.extend({

    _groupSources: [],
    _probabilityKey: "",

    _randomValuePool: new jsclient.ArrayList(),

    ctor: function(groupSources, probabilityKey){
        this._groupSources = groupSources;
        this._probabilityKey = probabilityKey;
    },

    getRandomValue: function(){
        if (this._randomValuePool.length == 0){
            var randomValues = new jsclient.ArrayList();
            for (var i=0; i<this._groupSources.length; i++){
                var num = this._groupSources[i][this._probabilityKey];
                for (var j=0; j<num; j++){
                    randomValues.add(this._groupSources[i]);
                }
                // Log("RandomByGroup.getRandomValue-->num: " + num + ", randomValues: " + jsclient.Log.getArrayDebugInfo(randomValues));
            }

            this._randomValuePool = jsclient.RandomUtils.randomNoRepeatArrayElements(randomValues, randomValues.length);

            // Log("RandomByGroup.getRandomValue-->_randomValuePool: " + jsclient.Log.getArrayDebugInfo(this._randomValuePool));
        }
        return this._randomValuePool.pop();
    }

});