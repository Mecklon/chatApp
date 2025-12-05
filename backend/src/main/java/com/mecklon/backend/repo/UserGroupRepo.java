package com.mecklon.backend.repo;

import com.mecklon.backend.model.UserGroup;
import com.mecklon.backend.model.UserGroupId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupRepo extends JpaRepository<UserGroup, UserGroupId> {

}
