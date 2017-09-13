/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {Root} from 'native-base';
import { AppRegistry } from 'react-native';

import Home  from './Home'
import Store from './Store'
import Item  from './Item'
import Search from './Search'
import Simple from './Simple'

const Routes = StackNavigator(
  {
    Home: { screen: Home },
    Store: { screen: Store },
    Item: { screen: Item },
    Search: { screen: Search },
    Simple: { screen: Simple }
  },
  { initialRouteName: 'Home' }
);

export default class reactStore extends React.Component {
  render() {
    return (
      <Root>
        <Routes />
    </Root>    
    )
  }
}

AppRegistry.registerComponent('cStore', () => reactStore);

