import "../css/index.css"
import React from "react";
import WaterfallSampleComponent from './WaterfallSampleComponent';
import PosterDetail from './PosterDetail';
import AnimatedSwitch from './AnimatedSwitch';

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