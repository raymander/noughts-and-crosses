import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Alert, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as firebase from 'firebase';

import Circle from './Circle'
import Cross from './Cross'
import Board from './Board'

import {CENTERS, SQUARES, WIN_CONDITIONS} from '../constants/game'
import {styles} from '../constants/styles'
import {db} from '../config'

export default class GameVsAI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerMoves: [],
      aiMoves: [],
      result: -1, // -1 = game is on, 0 = player wins, 1 = AI wins, 2 = tie
      dangerousCombinations: [], //ai determines in which combinations player is going to win
      dangerousCDraft: [], //needed to avoid duplicates in dangerousCombinations
      goodCombinations: [], //'good' for ai
      goodCDraft: [],
      counters: [],
    }
    const user = '-LBoyqJmLMtbQQ5slfiC'
    this.itemsRef = db.ref('counters/'+ user);
  }

  componentDidMount() {
    this.fetchCounters();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.counters.length === 0) {
      this.fetchCounters();
    }
  }

  fetchCounters() {
    this.itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          title: child.val().title,
          value: child.val().value,
        });
      });
      this.setState({counters: items });
    });

  }

  updateItem(key) {
    let counter = this.state.counters[key].value
    this.itemsRef.update({
      [key]:{
      ...this.state.counters[key],
      value: counter + 1
      }
    })
  }

  nullItem(key) {
    this.itemsRef.update({
      [key]:{
      ...this.state.counters[key],
      value: 0
      }
    })
  }

  maxStreak() {
    let maxStreak = this.state.counters[4].value
    let streak = this.state.counters[2].value
    if (maxStreak < streak) {
      this.itemsRef.update({
        [4]:{
        ...this.state.counters[4],
        value: streak
        }
      })
    }
  }

  onPlayerMove(e) {
    {/* Here we determine which square is tapped upon and make an array of all player's moves */}
    const {locationX, locationY} = e.nativeEvent
    const {playerMoves, aiMoves} = this.state
    const square = SQUARES.find(d =>(
      locationX >= d.startX && locationX <= d.endX && locationY >= d.startY && locationY <= d.endY
    ))
    if (square && playerMoves.concat(aiMoves).every(d => d !== square.id)){
      this.setState({playerMoves: playerMoves.concat(square.id) })
      this.findWinner()
      if (this.state.result === -1){
        setTimeout(() => this.onAIMove(), 10)
      }
    }
  }

  executeRandom() {
       const {playerMoves, aiMoves} = this.state
       const allinputs = playerMoves.concat(aiMoves)
       while (allinputs.length < 9) {
         const rand = Number.parseInt(Math.random()*9)
         if (allinputs.every(d => d !== rand)) {
           this.setState({aiMoves: aiMoves.concat(rand) })
           break
       }
     }
   }

   makeMove (combinations) {
     const rand = Number.parseInt(Math.random()*combinations.length)
     const {playerMoves, aiMoves} = this.state
     const allinputs = playerMoves.concat(aiMoves)
     const chosenComb = WIN_CONDITIONS[combinations[rand]]
     console.log('chose ' + chosenComb)
     while (true) {
        const findEmpty = Number.parseInt(Math.random()*3)
        console.log(findEmpty)
        if (allinputs.every(d => d !== chosenComb[0]) ||
           allinputs.every(d => d !== chosenComb[1]) ||
           allinputs.every(d => d !== chosenComb[2])) {
          console.log('going to first if')
          if (allinputs.every(d => d !== chosenComb[findEmpty]))
           {
            this.setState({
              aiMoves: aiMoves.concat(chosenComb[findEmpty]),
              dangerousCombinations: [],
            })
            break
          }
       }
       else {
         console.log('going to random')
         this.executeRandom();
         break
       }
     }
   }

  onAIMove() {
    console.log('ai started')
    const {playerMoves, aiMoves} = this.state
    //console.log(dangerousCombinations)
    this.mayWin(playerMoves);
    this.mayWin(aiMoves);

    if (this.state.goodCombinations.length > 0) {
      this.makeMove(this.state.goodCombinations)
      this.setState({
        goodCombinations: [],
      })
    }
    //if there are several dangerous combinations, we choose one of them randomly
    else if (this.state.dangerousCombinations.length > 0) {
      this.makeMove(this.state.dangerousCombinations)
      this.setState({
        dangerousCombinations: [],
      })
    }
    //nothing dangerous here, just random move
    else {
      this.executeRandom();
    }
    if (this.state.result === -1) {this.findWinner();}
    console.log('done')
    return
  }

  backToMain() {
    const {navigate} = this.props.navigation;
    this.updateItem(0);
    this.maxStreak();
    navigate('MainPage');
  }

  restart() {
    this.updateItem(0);
    this.maxStreak();
    this.setState ({
      playerMoves: [],
      aiMoves: [],
      result: -1,
      dangerousCombinations: [],
      dangerousCDraft: [],
      goodCombinations: [],
      goodCDraft: [],
      counters: [],
    })
  }

  //one of the win_conditions should be filled with either three player's or ai's moves
  isWinner(inputs) {
    return WIN_CONDITIONS.some(d => d.every(square => inputs.indexOf(square) !== -1))
  }

  //this function checks if the situation is dangerous for AI and sets an array of
  // combinations in which player may win
  mayWin(inputs) {
    for (var i = 0; i < WIN_CONDITIONS.length; i++) {
      for (var j = 0; j < inputs.length; j++) {
        if (WIN_CONDITIONS[i].indexOf(inputs[j]) !== -1) {
          for (var k = 0; k < inputs.length; k++) {
            if (k!==j && WIN_CONDITIONS[i].indexOf(inputs[k]) !== -1) {
                if (inputs == this.state.playerMoves) {
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
    const {playerMoves, aiMoves, result} = this.state
    const allinputs = playerMoves.concat(aiMoves)

    if (allinputs.length >= 5) {
      let won = this.isWinner(playerMoves)
      //here player wins
      if (won && result === -1) {
        this.setState({
          result: 0,
        })
        this.updateItem(1);
        this.updateItem(2);
        Vibration.vibrate(1000)
        Alert.alert(
          'You win!',
          'Play again?',
          [
            {text: 'Yes!', onPress: () => this.restart()},
            {text: 'No', onPress: () => this.backToMain()},
          ],
          { cancelable: false }
        )
      }
      won = this.isWinner(aiMoves)
      if (won && result === -1) {
        this.setState({
          result: 1,
        })
        this.nullItem(2);
        Vibration.vibrate(1000)
        setTimeout(() => Alert.alert(
          'Oops! You lost!',
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
          this.nullItem(2);
          this.updateItem(3);
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
    const {playerMoves, aiMoves} = this.state
    return (
      <View style={styles.container}>
      <TouchableWithoutFeedback onPress={(e) => this.onPlayerMove(e)}>
          <View style={styles.board}>
            <Board />
            {
              playerMoves.map((d, i) => (
                <Cross
                  key = {i}
                  xTranslate={CENTERS[d].x}
                  yTranslate={CENTERS[d].y}
                />
              ))
            }
            {
              aiMoves.map((d, i) => (
                <Circle
                  key = {i}
                  xTranslate={CENTERS[d].x}
                  yTranslate={CENTERS[d].y}
                />
              ))
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
