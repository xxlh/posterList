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
import { Drawer, Button, Select, Input, DatePicker } from 'antd';
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
			height: document.documentElement.clientHeight * 9/ 10,
			containerWidth: Math.floor((document.documentElement.clientWidth +10) / 180 ) * 180 -10 ,
			comeFrom: [],
			typelaber: [],
			startTime:undefined,//开始时间
			endTime:undefined,  //结束时间
			timeRang:[],
			startValue: null,
			endValue: null,
			endOpen: false,
			visible: false,
		};
	}

	showDrawer = () => {
		this.setState({
		  visible: true,
		});
	  };
	
	  onClose = () => {
		this.setState({
		  visible: false,
		});
	  };

	  
	// search 
	onNameChange = (e) => {
		console.log(e.target.value)
		this.setState({ 
			searchkeyword: {...this.state.searchkeyword, name: e.target.value},
			page : 1
		} 
		// ,()=>{this.getData(this.state.page, this.state.searchkeyword);}
		);
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
			} 
			// ,()=>{this.getData(this.state.page, this.state.searchkeyword);}
				);
		}else{
			this.setState({ 
				searchkeyword: {...this.state.searchkeyword, typeids: value.join(",")},
				page : 1
			}
			// ,()=>{this.getData(this.state.page, this.state.searchkeyword);}
			);
		}
	  }

	handleTimeChange = (date, dateString) => {
	console.log(dateString);
	if(dateString!= undefined )
	this.setState({
		searchkeyword: {...this.state.searchkeyword, startdate: dateString[0] ,enddate:  dateString[1]},
		page : 1
	} 
	// ,()=>{this.getData(this.state.page, this.state.searchkeyword);}
	);
	
	}

	disabledStartDate = startValue => {
	const { endValue } = this.state;
	if (!startValue || !endValue) {
		return false;
	}
	return startValue.valueOf() > endValue.valueOf();
	};

	disabledEndDate = endValue => {
	const { startValue } = this.state;
	if (!endValue || !startValue) {
		return false;
	}
	return endValue.valueOf() <= startValue.valueOf();
	};


	onStartChange = (date, dateString) => {
		this.setState({
			page : 1,
			searchkeyword: {...this.state.searchkeyword, startdate: dateString },
			startValue :date,
		},
		// () =>{this.getData(this.state.page, this.state.searchkeyword);}
		);
	};

	onEndChange = (date, dateString) => {
		this.setState({
			page : 1,
			searchkeyword: {...this.state.searchkeyword, enddate: dateString },
			endValue :date,
		},
		// () =>{this.getData(this.state.page, this.state.searchkeyword);}
		);
	};

	submit = () =>{
		this.setState({
			visible: false,
		  },
		  () =>{this.getData(this.state.page, this.state.searchkeyword);}
		  );
	}
	//   handleStartOpenChange = open => {
	// 	if (!open) {
	// 	  this.setState({ endOpen: true });
	// 	}
	//   };
	
	//   handleEndOpenChange = open => {
	// 	this.setState({ endOpen: false });
	//   };

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
						img.src = v.coverimg;
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
			containerHeight : this.state.height,
			gridWidth: 100,
			transitionDuration: '.5'
		  
		};
	  }
	
	  

	render() {
		const { startValue, endValue } = this.state;
	  return (
		<section className="page">
			 <Button type="primary" shape="circle" icon="search" onClick={this.showDrawer} style={{position:'absolute', bottom:'2%', right:'5%', zIndex:99}}/>
			{/* <Button type="primary" onClick={this.showDrawer} style={{position:'absolute', top:'0', right:'5%',}}>
				搜索
			</Button> */}
			<Drawer
				title="搜索条件"
				placement="left"
				closable={false}
				onClose={this.onClose}
				visible={this.state.visible}
				maskClosable={this.state.visible}
			>
				<DatePicker
					style={{ width: '100%', margin:'5px', float: 'right'}}
					disabledDate={this.disabledStartDate}
					// showTime
					format= {dateFormat}
					value={startValue}
					placeholder="开始时间"
					onChange={this.onStartChange}
					// onOpenChange={this.handleStartOpenChange}
				/>
				<DatePicker
					style={{ width: '100%', margin:'5px', float: 'right'}}
					disabledDate={this.disabledEndDate}
					// showTime
					format= {dateFormat}
					value={endValue}
					placeholder="结束时间"
					onChange={this.onEndChange}
					// open={endOpen}
					// onOpenChange={this.handleEndOpenChange}
				/>
				<Select
					mode="multiple"
					style={{ width: '100%', margin:'5px', float: 'right'}}
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
					style={{ width: '100%', margin:'5px', float: 'right' }}
					placeholder="海报类别"
					defaultValue={[]}
					allowClear
					showArrow
					onChange={v => this.handleChange(2, v)}
				>
					{this.state.typelaber}
				</Select>
				<Input style={{ width: '100%', margin:'5px', float: 'right'}} allowClear  placeholder="名 字" onChange={this.onNameChange} />
				<Button type="primary" onClick={this.submit} style={{margin:'5px', float: 'right'}}>
				  查询
				</Button>
				{/* <Search
					style={{ width: '100%', margin:'5px'}}
					placeholder="input search text"
					enterButton="Search"
					size="default"
					style={{ width: '40%'}}
					onSearch={(value) => this.onChange(value)}
				/> */}
			</Drawer>
			
			{/* <RangePicker style={{ width: '40%', margin:'10px' }} locale={locale} showTime 
				// renderExtraFooter={() => 'extra footer'}
				format = {dateFormat}
				// onChange = {this.handleTimeChange}
				// value={this.state.timeRang}
				onOk = {this.handleTimeChange}
			/> */}
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
								</CacheLink>
							);
						})
					}
					</AutoResponsive>
					<InfiniteScroll
						dataLength={this.state.article}
						next={this.onEndReached}
						hasMore={true}
						// loader={<h4> {this.state.isLoading ? "我是有底线的~" : "加载中..."}</h4>}
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