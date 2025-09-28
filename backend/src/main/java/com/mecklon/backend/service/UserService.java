package com.mecklon.backend.service;
import com.mecklon.backend.DTO.Person;
import com.mecklon.backend.model.ProfileImg;
import com.mecklon.backend.model.User;
import com.mecklon.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    UserRepo repo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public User findUser(String email) {
        return repo.findByUsername(email);
    }

    public User addUser(User req) {
        return repo.save(req);
    }

    public Map<String, String> update(String caption, MultipartFile profile, String name) throws IOException {

        Map<String,String> res = new HashMap<>();
        User user = repo.findByUsername(name);
        System.out.println("one");
        System.out.println(profile);
        if(profile!=null) {
            String uniqueName = System.currentTimeMillis() + "-" + profile.getOriginalFilename();
            String path = uploadDir + File.separator + uniqueName;
            profile.transferTo(new File(path));
            user.getProfileImg().setFilePath(path);
            user.getProfileImg().setFileName(uniqueName);
        }
        System.out.println("two");

        if(caption!=null) {
            user.setCaption(caption);
        }
        System.out.println("three");

        User newUser =  repo.save(user);
        res.put("caption",newUser.getCaption());
        res.put("profile", newUser.getProfileImg().getFileName());
        System.out.println("four");
        return res;
    }

    public List<Person> getUsernameMatches(String name, Long userId, String cursor){
        Pageable page = PageRequest.of(0,20);
        return repo.findPersonByUsernameStartingBy(name,userId,cursor, page);
    }
}
