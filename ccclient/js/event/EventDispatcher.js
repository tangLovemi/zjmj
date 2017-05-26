/**
 * Created by chennq on 14-3-12.
 * 事件分发器
 */

jsclient.EventDispatcher = {

    _listeners: {},

    hasListener: function(eventType, listener, listenerTarget){
        if (jsclient.EventDispatcher._listeners[eventType]){
            var listeners = jsclient.EventDispatcher._listeners[eventType];
            for (var i=0; i<listeners.length; i++){
                var listener = listeners[i];
                if (listener.sameListener(listener, listenerTarget)){
                    return true;
                }
            }
        }
        return false;
    },

    dispatchEvent: function(event){

        if (jsclient.EventDispatcher._listeners[event.getType()]){
            var listeners = jsclient.EventDispatcher._listeners[event.getType()];
//            Log("_listeners:" + jsclient.EventDispatcher._listeners[event.getType()].length);
//            Log("_listeners:" +
//                jsclient.Log.getArrayDebugInfo(jsclient.EventDispatcher._listeners[event.getType()]));

            for (var i=0; i<listeners.length; i++){
//                Log("dispatchEvent event[" + event.toString() + "], listener:" + listeners[i]);
                listeners[i].call(event);
            }
        }
    },

    registerEventListener: function(eventType, listener, listenerTarget){
        if (!jsclient.EventDispatcher.hasListener(eventType, listener, listenerTarget)){
            var listeners = jsclient.EventDispatcher._listeners[eventType];
            if (!listeners){
                listeners = new jsclient.ArrayList();
            }
            listeners.add(new jsclient.EventListener(listener, listenerTarget));
            jsclient.EventDispatcher._listeners[eventType] = listeners;

//            Log("register event[" + eventType + "], listener:" + listener + ", listeners:"
//                + jsclient.Log.getArrayDebugInfo(listeners));
        }
    },

    unRegisterAllEventListeners: function(eventType){
        if (jsclient.EventDispatcher._listeners[eventType]){
//            Log("unRegisterAllEventListeners event[" + eventType + "]");

            delete jsclient.EventDispatcher._listeners[eventType];
        }
    },

    unRegisterEventListener: function(eventType, listener, listenerTarget){
        if (jsclient.EventDispatcher._listeners[eventType]){
            var listeners = jsclient.EventDispatcher._listeners[eventType];
            for (var i=0; i<listeners.length; i++){
                var listener = listeners[i];
                if (listener.sameListener(listener, listenerTarget)){
//                    Log("unRegisterEventListener event[" + eventType + "], listener:" + listener + ", listeners:"
//                        + jsclient.Log.getArrayDebugInfo(listeners));

                    return listeners.remove(i);
                }
            }
        }
        return null;
    }

};

jsclient.EventListener = cc.Class.extend({

    _callback: null,
    _callbackTarget: null,

    ctor: function(callback, callbackTarget){
        this._callback = callback;
        this._callbackTarget = callbackTarget;
    },

    call: function(event){
        if (this._callback) {
            if(this._callbackTarget){
                this._callback.call(this._callbackTarget, event);
            }else{
                this._callback(this, event);
            }
        }
    },

    sameListener: function(callback, callbackTarget){
        return this._callback == callback && this._callbackTarget == callbackTarget;
    }

});