/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import { FieldConnect } from 'react-components-form';


import '../css/Edit.css';

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'}
  ],
  BLOCK_TYPE_DROPDOWN: [
    {label: 'Normal', style: 'unstyled'},
    {label: 'Heading Large', style: 'header-one'},
    {label: 'Heading Medium', style: 'header-two'},
    {label: 'Heading Small', style: 'header-three'}
  ],
  BLOCK_TYPE_BUTTONS: [
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ]
};

class zRTE extends Component {
  componentWillMount() {
		this.setState({ value:RichTextEditor.createValueFromString(this.props.value || '', 'html')});
  }

	render() {
		// console.log('render', this.props.name, this.props.value);
		return (			
			<div className='editFlow'>
				<label className='editLabel'>{this.props.name}</label>
				<div className='RTE'>
					<RichTextEditor 
						name={this.props.name}
						value={this.state.value} //createValueFromString(value)}
						onChange={ value => {
							this.setState({value});
							this.props.onChange(value.toString('html'));
						}}
						toolbarConfig={toolbarConfig}
					/>
				</div>
			</div>		
		);
	}
}

export default FieldConnect(zRTE);
