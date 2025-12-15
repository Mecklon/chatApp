package com.mecklon.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatContextDTO implements Serializable {
    private List<MessageDTO> chats;
    private int reached;
    private int pending;
}
