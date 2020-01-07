
import React from "react"
import Reactdom from "react-dom"
import AppCompent from "./AppCompent"
import wxShare from "@lib/wxShare"

//微信分享文案设置
var wx = {};
wx.shareLink ="http://n.sinaimg.cn/fj/projects/index2.html"; 
wx.sharePic = "http://n.sinaimg.cn/fj/anta/img/wxShare.jpg"; 
wx.shareTit = "新浪厦门海报案例库"; 
wx.shareDesc = "可按照人物、景色分类检索，同时支持关键字检索案例。";
wx.sharePyq = "可按照人物、景色分类检索，同时支持关键字检索案例。";
let wxshare =new wxShare();
wxshare.setInfo(wx);

Reactdom.render(
	<AppCompent />,
	document.getElementById("root")
);

