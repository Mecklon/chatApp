package com.mecklon.todo.service;

import com.mecklon.todo.model.Task;
import com.mecklon.todo.repo.TaskRepo;
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
