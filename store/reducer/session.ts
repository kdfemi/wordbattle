import { SessionState, SessionActions, JOIN_SESSION, GENERATE_SESSION } from "../types";

const initialState: SessionState = {
    inSession: false,
    userId: '',
    canGenerateWord: false,
    roomId: ''

}

export default (state = initialState, action: SessionActions) => {
    switch(action.type) {
        case JOIN_SESSION:
        case GENERATE_SESSION:
        default: 
        return state;
    }
}