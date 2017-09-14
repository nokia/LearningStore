import React from 'react';
import { StackNavigator } from 'react-navigation';
import {Root} from 'native-base';
import { View, ActivityIndicator, StatusBar, AppRegistry } from 'react-native';

// import Expo from "expo";

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading:true }
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.setState({ isLoading:false });
  }
    
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex:1, paddingTop:20 }}>
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

AppRegistry.registerComponent('android', () => App);
