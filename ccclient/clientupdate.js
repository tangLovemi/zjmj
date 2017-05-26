var cp = require('child_process');
var fs = require('fs');

var basedir="update/";
var updateDesc=fs.readFileSync("update.manifest","utf8");
//var sampleCfg=fs.readFileSync(basedir+"sample.cfg","utf8");

var tagproc = cp.spawn('git',['tag','-l']);
var tagbuf=new Buffer(0);

tagproc.stdout.on('data',function(data){tagbuf = Buffer.concat([tagbuf,data]);});

tagproc.stdout.on('end',function()
{
   var str = tagbuf.toString(), tags = str.split('\n');
   tags.length=tags.length-1;
   var ctags=[];
   for(var i=0;i<tags.length;i++)
   {
      if(tags[i].indexOf('client_')==0)
	  {
	     ctags.push(tags[i].substr('client_'.length));
	  }
   }
   tags=ctags;
   
   var i=-1;
   function genUpdate()
   {
      i++;  if(i>=tags.length-1) return;
	  var itag=tags[i],ttag=tags[tags.length-1];
      var difbuf=new Buffer(0);
      var diffproc=cp.spawn('git',['diff','--name-only','client_'+tags[i],'client_'+tags[tags.length-1],'res','src','main.jsc','project.json']);
	  diffproc.stdout.on('data',function(data){difbuf = Buffer.concat([difbuf,data]);});
      diffproc.stdout.on('end',function(){
	    
		 console.log(itag,'==>',ttag);
		 var files=difbuf.toString().split('\n');
		 var todir=basedir+itag;
		 if(!fs.existsSync(todir))     fs.mkdirSync(todir);
		 if(files.length>1)
		 {
		    files.length=files.length-1;
			
			var zipfiles=[todir+"/"+ttag+".zip"];
			for(var f=0;f<files.length;f++)
			{
			  
			  var zpath=files[f].substr('ccclient/'.length);
			  if(zpath!="res/project.manifest") 
			  {
				 var segs=zpath.split('/');
				 var segPath="";
				 for(var sg=0;sg<segs.length;sg++)
				 {
					 if(sg>0) segPath+="/";
					 segPath+=segs[sg];
					 if(zipfiles.indexOf(segPath)<0) zipfiles.push(segPath);
				 }
                 				
			  } 
			  
			}
			
			if(fs.existsSync(zipfiles[0]))fs.unlinkSync(zipfiles[0]);
			console.log(zipfiles);
			 var tempZipfiles = [];
			 var tempAddFiles = [];
			 for (var zi = 1; zi < zipfiles.length; zi++) {
				 tempAddFiles.push(zipfiles[zi]);
				 if(zi == (zipfiles.length - 1)
					 || tempAddFiles.length == 100){
					 tempZipfiles = [];
					 tempZipfiles.push(zipfiles[0]);
					 for(var zj = 0;zj < tempAddFiles.length;zj++){
						 tempZipfiles.push(tempAddFiles[zj]);
					 }
					 var ziproc = cp.spawnSync('zip', tempZipfiles, {});
					 tempAddFiles = [];
				 }
			 }
			//  var ziproc = cp.spawn('zip',zipfiles,{},function(error, stdout, stderr)
			// {
			// 	console.log(error);
             //   console.log(stdout);
			// });
			var pm=updateDesc.replace("{version}",itag).replace(new RegExp("{version}","gm"),ttag).replace("{zip}",'"'+ttag+'.zip":'+JSON.stringify( {md5:Date.now()+'',compressed:true} ) );
            fs.writeFileSync(todir+"/project.manifest",pm);
		 }else
		 {
			 console.log(itag,'==>2121',ttag);
			var pm=updateDesc.replace("{version}",itag).replace(new RegExp("{version}","gm"),ttag).replace("{zip}",'"'+ttag+'.zip":'+JSON.stringify( {md5:Date.now()+'',compressed:true} ) );
            fs.writeFileSync(todir+"/project.manifest",pm); 
		 }
	     process.nextTick(genUpdate);
	  });
   }
   
   if(tags.length>0)
   {
      i=tags.length-1;
      var pm=updateDesc.replace(new RegExp("{version}","gm"),tags[i]).replace("{zip}",'');
	  var todir=basedir+tags[i];
	  if(!fs.existsSync(todir))fs.mkdirSync(todir);
	  fs.writeFileSync("res/project.manifest",pm);
	  fs.writeFileSync(todir+"/project.manifest",pm);
	  //fs.writeFileSync(todir+"/"+tags[i]+".cfg",sampleCfg);
   }
   i=-1;
   genUpdate();
   
});




//