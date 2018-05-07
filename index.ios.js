
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import App from './App'


class NoughtsAndCrosses extends Component {
  render() {
    return (
      <App />
    )
  }
}

AppRegistry.registerComponent('Noughts and Crosses', () => NoughtsAndCrosses)
