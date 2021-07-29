
import React from "react"
import Reactdom from "react-dom"
import WaterfallSampleComponent from "./WaterfallSampleComponent"
import PosterDetail from "./PosterDetail"
// import wxShare from "@lib/wxShare"
import { Route,  HashRouter as Router } from 'react-keeper'
// BrowserRouter
//微信分享文案设置
// var wx = {};
// wx.shareLink ="http://n.sinaimg.cn/fj/poster/index32.html"; 
// wx.sharePic = "http://n.sinaimg.cn/fj/poster/wxShare.jpg"; 
// wx.shareTit = "新浪厦门海报案例库"; 
// wx.shareDesc = "可按照人物、景色分类检索，同时支持关键字检索案例。";
// wx.sharePyq = "可按照人物、景色分类检索，同时支持关键字检索案例。";
// let wxshare =new wxShare();
// wxshare.setInfo(wx);

Reactdom.render(
	// <AppCompent />,
	<Router>
		<div>
			<Route exact path="/>" component={ WaterfallSampleComponent } />
			<Route path="/detial" component={ PosterDetail } />
		</div>
	</Router>,
	document.getElementById("root")
);

