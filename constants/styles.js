import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  board: {
    width: 312,
    height: 312,
    marginTop: 80,
    borderWidth: 7,
    borderColor: '#777',
    backgroundColor: '#fff'
  },
  lines: {
    position:'absolute',
    backgroundColor: '#777',
  },
  crosscircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    alignItems:'center',
  },
  welcome: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 27,
    fontFamily: 'monospace'
  },
  menu: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 25,
    color: '#555'
  },
  stats: {
    marginTop: 40,
    fontSize: 20,
  },
  loginform: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 15,
  },
  formlabel: {
    color: '#555',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  backgroundImage:{
    backgroundColor: '#fff',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    opacity: .4
  },
  forminput: {
     width: 200,
     borderColor: 'gray',
     borderWidth: 1,
  },
  flatlist: {
    width: '85%',
    backgroundColor: '#eee',
    opacity: .6,
    marginTop: 30,
    borderRadius: 8
  },
});
