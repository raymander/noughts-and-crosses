import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ImageBackground, Alert } from 'react-native';
import { Header, Button } from 'react-native-elements';
import {StackNavigator} from 'react-navigation';

import GameVsAI from './GameVsAI';
import GameTwoPl from './GameTwoPl';

import {styles} from '../constants/styles.js'
import {db} from '../config'

export default class GamePage extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    title: 'Game started!',
    headerStyle: {backgroundColor:'firebrick'},
    headerTitleStyle:{ color: '#fff', fontSize: 20, marginLeft: 60},
    headerLeft: <Button
                    title='GO BACK'
                    onPress={()=>{ navigation.navigate('MainPage'); }}
                    buttonStyle={{
                      backgroundColor: '#811818',
                      borderRadius: 7,
                    }}
                    containerStyle={{ marginLeft: 10}}
                  />,
  });

  constructor(props) {
    super(props);
    this.state = {
      twoPlayers: false,
      stats: []
    }
    const user = '-LBoyqJmLMtbQQ5slfiC'
    this.itemsRef = db.ref('counters/'+ user);
  }

  componentDidMount() {
    Alert.alert(
      'Game mode',
      'Choose how you want to play:',
      [
        {text: 'One player', onPress: () => this.setState({
          twoPlayers: false,
          })
        },
        {text: 'Two players', onPress: () => this.setState({
          twoPlayers: true,
          })
        },
      ],
      { cancelable: false }
    )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
          <StatusBar hidden={true} />
          <ImageBackground
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
            source={require('../assets/pictures/backgr1.png')}
          >
          {
            this.state.twoPlayers ? (
            <GameTwoPl navigation={this.props.navigation}/>
            ) : ( <GameVsAI
                    navigation={this.props.navigation}/> )
          }
          </ImageBackground>
      </View>
    );
  }
}
