package com.mecklon.todo.controller;


import com.mecklon.todo.DTO.LoginRequest;
import com.mecklon.todo.model.User;
import com.mecklon.todo.service.UserService;
import com.sun.net.httpserver.HttpsServer;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.mecklon.todo.service.JwtService;

import java.util.HashMap;
import java.util.Map;


@RestController
public class AuthController {

    @Autowired
    UserService us;

    @Autowired
    JwtService jwt;

    @Autowired
    AuthenticationManager authenticationManager;

    @GetMapping("/autoLogin")
    ResponseEntity<Map<String,String>> autoLogin(Authentication auth){
        Map<String,String> map = new HashMap<>();
        map.put("username",auth.getName());
        return new ResponseEntity<>(map,HttpStatus.OK);
    }

    @PostMapping("/login")
    ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest req) {
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(),req.getPassword()));

            String token = jwt.generateJWT(req.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username",req.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","invalide username or password"));
        }
    }





    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder((12));

    @PostMapping("/signup")
    ResponseEntity<Map<String, String>> signup(@RequestBody User user) {
        User exists = us.findUser(user.getUsername());
        if (exists == null) {
            user.setPassword(encoder.encode(user.getPassword()));
            us.addUser(user);
            String token = jwt.generateJWT(user.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username",user.getUsername());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }
}
