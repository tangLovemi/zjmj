/**
 * Created with JetBrains WebStorm.
 * User: yinfeng
 * Date: 13-9-10
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */

jsclient.ArrayList = function () {
};

jsclient.inherits(jsclient.ArrayList, Array);

jsclient.ArrayList.prototype.get = function (index) {
    if (this.length <= index){
        return null;
    }
    return this[index];
};

jsclient.ArrayList.prototype.size = function () {
    return this.length;
};

jsclient.ArrayList.prototype.add = function (/* *** */) {
    if (1 == arguments.length) {
        this.push(arguments[0]);
        return;
    } else if (2 == arguments.length) {
        var index = arguments[0];
        var obj = arguments[1];
        if (typeof index == "number") {
            this.splice(index, 0, obj);
            return;
        } else {
            jsclient.warn("Error: ArrayList: invalid parameters");
        }
    } else {
        jsclient.warn("Error: ArrayList: invalid parameters");
    }
};

jsclient.ArrayList.prototype.remove = function (index) {
    var removes = this.splice(index, 1);
    if (null != removes) {
        return removes[0];
    }
    return null;
};

jsclient.ArrayList.prototype.removeElement = function (element) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (element == this[i]){
            var removes = this.splice(i, 1);

            if (null != removes) {
                return removes[0];
            }
        }
    }

    return null;
};


jsclient.ArrayList.prototype.removeArrayElement = function (arr) {
    var len = this.length;

    var removeElements = new jsclient.ArrayList();
    for (var i = 0; i < len; i++) {
        for (var j=0; j<arr.length; j++) {
            if (arr[j] == this[i]) {
                var removes = this.splice(i, 1);
                if (null != removes) {
                    removeElements.add(removes[0]);
                }
            }
        }
    }

    return removeElements;
};

jsclient.ArrayList.prototype.clear = function () {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        this.pop();
    }
};

jsclient.ArrayList.prototype.contains = function(element){
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] == element){
            return true;
        }
    }
    return false;
};

jsclient.ArrayList.prototype.copy = function(){
    var copy = new jsclient.ArrayList();
    for(var i = 0; i < this.length; i++){
        copy.add(this[i]);
    }
    return copy;
};

/**
 * 把 right 数组的元素从头到尾顺序添加到自身数组中
 * @param right
 */
jsclient.ArrayList.prototype.append = function(right){
    for(var i = 0; i < right.length; i++){
        this.add(right[i]);
    }
};

/**
 * 把 right 数组的元素从头到尾顺序添加到自身数组中(已经存在的，就不添加了）
 * @param right
 */
jsclient.ArrayList.prototype.appendIfNotContains = function(right){
    for (var i=0; i<right.length; i++){
        if (!this.contains(right[i])){
            this.add(right[i]);
        }
    }
};

jsclient.ArrayList.prototype.toString = function(){
    return jsclient.Log.getArrayDebugInfo(this);
};


// 根据元素的指定属性值进行排序
jsclient.ArrayList.prototype.sortByProperty = function(propertyName, isReverse){
    return this.sort(function(o1, o2){
        if (isReverse){
            return o2[propertyName] - o1[propertyName];
        }else{
            return o1[propertyName] - o2[propertyName];
        }
    });
};

// 根据元素的指定方法进行排序
jsclient.ArrayList.prototype.sortByMethod = function(methodName, isReverse){
    return this.sort(function(o1, o2){
        if (isReverse){
            return o2[methodName]() - o1[methodName]();
        }else{
            return o1[methodName]() - o2[methodName]();
        }
    });
};

jsclient.ArrayList.copy = function(right){
    if(null == right){
        return null;
    }

    var copy = new jsclient.ArrayList();
    for(var i = 0; i < right.length; i++){
        copy.add(right[i]);
    }
    return copy;
};





