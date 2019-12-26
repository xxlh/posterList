import "../css/index.css"
import React from "react";
import qs from 'qs';
import axios from "axios"
import 'react-tabs/style/react-tabs.css';
import SearchTabs from './SearchTabs';
import swal from 'sweetalert';
import WaterfallSampleComponent from './WaterfallSampleComponent';
import {SearchBar, PullToRefresh } from 'antd-mobile';


class AppCompent extends React.Component{
	constructor(porps){
		super(porps);
		
		// this.handleSearch = this.handleSearch.bind(this);
		
		this.state = {
			keyword: [],
			tabIndex: 0,
			searchkeyword:'',
			hotKeyword : "" ,
			page: 1,
			article: [],//文章列表
			total:0,
			// dataSource:dataSource,
			isLoading: true,
			refreshing: true,
			hasMore: true,
			height: document.documentElement.clientHeight * 2 / 3,
		};
	}
	
	  onChange= (value) => {
		this.setState({ searchkeyword: value});
	  };
	  clear = () => {
		this.setState({ searchkeyword: '' });
	  };
	  handleClick = () => {
		this.manualFocusInst.focus();
	  }

	render(){
		return(
			<section className="page">
				 <SearchBar
				 	value={this.state.searchkeyword}
					 placeholder="Search"
					//  onSubmit={value => this.handleSearch(value)}
					//  onClear={value => this.handleSearch(value)}
					 onFocus={() => console.log('onFocus')}
					 onBlur={() => console.log('onBlur')}
					//  onCancel={value => this.handleSearch("")}
					 showCancelButton
					 onChange={this.onChange}
					/>
					{/* <SearchTabs hotSubmit = {value => this.handleSearch(value)}/> */}
				<section className="stage" ref="stage">
					<section className="img-sec">
					  <WaterfallSampleComponent />	
					 </section>
				</section>
			</section>
		)
	}
	
}
export default AppCompent;