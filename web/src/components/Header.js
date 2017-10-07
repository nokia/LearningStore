/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import '../css/Header.css';
import FaSearch from 'react-icons/lib/fa/search';

export default class Header extends Component {
  firstLoad = false;
  constructor(props) {
    super(props);
    if(this.props.props.match.params.text){
      this.state = {value: this.props.props.match.params.text};
      this.firstLoad = true;
    }
    else if(this.props.props.location.pathname.split('/')[2] === 'search'){
      this.state = {value: ''};
      this.firstLoad = true;
    }else{
      this.state = {value: ''};
    }    
  }

  componentDidMount(){
    if(this.firstLoad){
      this.nameInput.focus();
    }
  }
  
  search = (event) => {
    this.setState({value: event.target.value});
    if(this.props.searchInput){
      this.props.searchInput(event.target.value); 
    }     
    this.props.props.history.push('/'+ this.props.props.location.pathname.split('/')[1] + '/search/' + event.target.value );
  }

  moveCaretAtEnd(e) {
    var temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }
  
  render() {
    return (
      <div className="header">
        <div className="wrapper">
          <Link to={`/${this.props.data.id}/`} replace>
            <div className="header-name" title="Home">
              { this.props.data.title }
            </div>
          </Link>
          <div className="header-input">
            <input 
              type="text"
              value={this.state.value}
              placeholder="Search in the store..."
              onChange={this.search} 
              onFocus={this.moveCaretAtEnd}
              ref={(input) => { this.nameInput = input; }} 
            />
            <div className="header-search">
              <FaSearch color='#ffffff'  style={{ marginTop: '-5px' }}/>
            </div>
          </div>
        </div>
      </div>     
    );
  }
}