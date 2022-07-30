import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Chat, Video, Header, Center } from "@components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Action, IRoomState, User } from "@lib/types";
import { io, Socket } from "socket.io-client";
import { Loading, Avatar } from "@nextui-org/react";
import useSocket from "hooks/useSocket";

const initialState: IRoomState = {
  id: "",
  users: [],
  messages: [],
  video: {
    url: "",
    paused: true,
    time: 0,
  },
  ownerId: "",
  loading: true,
};

const Room = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { roomId } = router.query;
  const [state, _dispatch] = useReducer(reducer, initialState);
  const socket = useSocket("/api/socketio");

  const commands = useMemo<{ [cmd in "pause" | "play" | "set"]: (args?: string[]) => Action }>(
    () => ({
      pause: () => ({
        type: "set-video",
        payload: {
          ...state.video,
          paused: true,
        },
      }),
      play: () => ({
        type: "set-video",
        payload: {
          ...state.video,
          paused: false,
        },
      }),
      set: (args) => ({
        type: "set-video",
        payload: {
          time: 0,
          paused: false,
          url: args ? args[0] || "" : "",
        },
      }),
    }),
    [state.video]
  );

  const dispatch = useCallback(
    (action: Action) => {
      _dispatch(action);
      socket?.emit("action", action);
    },
    [_dispatch, socket]
  );

  const dispatchCommand = useCallback(
    (fullCmd: string) => {
      const [command, ...args] = fullCmd.split(" ");
      const aliases: {
        [alias in keyof typeof commands]: string[];
      } = {
        pause: ["pause", "p", "pauw", "monopause", "pruw", "puwu", "mennopause", "menopause", "uwu"],
        play: ["play", "start", "daiwye", "pway", "meow", "owo"],
        set: ["set", "set-video", "set-video-url", "set-video-url-to", "set-video-url-to", "bruwu"],
      };

      if (!command) return;

      const cmd = Object.entries(aliases).find(([, value]) => value.includes(command))?.[0] as
        | keyof typeof commands
        | undefined;

      if (cmd) {
        const action = commands[cmd](args);
        dispatch(action);
        dispatch({ type: "cmd", payload: cmd });
      }
    },
    [commands, dispatch]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (message.startsWith("/")) {
        dispatchCommand(message.substring(1));
        message = message.split(" ")[0] || "";
      }

      dispatch({
        type: "add-message",
        payload: {
          authorId: user!.id!,
          author: user as User,
          content: message,
        },
      });
    },
    [dispatch, user, dispatchCommand]
  );

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on("connect", () => {
      socket.emit("join", { roomId, user });
      socket.on("action", _dispatch);
    });

    // return () => {
    //   socket.off("action");
    //   socket.off("connect");
    //   socket.removeAllListeners();
    //   socket.disconnect();
    // };
  }, [socket, roomId]);

  if (state.loading || router.isFallback) {
    return (
      <Center>
        <Loading size={"xl"} type="points" textColor="white" />
      </Center>
    );
  }

  return (
    <div className="flex flex-col">
      <Header>
        <Avatar.Group>
          {state.users.map((user) => (
            <Avatar key={user.id} src={user.image} size="xl" color={"gradient"} bordered />
          ))}
        </Avatar.Group>
      </Header>
      <div
        className="flex flex-col items-center md:flex-row "
        style={{
          height: "calc(100vh - 104px)",
        }}
      >
        <Video videoData={state.video} emitAction={dispatch} owner={state.ownerId === user!.id} />
        <Chat messages={state.messages} onMessageSubmit={sendMessage} />
      </div>
    </div>
  );
};

const reducer = (state: IRoomState, action: Action): IRoomState => {
  switch (action.type) {
    case "add-user":
    case "remove-user":
      return {
        ...state,
        users:
          action.type === "add-user"
            ? [...state.users, action.payload]
            : state.users.filter((user) => user.id !== action.payload.id),
      };
    case "add-message":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "set-video":
      return {
        ...state,
        video: action.payload,
      };
    case "room":
      return {
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default Room;
