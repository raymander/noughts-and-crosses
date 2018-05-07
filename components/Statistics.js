import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Alert} from 'react-native';
import { Badge } from 'react-native-elements';
import * as firebase from 'firebase';

import {styles} from '../constants/styles.js'

export default class Statistics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      color1: '',
      textColor1: '',
      color2: '',
      textColor2: '',
      color3: '',
      textColor3: '',
    }
  }

  componentDidMount() {
    var stats = this.props.stats
    console.log(stats)
    if (stats[0].value >= 10) {
      this.setState({color1: '#DC143C', textColor1: '#fff'});
    }
    if (stats[0].value >= 50) {
      this.setState({color2: '#DC143C', textColor2: '#fff' });
    }
    if (stats[0].value >= 100) {
      this.setState({color3: '#DC143C', textColor3: '#fff' });
    }
  }
  

  renderSeparator = () => {
     return (
       <View
         style={{
           height: 3,
           width: "100%",
           backgroundColor: "#666",
           margin: 7
         }}
       />
     );
  };

  keyExtractor = (item) => item.id;

  renderItem = ({item}) =>
    <View >
      <Text style={{fontSize: 18, fontFamily: 'monospace', textAlign: 'center'}}>
        {item.title}{item.value}
      </Text>
    </View>;

  render() {
    var closeStats = this.props.closeStats;
    const {color1, textColor1, color2, textColor2, color3, textColor3} = this.state
    return (
      <View style={[styles.container, {width: '100%'}]}>
        <ScrollView style={{width:'100%'}}>
          <View style={{height: "100%", width: '100%', alignItems: 'center'}}>
            <FlatList
              style={styles.flatlist}
              data = {this.props.stats}
              keyExtractor = {this.keyExtractor}
              renderItem = {this.renderItem}
              ItemSeparatorComponent={this.renderSeparator}
            />
            <View
              style={{
                height: 25,
                width: "100%",
                backgroundColor: "#B0C4DE",
                margin: 20
              }}
            />
            <Text style={{fontSize: 20, fontFamily: 'monospace'}}> Your badges: </Text>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Badge
                containerStyle = {{margin: 9, backgroundColor: color1 ? color1 : '#F5F5DC'}}
              >
                <Text style = {{color: textColor1 ? textColor1: '#777', fontSize: 16, paddingTop: 5, paddingBottom: 1}}>Rookie</Text>
                <Text style = {{color: textColor1 ? textColor1: '#777', fontSize: 10, padding: 2, paddingTop: 1, paddingBottom: 5}}>Played 10 games</Text>
              </Badge>
              <Badge
                containerStyle = {{margin: 9, backgroundColor: color2 ? color2 : '#F5F5DC'}}
              >
                <Text style = {{color: textColor2 ? textColor2: '#777', fontSize: 16, paddingTop: 5, paddingBottom: 1}}>Amateur</Text>
                <Text style = {{color: textColor2 ? textColor2: '#777', fontSize: 10, padding: 2, paddingTop: 1, paddingBottom: 5}}>Played 50 games</Text>
              </Badge>
              <Badge
                containerStyle = {{margin: 9, backgroundColor: color3 ? color3 : '#F5F5DC'}}
              >
                <Text style = {{color: textColor3 ? textColor3: '#777', fontSize: 16, paddingTop: 5, paddingBottom: 1}}>Pro</Text>
                <Text style = {{color: textColor3 ? textColor3: '#777', fontSize: 10, padding: 2, paddingTop: 1, paddingBottom: 5}}>Played 100 games</Text>
              </Badge>
            </View>
            <TouchableOpacity onPress={() => closeStats()}>
              <Text style={[styles.menu, {marginTop: 50}]}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

}
