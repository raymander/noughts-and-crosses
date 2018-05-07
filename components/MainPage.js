import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, ImageBackground } from 'react-native';
import { Header } from 'react-native-elements';
import {StackNavigator} from 'react-navigation';

import Statistics from './Statistics'

import { firebaseAuth } from '../config';
import {db} from '../config'
import {styles} from '../constants/styles.js'

export default class MainPage extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var closeStats = this.closeStats.bind(this);
    this.state = {
      statsShown: false,
      stats: []
    }
    const user = '-LBoyqJmLMtbQQ5slfiC'
    this.itemsRef = db.ref('counters/'+ user);
  }

  componentDidMount() {
      this.setState({stats: []});
      var items = [];
      this.itemsRef.on('value', (snap) => {
        snap.forEach((child) => {
          items.push({
            id: child.key,
            title: child.val().title,
            value: child.val().value,
          });
        });
        this.setState({stats: items });
      });
  }

  showStats(){
    this.setState({
      statsShown: true
    })
  }

  closeStats() {
    this.setState({
      statsShown: false
    })
  }

  logOut() {
    const { navigate } = this.props.navigation;
      firebaseAuth().signOut().then(() => {
      navigate('Login');
    }).catch(() => {
      console.log('Some error occured')
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { statsShown } = this.state;
    var closeStats = this.closeStats;

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <ImageBackground
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
          source={require('../assets/pictures/backgr1.png')}
        >
          <Header
          centerComponent={{
            text: 'NOUGHTS AND CROSSES',
            style: { color: '#fff', width: '100%', textAlign: 'center', fontSize: 18,   fontFamily: 'monospace', fontWeight:'bold'}
          }}
          innerContainerStyles={{ justifyContent: 'center', backgroundColor: 'firebrick' }}
          outerContainerStyles={{ backgroundColor: 'firebrick' }}
          />

          {
            statsShown&&this.state.stats.length !== 0 ? (
            <Statistics
            closeStats = {closeStats.bind(this)}
            stats = {this.state.stats}
            />
          ) : (
              <View style={styles.container}>
                <Text style={styles.welcome}>WELCOME TO THE GAME!</Text>
                <TouchableOpacity onPress={() => navigate('GamePage')}>
                  <Text style={styles.menu}>START</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.showStats()}>
                  <Text style={styles.menu}>STATS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.logOut()}>
                  <Text style={styles.menu}>LOG OUT</Text>
                </TouchableOpacity>

                <Image
                  source={require('../assets/pictures/circle3.png')}
                  style={{
                    width: 70,
                    height: 70,
                    transform: [
                      {translateX: 100},
                      {translateY: -20}
                    ]
                  }}
                />

                <Image
                  source={require('../assets/pictures/circle2.png')}
                  style={{
                    width: 150,
                    height: 150,
                    transform: [
                      {translateX: -100},
                      {translateY: -80},
                    ]
                  }}
                />

                <Image
                  source={require('../assets/pictures/cross3.png')}
                  style={{
                    width: 40,
                    height: 40,
                    transform: [
                      {translateX: -10},
                      {translateY: -80},
                      {rotate: '60deg'},
                    ]
                  }}
                />

                <Image
                  source={require('../assets/pictures/cross1.png')}
                  style={{
                    width: 150,
                    height: 150,
                    transform: [
                      {translateX: -70},
                      {translateY: -170},
                      {rotate: '20deg'},
                    ]
                  }}
                />

                <Image
                  source={require('../assets/pictures/circle1.png')}
                  style={{
                    width: 100,
                    height: 100,
                    transform: [
                      {translateY: -420},
                    ]
                  }}
                />

                <Image
                  source={require('../assets/pictures/cross2.png')}
                  style={{
                    width: 130,
                    height: 130,
                    transform: [
                      {translateX: 70},
                      {translateY: -420},
                    ]
                  }}
                />
              </View>
            )
          }
        </ImageBackground>
      </View>
    );
  }
}
