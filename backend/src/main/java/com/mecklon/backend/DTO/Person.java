package com.mecklon.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Person {
    private Long id;
    private boolean isOnline;
    private String username;
    private String filePath;
    private String fileName;
}
