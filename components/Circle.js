import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import {styles} from '../constants/styles.js'

export default class Circle extends React.Component {

  render() {
    const {xTranslate, yTranslate} = this.props

    {/*transform parameters are passed using props but default is 10 so that element is placed in the center of the square, not leaning to its border */}
    return (
    <View style={[
      styles.crosscircle,
      {transform: [
        {translateX: xTranslate ? xTranslate:10},
        {translateY: yTranslate ? yTranslate:10},
      ]}
    ]}
    >
      <Image
        source={require('../assets/pictures/circle3.png')}
        style={{
          width: 70,
          height: 70
        }}
      />
    </View>
    );
  }
}
