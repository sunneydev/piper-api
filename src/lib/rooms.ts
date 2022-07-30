import type { IVideo, IRoom, Action, IMessage, User } from "./types";

// generate a room id in xxx-xxx where x is a letter or a number
export function generateRoomId(): string {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const id = [];
    for (let i = 0; i < 6; i++) {
        id.push(letters[Math.floor(Math.random() * letters.length)]);
        if (i === 2) {
            id.push("-");
        }
    }
    return id.join("");
}


export class Room implements IRoom {
    id: string;
    ownerId: string;
    users: User[];
    messages: IMessage[];
    video: IVideo;
    actionMap: { [key: string]: (payload: any) => void };

    constructor(ownerId: string) {
        this.id = generateRoomId();
        this.users = [];
        this.messages = [];
        this.ownerId = ownerId;
        this.video = { url: "", time: 0, paused: false };

        this.actionMap = {
            "add-user": this.addUser,
            "remove-user": this.removeUser,
            "add-message": this.addMessage,
            "set-video": this.setVideo,
            "cmd": this.handleCmd,
        };
    }

    public update(action: Action): void {
        const handler = this.actionMap[action.type];
        handler && handler(action.payload);
    }

    public setVideo = (video: IVideo) => {
        this.video = video;
    };

    public isUserInRoom = (userId: string): boolean => {
        return this.users.some((user) => user.id === userId);
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

    public addMessage = (message: IMessage) => {
        this.messages.push(message);
    };

    public handleCmd = (payload: string) => {
        const commandMessages: {
            [key: string]: string;
        } = {
            "pause": "video is paused sir",
            "play": "video is playing sir",
            "set": "video is set sir",
        }

        this.addMessage({
            author: {
                image: "https://i1.sndcdn.com/artworks-sUZuSm54AvHM5DzC-sRJf4A-t500x500.jpg",
                id: "6969",
                name: "ChadBot",
            },
            authorId: "6969",
            content: commandMessages[payload]!,
        });
    }
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
