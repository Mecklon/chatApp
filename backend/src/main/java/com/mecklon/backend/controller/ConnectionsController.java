package com.mecklon.backend.controller;


import com.mecklon.backend.DTO.*;
import com.mecklon.backend.model.User;
import com.mecklon.backend.model.UserPrincipal;
import com.mecklon.backend.repo.GroupRepo;
import com.mecklon.backend.repo.MultimediaRepo;
import com.mecklon.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.data.jpa.repository.query.JSqlParserUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.security.web.authentication.ExceptionMappingAuthenticationFailureHandler;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ConnectionsController {

    @Autowired
    private UserService us;





    @GetMapping("/searchPeople/{name}/{cursor}")
    public ResponseEntity<List<Person>> searchPeople(@PathVariable("name") String name, @PathVariable("cursor") String cursor, @AuthenticationPrincipal UserPrincipal principal){

        List<Person> res = us.getUsernameMatches(name, principal.getId(), cursor);

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/getRequests/{cursor}")
    public ResponseEntity<List<RequestDTO>> getRequests(@PathVariable(name="cursor") LocalDateTime cursor, @AuthenticationPrincipal UserPrincipal principal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.getRequests(cursor,principal.getId()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getConnections")
    public ResponseEntity<List<Contact>> getContacts(@AuthenticationPrincipal UserPrincipal principal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.getConnections(principal.getId()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    @PostMapping("/sendRequest")
    public ResponseEntity<Void> sendRequest(@RequestBody Map<String, String> body, @AuthenticationPrincipal UserPrincipal principal){
        try{
            us.saveRequest(body.get("receiverUsername"), principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/acceptRequest/{senderUsername}")
    public ResponseEntity<Contact> acceptRequest(@PathVariable("senderUsername") String senderUsername, @AuthenticationPrincipal UserPrincipal principal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.acceptRequest(principal.getId(), senderUsername));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/rejectRequest/{senderUsername}")
    public ResponseEntity<Void> rejectRequest(@PathVariable("senderUsername") String senderUsername,  @AuthenticationPrincipal UserPrincipal principal){
        try{
            us.rejectRequest(principal.getId(), senderUsername);
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/setNotificationSeen")
    public ResponseEntity<Void> setNotificationSeen(@AuthenticationPrincipal UserPrincipal principal){
        try{
            us.setNotificationZero(principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/setRequestSeen")
    public ResponseEntity<Void> setRequestSeen(@AuthenticationPrincipal UserPrincipal principal){
        try{
            us.setRequestZero(principal.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/createGroup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GroupDTO> createGroup( @ModelAttribute CreateGroupDTO formData,@AuthenticationPrincipal UserPrincipal principal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.saveGroup(formData, principal.getUsername()));

        }catch( IOException err){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/getGroups")
    public ResponseEntity<List<GroupDTO>> getGroups(@AuthenticationPrincipal UserPrincipal principal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.getGroups(principal.getId()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getUserData/{username}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable("username") String username){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.getUserData(username));
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/getMembers/{groupId}")
    public ResponseEntity<List<GroupMemberDTO>> getMembers(@PathVariable("groupId") long id){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(us.getMembers(id));
        } catch (Exception e) {


            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/KickMember/{username}/{groupId}")
    public ResponseEntity<Void> kickMember(@PathVariable("username") String username,@PathVariable("groupId") long groupId, @AuthenticationPrincipal UserPrincipal principal){
        try{
            us.kickMember(username,groupId,principal.getId(), principal.getUsername());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            System.out.println(e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/addMember/{groupId}/{username}")
    public ResponseEntity<Void> addMember(@PathVariable("username") String username,@PathVariable("groupId") long groupId, @AuthenticationPrincipal UserPrincipal principal){
        try{

            us.addMember(username,groupId,principal.getId(), principal.getUsername());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            System.out.println(e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
