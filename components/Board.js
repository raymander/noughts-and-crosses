import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

import {styles} from '../constants/styles.js'

export default class Board extends React.Component {

  render() {

    return (
          <View>
            <View
              style={
                [styles.lines,
                {
                width: 5,
                height: 306,
                transform: [
                  {translateX: 100}
                ]
              }]}
            />
            <View
              style={
                [styles.lines,
                {
                width: 5,
                height: 306,
                transform: [
                  {translateX: 200}
                ]
              }]}
            />
            <View
              style={
                [styles.lines,
                {
                height: 5,
                width: 306,
                transform: [
                  {translateY: 100}
                ]
              }]}
            />
            <View
              style={
                [styles.lines,
                {
                height: 5,
                width: 306,
                transform: [
                  {translateY: 200}
                ]
              }]}
            />
        </View>
    );
  }
}
