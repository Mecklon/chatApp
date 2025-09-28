package com.mecklon.backend.controller;


import com.mecklon.backend.DTO.Person;
import com.mecklon.backend.model.UserPrincipal;
import com.mecklon.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ConnectionsController {

    @Autowired
    UserService us;

    @GetMapping("/searchPeople/{name}/{cursor}")
    public List<Person> searchPeople(@PathVariable("name") String name,@PathVariable("cursor") String cursor, @AuthenticationPrincipal UserPrincipal principal){
        return us.getUsernameMatches(name, principal.getId(), cursor );
    }

}
