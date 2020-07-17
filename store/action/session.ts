import { GENERATE_SESSION, JOIN_SESSION, AppThunk, SessionActions } from '../types';

const _generateSession = (roomId: string, canGenerateWord: boolean, userId: string): SessionActions => {
    return {type: GENERATE_SESSION, payload: {canGenerateWord, roomId, userId}};
};

export const generateSession = (roomId: string, canGenerateWord: boolean, userId: string): AppThunk<void>   => {
     return async (dispatch, actionState) => {
        dispatch(_generateSession(roomId, canGenerateWord, userId));
    }
};

const _joinSession = (): SessionActions => {
    return {type: JOIN_SESSION, payload: null};
};

export const joinSession = (): AppThunk<void> => {
    return async (dispatch, actionState) => {
        return dispatch(_joinSession())
    };
};

export default {
    generateSession,
    joinSession
}