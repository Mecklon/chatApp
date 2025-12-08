package com.mecklon.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMessageDTO {
    private String content;
    private LocalDateTime time;
    private List<MultimediaDTO> media;
    private String username;
    private String profileImgName;
}
