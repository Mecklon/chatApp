package com.mecklon.backend.controller;

import com.mecklon.backend.DTO.NotificationDTO;
import com.mecklon.backend.model.UserPrincipal;
import com.mecklon.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class NotificationsController {

    @Autowired
    private NotificationService ns;

    @GetMapping("/getNotifications/{cursor}/{firstPage}")
    ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable("cursor")LocalDateTime cursor, @AuthenticationPrincipal UserPrincipal principal,@PathVariable("firstPage") Boolean isFirst){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(ns.getNotifications(cursor, principal.getId(),isFirst));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
