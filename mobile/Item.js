/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import React from 'react';

import { View, ActivityIndicator, Image, ScrollView, Linking, StyleSheet } from 'react-native';
import { Container, Header, Icon, Button, Text } from 'native-base';
import { Left, Body, Right, Title, Subtitle } from 'native-base';
import { Content, List, ListItem, Thumbnail } from 'native-base';

import LS from './data';
import HTMLView from 'react-native-htmlview'

import { setCustomText } from 'react-native-global-props';
const customTextProps = {
  style: LS.font 
}
setCustomText(customTextProps); // Setting default styles for all Text components in HTMLView

const getQuote = '#getQuote';

export default class Item extends React.Component {

  state = { isLoading:true }

  static navigationOptions = ({ navigation }) => ({
    title: `${LS.format(navigation.state.params.title)}`,
    headerTitleStyle: LS.font,
    headerBackTitle: null
  });

  _resolve(itemID) {
    this.item = this.store.getByID(itemID);
    if (!this.item) {
      console.log('unknow ID', itemID);
      return;
    }
    this.setState({ isLoading: false });
    this.props.navigation.setParams({
      title:this.item.Title
    });     
  }

  componentWillMount() {
    const { itemID, storeID } = this.props.navigation.state.params;
//    console.log('Item.js', itemID, storeID);
    this.store = LS.get(storeID);
    if (this.store) 
      this._resolve(itemID);
    else {
      const def = LS.getDef(storeID);
      LS.fetch(storeID, def.url + '/img/' + storeID + '.json.gz', true)
      .then( (store) => { 
        this.store = store;
        this._resolve(itemID);
      });
    }
  }

  render() {

    if (this.state.isLoading) return (
      <View style={{ flex:1, flexDirection:'row', paddingTop:20, alignSelf:'center' }}>
        <ActivityIndicator />
        <Text style={ LS.font }>   { LS.loading }</Text>
      </View>
    );

    const item = this.item;
    const { storeID } = this.props.navigation.state.params;
    const def = LS.getDef(storeID);

    if (item.Url) {
      let fields = [];
      setField('Audience', item, fields);
      setField('Description', item, fields);
      setField('Objectives', item, fields);
      setField('Duration', item, fields); 
      setField('Prerequisites', item, fields);
      setField('Testimonials', item, fields);
      setField('Associates', item, fields);
      setField('More information', item, fields, item.Url === getQuote ? 'Access to the courses' : null);

      return(
        <ScrollView>
          <List>
            <ListItem >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <View>
                    <Image 
                      style = {{ width: 120, height: 60 }}
                      resizeMode = 'contain'
                      source = {{ uri:def.url + '/' + item.Icon }}
                    />    
                  </View>
                  <View style={{ height:60, justifyContent:'center', alignSelf: 'flex-end' }}>
                    { launch(item) }
                  </View>
                  
                </View>
            </ListItem>
            { fields }
          </List>
        </ScrollView>
      );
    }
    else if (item.Solutions) {
      const { navigate } = this.props.navigation;
      let solutions = [];
      item.Solutions.forEach((id) => {
        let item = this.store.getByID(id);
        if (item)
          solutions.push(item);
        else 
          console.log('unknow ID', id);
      });

//storeID === 'customer' ? './img/icon-fiche.jpg' : origin + '/' + item.Icon }}
      return (
        <ScrollView>
          <Content padder>
            <HTMLView value={ item.Description  || '' }/>
          </Content>
          <List dataArray={solutions}
            renderRow={(item) => 
              <ListItem button onPress={() => {
                  navigate('Item', { itemID:item.ID, storeID:item.sid });
                }}>
                <Image 
                  style = { LS.icon }
                  resizeMode = 'stretch'
                  source = {{ uri: def.url + '/' + item.Icon }}
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
        </ScrollView>
      );
    }

    return(
      <Text style={ LS.font }>Type not supported yet...</Text>
    )
  }
}

setField = (fieldName, item, rst, alter) => {
  if (item[fieldName]) {
    rst.push(
      <ListItem key={fieldName + '.1'} itemDivider>
        <Text style={ LS.font }>{alter || fieldName}</Text>
      </ListItem>
    );
    rst.push(
      <ListItem key={fieldName + '.2'}>
        <HTMLView value={ item[fieldName] }/>
      </ListItem>
    );
  }
}

launch = (item) => {
  let url = item.Url;
  if (url != getQuote) {
    return (
        <Button small onPress={() => {
          Linking.openURL(url);
        }}>
          <Text style={ LS.font }>{ item.btn || 'Launch' }</Text>
        </Button>
    );
  }
}

