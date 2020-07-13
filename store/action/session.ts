import { GENERATE_SESSION, JOIN_SESSION, AppThunk, SessionActions } from '../types';

const _generateSession = (): SessionActions => {
    return {type: GENERATE_SESSION};
};

export const generateSession = (): AppThunk<void>   => {
     return async (dispatch, actionState) => {
        dispatch(_generateSession());
    }
};

const _joinSession = (): SessionActions => {
    return {type: JOIN_SESSION};
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