import { useMemo } from "react";
import { Client } from "@stomp/stompjs";

export function useWebSocket(token) {
  const client = useMemo(() => {
    return new Client({
      // Native WebSocket URL
      brokerURL: "ws://localhost:9090/ws", // your Spring Boot WS endpoint
      connectHeaders: {
        Authorization: `Bearer ${token}`, // JWT
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // auto-reconnect after 5s
    });
  }, [token]);

  return client;
}
