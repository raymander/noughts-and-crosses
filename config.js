import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBE6wNWo1ZjPJuJxr6KwmR6epJllh6llV4",
  authDomain: "my-project-1506251266323.firebaseapp.com",
  databaseURL: "https://my-project-1506251266323.firebaseio.com",
  storageBucket: "my-project-1506251266323.appspot.com",
  projectId: "my-project-1506251266323",
  messagingSenderId: "634776333215"
}

firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebase.auth;
export const db = firebase.database();
