import '../css/index.less';
import React from "react";
import ReactDOM from 'react-dom';
import AutoResponsive from 'autoresponsive-react';
import axios from "axios"
import qs from 'qs';
import { PullToRefresh } from 'antd-mobile';

const pageSize = 10;
let styleList=[];
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
				 response.data.data.items.map((i,index) => {
					styleList[index] = getItemStyle();
					let img = new Image();
					img.src = i.imgurl;
					img.onload= () => {
						styleList[index].height = img.height / img.width * styleList[index].width;
						self.setState({
							styleList: styleList
						  });
					}
				});
				if (response.data.data.page == 1) {//如果是第一页，直接覆盖之前的数据
					self.setState({
						article:[...response.data.data.items],
						styleList :styleList
					});
				} else {
					self.setState({
						article:[...self.state.article, ...response.data.data.items],
						styleList :styleList
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
	
	componentDidMount() {
		this.getData(1, this.state.hotKeyword);
	  }
	getAutoResponsiveProps() {
		return {
		  itemMargin: 10,
		  containerWidth: document.documentElement.clientWidth,
		  containerHeight : this.state.height,
		  itemClassName: 'item',
		  gridWidth: 100,
		  transitionDuration: '.8',
		  transitionTimingFunction: 'easeIn'
		};
	  }
	render() {
	  return (
		<div className="albumPanel">
			<AutoResponsive ref="container" {...this.getAutoResponsiveProps()}>
			{
				this.state.article.map((i,index) => {
					console.log(this.state.styleList[index])
					return (
						<div key={index}  className={`w1 album item`} style={this.state.styleList[index]}>
						<img className="a-cover" src={i.imgurl}/>
						<p className="a-layer">
							<span className="al-title">{i.title}</span>
						</p>
						</div>
					);
					})
			}
			
			</AutoResponsive>
		</div>
	  );
	}
  }

  export  default WaterfallSampleComponent;