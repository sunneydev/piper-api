import { useState, useEffect } from "react";
import { io, type Socket } from "socket.io-client";

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    fetch(url).finally(() => {
      const socketio = io();
      socketio.on("connect", () => {
        console.log("connect");
        socketio.emit("hello");
      });
      socketio.on("disconnect", () => {
        console.log("disconnect");
      });
      setSocket(socketio);
    });
    function cleanup() {
      socket?.disconnect();
    }
    return cleanup;
  }, []);
  return socket;
};

export default useSocket;
