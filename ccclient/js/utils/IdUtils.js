/**
 * Created by chennq on 14-3-11.
 * ID 工具类
 */


jsclient.IdUtils = {
    DEFAULT_ID_NAME: "ID",
    TAG_ID_NAME: "TAG",
    TAG_START_VALUE: 200,

    currentIds: {},

    generateId: function(idName, startValue){
        idName = idName || jsclient.IdUtils.DEFAULT_ID_NAME;
        startValue = startValue || 1;

        var nextId = jsclient.IdUtils.currentIds[idName];
        if (!nextId){
            nextId = startValue;
        }else{
            nextId = nextId + 1;
        }

        jsclient.IdUtils.currentIds[idName] = nextId;
        return nextId;
    },

    generateUniqueTag: function(){
        return jsclient.IdUtils.generateId(jsclient.IdUtils.TAG_ID_NAME, jsclient.IdUtils.TAG_START_VALUE);
    }

};