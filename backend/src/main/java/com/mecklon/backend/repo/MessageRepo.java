package com.mecklon.backend.repo;


import com.mecklon.backend.DTO.MessageDTO;
import com.mecklon.backend.model.ConnectionKey;
import com.mecklon.backend.model.Message;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {


    // since message dto has a collection object hence it cannot be directly projected
    // in the query

    // use left join fetch to get media and user eagerly, or will lead to n+1 problem
    @Query("""
            select distinct m
            from Message m
            left join fetch m.user
            left join fetch m.media
            where m.connection.key = :id
            and m.postedOn < :cursor
            order by m.postedOn desc
    """)

    public List<Message> getMessage(@Param("cursor") LocalDateTime cursor, @Param("id") ConnectionKey id, Pageable page);



    // using left join fetch to eagerly get media and user associated with user
    @Query("""
            select distinct m from
            Message m
            left join fetch m.media media
            left join fetch m.user user
            where m.group.id = :id
            and
            m.postedOn < :cursor
            order by m.postedOn desc
            """)
    List<Message> getGroupMessages(long id, LocalDateTime cursor, Pageable page);
}
