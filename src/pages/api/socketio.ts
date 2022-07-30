import { Room } from "@lib/rooms";
import { Action, User } from "@lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";
import rooms from "server/room/rooms";

const handleSocket = (socket: Socket) => {
  let room: Room | undefined;
  let user: User | undefined;

  socket.on("join", (payload: { roomId: string; user: User }) => {
    room = rooms.getRoomById(payload.roomId);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return socket.disconnect();
    }

    if (payload.user) {
      if (room.isUserInRoom(payload.user.id)) {
        socket.emit("error", { message: "User already in room" });
        return socket.disconnect();
      }

      user = payload.user;
    } else {
      socket.emit("error", { message: "No user provided" });
      return socket.disconnect();
    }

    dispatch(socket, room, { type: "add-user", payload: user });
    socket.emit("action", {
      type: "room",
      payload: room,
    } as Action);
    socket.join(room.id);
  });

  socket.on("action", (action: Action) => dispatch(socket, room, action));

  socket.on("disconnect", () => {
    if (!room || !user) return;

    dispatch(socket, room, {
      type: "remove-user",
      payload: user,
    });

    if (room.ownerId === user?.id) {
      dispatch(socket, room, {
        type: "set-video",
        payload: { ...room?.video, paused: true },
      });
    }
  });
};

const dispatch = (socket: Socket, room: Room | undefined, action: Action) => {
  if (!room) {
    console.error("Room not found");
    return;
  }

  room.update(action);

  if (action.type === "cmd") {
    const commandMessages: {
      [key: string]: string;
    } = {
      pause: "video is paused sir",
      play: "video is playing sir",
      set: "video is set sir",
    };
    action = {
      type: "add-message",
      payload: {
        author: {
          image: "https://i1.sndcdn.com/artworks-sUZuSm54AvHM5DzC-sRJf4A-t500x500.jpg",
          id: "6969",
          name: "ChadBot",
        },
        authorId: "6969",
        content: commandMessages[action.payload]!,
      },
    };
  }

  socket.broadcast.to(room.id).emit("action", action);
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    
    // @ts-ignore
    const io = new Server(res.socket.server);
    
    // @ts-ignore
    res.socket.server.io = io;

    io.on("connection", handleSocket);
  }
  res.end();
};

export default SocketHandler;
