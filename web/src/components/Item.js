/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import B from './back';
import {Config} from './../config.js';
import Source from './data';
import '../css/Item.css';
import MdClose from 'react-icons/lib/md/close';
import renderHTML from 'react-render-html';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

export default class Item extends Component{
// export default ({ match, history }) => {

  state = { isLoading:true }
  myStore;

  constructor(props) {
    super(props);
    this.myStore = Source.getDef(props.match.params.name);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    Source.getSync(this.props.match.params.name)
    .then( (store) => this.setState({isLoading:false, store:store}) )
  }

  render() {
    
    if (this.state.isLoading) return null;

    let item = this.state.store.getByID(this.props.match.params.id)
    console.log('item', item)
    const back = (e) => {
      e.stopPropagation()
      document.body.style.overflow = 'auto';
      if (B.back) this.props.history.goBack()
    }
    let fields = Config.Mapping.map((field, index) => {
      if(item[field]){
        return (
          <div className="itemField" key={index}>
            <div className="itemFieldTitle">
              {field}
            </div>
            <div className="itemFieldBody">
              { renderHTML(item[field]) }
            </div>
          </div>
        );
      }
      return null;
    });
    return (
      <div className="itemOverlay">
        <div className='modal'>
          <div className="itemTitle">
            { Source.format(item.Title) }
            <MdClose color='#FFFFFF' className="pointer itemClose" onClick={back}/>
          </div>
          
          <div className="itemFields">
            <div className="itemIcon">
              <img src={this.myStore.url + "/" + item.Icon} alt=''/>
            </div>
            <a className="itemLaunch" href={item.Url} title="Launch" target="_blank">
              Launch
              <FaAngleRight style={{marginTop: '-4px', marginLeft: '6px'}} />
            </a>
            { fields }
          </div>
        </div>
      </div>
    )
  }
}
