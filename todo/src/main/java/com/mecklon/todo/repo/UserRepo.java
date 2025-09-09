package com.mecklon.todo.repo;

import com.mecklon.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findByEmail(String username);

    User findByUsername(String username);
}
