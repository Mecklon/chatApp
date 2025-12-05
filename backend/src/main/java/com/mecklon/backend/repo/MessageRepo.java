package com.mecklon.backend.repo;


import com.mecklon.backend.DTO.MessageDTO;
import com.mecklon.backend.model.ConnectionKey;
import com.mecklon.backend.model.Message;
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
    @Query("""
            select 
            m
            from 
            Message m
            where
            m.connection.key = :id
            and
            m.postedOn < :cursor
            order by m.postedOn desc
            """)
    public List<Message> getMessage(@Param("cursor") LocalDateTime cursor, @Param("id") ConnectionKey id, Pageable page);
}
