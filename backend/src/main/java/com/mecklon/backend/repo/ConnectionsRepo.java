package com.mecklon.backend.repo;

import com.mecklon.backend.DTO.Contact;
import com.mecklon.backend.model.Connection;
import com.mecklon.backend.model.ConnectionKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionsRepo extends JpaRepository<Connection, ConnectionKey> {


    // the latest message for a connection can be null in that case
    // jqpl assume all the values inside latest to be null and return null
    // when asked for these values but further dereferencing a null value will silently skip the row
    // hence further left join the user of m

    // c.user1.isOnline may be c.user2.isOnline
    @Query("""
    select new com.mecklon.backend.DTO.Contact(
        c.pending2,
        m.content,
        m.postedOn,
        c.user1.username,
        mu.username,
        c.user1.profileImg.fileName,
        c.user1.isOnline,
        c.user1.lastSeen
    )
    from Connection c
    left join c.latest m
    left join m.user mu
    where c.user2.id = :id
""")
    List<Contact> findLatestMessagePerConnection(@Param("id") Long id);




    @Query("""
    select new com.mecklon.backend.DTO.Contact(
                        c.pending1,
                        m.content,
                        m.postedOn,
                        c.user2.username,
                        mu.username,
                        c.user2.profileImg.fileName,
                        c.user2.isOnline,
                        c.user2.lastSeen
                    )
                    from Connection c
                    left join c.latest m
                    left join m.user mu
                    where c.user1.id = :id
""")
    List<Contact> findLatestMessagePerConnection2(@Param("id") Long id);

    @Query("""
            select c from Connection c left join c.latest m where c.user1.id = :id or c.user2.id = :id""")
    List<Connection> text(@Param("id") Long id);


    @Query("""
            select c from Connection c where
                (c.user1.username = :user1 and c.user2.username = :user2)
                or
                (c.user2.username = :user1 and c.user1.username = :user2)
            """)
    Connection getConnection(String user1, String user2);



    // something wrong over here
    @Modifying
    @Query("""
            update Connection c set c.pending1 = c.pending1+1 
            where 
                c.user1.id = (select u.id from User u where u.username = :receiver)
                and 
                c.user2.id = (select u.id from User u where u.username = :sender)
            """)
    int incrementPending1(String sender , String Receiver);

    @Modifying
    @Query("""
            update Connection c set c.pending2 = c.pending2+1 
            where 
            c.user2.id = (select u.id from User u where u.username = :receiver)
            and 
            c.user1.id = (select u.id from User u where u.username = :sender)
            """)
    int incrementPending2(String sender , String Receiver);


    @Modifying
    @Query("""
           update Connection c 
           set c.reached1 = 0 
           where 
           c.user1.id = :id
            """)
    void setReachedZero(Long id);



    @Modifying
    @Query("""
           update Connection c 
           set c.reached2 = 0 
           where 
           c.user2.id = :id
            """)
    void setReachedZero2(Long id);


}
