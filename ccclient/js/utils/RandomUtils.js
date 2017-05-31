/**
 *
 * Desc:
 *
 * User: chennq
 * Date: 13-11-19
 *
 */


jsclient.RandomUtils = (function() {

    var RANDOM_RANGE = 1000000;

    var RandomUtils = {}, abs, exports, floor, pow, root,
        __hasProp = {}.hasOwnProperty;

    var floor = Math.floor, pow = Math.pow, abs = Math.abs;

    RandomUtils.random = Math.random;

    RandomUtils.randomInt = function(min, max) {
        return floor(this.random() * (max + 1 - min) + min);
    };

    RandomUtils.randomNumber = function(min, max) {
        return this.random() * (max - min) + min;
    };

    /**
     * 从数组中随机获取一个元素
     * @param arr
     * @returns {*}
     */
    RandomUtils.randomArrayElement = function(arr) {
        if (arr.length == 0){
            return null;
        }

        if (arr.length == 1){
            return arr[0];
        }

        var index = this.randomInt(0, arr.length - 1);
        return arr[index];
    };

    /**
     * 从指定数组中获取指定数量（num)的不重复的元素
     * @param arr
     * @param num
     * @returns {jsclient.ArrayList}
     */
    RandomUtils.randomNoRepeatArrayElements = function(arr, num) {
        var randomResult = new jsclient.ArrayList();
        var randomArr = new jsclient.ArrayList();
        randomArr.append(arr);

        if (randomArr.length <= num){
            return randomArr;
        }

        for (var i=0; i<num; i++){
            var index = this.randomInt(0, randomArr.length - 1);
            randomResult.add(randomArr[index]);
            randomArr.remove(index);
        }
        return randomResult;
    };
    /**
     * 从指定数组中获取指定数量（num)元素
     * @param arr
     * @param num
     * @returns {jsclient.ArrayList}
     */
    RandomUtils.randomArrayElements = function(arr, num, canRepeat) {
        var randomResult = new jsclient.ArrayList();
        var randomArr = new jsclient.ArrayList();
        randomArr.append(arr);

        if (randomArr.length <= num){
            return randomArr;
        }

        for (var i=0; i<num; i++){
            var index = this.randomInt(0, randomArr.length - 1);
            randomResult.add(randomArr[index]);

            if (!canRepeat){
                randomArr.remove(index);
            }
        }
        return randomResult;
    };

    /**
     * 根据各自概率，从数组中随机出一个值
     */
    RandomUtils.randomArrayByProbabilities = function(arr, probabilityKey, denominatorKey){
        if (!arr || arr.length == 0){
            return null;
        }

        var probabilities = new jsclient.ArrayList();
        var totalProbability = 0;
        for (var i=0; i<arr.length; i++){
            totalProbability += parseInt(arr[i][probabilityKey]);
            probabilities.add(totalProbability);
        }

        var denominator = parseInt(arr[0][denominatorKey]);
        var randomValue = RandomUtils.randomInt(0, denominator - 1);

        for (var i=0; i<probabilities.length; i++){
            if (probabilities[i] > randomValue){
                return arr[i];
            }
        }

        return null;
    };

    RandomUtils.isHappenByHalf = function(){
        return RandomUtils.isHappen(RANDOM_RANGE / 2, RANDOM_RANGE);
    };

    /**
     * 根据固定值，生成随机数
     * @param fixNum
     */
    RandomUtils.randomNumByFixNum = function(fixNum){
        var min = fixNum / 2;
        var max = fixNum;
        min = min < 0.1 ? 0.1 : min;
        max = max < 1 ? 1 : max;

        return jsclient.Math.roundByDigit(jsclient.RandomUtils.randomNumber(min, max), 2);
    };

    /**
     * 概率是否发生
     * @param numerator  分子
     * @param denominator 分母
     */
    RandomUtils.isHappenByNumber = function(number){
        var numerator = RANDOM_RANGE * number;
        return RandomUtils.isHappen(numerator, RANDOM_RANGE);
    };

    /**
     * 概率是否发生
     * @param numerator  分子
     * @param denominator 分母
     */
    RandomUtils.isHappen = function(numerator, denominator){
        var randomValue = RandomUtils.randomInt(0, denominator - 1);
        return randomValue < numerator;
    };

    RandomUtils.biased = function(bias) {
        var r;
        r = this.random();
        if (bias === 0) {
            return r;
        }
        if (bias < 0) {
            return pow(r, -bias + 1);
        }
        if (bias > 0) {
            return 1 - pow(1 - r, bias + 1);
        }
    };

    RandomUtils.biasedInt = function(min, max, bias) {
        return floor(this.biased(bias) * (max + 1 - min) + min);
    };

    RandomUtils.biasedNumber = function(min, max, bias) {
        return this.biased() * (max - min) + min;
    };

    RandomUtils.weighted = function(obj) {
        var current, i, pos, r, sum, v;
        sum = 0;
        for (i in obj) {
            if (!__hasProp.call(obj, i)) continue;
            v = obj[i];
            sum += parseFloat(v);
        }
        r = this.random();
        pos = r * sum;
        current = 0;
        for (i in obj) {
            if (!__hasProp.call(obj, i)) continue;
            v = obj[i];
            current += parseFloat(v);
            if (current > pos) {
                return i;
            }
        }
        throw new Error("This should never happen, r was " + r);
    };

    RandomUtils.integerArrayWithSum = function(n, sum) {
        var arr, i, _i, _j, _ref, _ref1;
        arr = [];
        for (i = _i = 0, _ref = n - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            arr[i] = this.randomInt(0, sum);
        }
        arr[n - 1] = sum;
        arr = arr.sort(function(a, b) {
            return a - b;
        });
        for (i = _j = _ref1 = n - 1; _ref1 <= 1 ? _j <= 1 : _j >= 1; i = _ref1 <= 1 ? ++_j : --_j) {
            arr[i] -= arr[i - 1];
        }
        return arr;
    };
    return RandomUtils;
})();
