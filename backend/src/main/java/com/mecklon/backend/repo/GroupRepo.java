package com.mecklon.backend.repo;

import com.mecklon.backend.DTO.GroupDTO;
import com.mecklon.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepo extends JpaRepository<Group, Long> {

    // if a property of an entity my be null sometimes be cannot simple get them by writing entity.
    //property in the select columns, but have to left join them
    @Query("""
            select new com.mecklon.backend.DTO.GroupDTO(
                g.id,
                g.name,
                ug.pending,
                u.username,
                p.fileName,
                l.content,
                l.postedOn
            ) from UserGroup ug
            left join ug.group g
            left join g.latest l
            left join l.user u
            left join g.profileImg p
            where ug.user.id = :id
            """)
    List<GroupDTO> getGroups(@Param("id") Long id);
}
