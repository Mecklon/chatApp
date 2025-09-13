package com.mecklon.backend.repo;

import com.mecklon.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepo extends JpaRepository<Task,Integer> {
    List<Task> findByUser_Username(String username);

}
