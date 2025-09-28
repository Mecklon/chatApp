package com.mecklon.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
        indexes = {
                @Index(name = "sender_grouping", columnList = "sender_id"),
                @Index(name = "receiver_grouping", columnList = "receiver_id")
        }
)
public class Request {
    @EmbeddedId
    private RequestKey key;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name = "sender_id")
    @MapsId("senderId")
    private User sender;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name="receiver_id")
    @MapsId("receiverId")
    private User receiver;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime sentOn;

    private RecordStatus status;
}