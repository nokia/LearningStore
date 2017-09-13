import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Root, AppRegistry } from 'native-base';

import Home  from './Home'
import Store from './Store'
import Item  from './Item'
import Search from './Search'
import Simple from './Simple'

import { Font } from 'expo';
import { View, ActivityIndicator } from 'react-native';

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

export default class reactStore extends Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'NokiaPureText-Light': require('./assets/NokiaPureText-Light.ttf'),
    });

    this.setState({ isLoading: false });
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <Root>
        <Routes />
    </Root>    
    );
  }
}