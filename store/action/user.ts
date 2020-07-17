import {  AppThunk, UserActions } from '../types';
import { UserNames, GameScore } from 'constants/types';

const _storeUser = (usernames: UserNames, gameScores: GameScore): UserActions => {   
    return {
      type: "STORE_USER_SCORE",
      payload: {
          usernames,
          gameScores
      }
    }
}

export const storeUser =  (usernames: UserNames, gameScores: GameScore):AppThunk<void> => {
    return async (dispatch, state) => {
        dispatch(_storeUser(usernames, gameScores))
    }
}