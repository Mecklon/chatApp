package com.mecklon.backend.model;

import jakarta.persistence.*;
import jdk.jfr.BooleanFlag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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


    private int maxPending = 0;

    private int maxReached = 0;

    @Embedded
    ProfileImg profileImg;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserGroup> members = new ArrayList<>();

    ProfileImg getProfileImg(){
        if(profileImg == null){
            profileImg = new ProfileImg();
        }
        return profileImg;
    }

}