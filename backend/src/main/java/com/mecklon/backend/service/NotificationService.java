package com.mecklon.backend.service;


import com.mecklon.backend.DTO.NotificationDTO;
import com.mecklon.backend.repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    NotificationRepo repo;

    public List<NotificationDTO> getNotifications(LocalDateTime cursor, Long id){
        Pageable page = PageRequest.of(0, 20);
        return repo.getNotificationDTOPage(cursor, id, page);
    }
}
