package com.mecklon.backend.DTO;

import com.mecklon.backend.model.Multimedia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO implements Serializable {
    private String content;
    private LocalDateTime time;
    private List<MultimediaDTO> media;
    private String username;
    private String profileImgName;
    private boolean fromSystem;
}
