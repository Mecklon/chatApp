package com.mecklon.backend.service;

import com.mecklon.backend.model.Task;
import com.mecklon.backend.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TaskService {

    @Autowired
    TaskRepo repo;


    public Task saveTask(Task task) {
        return repo.save(task);
    }

    public List<Task> getTasksByUsername(String username){
        return repo.findByUser_Username(username);
    }

    public Task getTask(int id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteTask(int id) {
        repo.deleteById(id);
    }
}
