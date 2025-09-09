package com.mecklon.todo.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
