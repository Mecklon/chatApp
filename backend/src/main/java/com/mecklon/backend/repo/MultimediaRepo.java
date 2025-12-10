package com.mecklon.backend.repo;

import com.mecklon.backend.DTO.MultimediaDTO;
import com.mecklon.backend.model.ConnectionKey;
import com.mecklon.backend.model.Multimedia;
import com.mecklon.backend.model.MultimediaType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MultimediaRepo extends JpaRepository<Multimedia, Long> {

    @Query("""
    select new com.mecklon.backend.DTO.MultimediaDTO(
        m.id,
        m.fileName,
        m.fileType
    )
    from Multimedia m
    where
        m.connection.key.user1Id = :#{#key.user1Id}
        and m.connection.key.user2Id = :#{#key.user2Id}
        and type != :file
        and m.id < :cursor
    order by m.id desc
    """)
    List<MultimediaDTO> findVisualMediaPageByConnectionKey(
            @Param("key") ConnectionKey key,
            @Param("cursor") long cursor,
            MultimediaType file,
            Pageable page
    );


    @Query("""
    select new com.mecklon.backend.DTO.MultimediaDTO(
        m.id,
        m.fileName,
        m.fileType
    )
    from Multimedia m
    where
        m.connection.key.user1Id = :#{#key.user1Id}
        and m.connection.key.user2Id = :#{#key.user2Id}
        and type = :file
        and m.id < :cursor
    order by m.id desc
    """)
    List<MultimediaDTO> findDocumentPageByConnectionKey(
            @Param("key") ConnectionKey key,
            @Param("cursor") long cursor,
            MultimediaType file,
            Pageable page
    );


    @Query("""
           select new com.mecklon.backend.DTO.MultimediaDTO(
            m.id,
            m.fileName,
            m.fileType
            )
            from Multimedia m
            where
                m.group.id = :id
                and
                m.id < :cursor
                and
                m.type != :exclude
            order by id desc
            """)
    List<MultimediaDTO> findGroupVisualMedia(long id, long cursor, MultimediaType exclude,Pageable page);

    @Query("""
           select new com.mecklon.backend.DTO.MultimediaDTO(
            m.id,
            m.fileName,
            m.fileType
            )
            from Multimedia m
            where
                m.group.id = :id
                and
                m.id < :cursor
                and
                m.type = :include
            order by id desc
            """)
    List<MultimediaDTO> findGroupDocumentMedia(long id, long cursor, MultimediaType include,Pageable page);


}


