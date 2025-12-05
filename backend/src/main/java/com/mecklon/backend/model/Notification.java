package com.mecklon.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.beans.ConstructorProperties;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
// this index groups the notifications according to receiver and sorts them according to
// time posted of in reverse order so the latest notifications are queried faster
@Table(
        indexes = {
                @Index(name = "user_grouping", columnList = "receiver_id, postedOn desc")
        }
)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User sender ;

    @Column(nullable = false)
    private int typeId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private User receiver;

    @ManyToOne
    private Group group;

    @Column(nullable = false)
    private NotificationType type;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime postedOn;

}