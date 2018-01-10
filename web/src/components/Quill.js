/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';
import { FieldConnect } from 'react-components-form';

import ReactQuill from 'react-quill';
import '../../node_modules/react-quill/dist/quill.snow.css'; 

import '../css/Edit.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline'],        // toggled buttons
//  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link'],
  //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  // [{ 'direction': 'rtl' }],                         // text direction
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
//  [{ 'font': [] }],
  [{ 'align': [] }],
//  ['clean']                                         // remove formatting button
];

class Quill extends Component {
  componentWillMount() { this.state = { text: this.props.value } }
  componentWillReceiveProps(newProps){
		// console.log('quill');
		if (!newProps.value) this.setState({text:''});
		// this.state = { text: newProps.value }
		// this.setState({text:''});
  }
  
	render() {
		return (			
			<div className='editFlow'>
				<label className='editLabel'>{this.props.name}</label>
				<div className='RTE'>
					<ReactQuill theme="snow" 
            modules = {{
              toolbar: toolbarOptions
            }}
						name={this.props.name}
						value={this.state.text} 
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
