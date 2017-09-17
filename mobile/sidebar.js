/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import React from 'react';
import { View, Linking, ScrollView, TouchableHighlight } from 'react-native';
import { ListItem, Toast , Icon, Text, Body, Right } from 'native-base';

import Accordion from 'react-native-collapsible/Accordion';
import LS from './data';

const menuHeight = 35;

export default class SideBar extends React.Component {

  click = (item) => {
    const { id, url } = this.props.ctx.state.params;
    if (item.url) Linking.openURL(item.url);
    else LS.get(id) ? this.props.ctx.navigate('Item', { itemID:item.id, storeID:id }) : Toast.show({
      text: LS.loading,
      position: 'bottom',
      type: 'danger',
      buttonText: 'OK'
    });    
  }

  _renderHeader(section) {
    let text = <Text style={ [LS.font, { flex: 0.9, fontSize:15, height:menuHeight, color:'white', paddingVertical:7, marginLeft:10 }] }>{ section.title }</Text>;
    if (section.content)
      return (
        <View style={{ flexDirection: 'row', alignItems:'center' }}>
          { text }
          <Icon name="arrow-down" style={{ flex:0.1, fontSize:20, color:'lightgray' }}/>
        </View>
      );

    return (
      <TouchableHighlight onPress={() => { this.click(section) }}>
        <View style={{ flexDirection: 'row', alignItems:'center' }}> 
          { text }
          {/* <Icon name="arrow-forward" style={{ flex:0.1, fontSize:20, color:'lightgray' }}/> */}
        </View>
      </TouchableHighlight>
    );
  }

  _renderContent(section) {
    if (section.content)
      return (
        <View style={{ backgroundColor: '#696969' }}>
        { section.content.map((item, i) => 
          <ListItem key={i} style={{ height:menuHeight+5, flexDirection: 'row', alignItems:'center' }} button onPress={() => { this.click(item) }}>
            <Text style={ [LS.font, { flex: 0.9, paddingLeft:15, fontSize:15, color:'white' }] }>{ item.title }</Text>
            {/* <Icon name="arrow-forward" style={{ flex:0.1, fontSize:20, color:'lightgray' }}/> */}
          </ListItem>
        )}
        </View>
      );
  }

	render() {
    return (
      <ScrollView style = {{ backgroundColor:'gray' }}>
        <Accordion
          sections={ this.props.ctx.state.params.menu }
          renderHeader={ (section) => this._renderHeader(section) }
          renderContent={ (section) => this._renderContent(section) }
        />
      </ScrollView>
    );
	}
}
