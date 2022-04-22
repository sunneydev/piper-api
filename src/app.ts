import cors from "cors";
import http from "http";
import Rooms from "./rooms";
import express from "express";
import { Server } from "socket.io";
import { Action, Room, User } from "./types";

const app = express();
const rooms = new Rooms();
const port: number = Number(process.env.PORT) || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const router = express.Router();

app.use(express.json());
app.use(cors());

router.use((req, res, next) =>
  req.headers.authorization === "sanibani@"
    ? next()
    : res.status(401).send("Unauthorized")
);

router.get("/rooms", (req, res) => res.json(rooms.getRooms()));

router.delete("/rooms/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  rooms.deleteRoom(roomId);
  res.sendStatus(200);
});

app.use("/admin", router);

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

    dispatch(room, { type: "ADD", property: "users", payload: user });
    socket.emit("room", room);
    socket.join(room.id);
  });

  socket.on("action", dispatch);

  socket.on(
    "disconnect",
    () =>
      room &&
      user &&
      dispatch(room, {
        type: "REMOVE",
        payload: user,
        property: "users",
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
