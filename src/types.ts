export interface IRoom {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
  ownerId: string;
  video: Video;
  update: (action: Action) => void;
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
  authorId: string;
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