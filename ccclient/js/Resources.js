var jsclient = {};
var UpdateLayer;//热更新层

var res = {
    Update_json : "res/Update.json",
};

/* 所有资源的表 */
var g_resources = [];

for (var i in res) {
    g_resources.push(res[i]);
}

