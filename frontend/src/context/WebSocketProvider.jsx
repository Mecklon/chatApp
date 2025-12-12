// remember to refactor this file to provide only the client other dynamic functionaly should be better off in a redux store
import { useWebSocket } from "../hooks/useWebSocket";
import { useDispatch, useSelector } from "react-redux";
import useGetFetch from "../hooks/useGetFetch";
import {
  addConnection,
  addGroup,
  addRequest,
  deleteGroup,
  incrementGroupUnseen,
  incrementUnseen,
  setActivityStatus,
  updateLatestGroupMessage,
  updateLatestMessage,
} from "../store/slices/connectionsSlice";
import { addNotification } from "../store/slices/notificationsSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import { createContext, useEffect, useRef, useState } from "react";
import {
  addGroupMessage,
  addReceivedMessage,
  closeDeletedChat,
  sendGroupReceived,
  sendGroupSeen,
  setChatActivityStatus,
  setPendingZero,
  setReachedZero,
  updateGroupMaxValues,
} from "../store/slices/chatSlice";
import { AiOutlineConsoleSql } from "react-icons/ai";

export const websocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  const ws = useWebSocket(localStorage.getItem("JwtToken"));

  const clientRef = useRef(null);
  if (!clientRef.current) {
    clientRef.current = ws; // stable forever
  }
  const [wsConnected, setWsConnected] = useState(false);

  const { fetch } = useGetFetch();

  const { setUnseenNotifications, setUnseenRequests } = useAuthContext();

  const chatInfoRef = useRef(null);
  const chatInfo = useSelector((store) => store.chat);

  const { connectionSet, groupSet } = useSelector((store) => store.connection);
  useEffect(() => {
    chatInfoRef.current = chatInfo;
  }, [chatInfo]);

  const { username } = useAuthContext();
  const usernameRef = useRef(username);
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    let client = clientRef.current;
    client.onConnect = () => {
      console.log("Websocket connected");
      setWsConnected(true);

      client.subscribe("/user/queue/request", (payload) => {
        const request = JSON.parse(payload.body);
        dispatch(addRequest(request));
        setUnseenRequests((prev) => prev + 1);
      });
      client.subscribe("/user/queue/notification", (payload) => {
        const notification = JSON.parse(payload.body);
        setUnseenNotifications((prev) => prev + 1);
        dispatch(addNotification(notification));
      });
      client.subscribe("/user/queue/requestAccepted", (payload) => {
        const body = JSON.parse(payload.body);
        const { notification, contact } = body;
        setUnseenNotifications((prev) => prev + 1);
        dispatch(addNotification(notification));
        dispatch(addConnection(contact));
      });
      client.subscribe("/user/queue/receivedMessage", (payload) => {
        const body = JSON.parse(payload.body);
        dispatch(
          updateLatestMessage({
            content: body.content,
            sender: body.username,
            time: body.time,
            contact: body.username,
          })
        );
        if (
          chatInfoRef.current.id &&
          chatInfoRef.current.isPrivate &&
          chatInfoRef.current.userInfo.name === body.username
        ) {
          dispatch(addReceivedMessage(body));
          client.publish({
            destination: "/app/chat/receivedMessage",
            body: JSON.stringify({ sender: body.username }),
          });
        } else {
          dispatch(incrementUnseen(body.username));
          fetch("/incrementUnseen/" + body.username);
        }
      });
      client.subscribe("/user/queue/reached", (payload) => {
        const friendName = payload.body;
        dispatch(setReachedZero(friendName));
      });
      client.subscribe("/user/queue/seenMessage", (payload) => {
        const friendName = payload.body;
        console.log(friendName + " online");
        dispatch(setPendingZero(friendName));
        dispatch(setReachedZero(friendName));
      });
      client.subscribe("/user/queue/newGroup", (payload) => {
        const body = JSON.parse(payload.body);
        dispatch(addGroup(body));
      });
      client.subscribe("/user/queue/kickedOut", (payload) => {
        const body = JSON.parse(payload.body);

        console.log(body)
        dispatch(deleteGroup(body.groupId));
        dispatch(closeDeletedChat(body.groupId));
        setUnseenNotifications((prev) => prev + 1);
        dispatch(addNotification(body))
      });

      client.subscribe("/user/queue/addedToGroup",payload=>{
        const body = JSON.parse(payload.body)
        dispatch(addGroup(body.group))
        setUnseenNotifications((prev) => prev + 1);
        dispatch(addNotification(body.notification))
      })
    };
    client.onDisconnect = () => {
      console.log("❌ Disconnected from WebSocket");
    };

    client.activate();
    return () => {
      client.deactivate();
      setWsConnected(false);
    };
  }, []);

  const isSubscribed = useRef(new Set());
  useEffect(() => {
    if (
      clientRef.current == null ||
      ((!connectionSet || connectionSet.length === 0) &&
        (!groupSet || groupSet.length === 0)) ||
      !wsConnected
    )
      return;
    for (let i = 0; i < connectionSet.length; i++) {
      const name = connectionSet[i];
      if (isSubscribed.current.has(name)) continue;
      isSubscribed.current.add(name);
      clientRef.current.subscribe("/topic/connection/" + name, (payload) => {
        let activityStatus = JSON.parse(payload.body);
        dispatch(setActivityStatus(activityStatus));
        dispatch(setChatActivityStatus(activityStatus));
      });
    }
    groupSet.forEach((group) => {
      if (!isSubscribed.current.has(group)) {
        isSubscribed.current.add(group);
        clientRef.current.subscribe("/topic/group/" + group, (payload) => {
          const body = JSON.parse(payload.body);

          if (body.status === "CHECK_MARK_UPDATE") {
            dispatch(updateGroupMaxValues(body));
          } else if (body.message.username !== usernameRef.current) {
            dispatch(
              updateLatestGroupMessage({
                id: group,
                time: body.message.time,
                content: body.message.content,
                sender: body.message.username,
              })
            );
            if (
              !chatInfoRef.current ||
              !chatInfoRef.current.grpInfo ||
              chatInfoRef.current.grpInfo.id !== body.groupId
            ) {
              dispatch(sendGroupReceived({ groupId: body.groupId }));
              dispatch(incrementGroupUnseen(body));
            } else {
              dispatch(sendGroupSeen({ groupId: body.groupId }));
              dispatch(addGroupMessage(body));
            }
          }
        });
      }
    });
  }, [connectionSet, wsConnected, groupSet]);

  return (
    <websocketContext.Provider value={{ client: clientRef.current }}>
      {children}
    </websocketContext.Provider>
  );
};

export default WebSocketProvider;
