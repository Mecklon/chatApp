package com.mecklon.backend.service;
import com.mecklon.backend.model.User;
import com.mecklon.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
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
