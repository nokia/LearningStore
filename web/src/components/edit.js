/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';

import {Config} from '../config.js';
import Source from './data';
import B from './back';

// import TINY from '../lib/tiny.editor';

export default class Create extends Component {

  state = { isLoading:true }

  componentWillMount() {
    // console.log('coll willmount')
    const {name, id} = this.props.match.params;// || this.props.location.state;
    console.log('will name', name, id)
    Source.fetch(name, Config.Source + name + '.json').then( (store) => this.setState({isLoading:false, item:store.getByID(id)}) )
    B.back = true;
  }
  
  render() {
    if (this.state.isLoading) return null;

    // const { name, id } = this.props.location.state;
    // console.log(name, id);
    // const {name, id} = this.props.location.state;
    const item = this.state.item;
    if (!item) return <h4>Not found... </h4>
    if (item.Solutions) return (
      <div>
        <label>Title*</label><input placeholder={item.Title} />
        <label>Description</label><input placeholder={item.Description || '(empty)'} />
        <label>Item list</label><input placeholder={item.Solutions} />
      </div>
    );
    return <h4>Item </h4>
  }
}
