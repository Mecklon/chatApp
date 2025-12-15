package com.mecklon.backend.controller;


import com.mecklon.backend.DTO.*;
import com.mecklon.backend.model.UserPrincipal;
import com.mecklon.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class ChatController {
    @Autowired
    private ChatService cs;







    @PostMapping("/getChats/{firstPage}")
    public ResponseEntity<ChatContextDTO> getMessages(@RequestBody MessageFetchRequest req, @PathVariable("firstPage") boolean firstPage){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cs.getMessage(req.getUsername1(),req.getUsername2(), req.getCursor(), firstPage));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<MessageDTO> sendMessage(@RequestParam(value = "text", required = false) String content, @RequestParam(value="files", required = false) List<MultipartFile> files,@RequestParam("receiver") String receiver, Authentication auth) throws IOException {
        MessageDTO res = cs.saveMessage(content, files, receiver,auth.getName());
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

    @PostMapping("/getGroupMessages/{firstPage}")
    public ResponseEntity<ChatContextDTO> getGroupMessages(@RequestBody GroupMessageFetchRequest req,@PathVariable("firstPage") boolean firstPage){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cs.getGroupMessages(req.getId(), req.getCursor(), firstPage));
        }catch (Exception e){
            System.out.println(e.getMessage());
            System.out.println(e.getMessage());
            System.out.println(e.getMessage());
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

    @GetMapping("/getVisualMedia/{username}/{cursor}")
    public ResponseEntity<List<MultimediaDTO>> getVisualMedia(@PathVariable("username") String user1, @AuthenticationPrincipal UserPrincipal principal,@PathVariable("cursor") long cursor){
        try{
            if(cursor==-1){
                cursor = Long.MAX_VALUE;
            }
            return ResponseEntity.status(HttpStatus.OK).body(cs.getVisualMediaPage(user1, principal.getId(), cursor));
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getDocumentMedia/{username}/{cursor}")
    public ResponseEntity<List<MultimediaDTO>> getDocumentMedia(@PathVariable("username") String user1, @AuthenticationPrincipal UserPrincipal principal,@PathVariable("cursor") long cursor){
        try{
            if(cursor==-1){
                cursor = Long.MAX_VALUE;
            }
            return ResponseEntity.status(HttpStatus.OK).body(cs.getDocumentPage(user1, principal.getId(), cursor));
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/getGroupData/{groupId}")
    public ResponseEntity<GroupInfoDTO> getGroupInfo(@PathVariable("groupId") long id, @AuthenticationPrincipal UserPrincipal principal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cs.getGroupData(id, principal.getId()));
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("getGroupVisualMedia/{groupId}/{cursor}")
    public ResponseEntity<List<MultimediaDTO>> getGroupVisualMedia(@PathVariable("groupId") long id, @PathVariable("cursor") long cursor){
        try{

            if(cursor==-1){
                cursor = Long.MAX_VALUE;
            }
            return ResponseEntity.status(HttpStatus.OK).body(cs.getGroupVisualMedia(id, cursor));
        }catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("getGroupDocumentMedia/{groupId}/{cursor}")
    public ResponseEntity<List<MultimediaDTO>> getGroupDocumentMedia(@PathVariable("groupId") long id, @PathVariable("cursor") long cursor){
        try{
            if(cursor==-1){
                cursor = Long.MAX_VALUE;
            }
            return ResponseEntity.status(HttpStatus.OK).body(cs.getGroupDocumentMedia(id, cursor));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
