import type { Action, User } from "./types";
import { Room, Rooms } from "./rooms";
import { Server, Socket } from "socket.io";
import { search } from "./imovies";
import express from "express";
import cors from "cors";
import http from "http";

const app = express();
const rooms = new Rooms();
const port = Number(process.env.PORT) || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

const chad: User = {
  avatar: "https://i1.sndcdn.com/artworks-sUZuSm54AvHM5DzC-sRJf4A-t500x500.jpg",
  id: "6969",
  name: "ChadBot",
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
      pause: "video is paused",
      play: "video is playing",
      set: "video is set",
      seek: "ok",
    };
    action = {
      type: "add-message",
      payload: {
        author: chad,
        authorId: chad.id,
        content: commandMessages[action.payload]!,
      },
    };
  }

  socket.broadcast.to(room.id).emit("action", action);
};

io.on("connection", (socket) => {
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
});

app.get("/room/:roomId", (req, res) => {
  const roomId = req.params.roomId as string;
  const room = rooms.getRoomById(roomId);

  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  res.json({ success: true, room });
});

app.post("/room", (req, res) => {
  const { ownerId } = req.body;

  if (!ownerId) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  res.json(rooms.createRoom(ownerId));
});

const cache = new Map<string, any>();

app.get("/search", async (req, res) => {
  const { q } = req.query;

  const query = q;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  if (cache.has(query)) {
    return res.json(cache.get(query));
  }

  const results = await search(query);

  const processed = results.map((result) => ({
    id: result.id,
    type: result.isTvShow ? "series" : "movie",
    name: result.secondaryName,
    languages: result.languages.data.map((language) => language.code),
    poster: result.posters?.data["400"],
    imdb: result.rating.imdb.score,
    year: result.year,
  }));

  cache.set(query, processed);

  res.json(processed);
});

server.listen(port, () => console.log(`Listening on port ${port} ✅`));
