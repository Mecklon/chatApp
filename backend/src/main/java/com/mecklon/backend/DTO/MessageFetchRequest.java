package com.mecklon.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageFetchRequest {
    private String username1;
    private String username2;
    private LocalDateTime cursor;
}
