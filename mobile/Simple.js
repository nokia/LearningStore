/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { Container, H3, Separator, Text, Content} from "native-base";
import HTMLView from 'react-native-htmlview';

import LS from './data';

export default class Simple extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Info',
    headerTitleStyle: LS.font,
    headerBackTitle: null
//    headerBackTitleStyle: LS.font
  });

  render() {
    const { title, html } = this.props.navigation.state.params;
    // console.log(html);
    return (
      <ScrollView>
        <Content padder>
        <H3 style={ LS.font }>{title}</H3>
        <HTMLView value={ '<br>' + html }/>
        </Content>
      </ScrollView>
    );
  }
  
}

