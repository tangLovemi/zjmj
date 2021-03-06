/**
 * Created by chennq on 14-3-5.
 */


var LOG_LEVEL_DEBUG = 1;
var LOG_LEVEL_INFO = 2;
var LOG_LEVEL_WARN = 3;
var LOG_LEVEL_ERROR = 4;
var LOG_LEVEL_FATAL = 5;


jsclient.LOG_CC = true;
jsclient.LOG_LEVEL = jsclient.PRODUCT_MODE ? LOG_LEVEL_INFO : LOG_LEVEL_DEBUG;

jsclient.Log = {
    debug : function(message){
        jsclient.Log._log(LOG_LEVEL_DEBUG, message);
    },

    info : function(message){
        jsclient.Log._log(LOG_LEVEL_INFO, message);
    },

    warn : function(message){
        jsclient.Log._log(LOG_LEVEL_WARN, message);
    },

    error : function(message){
        jsclient.Log._log(LOG_LEVEL_ERROR, message);
    },

    fatal : function(message){
        jsclient.Log._log(LOG_LEVEL_FATAL, message);
    },

    getArrayDebugInfo: function(arr){
        if (arr){
            var debugInfo = "[";
            for (var i=0; i<arr.length; i++){
                var info = "";
                if(arr[i]){
                    if(jsclient.hasFunction(arr[i], "toString")){
                        info = arr[i].toString();
                    }else{
                        info = jsclient.reflectionToString(arr[i]);
                    }
                }else{
                    info = "NULL";
                }
                debugInfo += " {" + info + "}, ";
            }
            debugInfo += "]";
            return debugInfo
        }
        return "";
    },

    _log : function(level, message){
        if (level >= jsclient.LOG_LEVEL){
            var timeStr = new XDate().toString('MM-dd HH:mm:ss(.fff)');
            message = timeStr + " - " + jsclient.Log._getLogLevelName(level) + ": " + message;
            if(jsclient.LOG_CC){
                cc.log(message);
            }else{
                console.log(message);
            }
        }
    },

    _getLogLevelName: function(level){
        if (level == LOG_LEVEL_DEBUG){
            return "DEBUG";
        }else if (level == LOG_LEVEL_INFO){
            return "INFO";
        }else if (level == LOG_LEVEL_WARN){
            return "WARN";
        }else if (level == LOG_LEVEL_ERROR){
            return "ERROR";


        }else if (level == LOG_LEVEL_FATAL){
            return "FATAL";
        }
        return "";
    }
};

function Log(lg){
    if( cc.sys.OS_WINDOWS != cc.sys.os ){
        //return;
    }
    jsclient.Log.debug(lg)
}