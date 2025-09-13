package com.mecklon.backend.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
