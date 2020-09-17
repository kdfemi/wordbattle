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
import userStore from './store/reducer/user';

import MainNavigator from './navigation/MainNavigator';

import StartNavigator from './navigation/StartNavigator';
import AuthContext from './AuthContext';

import io from 'socket.io-client';
import { websocketLink } from './env';

// import {socket} from './socket';

const reducer = combineReducers({
  game: gameStore,
  session: sessionStore,
  user: userStore
});


export type RootState = ReturnType<typeof reducer>


const store = createStore(reducer, applyMiddleware(ReduxThunk))

const loadFont = () => {
  return Font.loadAsync({
    'egorycastle': require('./assets/fonts/EgorycastlePersonal.ttf'),
    'raleway-bold': require('./assets/fonts/Raleway-Medium.ttf'),
    'raleway-medium': require('./assets/fonts/Raleway-Bold.ttf'),
  });
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInSession, setIsInSession] = useState(false); // Switch navigator screen
  const[isConnectedToServer, setIsConnectedToServer] = useState(false); // check if websocket is connected
  const [socket, setSocket] = useState(io.connect(websocketLink, {autoConnect: false}));

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      setIsConnectedToServer(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server')
      setIsConnectedToServer(false);
    });

    socket.on('exception', function(data: any) {
      console.log('exception', data);
    });

    socket.on('connect_timeout', function(data: any) {
      console.log('Time out', data);
    });
    
    return () => {
      socket.removeListener('connect');
      socket.removeListener('disconnect');
      socket.removeListener('exception');
      socket.removeListener('connect_timeout');
    }
  }, [socket]);

  if(isLoading) {
    return <AppLoading startAsync={loadFont} onFinish={() => setIsLoading(false)}/>
  }
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthContext.Provider value={{setIsInSession, isConnectedToServer, socket}}>
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

