import socketio from "socket.io-client";
import React from "react";

const SOCKET_URL = "localhost:5000";

export const socket = socketio.connect(SOCKET_URL, {
  transports: ["websocket"],
});
export const SocketContext = React.createContext();
