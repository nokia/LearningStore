/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import React from 'react';
import { Image } from 'react-native';
import { Body, Right, List, ListItem, Icon, Text } from 'native-base';

import LS from './data';

export default class Search extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Search results (' + `${navigation.state.params.data.length}` + ')',
    headerTitleStyle: LS.font,
    headerBackTitle: null
  });

  render() {
    const { navigate } = this.props.navigation;  
    const {id, data, url} = this.props.navigation.state.params;

    if (data.length) {
      return (
        <List dataArray = { data }
          renderRow = { (item) =>
            <ListItem key={item.ID} button onPress={() => {
                navigate('Item', { itemID:item.ID, storeID:item.sid });
              }}>
              <Image 
                style={ LS.icon }
                resizeMode = 'stretch'
                source = {{ uri: url + '/' + item.Icon }}
              />
              <Body>
                <Text style={ LS.font }>{ LS.format(item.Title) }</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
          }>
        </List>      
      );
    }
    
    return (
      <Text style = { LS.font }>No result...</Text>
    ); 
  }
}

