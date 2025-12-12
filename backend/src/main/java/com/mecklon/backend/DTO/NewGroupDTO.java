package com.mecklon.backend.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewGroupDTO {
    private NotificationDTO notification;
    private GroupDTO group;

}
