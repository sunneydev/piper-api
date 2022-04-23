export interface IRoom {
  id: string;
  users: User[];
  messages: Message[];
  ownerId: string;
  video: Video;
}

export interface Video {
  url: string;
  time: number;
  paused: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  content: string;
  author: User;
}

export type Action =
  | {
      type: "add-user" | "remove-user";
      payload: User;
    }
  | {
      type: "add-message";
      payload: Message;
    }
  | {
      type: "set-video";
      payload: Video;
    }
  | {
      type: "room";
      payload: IRoom;
    };