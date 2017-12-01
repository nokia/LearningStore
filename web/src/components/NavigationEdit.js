/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../css/NavigationEdit.css';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
import Edit from './editCtl';
import B from './back';
const item = 'item/';

export default class Navigation extends Component {

  onClick(info) {
    switch (info.key) {
      case 'c': 
        Edit.clipboard();
        break;
      case 'd': 
        Edit.dump();
        break;
      case 'e': 
        Edit.modify();
        break;
        case 'f': 
        Edit.create('collection');
        break;
      case 'h':
        B.history.push('/');
        break;
      case 'l':
        Edit.showLog();
        break;
      case 'n': 
        Edit.create('item');
        break;
      case 'o':
        Edit.open();
        break;
      case 'r':
        Edit.reset();
        break;
      case 's':
        Edit.saveAs();
        break;
      case 'ex':
        Edit.switchEditMode(false, true);
        B.history.push('/');
        break;
      case 'u':
        Edit.upload();
        break;
      case 'w':
        Edit.gotoWip();
        break;
      case 'x':
        Edit.del();
        break;
      case 'y':
        Edit.redo();
        break;
      case 'z':     
        Edit.undo();
        break;
      default:
    }
    
    
  }

  render() {
    console.log(Edit);
    return(
      <div>
        <div className="navigationEdit" id="navigationEdit">
          <Menu
            onClick={ (info) => this.onClick(info) }
            mode="horizontal"
          >
            <SubMenu className="floatRight" title={<span>Other <FaAngleDown color='#7C7B7B' /></span>}>
              <MenuItem key="l">Open the logs of saved operations</MenuItem>
              <MenuItem key="w">Toggle work in progress (WIP)</MenuItem>
              <MenuItem key="h">Go Home</MenuItem>
              <MenuItem key="r">Reset all saved operations</MenuItem>
              <MenuItem key="ex">Exit edit mode</MenuItem>
            </SubMenu>
            <SubMenu className="floatRight" title={<span>File operations <FaAngleDown color='#7C7B7B' /></span>}>
              <MenuItem key="s">Download to a local file all modifications saved</MenuItem>
              <MenuItem key="o">Load one or more files</MenuItem>
              <MenuItem key="d">Save locally the complete store</MenuItem>
            </SubMenu>
            <SubMenu className="floatRight" title={<span>Undo / Redo <FaAngleDown color='#7C7B7B' /></span>}>
              <MenuItem key="z">Undo the last saved operation</MenuItem>
              <MenuItem key="y">Redo the last undone operation</MenuItem>
            </SubMenu>
            <MenuItem className="floatRight" key="f">Create collection</MenuItem>
            <MenuItem className="floatRight" key="n">Create item</MenuItem>
            <SubMenu className="floatRight" title={<span>Current item <FaAngleDown color='#7C7B7B' /></span>}>
              <MenuItem key="e">Edit current item</MenuItem>
              <MenuItem key="x">Delete current item</MenuItem>
              <MenuItem key="c">Copy the ID of current item</MenuItem>
            </SubMenu>
          </Menu>
        </div>
      </div>
    );
  }
}
