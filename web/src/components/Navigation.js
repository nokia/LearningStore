/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../css/Navigation.css';
import FaAngleDown from 'react-icons/lib/fa/angle-down';

const item = 'item/';

export default class Navigation extends Component {

  onClick(info) {
    console.log('hustory', this.props.props)
    this.props.props.history.push('/' + this.props.props.history.location.pathname.split('/')[1] + '/' + item + info.key);
    // window.location = "#/employee/item/" + info.key;
  }

  render() {

    //Generate "Categories" menu
    let cat = false;
    let categories = this.props.data.menu.map((link, index) => {
      if(link.category){
        // if(!link.id){
        //   link.id = "0" + index;
        // }
        cat = true;
        if(link.content){
          const linksChild = link.content.map((linkChild) => {
            return <MenuItem key={linkChild.id}>{linkChild.title}</MenuItem>
          });
          return(
            <SubMenu key={index} title={link.title}>
              {linksChild}
            </SubMenu>
          )
        }
        else{
          return <MenuItem key={index}>{link.title}</MenuItem>
        }
      }
      return null;
    });

    categories = cat ? (
      <SubMenu key="categories" title={<span>Categories <FaAngleDown color='#7C7B7B' /></span>}>
        { categories }
      </SubMenu>
    ) : null;

    //Generate others menus
    const links = this.props.data.menu.map((link, index) =>{
      //There is no category attribute if the link is not in the "categories" menu
      if(!link.category){
        // if(!link.id){
        //   link.id = "0" + index;
        // }

        //This link is a submenu
        if(link.content){
          const linksChild = link.content.map((linkChild) => {
            // console.log(linkChild.id, linkChild.title, linkChild.url)
            return <MenuItem key={linkChild.id || linkChild.url}>{ linkChild.title }</MenuItem>
          });
          return(
            <SubMenu className="floatRight" key={index} title={<span>{link.title} <FaAngleDown color='#7C7B7B' /></span>}>
              { linksChild }
            </SubMenu>
          )
        }
        else{
          return <MenuItem className="floatRight" key={link.id}>{ link.title }</MenuItem>
        }
      }
      return null;
    });

    return (
      <div>
        <div className="navigation">
          <Menu
            onClick={ (info) => this.onClick(info) }
            mode="horizontal"
          >
            { categories }
            { links }
          </Menu>
        </div>
      </div>
    );
  }
}
