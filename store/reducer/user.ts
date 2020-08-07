import {UserState, UserActions, UPDATE_SCORE, STORE_USER_ACTION, RESET_WORD, RESET_USER } from "../types";

const initialState: UserState = {

}

export default (state = initialState, action: UserActions): UserState => {
    switch(action.type) {
        case UPDATE_SCORE:
            // state[]
            const pl1gameScoresUpdate = action.payload.pl1;
            const pl2gameScoresUpdate = action.payload.pl2;
            state[pl1gameScoresUpdate.userId].score = pl1gameScoresUpdate.score+""
            state[pl2gameScoresUpdate.userId].score = pl2gameScoresUpdate.score+""
            return {
                ...state,
            }
            case STORE_USER_ACTION:
                const pl1UsernameStore = action.payload.usernames.pl1Username;
                const pl2UsernameStore = action.payload.usernames.pl2Username;
                const pl1gameScoresStore = action.payload.gameScores.pl1;
                const pl2gameScoresStore = action.payload.gameScores.pl2;
                state[pl1UsernameStore.userId] = { username: pl1UsernameStore.username, score: ""+pl1gameScoresStore.score}
                state[pl2UsernameStore.userId] = { username: pl2UsernameStore.username, score: ""+pl2gameScoresStore.score}
            return {
                ...state
            }
            case RESET_USER:
                return {};
        default: 
        return state;
    }
}