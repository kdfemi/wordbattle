import { GameActions, GameState, SEND_WORD, SHUFFLE_GAME, SET_WORD, DROP_WORD } from '../types'

const initialState: GameState = {
    word: '',
    fillingLetter: [],
    scrambledWord: [],
    canSetSpot: []
}

export default (state = initialState, action: GameActions): GameState => {
    switch(action.type) {
        case SEND_WORD:
            return {
                ...action.words,
            }
        case SHUFFLE_GAME:
            return{
                ...state,
                scrambledWord: action.wordToShuffle
            }
        case SET_WORD:
            state.fillingLetter[action.index] = action.letterToFill;
            state.scrambledWord[action.letterIndex] = '';
            return {
                ...state
            }
        case DROP_WORD:
            const indexToFill = state.scrambledWord.findIndex(letter => letter.length <= 0 );
            state.fillingLetter[action.letterToDropIndex] = '';
            state.scrambledWord[indexToFill] = action.letterToDrop;
            return{
                ...state
            }
        default: 
            return state;

    }
}