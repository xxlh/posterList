
import React from "react"
import Reactdom from "react-dom"
import AppCompent from "./AppCompent"
import PosterDetail from "./PosterDetail"
import wxShare from "@lib/wxShare"
import { Route, HashRouter as Router, Link } from 'react-router-dom'

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
	// <AppCompent />,
	<Router>
		<div>
			<Link to="/">首页</Link>
			<Link to="/one">一个页面</Link>
			<Link to="/two">另一个页面</Link>
			<Route exact path="/" component={ AppCompent } />
			<Route path="/one:id" component={ PosterDetail } />
			<Route path="/two" component={ PosterDetail } />
		</div>
	</Router>,
	document.getElementById("root")
);

