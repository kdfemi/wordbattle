export interface RoomDetails {
    roomId: string;
    canGenerateWord: boolean;
    userId: string
}

export interface CreateGameBody {
    username: string;
    maxLength: number
}