package com.mecklon.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
// adding userId index so users can quickly fetch groups they are associated with

// while indexing you have to mention the User user object but when performing jpql queries its throught key.userId
@Table(
        indexes = {
                @Index(name = "group_user_search_index", columnList = "user_id")
        })
public class UserGroup {
    @EmbeddedId
    private UserGroupId id;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name = "user_id")  ///  <<-- this tells hibernate to map userId to user_id. hiberenate
    // does not map automatically
    @MapsId("userId")
    private User user;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name = "group_id")
    @MapsId("groupId")
    private Group group;

    private int pending = 0;

    private boolean isAdmin = false;

}