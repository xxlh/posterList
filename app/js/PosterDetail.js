import '../css/index.less';
import React from "react";
import axios from "axios"
import qs from 'qs';



class PosterDetail extends React.Component {
	constructor(porps){
		super(porps);
		
		this.state = {
			article: [],//文章列表
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
					article:[...self.state.article, ...response.data.list],
				});
			}else{
				swal(response.data.msg);
			}
			
		})
        
	}
	
 
  
	componentDidMount() {
		this.getData(1);
		window.addEventListener('resize', () => {
			this.setState({
				posterWidth: document.documentElement.clientWidth > 1000 ? "950px" : "100%",
			});
		}, false);
	}

	render() {
	  return (
		<div className="stage" ref="stage">
			<div className = "back-home">返 回</div>
		  	<div className = "detail" style = {{width: this.state.posterWidth }}>
			{
				this.state.article.map((v,i) => {
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