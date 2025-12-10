package com.mecklon.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
// this index groups the multimedia according to the messages its associated with for faster query
// the column list name is message_id because the actual database table simply maintains a foreign key to the actuall message
// table not the  entire object as represented in jpa and the name of this column if not explicitly mentioned to be something else
// will be names message_id since the primary key of message was named id
@Table(
        indexes={
                @Index(
                        name="message_query_association",
                        columnList = "message_id"
                ),
                @Index(
                        name="group_query_association",
                        columnList = "group_id"
                ),
                @Index(
                        name="connection_query_association",
                        columnList = "connection_user1_id, connection_user2_id"
                )
        }
)
public class Multimedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private MultimediaType type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false,name = "message_id")
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "connection_user1_id", referencedColumnName = "user1_id"),
            @JoinColumn(name = "connection_user2_id", referencedColumnName = "user2_id")
    })
    private Connection connection;
}