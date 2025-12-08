package com.mecklon.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        indexes = {
                @Index(name = "idx_messages_group_postedon", columnList = "group_id, postedOn DESC"),
                @Index(name = "idx_messages_connection1_postedon", columnList = "connection_user1_id, postedOn DESC"),
                @Index(name = "idx_messages_connection2_postedon", columnList =  "connection_user2_id, postedOn DESC")
        }
)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime postedOn;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Multimedia> media = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    Connection connection;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    User user;
}