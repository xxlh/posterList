import "../css/index.css"
import React from "react";
import WaterfallSampleComponent from './WaterfallSampleComponent';
import PosterDetail from './PosterDetail';
import AnimatedSwitch from './AnimatedSwitch';
import { Route, browserHistory as Router, Link } from 'react-router-dom'

class AppCompent extends React.Component{
	constructor(porps){
		super(porps);
	}
	render(){
		return(
			<WaterfallSampleComponent/>
		)
	}
	
}
export default AppCompent;