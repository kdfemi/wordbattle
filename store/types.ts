import { ThunkAction } from 'redux-thunk';
import { RootState } from 'App';
import { Action } from 'redux';

export const SEND_WORD = 'SEND_WORD';
export const SHUFFLE_GAME = 'SHUFFLE_GAME';
export const SET_WORD = 'SET_WORD';
export const DROP_WORD = 'DROP_WORD';

export const JOIN_SESSION = 'JOIN_SESSION';
export const GENERATE_SESSION = 'GENERATE_SESSION';

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

export type GameActions = SendWordAction | ShuffleWordAction | SetWordAction | DropWordAction;


export interface GameState {
    word: string;
    scrambledWord: string[];
    fillingLetter: string[];
    canSetSpot: boolean[];
}

interface JoinSessionAction {
  type: typeof JOIN_SESSION
}

interface GenerateSessionAction {
    type: typeof GENERATE_SESSION
}

export type SessionActions = JoinSessionAction | GenerateSessionAction;

export interface SessionState {
    inSession: boolean,
    roomId: string,
    userId: string,
    canGenerateWord: boolean
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>