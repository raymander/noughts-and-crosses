import React, { Component } from 'react';
import {StackNavigator} from 'react-navigation';
import { StyleSheet, Text, View, StatusBar, KeyboardAvoidingView, Keyboard, ImageBackground} from 'react-native';
import { FormLabel, FormInput, Button, Header} from 'react-native-elements';
import Toast, {DURATION} from 'react-native-easy-toast'
import {styles} from '../constants/styles.js'
import { firebaseAuth } from '../config';
import {db} from '../config'

class Login extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user:'',
    }
    this.itemsRef = db.ref('counters');
  }

  fetchCounters(email) {
    //user's personal instance's key
   this.itemsRef.on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      data.forEach(function(counters) {
        console.log(email,counters.val().value)
        if (counters.val().value === email) {
         console.log('gotcha', data.key)
         return data.key;
        }
       })
     })
   })
  }

  reload() {
    this.setState ({
      email: '',
      password: '',
      user: '',
    })
  }

  resetPassword = (event) => {
    event.preventDefault();

    const {email} = this.state;
    firebaseAuth().sendPasswordResetEmail(email).then(() => {
      Keyboard.dismiss();
      this.refs.toast.show('Password sent', 1000);
    }).catch(() => {
      Keyboard.dismiss();
      this.refs.toast.show('Email is incorrect, please try again', 1000);
    })
  }

  onLoginClick = (event) => {
    event.preventDefault();
    const { navigate } = this.props.navigation;
    const { email, password, redirect } = this.state;
    let user = ''
    firebaseAuth().signInWithEmailAndPassword(email, password)
      .then(async() => {
        // Redirect
        user = await this.fetchCounters(email);
        console.log(user)
        Keyboard.dismiss();
        this.refs.toast.show('Login successful', 600, () => {
          navigate('MainPage');
        });
      })
      .catch(() => {
        // No account found. Create a new one
        firebaseAuth().createUserWithEmailAndPassword(email, password)
          .then(() => {
            Keyboard.dismiss();
            const key = this.itemsRef.push([
              {title: 'Total games played: ', value: 0},
              {title: 'Total games won: ', value: 0},
              {title: 'Current streaks: ', value: 0},
              {title: 'Total ties: ', value: 0},
              {title:'Highscore streak: ', value: 0},
              {title: 'email', value: email}
            ]).getKey();
          })
            .then(async() => {
              user = await this.fetchCounters(email);
              console.log(user)
              this.refs.toast.show('New account created', 600, () => {
              navigate('MainPage');
              }
            )}
          )
          .catch(() => {
            Keyboard.dismiss();
            this.refs.toast.show('Email and password combination is incorrect! Please try again', 1000);
          })
      })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {

    return (
      <View style={styles.container}>
        <Toast ref="toast"/>
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
            <View style = {styles.loginform}>
              <FormLabel labelStyle = {styles.formlabel}>Email</FormLabel>
              <FormInput
                placeholder='Email'
                style={styles.forminput}
                placeholderTextColor={'#777'}
                inputStyle={{color:'#555'}}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                keyboardType='email-address'
              />
              <FormLabel labelStyle = {styles.formlabel}>Password</FormLabel>
              <FormInput
                placeholder='Password'
                style={styles.forminput}
                placeholderTextColor={'#777'}
                inputStyle={{color:'#555'}}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry={true}
                containerStyle = {{marginBottom: 15}}
              />

              <KeyboardAvoidingView
              behavior="padding"
              style={{width: '100%'}}
              >
                <Button
                onPress={this.onLoginClick}
                title="Submit"
                borderRadius = {6}
                fontSize = {16}
                />
                <FormLabel labelStyle = {styles.formlabel}>Forgot your password? </FormLabel>
                <Button
                onPress={this.resetPassword}
                title="Send my password"
                borderRadius = {6}
                fontSize = {16}
                />
              </KeyboardAvoidingView>
            </View>
        </ImageBackground>
      </View>
    );
  }
}

export default Login;
