import { Room, Action } from "./types";
import { generateId } from "./utils";

class Rooms {
  private _rooms: { [id: string]: Room } = {};

  public getRooms = (): Room[] => {
    return Object.values(this._rooms);
  };

  public getRoomById(id: string): Room | undefined {
    return this._rooms[id];
  }

  public deleteRoom(roomId: string) {
    delete this._rooms[roomId];
  }

  public createRoom(ownerId: string): Room {
    const roomId = generateId();
    const room = {
      id: roomId,
      ownerId,
      users: [],
      messages: [],
      video: {
        url: "",
        time: 0,
        paused: false,
      },
      update: (action: Action) => this._updateRoom(roomId, action),
    };

    this._rooms[roomId] = room;

    return room;
  }

  private _updateRoom(roomId: string, action: Action): boolean {
    const room = this.getRoomById(roomId);

    if (!room) {
      return false;
    }

    switch (action.type) {
      case "ADD":
        if (
          action.property === "users" &&
          this._rooms[roomId][action.property].find(
            (item) => item.id === action.payload.id
          )
        ) {
          return false;
        }

        (this._rooms[roomId][action.property] as any[]).push(action.payload);
        break;
      case "REMOVE":
        console.log(`Removed ${action.payload} from ${action.property}`);

        (this._rooms[roomId][action.property] as any[]) = (
          this._rooms[roomId][action.property] as any[]
        ).filter((e) => e !== action.payload);
        break;
      case "SET":
        this._rooms[roomId][action.property] = action.payload;
        break;
    }

    return true;
  }
}

export default Rooms;
