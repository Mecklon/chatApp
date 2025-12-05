package com.mecklon.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

// here the user1 and user2 attributes are indexed so the query for
// friend list which depends on searching based on user1 = currentUser or
// user2 = currentUser, here posgress is smart enough user the indexes to optimize search
// for indexing refer to class variable name rather than connection key attributes
@Table(
        indexes = {
                @Index(name="user1_search_index",columnList = "user1_id"),
                @Index(name="user2_search_index",columnList = "user2_id")
        }
)
public class Connection {
    @EmbeddedId
    private ConnectionKey key;
    @MapsId("user1Id")
    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name = "user1_id")
    private User user1;

    @MapsId("user2Id")
    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name = "user2_id")
    private User user2;


    private int pending1 = 0;
    private int reached1 = 0;

    private int pending2 = 0;
    private int reached2 = 0;

    @OneToMany(mappedBy = "connection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    @OneToOne(cascade= CascadeType.ALL)
    private Message latest;

}