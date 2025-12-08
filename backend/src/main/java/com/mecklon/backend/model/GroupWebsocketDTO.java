package com.mecklon.backend.model;

import com.mecklon.backend.DTO.GroupMessageDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupWebsocketDTO {
    private GroupWebsocketStatus status;
    private GroupMessageDTO message;
    private long groupId;
    private int pending;
    private int reached;

}
