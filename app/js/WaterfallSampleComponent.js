import '../css/index.less';
import React from "react";
import ReactDOM from 'react-dom';
import AutoResponsive from 'autoresponsive-react';
import axios from "axios"
import qs from 'qs';
import { PullToRefresh } from 'antd-mobile';
import InfiniteScroll from "react-infinite-scroll-component";
import { Router, Route, Link } from 'react-router'


const pageSize = 20;
let clientWidth ;
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
			containerWidth: Math.floor((document.documentElement.clientWidth + 30) / 180 ) * 180 -30 > 1600 ? 1600 : Math.floor((document.documentElement.clientWidth + 30) / 180 ) * 180 -30,
		};
	}
	
	getData(page,searchWord) {//获取数据的函数
		var self = this;
		var data={};
		data.page = page;
		data.perpage = pageSize;
		data.search=searchWord;
		axios.post('https://www.jinping.shop/project/xingzheng/front/getposter_grouplist.php',qs.stringify(data)).then(function(response){
			if(response.data.err == 0 ){
				response.data.list.map((v,i) => {
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
				if (page == 1) {//如果是第一页，直接覆盖之前的数据
					self.setState({
						article:[...response.data.list],
					});
				} else {
					self.setState({
						article:[...self.state.article, ...response.data.list],
					});
				}
				// if(response.data.data.total <= page * pageSize){}
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}
	onRefresh = () => {
		this.setState({page: this.state.page + 1},() => this.getData(this.state.page, this.state.hotKeyword));
  	};

  onEndReached = (event) => {
		if (!this.state.hasMore) {
			return;
		}
		let page = this.state.page + 1;
		this.setState({ isLoading: false });
		this.setState({page: this.state.page + 1}, ()=> this.getData(this.state.page, this.state.hotKeyword));
	}
  
	componentDidMount() {
		this.getData(1, this.state.hotKeyword);
		window.addEventListener('resize', () => {
			console.log("clientWidth:"+ (Math.floor((document.documentElement.clientWidth + 30) / 180 ) * 180 - 30));
			console.log("documentElement.clientWidth:"+ document.documentElement.clientWidth);
			this.setState({
				containerWidth: Math.floor((document.documentElement.clientWidth + 30) / 180 ) * 180 -30,
			});
		}, false);
	}

	getAutoResponsiveProps() {
		return {
		  itemMargin: 30,
		  containerWidth: this.state.containerWidth,
		  containerHeight : this.state.height,
		  itemClassName: 'item',
		  gridWidth: 10,
		  transitionDuration: '.8',
		  transitionTimingFunction: 'easeIn'
		};
	  }
	render() {
	  return (
		<div className="albumPanel" id="scrollableDiv" style={{width: this.state.containerWidth, height: this.state.height, overflow: "auto" }} >
			
			<AutoResponsive ref="container"  {...this.getAutoResponsiveProps()}>
			{
				this.state.article.map((v,i) => {
					return (
						<div key={i}  className={`w${i} album item`} style={this.state.styleList[i]} onClick >
						<img className="a-cover" src={v.coverimg}/>
						<p className="a-layer">
							<span className="al-title">{v.name}</span>
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