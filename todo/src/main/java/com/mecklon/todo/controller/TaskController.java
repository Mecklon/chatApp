package com.mecklon.todo.controller;


import com.mecklon.todo.model.Task;
import com.mecklon.todo.model.User;
import com.mecklon.todo.service.TaskService;
import com.mecklon.todo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class TaskController {
    @Autowired
    TaskService ts;


    @Autowired
    UserService us;

    @PostMapping("/post")
    ResponseEntity<Task> addPost(@RequestBody Task task, Authentication auth){
        User user = us.findUser(auth.getName());
        task.setUser(user);
        Task savedTask = ts.saveTask(task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping("/post")
    ResponseEntity<List<Task>> getPosts(Authentication auth){
        List<Task> tasks = ts.getTasksByUsername(auth.getName());
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/post/{id}")
    ResponseEntity<Void> deletePost(@PathVariable("id") int id, Authentication auth){
        Task task = ts.getTask(id);
        if(task==null || !task.getUser().getUsername().equals(auth.getName())){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        ts.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

}
