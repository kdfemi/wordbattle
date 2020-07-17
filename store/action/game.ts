import { SEND_WORD, AppThunk, GameActions, SHUFFLE_GAME, SET_WORD, DROP_WORD, GameState } from '../types';

const _sendWord = (words: GameState): GameActions => {   
    return {
      type: SEND_WORD,
      words
    }
}

export const sendWord =  (data: any):AppThunk<void> => {
    return async (dispatch, state) => {
        try {
            const tempArray: boolean[] = [];
            data.fillingLetter.forEach((letter: string, index: number) => {
                if(letter.length > 0) {
                    tempArray[index] = false;
                } else {
                    tempArray[index] = true;
                }
            });
            const gameDate = data as GameState
            gameDate.canSetSpot = tempArray;
            dispatch(_sendWord(data));
        } catch (err) {
            if(err) {
                throw new Error(err);
            }
            throw new Error('Something went wrong try again');
        }
    }
}

export const shuffleAction = (word: string[]): GameActions => {
    for (let i = word.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [word[i], word[j]] = [word[j], word[i]];
    }
    return {type: SHUFFLE_GAME, wordToShuffle: word}
    
}

export const setWordAction = (letter: string, letterIndex: number, index: number): GameActions => {
    return {type: SET_WORD, letterToFill: letter, letterIndex, index}
}

export const dropWordAction = (letterToDrop: string, letterToDropIndex: number,): GameActions => {
    return {type: DROP_WORD, letterToDrop: letterToDrop, letterToDropIndex}
}