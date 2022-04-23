import { generateId } from "./utils";
import type { Video, IRoom, Action, Message, User } from "./types";

export class Room implements IRoom {
  id: string;
  users: User[];
  messages: Message[];
  ownerId: string;
  video: Video;
  actionMap: { [key: string]: (payload: any) => void };

  constructor(ownerId: string) {
    this.id = generateId();
    this.users = [];
    this.messages = [];
    this.ownerId = ownerId;
    this.video = { url: "", time: 0, paused: false };

    this.actionMap = {
      "add-user": this.addUser,
      "remove-user": this.removeUser,
      "add-message": this.addMessage,
      "set-video": this.setVideo,
    };
  }

  public update(action: Action): void {
    const handler = this.actionMap[action.type];
    handler && handler(action.payload);
  }

  public setVideo = (video: Video) => {
    this.video = video;
  };

  public addUser = (user: User) => {
    if (this.users.find((u) => u.id === user.id)) {
      return;
    }

    this.users.push(user);
  };

  public removeUser = (user: User) => {
    this.users = this.users.filter((u) => u.id !== user.id);
  };

  public addMessage = (message: Message) => {
    this.messages.push(message);
  };
}

export class Rooms {
  private rooms: Room[] = [];

  constructor() {
    this.rooms = [];
  }

  public getRoomById = (id: string): Room | undefined => {
    return this.rooms.find((room) => room.id === id);
  };

  public createRoom = (ownerId: string): Room => {
    const room = new Room(ownerId);
    this.rooms.push(room);
    return room;
  };

  public getRooms = (): Room[] => {
    return this.rooms;
  };

  public getRoomsByUser = (userId: string): Room[] => {
    return this.rooms.filter((room) => room.users.some((u) => u.id === userId));
  };

  public getRoomsByOwner = (ownerId: string): Room[] => {
    return this.rooms.filter((room) => room.ownerId === ownerId);
  };
}
