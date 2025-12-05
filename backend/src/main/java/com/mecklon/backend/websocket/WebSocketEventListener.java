package com.mecklon.backend.websocket;

import com.mecklon.backend.DTO.ActivityStatusDTO;
import com.mecklon.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
public class WebSocketEventListener {

    @Autowired
    private UserService us;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        String user = event.getUser() != null ? event.getUser().getName() : "Unknown";
        log.info("🔵 Connected: {}", user);
        messagingTemplate.convertAndSend("/topic/connection/"+user,new ActivityStatusDTO(user, true));
        us.setOnline(user);

    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String user = event.getUser() != null ? event.getUser().getName() : "Unknown";
        log.info("🔴 Disconnected: {}", user);
        messagingTemplate.convertAndSend("/topic/connection/"+user,new ActivityStatusDTO(user, false));
        us.setOffline(user);

    }
}
