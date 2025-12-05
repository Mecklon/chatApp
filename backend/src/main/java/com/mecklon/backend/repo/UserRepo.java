package com.mecklon.backend.repo;

import com.mecklon.backend.DTO.Person;
import com.mecklon.backend.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    User findByEmail(String username);

    User findByUsername(String username);


    // here while mapping to projection only primitives map something like u.profile wont map since profle is embedded object and not a primitive type

    @Query("""
            select new com.mecklon.backend.DTO.Person(
                    u.id, 
                    u.isOnline, 
                    u.username, 
                    u.profileImg.filePath, 
                    u.profileImg.fileName) 
            from User u 
            where lower(u.username) like  concat(lower(:prefix), '%') 
            and
            lower(u.username) > lower(:cursor)
            and
            u.id != :currentUser
            and
            u.id not in (select r.key.receiverId from Request r where r.key.senderId = :currentUser)
            order by lower(u.username) asc
            """)
    List<Person> findPersonByUsernameStartingBy(@Param("prefix") String prefix, @Param("currentUser") Long userId,@Param("cursor")  String cursor, Pageable page );


    @Modifying
    @Query("""
            update User u set u.unseenNotifications = u.unseenNotifications+1 where u.id = :id
            """)
    void incrementUnseenNotifications(@Param("id") Long id);

    @Modifying
    @Query("""
            update User u set u.unseenRequest = u.unseenRequest+1 where u.id = :id
            """)
    void incrementUnseenRequests(@Param("id") Long id);


    @Modifying
    @Query("""
            update User u set u.unseenNotifications = 0 where u.id = :id
            """)
    void setNotificationsZero(@Param("id") Long id);

    @Modifying
    @Query("""
            update User u set u.unseenRequest = 0 where u.id = :id
            """)
    void setRequestsZero(@Param("id") Long id);


    @Modifying
    @Query("update User u set u.isOnline = true where u.username = :user")
    void setOnline(@Param("user") String user);

    @Modifying
    @Query("update User u set u.isOnline = false where u.username = :user")
    void setOffline(@Param("user") String user);
}

