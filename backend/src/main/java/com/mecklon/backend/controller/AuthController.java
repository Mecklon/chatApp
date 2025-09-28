package com.mecklon.backend.controller;


import com.mecklon.backend.DTO.LoginRequest;
import com.mecklon.backend.model.User;
import com.mecklon.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.mecklon.backend.service.JwtService;
import org.springframework.web.multipart.MultipartFile;

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
        User user = us.findUser(auth.getName());
        map.put("email",user.getEmail());
        if(user.getProfileImg()!=null){
            map.put("profile", user.getProfileImg().getFileName());
        }
        map.put("caption",user.getCaption());
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
            User user = us.findUser(req.getUsername());
            response.put("email",user.getEmail());
            if(user.getProfileImg()!=null){
                response.put("profile", user.getProfileImg().getFileName());
            }
            response.put("caption",user.getCaption());
            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","invalid username or password"));
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
            User res = us.findUser(user.getUsername());
            response.put("email",res.getEmail());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @PostMapping("/updateProfile")
    ResponseEntity<Map<String, String>> updateProfile(@RequestParam(name="caption", required = false) String caption, @RequestParam(name = "profile", required = false) MultipartFile profile, Authentication auth){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(us.update(caption, profile, auth.getName()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
