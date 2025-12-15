package com.mecklon.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MultimediaDTO implements Serializable {
    private Long id;
    private String fileName;
    private String fileType;
}
