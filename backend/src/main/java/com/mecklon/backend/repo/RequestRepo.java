package com.mecklon.backend.repo;

import com.mecklon.backend.DTO.RequestDTO;
import com.mecklon.backend.model.Request;
import com.mecklon.backend.model.RequestKey;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestRepo extends JpaRepository<Request, RequestKey> {
    @Query("""
            select new com.mecklon.backend.DTO.RequestDTO(r.sender.username, r.sender.profileImg.fileName, r.sentOn)
            from Request r
            where r.receiver.id = :id
            and
            r.sentOn< :cursor
            order by sentOn desc
            """)
    List<RequestDTO> getRequests(@Param("id") Long id , @Param("cursor")LocalDateTime cursor, Pageable page);

    void deleteByReceiver_IdAndSender_Username(Long id, String senderUsername);

    void deleteByReceiver_IdAndSender_Id(Long id, Long id1);
}
