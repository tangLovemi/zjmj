var cp = require('child_process');
var fs = require('fs');

var webPath = '../web';
var serverKWXPath = '../server';
var zipPublishPath = '../../ahmj_publish/ahmj_zip/web';
var webPublishPath = '../../ahmj_publish/ahmj_web/web';
var serverKWXPublishPath = '../../ahmj_publish/ahmj_server';
var server_AHMJ_PublishPath = '../../ahmj_publish/ahmj_server/ahmj';
var server_GUANDAN_PublishPath = '../../ahmj_publish/ahmj_server/guandan';
var server_DDZ_PublishPath = '../../ahmj_publish/ahmj_server/ddz';
var server_JJZ_PublishPath = '../../ahmj_publish/ahmj_server/jjz';

var tagAry = [];

function deleteAllDir(){
	var arr = [
		zipPublishPath,
		webPublishPath,
		server_AHMJ_PublishPath,
		server_GUANDAN_PublishPath,
		server_DDZ_PublishPath,
		server_JJZ_PublishPath
	];
	for(var i = 0;i < arr.length;i++){
		cp.spawnSync('rm', ['-rf',arr[i]]);
	}
}

function findGitTags(){
	var tagproc = cp.spawn('git', ['tag']);
	var tagbuf = new Buffer(0);

	tagproc.stdout.on('data', function (data) {
		tagbuf = Buffer.concat([tagbuf, data]);
	});

	tagproc.stdout.on('end', function () {
		var str = tagbuf.toString();
		var tags = str.split('\n');
		tags.length = tags.length - 1;
		for (var i = 0; i < tags.length; i++) {
			if (tags[i].indexOf('client_') == 0) {
				tagAry.push(tags[i].substr('client_'.length));
			}
		}
		copyWeb();
		copyZip();
		copyServer();
	});
}

function copy(src, dst) {
	// fs.createReadStream(src).pipe(fs.createWriteStream(dst));
	cp.spawnSync('cp', ['-rf',src,dst]);
}

function copyWeb(){
	// var proc = cp.spawn('find', [webPath,'-type','d','\(','-name','\'*.*.*\'','-o','-name','\'*.*\'','\)']);
	var proc = cp.spawn('find', [webPath,'-mindepth','1','-maxdepth','1']);
	var buf = new Buffer(0);

	proc.stdout.on('data', function (data) {
		buf = Buffer.concat([buf, data]);
	});

	proc.stdout.on('end', function () {
		var str = buf.toString();
		var lists = str.split('\n');
		var tags = tagAry.slice(0);
		var isCreaterDir = {};
		//create dir web
		fs.mkdirSync(webPublishPath);
		lists.length = lists.length - 1;
		for(var i = 0;i < lists.length;i++){
			for(var j = 0;j < tags.length;j++){
				if(lists[i].indexOf(tags[j]) > -1
					&& fs.lstatSync(lists[i]).isDirectory()
					&& !isCreaterDir[tags[j]]){
					isCreaterDir[tags[j]] = true;
					isCreaterDir[lists[i]] = true;
					//创建文件夹 并拷贝project.manifest
					var dir = webPublishPath + "/" + tags[j];
					fs.mkdirSync(dir);
					var manifestSrc = lists[i] + "/project.manifest";
					var manifestDst = dir + "/project.manifest";
					copy(manifestSrc,manifestDst);
				}
			}
		}

		for(var i = 0;i < lists.length;i++) {
			if(!isCreaterDir[lists[i]]){
				isCreaterDir[lists[i]] = true;
				var arrFile = lists[i].split("/");
				var file = arrFile[arrFile.length - 1];
				var src = lists[i];
				var dst = webPublishPath + "/" + file;
				copy(src,dst);
			}
		}
	});
}

function copyZip(){
	var proc = cp.spawn('find', [webPath,'-mindepth','1','-maxdepth','1']);
	var buf = new Buffer(0);

	proc.stdout.on('data', function (data) {
		buf = Buffer.concat([buf, data]);
	});

	proc.stdout.on('end', function () {
		var str = buf.toString();
		var lists = str.split('\n');
		var tags = tagAry.slice(0);
		var isCreaterDir = {};
		//create dir web
		fs.mkdirSync(zipPublishPath);
		lists.length = lists.length - 1;
		for(var i = 0;i < lists.length;i++){
			for(var j = 0;j < tags.length;j++){
				if(lists[i].indexOf(tags[j]) > -1
					&& fs.lstatSync(lists[i]).isDirectory()
					&& !isCreaterDir[tags[j]]){
					isCreaterDir[tags[j]] = true;
					isCreaterDir[lists[i]] = true;
					//创建文件夹 并拷贝project.manifest
					var dir = zipPublishPath + "/" + tags[j];
					fs.mkdirSync(dir);
					var file = tags[tags.length - 1];
					var manifestSrc = lists[i] + "/" + file + ".zip";
					var manifestDst = dir + "/" + file + ".zip";
					console.log("manifestDst : " + manifestDst);
					copy(manifestSrc,manifestDst);
				}
			}
		}
	});
}

function copyServer(){
	var srcPathAry = [serverKWXPath];
	//var dstPathAry = [server_AHMJ_PublishPath, server_GUANDAN_PublishPath, server_DDZ_PublishPath, server_JJZ_PublishPath];
	var dstPathAry = [serverKWXPublishPath];

	//create server dir
	//for(var i = 0;i < dstPathAry.length;i++){
	//	fs.mkdirSync(dstPathAry[i]);
	//}

	//copy dst
	function copyFile(srcPath,dstPath){
		var proc = cp.spawn('find', [srcPath,'-mindepth','1','-maxdepth','1']);
		var buf = new Buffer(0);

		proc.stdout.on('data', function (data) {
			buf = Buffer.concat([buf, data]);
		});

		proc.stdout.on('end', function () {
			var str = buf.toString();
			var lists = str.split('\n');
			var isCreaterDir = {};
			//create dir web
			lists.length = lists.length - 1;
			console.log("lists : " + str);
			for(var j = 0;j < lists.length;j++){
				if (!isCreaterDir[lists[j]]) {
					isCreaterDir[lists[j]] = true;
					var arrFile = lists[j].split("/");
					var file = arrFile[arrFile.length - 1];
					var manifestSrc = lists[j];
					var manifestDst = dstPath + "/" + file;
					console.log("manifestDst : " + manifestDst);
					copy(manifestSrc, manifestDst);
				}
			}
		});
	}
	for(var i = 0;i < srcPathAry.length;i++){
		copyFile(srcPathAry[i],dstPathAry[i]);
	}
}

deleteAllDir();
findGitTags();