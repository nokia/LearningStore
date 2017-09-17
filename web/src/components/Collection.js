/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import renderHTML from 'react-render-html';

import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

export default class Collection extends Component {

  state = { isLoading:true }

  componentWillMount() {
    Source.getSync(this.props.match.params.name)
    .then( (store) => this.setState({isLoading:false, store:store}) )
  }

  render() {
    
    if (this.state.isLoading) return null

    B.path = this.props.location.pathname;
    // console.log(B.path)
    
    const { name, id } = this.props.match.params;
    let store = this.state.store;
    let storeDef = Source.getDef(name);
    let coll = this.state.store.getByID(id);

    let thumbnails = coll.Solutions.map((itemID, index) => {
      let item = store.getByID(itemID);
      if (!item || !item.Icon) return null;
      return (          
        <Thumbnail  key={itemID} props={this.props} data={item} store={storeDef} />
      );
    });

    return (
      <div>
        <div className="head">
          <HeaderComponent props={this.props} data={storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={storeDef}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            <h2>{ coll.Title } ({thumbnails.length})</h2>
            <div>{ renderHTML(coll.Description || '') } </div>
            { thumbnails }
          </div>
        </div>
      </div>
    );
  }
}