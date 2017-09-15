import React, { Component } from 'react';
import B from './back';
import {Config} from './../config.js';
import Source from './data';

export default class Collection extends React.Component {

  state = {isLoading:true}

  componentWillMount() {
    console.log(this.props.match.params.name);
    Source.getSync(this.props.match.params.name)
    .then( (store) => this.setState({isLoading:false, store:store}))
  }

  render() {
    
    if (this.state.isLoading) return null    
    return <h1>eHEHHHE</h1>
  }

}