/**
 * Created by chennq on 14-3-12.
 * 事件类
 */

jsclient.Event = cc.Class.extend({

    _type: null,
    _data: null,

    ctor: function(type, data){
        this._type = type;
        this._data = data;
    },

    getType: function(){
        return this._type;
    },

    getData: function(){
        return this._data;
    },

    toString: function(){
        return "type[" + this._type + "], data[" + this._data + "]";
    }
});
