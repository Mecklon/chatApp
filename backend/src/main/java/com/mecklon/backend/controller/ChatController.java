package com.mecklon.backend.controller;


import com.mecklon.backend.DTO.*;
import com.mecklon.backend.model.GroupWebsocketDTO;
import com.mecklon.backend.model.UserPrincipal;
import com.mecklon.backend.service.ChatService;
import org.apache.catalina.util.ToStringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class ChatController {
    @Autowired
    private ChatService cs;




    @PostMapping("/getChats")
    public ResponseEntity<ChatContextDTO> getMessages(@RequestBody MessageFetchRequest req){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cs.getMessage(req.getUsername1(),req.getUsername2(), req.getCursor()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<MessageDTO> sendMessage(@RequestParam(value = "text", required = false) String content, @RequestParam(value="files", required = false) List<MultipartFile> files,@RequestParam("receiver") String receiver, Authentication auth) throws IOException {
        MessageDTO res = cs.saveMessage(content, files, receiver,auth.getName());
        System.out.println(receiver);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/incrementUnseen/{sender}")
    public ResponseEntity<Void> incrementUnseen(Authentication auth, @PathVariable("sender") String sender){
        try{
            cs.incrementPending(auth.getName(), sender);
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/setSeenMessage/{sender}")
    public  ResponseEntity<Void> setSeenMessage(Authentication auth, @PathVariable("sender") String sender){
        try{
            cs.setPendingZero(auth.getName(), sender);
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/receivedMessages")
    public ResponseEntity<Void> setReceivedMessage(@AuthenticationPrincipal UserPrincipal principal){
        try{
            cs.setReachedZero(principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sendGroupMessage")
    public ResponseEntity<GroupMessageDTO> sendGroupMessage(@RequestParam(value = "text", required = false) String content, @RequestParam(value="files", required = false) List<MultipartFile> files, @RequestParam("groupId") long groupId, Authentication auth){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cs.saveGroupMessage(content, files, groupId, auth.getName()));

        }catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

    @PostMapping("/getGroupMessages")
    public ResponseEntity<ChatContextDTO> getGroupMessages(@RequestBody GroupMessageFetchRequest req){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cs.getGroupMessages(req.getId(), req.getCursor()));
        }catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sendGroupReceived/{groupId}")
    public ResponseEntity<Void> sendGroupReceived(@PathVariable("groupId") long groupId,@AuthenticationPrincipal UserPrincipal principal){
        try{
            cs.propogateReceived(groupId, principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sendGroupSeen/{groupId}")
    public ResponseEntity<Void> sendGroupSeen(@PathVariable("groupId") long groupId,@AuthenticationPrincipal UserPrincipal principal){
        try{
            cs.propogateReceivedAndPending(groupId, principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sendGroupOpened/{groupId}")
    public ResponseEntity<Void> sendGroupOpened(@PathVariable("groupId") long groupId,@AuthenticationPrincipal UserPrincipal principal){
        try{
            cs.propogatePending(groupId, principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
