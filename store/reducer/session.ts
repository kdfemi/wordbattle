import { SessionState, SessionActions, JOIN_SESSION, GENERATE_SESSION, CONNECTED_TO_SERVER, DISCONNECTED_TO_SERVER, RESET_SESSION } from "../types";

const initialState: SessionState = {
    inSession: false,
    userId: '',
    canGenerateWord: false,
    roomId: '',
    isConnectedToServer: false
}

export default (state = initialState, action: SessionActions): SessionState => {
    switch(action.type) {
        case JOIN_SESSION:
        case GENERATE_SESSION:
           return {
               ...state,
               ...action.payload 
            }
        case CONNECTED_TO_SERVER:
            return {
                ...state,
                isConnectedToServer: true
            }
        case DISCONNECTED_TO_SERVER:
            return state
        case RESET_SESSION:
            return initialState;
        default: 
        return state;
    }
}