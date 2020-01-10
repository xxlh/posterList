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
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Select, Input, DatePicker } from 'antd';
import { CacheLink  } from "react-keeper";

moment.locale('zh-cn');
const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'||undefined;
const { Option } = Select;
const pageSize = 20;

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
			searchkeyword:{},
			page: 1,
			article: [],//文章列表
			styleList : [],//图片样式主要获取高度
			isLoading: true,
			hasMore: true,
			height: document.documentElement.clientHeight * 4 / 5,
			containerWidth: Math.floor((document.documentElement.clientWidth +10) / 180 ) * 180 -10 ,
			comeFrom: [],
			typelaber: [],
			startTime:undefined,//开始时间
			endTime:undefined,  //结束时间
			timeRang:[]
		};
	}

	// search 
	onChange= (value) => {
		this.setState({ 
			searchkeyword: {...this.state.searchkeyword, name: value},
			page : 1
		} ,()=>{
			this.getData(this.state.page, this.state.searchkeyword);
		});
	};
	
	// 分类搜索
	getLaber() {//获取laber
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
				this.setState({
					comeFrom: [...comeFrom],
					typelaber: [...typelaber],
				})
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}

	handleChange(type, value) {
		if(type==1){
			this.setState({ 
				searchkeyword: {...this.state.searchkeyword, sceneids: value.join(",")},
				page : 1
			} ,()=>{
				this.getData(this.state.page, this.state.searchkeyword);
			});
		}else{
			this.setState({ 
				searchkeyword: {...this.state.searchkeyword, typeids: value.join(",")},
				page : 1
			} ,()=>{
				this.getData(this.state.page, this.state.searchkeyword);
			});
		}
	  }

	  handleTimeChange = (date, dateString) => {
		console.log(dateString);
		if(dateString!= undefined )
		this.setState({
			searchkeyword: {...this.state.searchkeyword, startdate: dateString[0] ,enddate:  dateString[1]},
			page : 1
		} ,()=>{
			this.getData(this.state.page, this.state.searchkeyword);
		});
		
	  }

	// 列表数据
	getData(page, searchWord) {//获取数据的函数
		var self = this;
		var data = {};
		data.page = page;
		data.perpage = pageSize;
		data = { ...data, ...searchWord};
	
		axios.post('https://www.jinping.shop/project/xingzheng/front/getposter_grouplist.php',qs.stringify(data)).then(function(response){
			if(response.data.err == 0 ){
				if(response.data.totalnum != 0){
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
					if(response.data.totalnum <= page * pageSize){
						self.setState({
							hasMore:false,
							isLoading: true,
						})
					}
				}else{
					swal("这里无符合你条件的哈");
					self.setState({
						article:[],
					});
				}
				
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}
	
	onRefresh = () => {
		this.setState({page: this.state.page + 1},() => this.getData(this.state.page, this.state.searchWord));
  	};

	onEndReached = (event) => {
			if (!this.state.hasMore) {
				return;
			}
			let page = this.state.page + 1;
			this.setState({ isLoading: false });
			this.setState({page: this.state.page + 1}, ()=> this.getData(this.state.page, this.state.searchWord));
		}
  
	componentDidMount() {
		this.getLaber();
		this.getData(1, this.state.searchWord);
		window.addEventListener('resize', () => {
			this.setState({
				containerWidth: Math.floor((document.documentElement.clientWidth + 10) / 180 ) * 180 -10,
			});
		}, false);
	}

	// 属性设置
	getAutoResponsiveProps() {
		return {
			// itemMargin: 30,
			// containerWidth: this.state.containerWidth,
			// containerHeight : this.state.height,
			// itemClassName: 'item',
			// gridWidth: 10,
			// transitionDuration: '.8',
			// transitionTimingFunction: 'easeIn'
			itemMargin: 10,
			containerWidth: this.state.containerWidth || document.body.clientWidth,
			itemClassName: 'item',
			gridWidth: 100,
			transitionDuration: '.5'
		  
		};
	  }
	
	  

	render() {
	  return (
		<section className="page">
			<Select
				mode="multiple"
				style={{ width: '30%', margin:'10px'}}
				placeholder="海报场景(来源)"
				defaultValue={[]}
				allowClear
				showArrow
				onChange={v => this.handleChange(1, v)}
			>
				{this.state.comeFrom}
			</Select>
			<Select
				mode="multiple"
				style={{ width: '30%', margin:'10px' }}
				placeholder="海报类别"
				defaultValue={[]}
				allowClear
				showArrow
				onChange={v => this.handleChange(2, v)}
			>
					{this.state.typelaber}
			</Select>
			<RangePicker locale={locale} showTime 
				// renderExtraFooter={() => 'extra footer'}
				format = {dateFormat}
				// onChange = {this.handleTimeChange}
				// value={this.state.timeRang}
				onOk = {this.handleTimeChange}
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
								<div  to='/detial'  state ={{gid:v.gid}} key={i}  className={`w${i} album item`} style={this.state.styleList[i]}   >
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
						loader={<h4> {this.state.isLoading ? "我是有底线的~" : "加载中..."}</h4>}
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