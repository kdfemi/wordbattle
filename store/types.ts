import { ThunkAction } from 'redux-thunk';
import { RootState } from 'App';
import { Action } from 'redux';
import { UserNames, GameScore } from '../constants/types';

export const SEND_WORD = 'SEND_WORD';
export const SHUFFLE_GAME = 'SHUFFLE_GAME';
export const SET_WORD = 'SET_WORD';
export const DROP_WORD = 'DROP_WORD';
export const RESET_WORD = 'RESET_WORD'


export const JOIN_SESSION = 'JOIN_SESSION';
export const GENERATE_SESSION = 'GENERATE_SESSION';
export const CONNECTED_TO_SERVER = 'CONNECTED_TO_SERVER';
export const DISCONNECTED_TO_SERVER = 'DISCONNECTED_TO_SERVER';
export const RESET_SESSION = 'RESET_SESSION'

export const UPDATE_SCORE = 'UPDATE_SCORE';
export const STORE_USER_ACTION = 'STORE_USER_SCORE';
export const RESET_USER = 'RESET_USER'

/* GAME WORD */

  interface SendWordAction {
    type: typeof SEND_WORD,
    words: any
  }

  interface ShuffleWordAction {
    type: typeof SHUFFLE_GAME,
    wordToShuffle: string[]
  }

  interface SetWordAction {
    type: typeof SET_WORD,
    letterToFill: string,
    letterIndex: number,
    index: number
  }

  interface DropWordAction {
    type: typeof DROP_WORD,
    letterToDrop: string,
    letterToDropIndex: number
  }

  interface ResetWordAction {
    type: typeof RESET_WORD
  }

export type GameActions = SendWordAction | ShuffleWordAction | SetWordAction | DropWordAction | ResetWordAction;

export interface GameState {
  word: string;
  scrambledWord: string[];
  fillingLetter: string[];
  canSetSpot: boolean[];
  gameLength: number;
  played: number
}


/* GAME SESSION */
interface JoinSessionAction {
  type: typeof JOIN_SESSION;
  payload: any
}

interface GenerateSessionAction {
    type: typeof GENERATE_SESSION;
    payload: {
      roomId: string,
      userId: string,
      canGenerateWord: boolean
    }
}

interface ConnectedToServerAction {
  type: typeof CONNECTED_TO_SERVER
  payload: any
}

interface DisConnectedToServerAction {
  type: typeof DISCONNECTED_TO_SERVER;
}

interface ResetSessionAction {
  type: typeof RESET_SESSION
}
export type SessionActions = JoinSessionAction | GenerateSessionAction | ConnectedToServerAction | DisConnectedToServerAction | ResetSessionAction

export interface SessionState {
  inSession: boolean,
  roomId: string,
  userId: string,
  canGenerateWord: boolean,
  isConnectedToServer: boolean
}

/* GAME USER And SCORE */
interface UpdateScoreAction {
  type: typeof UPDATE_SCORE;
  payload: GameScore
}

interface StoreUserAction {
  type: typeof STORE_USER_ACTION;
  payload:{
    usernames: UserNames;
    gameScores: GameScore;
  }
}

interface ResetUserAction {
  type: typeof RESET_USER
}


export interface UserState{
 [userId: string]: {
   score: string;
   username: string;
 }
}

export type UserActions = UpdateScoreAction | StoreUserAction | ResetUserAction;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>