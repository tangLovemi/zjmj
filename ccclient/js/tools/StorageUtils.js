/**
 * Created by chennq on 2014/4/22.
 */

jsclient.STORAGE_KEY = "f3J4K*)s";
jsclient.STORAGE_CRYPTO = false;

jsclient.StorageUtils = {

    _db: null,

    /*
     * init user default
     * */
    init: function () {
        jsclient.StorageUtils._db = jsclient.StorageUtils._getLocalStorage();
        return true;
    },

    _getLocalStorage: function () {
        try {
            if (!!sys.localStorage) {
                return sys.localStorage;
            }
        } catch (e) {
            return undefined;
        }
    },

    /**
     * Get bool value by key, if the key doesn't exist, a default value will return. <br/>
     * You can set the default value, or it is false.
     *
     * @param {String} key
     * @param {Boolean} defaultValue
     * @return {Boolean}
     */
    getBoolForKey: function (key, defaultValue) {
        var value = jsclient.StorageUtils._getValueForKey(key);
        var ret = defaultValue || false;
        if (value == "true") {
            return true;
        }
        else if (value == "false") {
            return false;
        }
        else if (value) {
            return Boolean(value);
        }

        return ret;
    },

    /**
     * Get integer value by key, if the key doesn't exist, a default value will return.<br/>
     * You can set the default value, or it is 0.
     *
     * @param {String} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    getIntegerForKey: function (key, defaultValue) {
        var value = jsclient.StorageUtils._getValueForKey(key);
        var ret = defaultValue || 0;

        if (value) {
            return parseInt(value);
        }

        return ret;
    },

    /**
     * Get float value by key, if the key doesn't exist, a default value will return.<br/>
     * You can set the default value, or it is 0.0f.
     *
     * @param {String} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    getFloatForKey: function (key, defaultValue) {
        var value = jsclient.StorageUtils._getValueForKey(key);
        var ret = defaultValue || 0;

        if (value) {
            return parseFloat(value);
        }

        return ret;
    },

    /**
     * Get double value by key, if the key doesn't exist, a default value will return.<br/>
     * You can set the default value, or it is 0.0.
     *
     * @param {String} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    getDoubleForKey: function (key, defaultValue) {
        return jsclient.StorageUtils.getFloatForKey(key, defaultValue);
    },

    /**
     * Get string value by key, if the key doesn't exist, a default value will return.<br/>
     * You can set the default value, or it is "".
     *
     * @param {String} key
     * @param {String} defaultValue
     * @return {String}
     */
    getStringForKey: function (key, defaultValue) {
        var value = jsclient.StorageUtils._getValueForKey(key);
        var ret = defaultValue || "";

        if (value) {
            return  String(value);
        }

        return ret;
    },

    _getValueForKey: function (key) {
        var ret;
        if (jsclient.StorageUtils._db) {
            ret = jsclient.StorageUtils._db.getItem(key);
        }

        // Log("_getValueForKey-->key:" + key + ", ret:" + ret);
        ret = jsclient.StorageUtils.decryptText(ret);
        // Log("_getValueForKey-->key:" + key + ", ret:" + ret);

        return ret;
    },

    /**
     * Set bool value by key.
     *
     * @param {String} key
     * @param {Boolean} value
     */
    setBoolForKey: function (key, value) {
        jsclient.StorageUtils.setStringForKey(key, String(value));
    },

    /**
     * Set integer value by key.
     *
     * @param {String} key
     * @param {Number} value
     */
    setIntegerForKey: function (key, value) {
        if (!key) {
            return;
        }

        jsclient.StorageUtils._setValueForKey(key, parseInt(value));
    },

    /**
     * Set float value by key.
     *
     * @param {String} key
     * @param {Number} value
     */
    setFloatForKey: function (key, value) {
        // check key
        if (!key) {
            return;
        }

        jsclient.StorageUtils._setValueForKey(key, parseFloat(value));
    },

    /**
     * Set double value by key.
     *
     * @param {String} key
     * @param {Number} value
     */
    setDoubleForKey: function (key, value) {
        return jsclient.StorageUtils.setFloatForKey(key, value);
    },

    /**
     * Set string value by key.
     *
     * @param {String} key
     * @param {String} value
     */
    setStringForKey: function (key, value) {
        // check key
        if (!key) {
            return;
        }

        jsclient.StorageUtils._setValueForKey(key, String(value));
    },

    _setValueForKey: function (key, value) {
        if (jsclient.StorageUtils._db) {
            // Log("_setValueForKey-->key:" + key + ", value:" + value);
            var encryptValue = jsclient.StorageUtils.encryptText(value + "");
            jsclient.StorageUtils._db.setItem(key, encryptValue);
            // Log("_setValueForKey-->key:" + key + ", encryptValue:" + encryptValue);
        }
    },

    encryptText: function(text) {
        if (!text){
            return "";
        }

        if (jsclient.STORAGE_CRYPTO){
            return CryptoJS.AES.encrypt(text, jsclient.STORAGE_KEY);
        }
        return text;
    },

    decryptText: function(text) {
        if (!text){
            return "";
        }
        if (jsclient.STORAGE_CRYPTO) {
            return CryptoJS.AES.decrypt(text, jsclient.STORAGE_KEY).toString(CryptoJS.enc.Utf8);
        }
        return text;
    }
};

jsclient.StorageUtils.init();

