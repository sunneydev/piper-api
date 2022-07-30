import type { NextApiRequest, NextApiResponse } from "next";
import rooms from "server/room/rooms";

const room = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    res.json(rooms.createRoom(ownerId));
  } else if (req.method === "GET") {
    const { roomId } = req.query;

    if (typeof roomId !== "string") {
      console.log(roomId);
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const room = rooms.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    res.json({ success: true, room });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
};

export default room;
