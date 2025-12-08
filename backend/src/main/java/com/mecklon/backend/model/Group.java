package com.mecklon.backend.model;

import jakarta.persistence.*;
import jdk.jfr.BooleanFlag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// for quick fetch of group while user first loads in

// dont need this since primary key is alrady indexed
//@Table(name = "groups",
//    indexes = {
//        @Index(name="group_search_index", columnList = "id")
//    })
@Table(
        name = "groups"
)
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String caption;

    private int maxPending = 0;

    private int maxReached = 0;

    @Embedded
    private ProfileImg profileImg;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserGroup> members = new ArrayList<>();

    public ProfileImg getProfileImg(){
        if(profileImg == null){
            profileImg = new ProfileImg();
        }
        return profileImg;
    }

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    private Message latest;

}