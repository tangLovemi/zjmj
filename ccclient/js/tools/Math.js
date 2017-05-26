/**
 * Created by chennq on 14-3-5.
 */

jsclient.Math = {

    /**
     * PI is the ratio of a circle's circumference to its diameter.
     * @constant
     * @type Number
     */
    PI : Math.PI,

    /**
     * @constant
     * @type Number
     */
    FLT_MAX : parseFloat('3.402823466e+38F'),

    /**
     * @constant
     * @type Number
     */
    RAD : Math.PI / 180,

    /**
     * @constant
     * @type Number
     */
    DEG : 180 / Math.PI,

    /**
     * maximum unsigned int value
     * @constant
     * @type Number
     */
    UINT_MAX : 0xffffffff,

    calcDistance: function(p1, p2){
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    },

    /**
     * 计算两点的角度
     * @param p1
     * @param p2
     */
    calcAngle: function(p1, p2){
        var radians = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
        return jsclient.Math.RADIANS_TO_DEGREES(radians);
    },

    /**
     * 转成千位符
     * @param n
     * @returns {string}
     */
    thousandthFormat : function(n){
        var strN = n + "";
        var re = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
        return strN.replace(re, "$1,");
    },

    roundByDigit : function(number, fractionDigits){
        return Math.round( number * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
    },

    min : function(p1, p2){
        return (p1 < p2 ? p1 : p2);
    },

    max : function(p1, p2){
        return (p1 > p2 ? p1 : p2);
    },

    formatChip : function(chip){
        if(chip < 100000){
            return chip + "";
        }

//        var formattedChip = chip / 1000000;
//        if(formattedChip >= 1){
//            return jsclient.Math.roundByDigit(formattedChip) + "百万";
//        }

        var formattedChip = chip / 10000;

        Log("formatChip-->chip: " + chip + ", formattedChip:" + formattedChip);
        if(formattedChip >= 1){
            return Math.round(formattedChip) + "万";
        }
        return chip + "";
    },

    formatTimeMMSS: function(totalSeconds){
        if (totalSeconds > 0){
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;

            var minutesStr = minutes >= 10 ? minutes : "0" + minutes;
            var secondsStr = seconds >= 10 ? seconds : "0" + seconds;
            return minutesStr + ":" + secondsStr;
        }
        return "00:00";
    },

    formatTimeHHMMSS: function(totalSeconds){
        if (totalSeconds > 0){
            var hours = Math.floor(totalSeconds / 60 / 60);
            var minutes = Math.floor(totalSeconds / 60) % 60;
            var seconds = totalSeconds % 60;

            var hourStr = hours >= 10 ? hours : "0" + hours;
            var minutesStr = minutes >= 10 ? minutes : "0" + minutes;
            var secondsStr = seconds >= 10 ? seconds : "0" + seconds;
            return hourStr + ":" + minutesStr + ":"  + secondsStr;
        }
        return "00:00:00";
    },

    /**
     * converts degrees to radians
     * @param {Number} angle
     * @return {Number}
     * @function
     */
    DEGREES_TO_RADIANS : function (angle) {
        return angle * jsclient.Math.RAD;
    },

    /**
     * converts radians to degrees
     * @param {Number} angle
     * @return {Number}
     * @function
     */
    RADIANS_TO_DEGREES : function (angle) {
        return angle * jsclient.Math.DEG;
    },

    addLongValue: function(v1, v2){
        var longV2 = jsclient.hasFunction(v2, "toNumber") ?
                    dcodeIO.Long.fromNumber(v2.toNumber()) : dcodeIO.Long.fromNumber(parseFloat(v2));

        if (jsclient.hasFunction(v1, "add")){
            v1 = v1.add(longV2);
        }else{
            v1 += longV2.toNumber();
        }
        return v1;
    },

    toNumber: function(v){
        return jsclient.hasFunction(v, "toNumber") ?
            v.toNumber() : Number(v);
    }
};
