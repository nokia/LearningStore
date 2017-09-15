import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../css/Navigation.css';
import imgChevron from '../img/chevron.png';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
var data;
var properties;
class Navigation extends React.Component{
  constructor(props) {
    super(props);
    properties = props.props;
    data = props.data;
  }
  onClick(info) {
    properties.history.push(properties.history.location.pathname + "item/" + info.key);
    // window.location = "#/employee/item/" + info.key;
  }

  render() {

    //Generate "Categories" menu
    const categories = data.menu.map((link, index) =>{
      if(link.category){
        // if(!link.id){
        //   link.id = "0" + index;
        // }
        if(link.content){
          const linksChild = link.content.map((linkChild, index2) =>{
            return <MenuItem key={index2}>{linkChild.title}</MenuItem>
          });
          return(
            <SubMenu key={index} title={link.title}>
              {linksChild}
            </SubMenu>
          )
        }else{
          return <MenuItem key={index}>{link.title}</MenuItem>
        }
      }
    });

    //Generate others menus
    const links = data.menu.map((link, index) =>{
      //There is no category attribute if the link is not in the "categories" menu
      if(!link.category){
        // if(!link.id){
        //   link.id = "0" + index;
        // }

        //This link is a submenu
        if(link.content){
          const linksChild = link.content.map((linkChild, index) =>{
            return <MenuItem key={linkChild.id}>{linkChild.title}</MenuItem>
          });
          return(
            <SubMenu className="floatRight" key={index} title={<span>{link.title} <FaAngleDown color='#7C7B7B' /></span>}>
              {linksChild}
            </SubMenu>
          )
        }else{
          return <MenuItem className="floatRight" key={link.id}>{link.title}</MenuItem>
        }
      }
    });

    return (
      <div>
        <div className="navigation">
          <Menu
            onClick={this.onClick}
            mode="horizontal"
          >
            <SubMenu key="categories" title={<span>Categories <FaAngleDown color='#7C7B7B' /></span>}>
              {categories}
            </SubMenu>
            {links}
          </Menu>
        </div>
      </div>
    );
  }
};
export default Navigation;