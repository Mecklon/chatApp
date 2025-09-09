package com.mecklon.todo.service;
import com.mecklon.todo.model.User;
import com.mecklon.todo.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepo repo;


    public User findUser(String email) {
        return repo.findByUsername(email);
    }


    public User addUser(User req) {
        return repo.save(req);
    }
}
