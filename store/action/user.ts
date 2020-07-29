import {  AppThunk, UserActions, STORE_USER_ACTION, UPDATE_SCORE, RESET_USER } from '../types';
import { UserNames, GameScore } from 'constants/types';

const _storeUser = (usernames: UserNames, gameScores: GameScore): UserActions => {   
    return {
      type: STORE_USER_ACTION,
      payload: {
          usernames,
          gameScores
      }
    }
}

const _updateScore = ( gameScores: GameScore): UserActions => {   
    return {
      type: UPDATE_SCORE,
      payload: gameScores
    }
}

export const storeUser =  (usernames: UserNames, gameScores: GameScore):AppThunk<void> => {
    return async (dispatch, state) => {
        dispatch(_storeUser(usernames, gameScores))
    }
}

export const updateScores = (scores: GameScore):AppThunk<void> => {
    return async (dispatch, state) => {
        dispatch(_updateScore(scores))
    }
}

export const resetScores = (): UserActions => {   
    return {
      type: RESET_USER
    }
}
