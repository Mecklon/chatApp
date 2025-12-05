package com.mecklon.backend.DTO;

import com.mecklon.backend.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String senderName;
    private String senderProfile;
    private int typeId;
    private String groupName;
    private String groupProfile;
    private NotificationType type;
    private LocalDateTime postedOn;
}
