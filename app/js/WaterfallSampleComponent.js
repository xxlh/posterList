import '../css/index.less';
import React from "react";
import ReactDOM from 'react-dom';
import AutoResponsive from 'autoresponsive-react';
import axios from "axios"
import qs from 'qs';

const pageSize = 10;
class WaterfallSampleComponent extends React.Component {
	constructor(porps){
		super(porps);
		
		this.state = {
			keyword: [],
			searchkeyword:'',
			hotKeyword : "" ,
			page: 1,
			article: [],//文章列表
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
				if (response.data.data.page == 1) {//如果是第一页，直接覆盖之前的数据
					self.setState({
						article:[...response.data.data.items]
					});
				} else {
					self.setState({
						article:[...self.state.article, ...response.data.data.items],
					});
				}
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
		  gridWidth: 50,
		  transitionDuration: '.5'
		};
	  }
	render() {
	  return (
		<AutoResponsive ref="container" {...this.getAutoResponsiveProps()}>
		  {
			this.state.article.map(function(i,index) {
				let style = {
				  width: '3rem',
				  height:'3rem'
				};
				return (
				  <a key={index} href="#" className={`album item`} style={style}>
					<img className="a-cover" src={i.imgurl}/>
					<p className="a-layer">
					  <span className="al-title">{i.title}</span>
					</p>
					<p className="a-more j_ALMore"></p>
				  </a>
				);
			  })
		  }
		</AutoResponsive>
	  );
	}
  }

  export  default WaterfallSampleComponent;