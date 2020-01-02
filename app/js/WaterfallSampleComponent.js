import '../css/index.less';
import React from "react";
import ReactDOM from 'react-dom';
import AutoResponsive from 'autoresponsive-react';
import axios from "axios"
import qs from 'qs';
import { PullToRefresh } from 'antd-mobile';
import InfiniteScroll from "react-infinite-scroll-component";

const pageSize = 20;
// let styleList=[];
let getItemStyle = function() {
	return {
	  width: 150,
	  height: 200,
	};
  };
class WaterfallSampleComponent extends React.Component {
	constructor(porps){
		super(porps);
		
		this.state = {
			keyword: [],
			searchkeyword:'',
			hotKeyword : "" ,
			page: 1,
			article: [],//文章列表
			styleList : [],//图片样式主要获取高度
			total:0,
			isLoading: true,
			refreshing: true,
			refreshing: false,
			down: false,
			hasMore: true,
			height: document.documentElement.clientHeight * 2 / 3,
		};
	}
	
	getData(page,searchWord) {//获取数据的函数
		var self = this;
		var data={};
		data.page = page;
		data.perpage = pageSize;
		data.search=searchWord;
		axios.post('https://sina.ieexx.com/api/public/?s=Projects.getList',qs.stringify(data)).then(function(response){
			if(response.data.ret == 200 ){
				response.data.data.items.map((v,i) => {
					let styleList = self.state.styleList;
					styleList.push(getItemStyle());
					self.setState({styleList});
					let img = new Image();
					img.src = v.imgurl;
					img.index = styleList.length - 1;
					img.onload= () => {
						let styleList = self.state.styleList;
						styleList[img.index].height = img.height / img.width * styleList[img.index].width;
						self.setState({styleList});
					}
				});
				if (response.data.data.page == 1) {//如果是第一页，直接覆盖之前的数据
					self.setState({
						article:[...response.data.data.items],
						// styleList :styleList
					});
				} else {
					self.setState({
						article:[...self.state.article, ...response.data.data.items],
						// styleList :styleList
					});
				}
				// console.log(styleList);
				// getItemStyle();
				// if(response.data.data.total <= page * pageSize){}
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}
	onRefresh = () => {
		console.log("22222222")
		this.setState({
			page: this.state.page + 1,
			// searchkeyword : "" ,
		  //   hotKeyword : "" ,
		},() => this.getData(this.state.page, this.state.hotKeyword));
  };

  onEndReached = (event) => {
	  if (!this.state.hasMore) {
		  return;
	  }
	  console.log("333333333333")
	//   if(this.scrollDom.scrollTop + this.scrollDom.clientHeight >= this.scrollDom.scrollHeight){
		let page = this.state.page + 1;
		this.setState({ isLoading: false });
		this.setState({page: this.state.page + 1},
			()=>{ console.log("page:" + this.state.page)
				this.getData(this.state.page, this.state.hotKeyword)
			});
				// console.log("page:" + this.state.page);
				// this.getData(this.state.page, this.state.hotKeyword)
	// }
}
  
	componentDidMount() {
		this.getData(1, this.state.hotKeyword);
	  }
	getAutoResponsiveProps() {
		return {
		  itemMargin: 10,
		  containerWidth: document.documentElement.clientWidth,
		  containerHeight : this.state.height,
		  itemClassName: 'item',
		  gridWidth: 10,
		  transitionDuration: '.8',
		  transitionTimingFunction: 'easeIn'
		};
	  }
	render() {
	  return (
		<div className="albumPanel" id="scrollableDiv" style={{ height: this.state.height, overflow: "auto" }} >
			
			<AutoResponsive ref="container"  {...this.getAutoResponsiveProps()}>
			{
				this.state.article.map((v,i) => {
					return (
						<div key={i}  className={`w${i} album item`} style={this.state.styleList[i]}>
						<img className="a-cover" src={v.imgurl}/>
						<p className="a-layer">
							<span className="al-title">{v.title}</span>
						</p>
						</div>
					);
				})
			}
			</AutoResponsive>
			<InfiniteScroll
				dataLength={this.state.article}
				next={this.onEndReached}
				hasMore={true}
				loader={<h4>Loading...</h4>}
				scrollableTarget="scrollableDiv"
			>
			</InfiniteScroll>
			
		</div>
	  );
	}
  }

  export  default WaterfallSampleComponent;