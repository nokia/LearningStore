import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Config} from './../config.js';
import HeaderComponent from './Header';
import '../css/Home.css';
import imgLoading from '../img/loading.gif'
import imgSearch from '../img/search.png'
import Source from './data';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

var data;
var els;
class Home extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    
  }
  render() {
    const myStores = this.props.stores.map((store, index) =>{
      return (
        <div key={index} className="selectStore" title={store.title}>
          <Link to={"/" + store.id + "/"}>
            <div className="SelectStoreTitle">
              {store.title}
            </div>
            <div className="SelectStoreBody">
              {store.subtitle}
            </div>
            <div className="SelectStoreButton">
              Open this store 
              <FaAngleRight color='orange' />
            </div>
          </Link>
          
        </div>
      )
    });
    return (
      <div className="select">
        <div className="selectTitle">
          {Config.Name}
        </div>
        {myStores}
      </div>
    );
  }
}
export default Home;