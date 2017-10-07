/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';
import { FieldConnect } from 'react-components-form';

import ReactQuill from 'react-quill';
import '../../node_modules/react-quill/dist/quill.snow.css'; 

import '../css/Edit.css';

class Quill extends Component {
  componentWillMount() { this.state = { text: this.props.value } }
  
	render() {
		// console.log('render', this.props.name, this.props.value);
		return (			
			<div className='editFlow'>
				<label className='editLabel'>{this.props.name}</label>
				<div className='RTE'>
					<ReactQuill theme="snow" 
						name={this.props.name}
						value={this.state.text} //createValueFromString(value)}
						onChange={ value => {
							this.setState({ text:value});
							this.props.onChange(this.state.text);
						}}
					/>
				</div>
			</div>		
		);
	}
}

export default FieldConnect(Quill);
