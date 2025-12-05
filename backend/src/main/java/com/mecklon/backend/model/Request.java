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

// here the order of the index columns matter because the application will fetch either
// by the receiver of the request so receiver_id needs to be first
// or
// fetch a particular request based and sender and receiver
@Table(
        indexes = {
                @Index(name = "receiver_sender_grouping", columnList = "receiver_id,sender_id,  sentOn desc"),
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