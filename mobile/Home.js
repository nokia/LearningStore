/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Left, Body, Right, Title, Subtitle } from 'native-base';
import { Content, List, ListItem, Thumbnail } from 'native-base';

import cnf from './config';
import LS  from './data';

export default class App extends React.Component {

  state = { isLoading:true, isCollapsed:true }

  static navigationOptions = {
    title: 'Nokia Learning Store', 
    headerTitleStyle: LS.font,
    headerBackTitle: null
//    headerBackTitleStyle: LS.font
  };

  componentWillMount() {
    fetch(cnf.url)
    .then((response) => response.json())
    .then((responseJson) => {
      LS.setDefs(responseJson);
      this.setState({ isLoading:false, items:responseJson });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const { navigate } = this.props.navigation;

//    let isCollapsed = true;
    
    if (this.state.isLoading) {
      return (
        <View style={{ flex:1, paddingTop:20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <List dataArray={this.state.items}
        renderRow={(item) =>
          <ListItem button onPress={() => {
              navigate('Store', item);
            }}>
            <Thumbnail source={require('./img/logo.png')} />
            <Body>
              <Text style={ LS.font }>{item.title}</Text>
              <Text note style={ LS.font }>{item.subtitle}</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward"/>
            </Right>
          </ListItem>
        }>
      </List>
    );
  }
}
