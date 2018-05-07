import React, { Component } from 'react';
import {StackNavigator} from 'react-navigation';
import MainPage from './components/MainPage.js';
import GamePage from './components/GamePage.js';
import Login from './components/Login.js'
import { YellowBox } from 'react-native';

const MyApp = StackNavigator({

      Login: {screen: Login},
      MainPage: {screen: MainPage},
      GamePage: {screen: GamePage},
    }
);

console.disableYellowBox = true;

export default class App extends React.Component {

  render() {

    return <MyApp />;
}
}
