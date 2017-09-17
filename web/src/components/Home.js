/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Config} from './../config.js';
import '../css/Home.css';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

class Home extends Component {
  render() {
    // console.log('Home', this.props.stores.length, this.props.stores)
    const myStores = this.props.stores.map((store, index) => {
      console.log('map', store)
      return (
        <div key={index} className="selectStore" title={store.title}>
          <Link to={"/" + store.id + "/"}>
            <div className="SelectStoreTitle">
              { store.title }
            </div>
            <div className="SelectStoreBody">
              { store.subtitle }
            </div>
            <div className="SelectStoreButton">
              Open this store 
              <FaAngleRight color='orange' />
            </div>
          </Link>
          
        </div>
      )
    });
    console.log(myStores)
    return (
      <div className="home">
        <div className="select">
          <div className="selectTitle">
            { Config.Name }
          </div>
          { myStores }
        </div>
      </div>
    );
  }
}
export default Home;