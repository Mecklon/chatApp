package com.mecklon.backend.service;
import com.mecklon.backend.DTO.*;
import com.mecklon.backend.model.*;
import com.mecklon.backend.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    @Autowired
    private RequestRepo Rrepo;

    @Autowired
    private ConnectionsRepo Crepo;

    @Autowired
    private GroupRepo Grepo;

    @Autowired
    private NotificationRepo Nrepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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
        if(profile!=null) {
            String uniqueName = System.currentTimeMillis() + "-" + profile.getOriginalFilename();
            String path = uploadDir + File.separator + uniqueName;
            profile.transferTo(new File(path));
            user.getProfileImg().setFilePath(path);
            user.getProfileImg().setFileName(uniqueName);
        }

        if(caption!=null) {
            user.setCaption(caption);
        }

        User newUser =  repo.save(user);
        res.put("caption",newUser.getCaption());
        res.put("profile", newUser.getProfileImg().getFileName());
        return res;
    }

    public List<Person> getUsernameMatches(String name, Long userId, String cursor){
        Pageable page = PageRequest.of(0,20);
        List<Person> res = repo.findPersonByUsernameStartingBy(name,userId,cursor, page);
        return res;
    }

    public List<RequestDTO> getRequests(LocalDateTime cursor, Long id) {
        Pageable page = PageRequest.of(0, 20);
        List<RequestDTO> list =  Rrepo.getRequests(id, cursor, page);
        return list;
    }

    public List<Contact> getConnections(Long id) {
        List<Contact> res =  Crepo.findLatestMessagePerConnection(id);
        res.addAll(Crepo.findLatestMessagePerConnection2(id));
        return res;
    }

    @Transactional
    public void saveRequest(String receiverUsername, Long id) {
        User receiver = repo.findByUsername(receiverUsername);
        if (receiver == null) {
            throw new RuntimeException("User with username " + receiverUsername + " not found");
        }
        User sender = repo.findById(id).orElseThrow(()->  new RuntimeException("User does not exist"));
        Request req = new Request();
        req.setReceiver(receiver);
        req.setSender(sender);
        req.setSentOn(LocalDateTime.now());
        req.setKey(new RequestKey(sender.getId(), receiver.getId()));
        req.setStatus(RecordStatus.PENDING);

        Rrepo.save(req);
        repo.incrementUnseenRequests(receiver.getId());

        RequestDTO request = new RequestDTO(sender.getUsername(), sender.getProfileImg()!=null? sender.getProfileImg().getFileName(): null, LocalDateTime.now());
        messagingTemplate.convertAndSendToUser(receiverUsername, "/queue/request", request);
    }

    @Transactional
    public Contact acceptRequest(Long id, String senderUsername) {
        User sender = repo.findByUsername(senderUsername);

        User receiver = repo.findById(id).orElseThrow(()->  new RuntimeException("User does not exist"));

        if(sender==null){
            Rrepo.deleteByReceiver_IdAndSender_Username(id, senderUsername);
            throw new RuntimeException("This sender does not exist");
        }

        // delete request since its been accepted and is now redundant
        Rrepo.deleteByReceiver_IdAndSender_Id(id, sender.getId());
        Connection connection = new Connection();

        // this is done to make the connection symmetric to ensure uniqueness of the keys
        // by keeping the composite columns in sorted order
        // !!! remember to initialize the object with an explicit composite key
        if (sender.getId() < receiver.getId()) {
            connection.setUser1(sender);
            connection.setUser2(receiver);
            connection.setKey(new ConnectionKey(sender.getId(), receiver.getId()));
        } else {
            connection.setUser1(receiver);
            connection.setUser2(sender);
            connection.setKey(new ConnectionKey(receiver.getId(), sender.getId()));
        }
        Crepo.save(connection);

        Notification notification = new Notification();
        notification.setSender(receiver);
        notification.setTypeId(1);
        notification.setReceiver(sender);
        notification.setType(NotificationType.FRIEND_MESSAGE);
        notification.setPostedOn(LocalDateTime.now());
        Nrepo.save(notification);
        // incrementUnseenNotification for the sender
        repo.incrementUnseenNotifications(sender.getId());

        // send the sender of the request that their request has been accepted
        messagingTemplate.convertAndSendToUser(
                sender.getUsername(),
                "/queue/requestAccepted",
                new NotificationAndContactDTO(
                        new NotificationDTO(
                                receiver.getUsername(),
                                receiver.getProfileImg()!=null?
                                        receiver.getProfileImg().getFileName() : null,
                                notification.getTypeId(),
                                null,
                                null,
                                notification.getType(),
                                notification.getPostedOn()
                        ),
                        new Contact(
                            0,

                            null,
                                null,
                            receiver.getUsername(),
                            null,
                            receiver.getProfileImg()!=null?
                                    receiver.getProfileImg().getFileName(): null,
                            true,
                                LocalDateTime.now()

                ))
        );

        return new Contact(0, null,null, sender.getUsername(), null, sender.getProfileImg()!=null ? sender.getProfileImg().getFileName(): null,true,LocalDateTime.now());
    }
    @Transactional
    public void rejectRequest(Long id, String senderUsername) {
        User sender = repo.findByUsername(senderUsername);

        User receiver = repo.findById(id).orElseThrow(()->  new RuntimeException("User does not exist"));

        if(sender==null){
            Rrepo.deleteByReceiver_IdAndSender_Username(id, senderUsername);
            throw new RuntimeException("This sender does not exist");
        }

        // delete request since its been accepted and is now redundant
        Rrepo.deleteByReceiver_IdAndSender_Id(id, sender.getId());

        Notification notification = new Notification();
        notification.setSender(receiver);
        notification.setTypeId(2);
        notification.setReceiver(sender);
        notification.setType(NotificationType.FRIEND_MESSAGE);
        notification.setPostedOn(LocalDateTime.now());
        Nrepo.save(notification);

        // incrementUnseenNotification for the sender
        repo.incrementUnseenNotifications(sender.getId());
        messagingTemplate.convertAndSendToUser(
                sender.getUsername(),
                "queue/notification",
                new NotificationDTO(
                    receiver.getUsername(),
                    receiver.getProfileImg()!=null?
                        receiver.getProfileImg().getFileName() : null,
                    notification.getTypeId(),
                    null,
                    null,
                    notification.getType(),
                    notification.getPostedOn()
        ));
    }

    @Transactional
    public void setNotificationZero(Long id) {
        repo.setNotificationsZero(id);
    }

    @Transactional
    public void setRequestZero(Long id) {
        repo.setRequestsZero(id);
    }

    @Transactional
    public void setOnline(String user) {
        repo.setOnline(user);
    }

    @Transactional
    public void setOffline(String user) {
        User u = repo.findByUsername(user);
        u.setOnline(false);
        u.setLastSeen(LocalDateTime.now());
    }

    @Transactional
    public GroupDTO saveGroup(CreateGroupDTO formData, String username) throws IOException {
        HashSet<String> adminsSet = new HashSet<>(formData.getAdmins());
        ProfileImg profile = null;
        if(formData.getProfile()!=null){
            String uniqueName = System.currentTimeMillis()+"_"+formData.getProfile().getOriginalFilename();
            String path = uploadDir + File.separator + uniqueName;
            profile = new ProfileImg(path, uniqueName);
            formData.getProfile().transferTo(new File(path));
        }

        List<UserGroup> users = new ArrayList<>();


        Group group = Group.builder()
                .name(formData.getTitle())
                .caption(formData.getCaption())
                .profileImg(profile)
                .build();

        Group savedGroup = Grepo.save(group);

        formData.getMembers().forEach(member->{
            User u = repo.findByUsername(member);
            users.add(new UserGroup( new UserGroupId(u.getId(), savedGroup.getId()),u, savedGroup, 0, adminsSet.contains(member)));
        });

        savedGroup.setMembers(users);

        GroupDTO response = new GroupDTO(savedGroup.getId(), savedGroup.getName(), 0, null, savedGroup.getProfileImg().getFileName(), null , null);
        formData.getMembers().forEach(member->{
            if(!username.equals(member)){
                messagingTemplate.convertAndSendToUser(member,"/queue/newGroup",response);
            }
        });

        return response;
    }

    public List<GroupDTO> getGroups(Long id) {
        return Grepo.getGroups(id);
    }
}
