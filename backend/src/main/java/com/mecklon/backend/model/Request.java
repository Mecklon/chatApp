package com.mecklon.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    @EmbeddedId
    private RequestKey key;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    @MapsId("senderId")
    private User sender;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    @MapsId("receiverId")
    private User receiver;

    t

    private RecordStatus status;
}