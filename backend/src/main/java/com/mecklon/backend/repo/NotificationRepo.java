package com.mecklon.backend.repo;

import com.mecklon.backend.DTO.NotificationDTO;
import com.mecklon.backend.model.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

    // here you have to use aliases for n.sender and n.group since thats how jpql mandates it
    // accessing embeded or seperate connected objects here when they are null will be expressed as
    //  individual attributes to also be null
    @Query("""
             select new com.mecklon.backend.DTO.NotificationDTO(
             s.username,
             s.profileImg.fileName,
             n.typeId,
             g.name,
             g.profileImg.fileName,
             n.type,
             n.postedOn,
             null)
             from Notification n
             left join n.sender s
             left join n.group g
             where n.receiver.id = :id
             and
             n.postedOn < :cursor
             order by n.postedOn desc
            """)
    List<NotificationDTO> getNotificationDTOPage(LocalDateTime cursor, Long id, Pageable page);
}
