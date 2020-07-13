import io from 'socket.io-client';

export const socket = io.connect("10.152.2.77/3000");