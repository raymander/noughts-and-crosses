import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Alert, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Toast, {DURATION} from 'react-native-easy-toast'

import Circle from './Circle'
import Cross from './Cross'
import Board from './Board'

import {CENTERS, SQUARES, WIN_CONDITIONS} from '../constants/game'
import {styles} from '../constants/styles'

export default class GameTwoPl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crossesMoves: [],
      circlesMoves: [],
      result: -1, // -1 = game is on, 0 = crosses win, 1 = circles win, 2 = tie
      dangerousCombinations: [], //in which crosses are likely to win
      dangerousCDraft: [], //needed to avoid duplicates in dangerousCombinations
      goodCombinations: [], //in which circles are likely to win
      goodCDraft: [],
      whoMoves: true, //determines whose turn is now (true - crosses, false - circles)
    }
  }

  componentDidMount() {
    this.refs.toast.show('NOTE: Statistics is not collected in two players mode', 1700);
  }

  componentDidUpdate(prevProps, prevState) {
    this.findWinner();
  }

  onCrossesMove(e) {
    {/* Here we determine which square is tapped upon and make an array of all player's moves */}
    const {locationX, locationY} = e.nativeEvent
    const {crossesMoves, circlesMoves} = this.state
    const square = SQUARES.find(d =>(
      locationX >= d.startX && locationX <= d.endX && locationY >= d.startY && locationY <= d.endY
    ))
    if (square && crossesMoves.concat(circlesMoves).every(d => d !== square.id)){
      this.setState({crossesMoves: crossesMoves.concat(square.id)})
      if (this.state.result === -1){
        this.setState({whoMoves: false})
      }
    }
  }

  onCirclesMove(e) {
    {/* Here we determine which square is tapped upon and make an array of all player's moves */}
    const {locationX, locationY} = e.nativeEvent
    const {crossesMoves, circlesMoves} = this.state
    const square = SQUARES.find(d =>(
      locationX >= d.startX && locationX <= d.endX && locationY >= d.startY && locationY <= d.endY
    ))
    if (square && crossesMoves.concat(circlesMoves).every(d => d !== square.id)){
      this.setState({circlesMoves: circlesMoves.concat(square.id)})
      if (this.state.result === -1){
        this.setState({whoMoves: true})
      }
    }
  }

  backToMain() {
    const {navigate} = this.props.navigation;
    navigate('MainPage');
  }

  restart() {
    this.setState ({
      crossesMoves: [],
      circlesMoves: [],
      result: -1,
      dangerousCombinations: [],
      dangerousCDraft: [],
      goodCombinations: [],
      goodCDraft: [],
      whoMoves: true
    })
  }

  //one of the win_conditions should be filled with either three player's or ai's moves
  isWinner(inputs) {
    return WIN_CONDITIONS.some(d => d.every(square => inputs.indexOf(square) !== -1))
  }

  mayWin(inputs) {
    for (var i = 0; i < WIN_CONDITIONS.length; i++) {
      for (var j = 0; j < inputs.length; j++) {
        if (WIN_CONDITIONS[i].indexOf(inputs[j]) !== -1) {
          for (var k = 0; k < inputs.length; k++) {
            if (k!==j && WIN_CONDITIONS[i].indexOf(inputs[k]) !== -1) {
                if (inputs == this.state.crossesMoves) {
                  if (!this.state.dangerousCDraft.includes(i)) {
                    this.setState(prevState => ({
                      dangerousCDraft: [...this.state.dangerousCDraft, i],
                      dangerousCombinations: [...this.state.dangerousCombinations, i]
                    }))
                  }
                }
                else {
                  if (!this.state.goodCDraft.includes(i)) {
                    this.setState(prevState => ({
                      goodCDraft: [...this.state.goodCDraft, i],
                      goodCombinations: [...this.state.goodCombinations, i]
                    }))
                  }
                }
              }
            }
          }
        }
      }
    }

  findWinner() {
    const {crossesMoves, circlesMoves, result} = this.state
    const allinputs = crossesMoves.concat(circlesMoves)

    if (allinputs.length >= 5) {
      let won = this.isWinner(crossesMoves)
      //here crosses wins
      if (won && result === -1) {
        this.setState({
          result: 0,
        })
        Vibration.vibrate(1000)
        Alert.alert(
          'Crosses win!',
          'Play again?',
          [
            {text: 'Yes!', onPress: () => this.restart()},
            {text: 'No', onPress: () => this.backToMain()},
          ],
          { cancelable: false }
        )
      }
      won = this.isWinner(circlesMoves)
      if (won && result === -1) {
        this.setState({
          result: 1,
        })
        Vibration.vibrate(1000)
        setTimeout(() => Alert.alert(
          'Circles win!',
          'Play again?',
          [
            {text: 'Yes!', onPress: () => this.restart()},
            {text: 'No', onPress: () => this.backToMain()},
          ],
          { cancelable: false }
        ), 100
       )
      }
    }

    if (allinputs.length === 9 && this.state.result === -1) {
          this.setState({
            result: 2,
           })
          Vibration.vibrate(1000)
          Alert.alert(
            'Nobody wins!',
            'Play again?',
            [
              {text: 'Yes!', onPress: () => this.restart()},
              {text: 'No', onPress: () => this.backToMain()},
            ],
            { cancelable: false }
          )
    }
  }

  render() {
    const {crossesMoves, circlesMoves, whoMoves} = this.state
    return (
      <View style={styles.container}>
        <Toast
          ref="toast"
          style={{backgroundColor:'yellow'}}
          opacity={0.8}
          textStyle={{color:'black', fontSize: 16, fontFamily: 'monospace'}}
          position='bottom'
          positionValue={200}
        />
      {
        whoMoves ? (
        <TouchableWithoutFeedback onPress={(e) => this.onCrossesMove(e)}>
          <View style={styles.board}>
            <Board />
            {
              crossesMoves.map((d, i) => (
                <Cross
                  key = {i}
                  xTranslate={CENTERS[d].x}
                  yTranslate={CENTERS[d].y}
                />
              ))
            }
            {
              circlesMoves.map((d, i) => (
                <Circle
                  key = {i}
                  xTranslate={CENTERS[d].x}
                  yTranslate={CENTERS[d].y}
                />
              ))
            }
          </View>
      </TouchableWithoutFeedback>
        ) : (
      <TouchableWithoutFeedback onPress={(e) => this.onCirclesMove(e)}>
        <View style={styles.board}>
          <Board />
          {
            crossesMoves.map((d, i) => (
              <Cross
                key = {i}
                xTranslate={CENTERS[d].x}
                yTranslate={CENTERS[d].y}
              />
            ))
          }
          {
            circlesMoves.map((d, i) => (
              <Circle
                key = {i}
                xTranslate={CENTERS[d].x}
                yTranslate={CENTERS[d].y}
              />
            ))
          }
        </View>
    </TouchableWithoutFeedback>
        )
      }

      </View>
    );
  }
}
