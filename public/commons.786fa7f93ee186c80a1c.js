/*! @小玲欢 版权所有，二次开发请保留原作者信息！ */
(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{226:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getJSON=exports.post=exports.get=exports.ajax=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_config=__webpack_require__(487),formatParams=function(e){var t=[];for(var o in e)t.push(encodeURIComponent(o)+"="+encodeURIComponent(e[o]));return t.push(("v="+Math.random()).replace(".","")),t.join("&")},ajax=function(e){(e=e||{}).type=(e.type||"GET").toUpperCase(),e.dataType=e.dataType||"json";var t=formatParams(e.data);if(window.XMLHttpRequest)var o=new XMLHttpRequest;else o=new ActiveXObject("Microsoft.XMLHTTP");o.onreadystatechange=function(){if(4==o.readyState){var t=o.status;t>=200&&t<300?e.success&&e.success(o.responseText,o.responseXML):e.fail&&e.fail(t)}},("object"===_typeof(e.xhrFields)&&e.xhrFields.withCredentials||location.host!=_config.htmlServerHost)&&(o.withCredentials=!0),"GET"==e.type?(o.open("GET",e.url+"?"+t,!0),o.send(null)):"POST"==e.type&&(o.open("POST",e.url,!0),o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),o.send(t))};exports.ajax=ajax;var get=exports.get=function get(){for(var _len=arguments.length,o=Array(_len),_key=0;_key<_len;_key++)o[_key]=arguments[_key];"function"==typeof o[1]&&(o[3]=o[2],o[2]=o[1],o[1]={}),ajax({url:o[0],type:"GET",data:o[1],dataType:"json",success:function success(response,xml){var json=eval("("+response+")");o[2]&&o[2](json)},fail:function(e){o[3]&&o[3](json)}})},post=exports.post=function post(){for(var _len2=arguments.length,o=Array(_len2),_key2=0;_key2<_len2;_key2++)o[_key2]=arguments[_key2];"function"==typeof o[1]&&(o[3]=o[2],o[2]=o[1],o[1]={}),ajax({url:o[0],type:"post",data:o[1],dataType:"json",success:function success(response,xml){var json=eval("("+response+")");o[2]&&o[2](json)},fail:function(e){o[3]&&o[3](json)}})},getJSON=exports.getJSON=function(){var e=arguments.length<=0?void 0:arguments[0],t="function"!=typeof(arguments.length<=1?void 0:arguments[1])?arguments.length<=1?void 0:arguments[1]:{},o="function"==typeof(arguments.length<=1?void 0:arguments[1])?arguments.length<=1?void 0:arguments[1]:arguments.length<=2?void 0:arguments[2],n="AJAX"+Math.floor(1e7*Math.random()),s=document.createElement("script");e+=(-1===e.search(/\?/)?"?":"&")+Object.keys(t).map(function(e){return e+"="+t[e]}).join("&"),s.setAttribute("type","text/javascript"),s.setAttribute("language","javascript"),s.setAttribute("src",e+(-1!=e.indexOf("?")?"&":"?")+"callback="+n),document.head.appendChild(s),window[n]=function(e){o(e)}}},487:function(e,t,o){"use strict";e.exports={htmlServerHost:"it.mn.sina.com",projectDir:"/mn_2018/reactTest2",weiboCallbackURL:"http://it.mn.sina.com/public/weibo/oauth2_wlsx_index.php?redirect_url=",wechatCallbackURL:"http://it.mn.sina.com/public/weixin/oauth2_xmtch_index.php?redirect_url="}}}]);