import React, {useState, useEffect} from 'react';
import {combineReducers, applyMiddleware, createStore} from 'redux'
import ReduxThunk from 'redux-thunk';
import {Provider, useSelector} from 'react-redux';
import {AppLoading} from 'expo';
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import gameStore from './store/reducer/game';
import sessionStore from './store/reducer/session';

import MainNavigator from './navigation/MainNavigator';

import StartNavigator from './navigation/StartNavigator';
import AuthContext from './AuthContext';

import {socket} from './socket';

const reducer = combineReducers({
  game: gameStore,
  session: sessionStore
});


export type RootState = ReturnType<typeof reducer>


const store = createStore(reducer, applyMiddleware(ReduxThunk))

const loadFont = () => {
  return Font.loadAsync({
  'egorycastle': require('./assets/fonts/EgorycastlePersonal.ttf')
  });
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInSession, setIsInSession] = useState(false); // Switch navigator screen
  const[isConnectedToServer, setIsConnectedToServer] = useState(false); // check if websocket is connected

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server')
      setIsConnectedToServer(true);
    });
    socket.on('disconnect', () => {
      console.log('disconnected to server')
      setIsConnectedToServer(false);
    })

    socket.on('exception', function(data: any) {
      console.log('exception', data);
    });

    socket.on('connect_timeout', function(data: any) {
      console.log('Time out', data);
    });
    console.log('Started')
  }, []);

  if(isLoading) {
    return <AppLoading startAsync={loadFont} onFinish={() => setIsLoading(false)}/>
  }
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthContext.Provider value={{setIsInSession, isConnectedToServer}}>
          {
            isInSession?
            <MainNavigator />:
            <StartNavigator/>
          }
        </AuthContext.Provider>
      </NavigationContainer>
    </Provider>
  );
}

