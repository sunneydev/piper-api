import { env } from "env/server.mjs";
import { Rooms } from "../../lib/rooms";

declare global {
  var rooms: Rooms | undefined;
}

const rooms = global.rooms || new Rooms();
console.log("rooms", rooms);

if (env.NODE_ENV !== "production") {
  global.rooms = rooms;
}

export default rooms;
