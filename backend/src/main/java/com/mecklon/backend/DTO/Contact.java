package com.mecklon.backend.DTO;

import com.mecklon.backend.model.Message;
import com.mecklon.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    private int pending;
    private String content;
    private LocalDateTime postedOn;
    private String name;
    private String sender;
    private String profileImgName;
    private boolean isOnline;
    private LocalDateTime lastSeen;
}
