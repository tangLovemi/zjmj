/**
 * Created with JetBrains WebStorm.
 * User: yinfeng
 * Date: 13-8-3
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 */


jsclient.FileUtils = (function () {

    var FileUtils = function () {
    };

    /**
     *
     * @param path
     * @param needDecrypt   是否需要解密（如果未配置或者为true，则根据StorageUtils的配置觉得是否要解密）
     * @returns {String}
     */
    FileUtils.getStringFromFile = function (path, needDecrypt) {
        var text = jsb.fileUtils.getStringFromFile(path);
        needDecrypt = (needDecrypt == undefined) ? true : needDecrypt;
        if (needDecrypt){
            text = jsclient.StorageUtils.decryptText(text);
        }
        return text;

    };

    /**
     * @return {Uint8Array}
     */
    FileUtils.getByteArrayFromFile = function (path){
        return jsb.fileUtils.getByteArrayFromFile(path);
    };

    FileUtils.fullPathForFilename =  function (name){
        return jsb.fileUtils.fullPathForFilename(name);
    };

    FileUtils.addSearchPath = function (path){
        //cc.FileUtils.getInstance().addSearchPath(path);
        jsb.fileUtils.addSearchPath(path)
    }

    return FileUtils;
})();