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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    Message message ;

}