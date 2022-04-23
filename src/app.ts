import type { Action, User } from "./types";

import { Room, Rooms } from "./rooms";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";

const app = express();
const rooms = new Rooms();
const port: number = Number(process.env.PORT) || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  const dispatch = (room: Room, action: Action) => {
    room.update(action);
    socket.broadcast.to(room.id).emit("action", action);
  };

  let room: Room | undefined;
  let user: User | undefined;

  socket.on("join", (payload: { roomId: string; user: User }) => {
    const _room = rooms.getRoomById(payload.roomId);
    room = _room;

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return socket.disconnect();
    }

    if (payload.user) {
      user = payload.user;
    } else {
      socket.emit("error", { message: "No user provided" });
      return socket.disconnect();
    }

    dispatch(room, { type: "add-user", payload: user });
    socket.emit("action", {
      type: "room",
      payload: room,
    } as Action);
    socket.join(room.id);
  });

  socket.on("action", dispatch);

  socket.on(
    "disconnect",
    () =>
      room &&
      user &&
      dispatch(room, {
        type: "remove-user",
        payload: user,
      })
  );
});

app.get("/room/:roomId", (req, res) => {
  const roomId = req.params.roomId as string;
  const room = rooms.getRoomById(roomId);

  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  res.json({ success: true, room });
});

app.post("/room", (req, res) => res.json(rooms.createRoom(req.body.ownerId)));

server.listen(port, () => console.log(`Listening on port ${port} ✅`));
