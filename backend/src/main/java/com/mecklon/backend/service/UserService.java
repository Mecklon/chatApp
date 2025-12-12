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
    private MessageRepo Mrepo;


    @Autowired
    private UserGroupRepo UGrepo;

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
                                notification.getPostedOn(),
                                null
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
                    notification.getPostedOn(), null
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
            users.add(new UserGroup( new UserGroupId(u.getId(), savedGroup.getId()),u, savedGroup, 0,0, adminsSet.contains(member)));
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

    public UserInfoDTO getUserData(String username) {
        User u = repo.findByUsername(username);
        return new UserInfoDTO(u.getCaption());
    }

    public List<GroupMemberDTO> getMembers(long id) {
        return repo.getGroupMembers(id);
    }


    @Transactional
    public void kickMember(String username, Long id, Long principalId, String principalUsername) {
        UserGroup ug = UGrepo.findById(new UserGroupId(id, principalId)).orElseThrow();
        Group g = Grepo.findById(id).orElseThrow();

        if(!ug.isAdmin()){
            throw new RuntimeException("not an admin");
        }

        User kickedUser = repo.findByUsername(username);
        kickedUser.setUnseenNotifications(kickedUser.getUnseenNotifications()+1);

        UserGroup connection = UGrepo.findById(new UserGroupId(id,kickedUser.getId())).orElseThrow();

        Message m = new Message().builder()
                .content(principalUsername+" kicked out "+username)
                .group(g)
                .postedOn(LocalDateTime.now())
                .build();

        Mrepo.save(m);

        g.setLatest(m);

        GroupMessageDTO response = new GroupMessageDTO(
                m.getContent(),
                m.getPostedOn(),
                null,
                null,
                null
        );

        Notification notification  = new Notification();
        notification.setTypeId(3);
        notification.setReceiver(kickedUser);
        notification.setGroup(g);
        notification.setType(NotificationType.GROUP_MESSAGE);
        notification.setPostedOn(LocalDateTime.now());
        Nrepo.save(notification);


        int maxReached;
        int maxPending;
        boolean flag = false;

        if(g.getMaxReached() > ug.getReached()){
            ug.setReached(0);
        }else{
            ug.setReached(0);
            maxReached = UGrepo.getMaxReached(id, kickedUser.getId());

            if(maxReached < g.getMaxReached()){
                flag = true;
                g.setMaxReached(maxReached);
            }
        }


        if(g.getMaxPending() > ug.getPending()){
            ug.setPending(0);
        }else{
            ug.setPending(0);
            maxPending = UGrepo.getMaxPending(id, kickedUser.getId());
            if(maxPending < g.getMaxPending()){
                flag = true;
                g.setMaxPending(maxPending);
            }
        }

        if(flag){
            messagingTemplate.convertAndSend("/topic/group/"+id, new GroupWebsocketDTO(GroupWebsocketStatus.CHECK_MARK_UPDATE, null, id,g.getMaxPending(),g.getMaxReached()));
        }

        UGrepo.incrementPendingAndReached(principalId, id);
        g.setMaxPending(g.getMaxPending()+1);
        g.setMaxReached(g.getMaxReached()+1);




        UGrepo.delete(connection);



        NotificationDTO notificationDTO = new NotificationDTO(
                null,
                null,
                3,
                g.getName(),
                g.getProfileImg()!=null? g.getProfileImg().getFileName():null,
                NotificationType.GROUP_MESSAGE,
                notification.getPostedOn(),
                id
        );
        messagingTemplate.convertAndSendToUser(username,"/queue/kickedOut",notificationDTO);
        messagingTemplate.convertAndSend("/topic/group/"+id, new GroupWebsocketDTO(GroupWebsocketStatus.MESSAGE, response, id,0,0));




    }

    @Transactional
    public void addMember(String username, long groupId, Long id, String username1) {

        User addedMember = repo.findByUsername(username);
        Group g = Grepo.findById(groupId).orElseThrow();

        UserGroup ug = new UserGroup();
        ug.setId(new UserGroupId(groupId, addedMember.getId()));
        ug.setAdmin(false);
        ug.setGroup(g);
        ug.setUser(addedMember);

        UGrepo.save(ug);

        Message m = new Message().builder()
                .content(username1+" added "+username)
                .group(g)
                .postedOn(LocalDateTime.now())
                .build();

        g.setLatest(m);

        GroupMessageDTO response = new GroupMessageDTO(
                m.getContent(),
                m.getPostedOn(),
                null,
                null,
                null
        );

        UGrepo.incrementPendingAndReached(id, groupId);
        g.setMaxPending(g.getMaxPending()+1);
        g.setMaxReached(g.getMaxReached()+1);

        Notification notification  = new Notification();
        notification.setTypeId(4);
        notification.setReceiver(addedMember);
        notification.setGroup(g);
        notification.setType(NotificationType.GROUP_MESSAGE);
        notification.setPostedOn(LocalDateTime.now());
        Nrepo.save(notification);

        NotificationDTO notificationDTO = new NotificationDTO(
                null,
                null,
                3,
                g.getName(),
                g.getProfileImg()!=null? g.getProfileImg().getFileName():null,
                NotificationType.GROUP_MESSAGE,
                notification.getPostedOn(),
                id
        );

        GroupDTO groupDTO = new GroupDTO(
                g.getId(),
                g.getName(),
                0,
                null,
                g.getProfileImg()!=null? g.getProfileImg().getFileName(): null,
                null,
                null
        );

        messagingTemplate.convertAndSendToUser(username,"/queue/addedToGroup",new NewGroupDTO(notificationDTO, groupDTO));
        messagingTemplate.convertAndSend("/topic/group/"+id, new GroupWebsocketDTO(GroupWebsocketStatus.MESSAGE, response, id,0,0));



    }
}
