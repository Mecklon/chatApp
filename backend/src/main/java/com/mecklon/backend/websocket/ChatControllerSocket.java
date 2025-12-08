package com.mecklon.backend.websocket;

import com.mecklon.backend.repo.ConnectionsRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Slf4j
@Controller
public class ChatControllerSocket {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

//    // When a client sends to /app/chat.sendMessage
//    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public")  // all subscribers to this topic get the message
//    public ChatMessage sendMessage(ChatMessage message, Principal principal) {
//        message.setSender(principal.getName());
//        return message; // broadcast to all
//    }
//
//    @MessageMapping("/chat.sendRoomMessage")
//    public void sendRoomMessage(ChatMessage message, Principal principal) {
//        message.setSender(principal.getName());
//        messagingTemplate.convertAndSend("/topic/room."+message.getRid(), message);
//    }
//
//    @MessageMapping("/chat/private")
//    public void sendPrivate(ChatMessage message, Principal principal){
//        String receiver = message.getReceiver();
//        message.setSender(principal.getName());
//        messagingTemplate.convertAndSendToUser(receiver, "/queue/messages",message);
//    }
//
//    // Optional: greeting when a user joins
//    @MessageMapping("/chat.addUser")
//    @SendTo("/topic/public")
//    public ChatMessage addUser(ChatMessage message) {
//        log.info("👤 User joined: {}", message.getSender());
//        message.setContent(message.getSender() + " joined the chat");
//        return message;
//    }

    @Autowired
    private ConnectionsRepo Crepo;

    @MessageMapping("/chat/receivedMessage")
    public void sendMessageSeen(@Payload Map<String, String> payload, Principal principal){
        messagingTemplate.convertAndSendToUser(payload.get("sender"),"queue/seenMessage",principal.getName());
    }

}
