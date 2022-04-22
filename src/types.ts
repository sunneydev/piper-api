export type Room = {
  id: string;
  users: User[];
  messages: Message[];
  ownerId: string;
  video: Video;
  update: (action: Action) => void;
};

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

export type RoomStateProperties = keyof Pick<
  Room,
  "messages" | "users" | "video"
>;

export type Action = {
  type: "ADD" | "REMOVE" | "SET";
  property: RoomStateProperties;
  payload: any;
};
