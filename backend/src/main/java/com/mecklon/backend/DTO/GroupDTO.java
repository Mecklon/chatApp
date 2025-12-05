package com.mecklon.backend.DTO;

import com.mecklon.backend.model.ProfileImg;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO {
    private Long id;
    private String name;
    private int pending;
    private String sender;
    private String profileImgName;
    private String latestMessage;
    private LocalDateTime lastMessageTime;
}
