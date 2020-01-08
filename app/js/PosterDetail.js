import '../css/index.less';
import React from "react";
import axios from "axios"
import qs from 'qs';
import { Control } from 'react-keeper'

class PosterDetail extends React.Component {
	constructor(porps){
		super(porps);
		this.state = {
			posterList: [],//文章列表
			posterWidth: document.documentElement.clientWidth > 1000 ? "1000px" : "100%",
		};
	}
	
	getData(id) {//获取数据的函数
		var self = this;
		var data={};
		data.groupid = id;
		axios.post('https://www.jinping.shop/project/xingzheng/front/getposter_imglist.php',qs.stringify(data)).then(function(response){
			if(response.data.err == 0 ){
				self.setState({
					posterList:[...self.state.posterList, ...response.data.list],
				});
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}
	onHandleClick = () => {
		/* 返回上一页，也可以这样-- Control.go(path, state) */
		Control.go(-1)
	  }
	componentDidMount() {
		// let id  = 1//parseInt(this.props.location.query.gid) ;
		let { gid } = Control.state || {}
		this.getData(gid);
		window.addEventListener('resize', () => {
			this.setState({
				posterWidth: document.documentElement.clientWidth > 1000 ? "950px" : "100%",
			});
		}, false);
		console.log(gid);
	}

	render() {
	  return (
		<div className="stage" ref="stage">
			<div className = "back-home" onClick={this.onHandleClick}>返 回</div>
		  	<div className = "detail" style = {{width: this.state.posterWidth }}>
			{
				this.state.posterList.map((v,i) => {
					return (
						<div key={i}  className = "pic item">
						<img className = "a-cover" src = {v.imgurl}/>
						<p className = "a-layer">{v.title}</p>
						</div>
					);
				})
			}
			</div>
		</div>
	  );
	}
  }

  export  default PosterDetail;