package com.mecklon.backend.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupDTO {
    private String title;
    private String caption;
    private MultipartFile profile;
    private List<String> members = new ArrayList<>();
    private List<String> admins = new ArrayList<>();
}
