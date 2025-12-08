package com.mecklon.backend.repo;

import com.mecklon.backend.model.GroupPendingReceivedProjection;
import com.mecklon.backend.model.UserGroup;
import com.mecklon.backend.model.UserGroupId;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Repository
public interface UserGroupRepo extends JpaRepository<UserGroup, UserGroupId> {




    @Query("""
            select max(ug.reached) from UserGroup ug
            where
            ug.group.id = :groupId
            and
            ug.user.id != :id
            """)
    int getMaxReached(long groupId, Long id);


    @Modifying
    @Query("""
                update UserGroup ug
                set ug.pending = ug.pending + 1,
                    ug.reached = ug.reached + 1
                where ug.group.id = :groupId
                  and ug.user.id <> :id
                
            """)
    void incrementPendingAndReached(Long id, long groupId);


    @Query("""
            select max(ug.pending) from UserGroup ug
            where
            ug.group.id = :groupId
            and
            ug.user.id != :id
            """)
    int getMaxPending(long groupId, Long id);


    @Query("""
            select ug from UserGroup ug 
            left join fetch ug.group 
            where 
            ug.user.id = :id
            """)
    List<UserGroup> findAllByUserId(Long id);
}
