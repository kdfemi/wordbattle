export interface RoomDetails {
    roomId: string;
    canGenerateWord: boolean;
    userId: string
}

export interface CreateGameBody {
    username: string;
    maxLength: number
}

export interface JoinGameBody {
    roomId: string;
    username: string;
}

export interface GameScore {
    pl1: {userId: string, score: number};
    pl2: {userId: string, score: number};
}

export interface UserNames {
    pl1Username: {userId: string, username: string};
    pl2Username: {userId: string, username: string};
}

export interface leaveGameBody {
    roomId: string;
    userId: string;
}

export interface Winner  {
    score: number;
    userId: string;
}