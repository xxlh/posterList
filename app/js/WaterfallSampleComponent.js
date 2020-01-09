import '../css/index.less';
import React from "react";
import ReactDOM from 'react-dom';
import AutoResponsive from 'autoresponsive-react';
import axios from "axios"
import qs from 'qs';
import InfiniteScroll from "react-infinite-scroll-component";
import 'react-tabs/style/react-tabs.css';
import swal from 'sweetalert';
import 'antd/dist/antd.css';
import { Select, Input, DatePicker } from 'antd';
import { CacheLink  } from "react-keeper";

const { Search } = Input;
const { RangePicker } = DatePicker;
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
			searchkeyword:{},
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
			containerWidth: Math.floor((document.documentElement.clientWidth ) / 180 ) * 180 -30 ,
			comeFrom: [],
			typelaber: [],
		};
	}
	onChange= (value) => {
		console.log(value)
		this.setState({ 
			searchkeyword: {...this.state.searchkeyword, name: value},
			page : 1
		} ,()=>{
			this.getData(this.state.page, this.state.searchkeyword);
		});
	};
	
	getData(page, searchWord) {//获取数据的函数
		var self = this;
		var data = {};
		data.page = page;
		data.perpage = pageSize;
		data = [...searchWord];
		console.log("data:" + data);
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
				// if(response.data.data.totalnum <= page * pageSize){
				// 	self.setState({
				// 		hasMore:false,
				// 	})
				// }
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}
	getLaber() {//获取数据的函数
		axios.post('https://www.jinping.shop/project/xingzheng/front/getposter_idslist.php').then((response) => {
			if(response.data.err == 0 ){
				let comeFrom = [];
				response.data.scenelist.map((v,i) => {
				    comeFrom.push(<Option key={v.sceneid}>{v.scenename}</Option>)
				});
				let typelaber = [];
				response.data.typelist.map((v,i) => {
				    typelaber.push(<Option key={v.typeid}>{v.typename}</Option>)
				});
				console.log(comeFrom)
				this.setState({
					comeFrom: [...comeFrom],
					typelaber: [...typelaber],
				})
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
		this.getLaber();
		window.addEventListener('resize', () => {
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
	  handleChange(value) {
		console.log(`selected ${value}`);
	  }
	render() {
		// let query = this.useQuery()
	  return (
		<section className="page">
			<Select
				mode="multiple"
				style={{ width: '30%', margin:'10px'}}
				placeholder="来源"
				defaultValue={[]}
				onChange={this.handleChange}
			>
				{this.state.comeFrom}
			</Select>
			<Select
				mode="multiple"
				style={{ width: '30%', margin:'10px' }}
				placeholder="类别"
				defaultValue={[]}
				onChange={this.handleChange}
			>
					{this.state.typelaber}
			</Select>
			<RangePicker
				dateRender={current => {
					const style = {};
					if (current.date() === 1) {
					style.border = '1px solid #1890ff';
					style.borderRadius = '50%';
					}
					return (
					<div className="ant-calendar-date" style={style}>
						{current.date()}
					</div>
					);
				}}
			/>
			<Search
				placeholder="input search text"
				enterButton="Search"
				size="default"
				style={{ width: '40%'}}
				onSearch={(value) => this.onChange(value)}
			/>
			
			<section className="stage" ref="stage">
				<section className="img-sec">
					<div className="albumPanel" id="scrollableDiv" style={{width: this.state.containerWidth, height: this.state.height, overflow: "auto" }} >
					<AutoResponsive ref="container"  {...this.getAutoResponsiveProps()}>
					{
						this.state.article.map((v,i) => {
							return (
								<CacheLink  to='/detial'  state ={{gid:v.gid}} key={i}  className={`w${i} album item`} style={this.state.styleList[i]}   >
								<img className="a-cover" src={v.coverimg}/>
								<p className="a-layer">
									<span className="al-title">{v.name}</span>
								</p>
								</CacheLink  >
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
				</section>
			</section>
		</section>
	  );
	}
  }

  export  default WaterfallSampleComponent;