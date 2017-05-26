/* xxtea.js
 *
 * Author:      huyan
 * Copyright:    CoolCode.CN
 * Version:      1.2
 * This library is free.  You can redistribute it and/or modify it.
 */ 
var fs = require('fs');
var cp = require('child_process');
var base64 = require('./base64');

var crypto = require('crypto');
var _key = 'pipi2016';
var instancedes = {
 
  algorithm:{ ecb:'des-ecb',cbc:'des-cbc' },
  encrypt:function(plaintext,iv){
    var key = new Buffer(_key);
    var iv = new Buffer(iv ? iv : 0);
    var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
    cipher.setAutoPadding(true) //default true
    var ciph = cipher.update(plaintext, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
  },
  decrypt:function(encrypt_text,iv){
    var key = new Buffer(_key);
    var iv = new Buffer(iv ? iv : 0);
    var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
    decipher.setAutoPadding(true);
    var txt = decipher.update(encrypt_text, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt;
  }
 
};

function long2str(v, w) {
    var vl = v.length;
    var sl = v[vl - 1] & 0xffffffff;
    for (var i = 0; i < vl; i++)
    {
        v[i] = String.fromCharCode(v[i] & 0xff,
                                   v[i] >>> 8 & 0xff,
                                   v[i] >>> 16 & 0xff, 
                                   v[i] >>> 24 & 0xff);
    }
    if (w) {
        return v.join('').substring(0, sl);
    }
    else {
        return v.join('');
    }
}

function str2long(s, w) {
    var len = s.length;
    var v = [];
    for (var i = 0; i < len; i += 4)
    {
        v[i >> 2] = s.charCodeAt(i)
                  | s.charCodeAt(i + 1) << 8
                  | s.charCodeAt(i + 2) << 16
                  | s.charCodeAt(i + 3) << 24;
    }
    if (w) {
        v[v.length] = len;
    }
    return v;
}

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * utf8 = utf16to8(utf16);
 * utf16 = utf16to8(utf8);
 */

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	    out += str.charAt(i);
	} else if (c > 0x07FF) {
	    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	} else {
	    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	}
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
	c = str.charCodeAt(i++);
	switch(c >> 4)
	{ 
	  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	    // 0xxxxxxx
	    out += str.charAt(i-1);
	    break;
	  case 12: case 13:
	    // 110x xxxx   10xx xxxx
	    char2 = str.charCodeAt(i++);
	    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	    break;
	  case 14:
	    // 1110 xxxx  10xx xxxx  10xx xxxx
	    char2 = str.charCodeAt(i++);
	    char3 = str.charCodeAt(i++);
	    out += String.fromCharCode(((c & 0x0F) << 12) |
					   ((char2 & 0x3F) << 6) |
					   ((char3 & 0x3F) << 0));
	    break;
	}
    }

    return out;
}

function xxtea_encrypt(str, key) {
    if (str == "") {
        return "";
    }
    var v = str2long(str, true);
    var k = str2long(key, false);
    var n = v.length - 1;

    var z = v[n], y = v[0], delta = 0x9E3779B9;
    var mx, e, q = Math.floor(6 + 52 / (n + 1)), sum = 0;
    while (q-- > 0) {
        sum = sum + delta & 0xffffffff;
        e = sum >>> 2 & 3;
        for (var p = 0; p < n; p++) {
            y = v[p + 1];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            z = v[p] = v[p] + mx & 0xffffffff;
        }
        y = v[0];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
        z = v[n] = v[n] + mx & 0xffffffff;
    }

    return long2str(v, false);
}

function xxtea_decrypt(str, key) {
    if (str == "") {
        return "";
    }
    var v = str2long(str, false);
    var k = str2long(key, false);
    var n = v.length - 1;

    var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
    var mx, e, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff;
    while (sum != 0) {
        e = sum >>> 2 & 3;
        for (var p = n; p > 0; p--) {
            z = v[p - 1];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            y = v[p] = v[p] - mx & 0xffffffff;
        }
        z = v[n];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
        y = v[0] = v[0] - mx & 0xffffffff;
        sum = sum - delta & 0xffffffff;
    }
    return long2str(v, true);
}

process.argv.forEach(function (val, index, array) {
    //console.log(index + ': ' + val);
});

var arguments = process.argv.splice(2);


function writeEncode( filepath, buff )
{
    console.log("write file " + filepath);
    filepath = filepath.replace( ".json", ".dat" );
    fs.writeFile(filepath,buff, "utf-8",function (err) {
        if (err) 
        {
            console.log(err);
        }
        else
        {
        
        }
    });
}

function _main( _arguments  )
{
     console.log( _arguments[0] );
     if( 'undefined' == _arguments[0] )
     {
         _arguments[0] = "../../web";
     }

     cp.exec('find '+ _arguments[0] +' -type f -name \"*.json\"', function(err, stdout, stderr){
     stdout = stdout.trim();
     var filesPath=stdout.split('\n');
     console.log( filesPath );
     for( var f=0; f<filesPath.length; f++ )
     {
        var stat = fs.statSync(filesPath[f]);
        if( stat.isFile() )
        {
           var buff = fs.readFileSync(filesPath[f], "utf-8");
           buff = encodeURI( buff )
           buff = xxtea_encrypt( buff, "pipi2016" );
           var base64_1 = base64.base64encode( buff );
           writeEncode( filesPath[f], "encode" + base64_1);
        }
     }
     });
     
}

// fs.readFile(path.join(__dirname, 'account.js'), function (err,bytesRead) {
//     if (err) throw err;
//     console.log(bytesRead);
// });

// fs.writeFile(path.join(__dirname, 'account.js'), JSON.stringify(tempAccount), function (err) {
//         if (err) throw err;
//         console.log("Export Account Success!");
//     });

_main( arguments )