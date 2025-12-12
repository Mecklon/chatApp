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
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private MessageRepo Mrepo;

    @Autowired
    private UserRepo Urepo;

    @Autowired
    private ConnectionsRepo Crepo;

    @Autowired
    private GroupRepo Grepo;

    @Autowired
    private UserGroupRepo UGrepo;

    @Autowired
    MultimediaRepo MuRepo;



    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatContextDTO getMessage(String user1, String user2, LocalDateTime time){
        Connection c = Crepo.getConnection(user1, user2);

        Pageable page = PageRequest.of(0, 20);


        List<Message> res = Mrepo.getMessage(time, c.getKey(), page);
        List<MessageDTO> chats =  res.stream().map(m-> new MessageDTO(
                m.getContent(),
                m.getPostedOn(),
                m.getMedia()
                        .stream()
                        .map(media->
                                new MultimediaDTO(
                                        media.getId(),
                                        media.getFileName(),
                                        media.getFileType()))
                        .toList(),
                m.getUser().getUsername(),
                null
        )).toList();

        int reached = c.getUser1().getUsername().equals(user1) ? c.getReached2() : c.getReached1();
        int pending = c.getUser1().getUsername().equals(user1) ? c.getPending2() : c.getPending1();
        return new ChatContextDTO(chats, reached, pending);

    }

    @Value("${file.upload-dir}")
    private String uploadDir;


    @Transactional
    public MessageDTO saveMessage(String content, List<MultipartFile> files, String receiver, String sender) throws IOException {
        Connection c = Crepo.getConnection(receiver, sender);
        User user = Urepo.findByUsername(sender);
        User receiverUser = Urepo.findByUsername(receiver);

        Message mess = new Message();
        mess.setConnection(c);
        mess.setUser(user);
        mess.setPostedOn(LocalDateTime.now());
        if(content!=null){
            mess.setContent(content);
        }
        if(files==null) files = new ArrayList<MultipartFile>();
        for(MultipartFile file: files){
            String uniqueName = System.currentTimeMillis()+"-"+file.getOriginalFilename();
            String path = uploadDir+ File.separator+uniqueName;

            Multimedia media = new Multimedia();
            media.setFilePath(path);
            media.setFileType(file.getContentType());
            media.setFileName(uniqueName);
            media.setMessage(mess);
            media.setConnection(c);

            if (file.getContentType() != null && file.getContentType().startsWith("image")) {
                media.setType(MultimediaType.IMAGE);
            }else if(file.getContentType()!=null && file.getContentType().startsWith("video")){
                media.setType(MultimediaType.VIDEO);
            }else if(file.getContentType()!=null && file.getContentType().startsWith("audio")){
                media.setType(MultimediaType.AUDIO);
            }else{
                media.setType(MultimediaType.FILE);
            }

            mess.getMedia().add(media);
            file.transferTo(new File(path));

        }
        //Message res = Mrepo.save(mess); commented because not needed

        c.setLatest(mess);
        //Crepo.save(c); commented because not needed


        MessageDTO messageDTO =  new MessageDTO(
                mess.getContent(),
                mess.getPostedOn(),
                mess.getMedia()
                        .stream()
                        .map(media->
                                new MultimediaDTO(
                                        media.getId(),
                                        media.getFileName(),
                                        media.getFileType()))
                                        .toList() ,
                mess.getUser()!=null? mess.getUser().getUsername():null,
                null
        );

        if(receiverUser.isOnline()){
            messagingTemplate.convertAndSendToUser(receiver,"/queue/receivedMessage",messageDTO);
        }else{

            if(c.getUser2().getUsername().equals(receiver)){
                c.setPending2(c.getPending2()+1);
                c.setReached2(c.getReached2()+1);
            }else{
                c.setPending1(c.getPending1()+1);
                c.setReached1(c.getReached1()+1);
            }
            //Crepo.save(c); commented because not needed
        }
        return messageDTO;
    }

    @Transactional
    public void incrementPending(String receiver, String sender) {
        Connection c = Crepo.getConnection(receiver, sender);
        if(c.getUser2().getUsername().equals(receiver)){
            c.setPending2(c.getPending2()+1);
        }else{
            c.setPending1(c.getPending1()+1);
        }
        //Crepo.save(c);
        Crepo.save(c);
        messagingTemplate.convertAndSendToUser(sender, "queue/reached",receiver);
    }


    public void setPendingZero(String receiver, String sender) {
        Connection c = Crepo.getConnection(receiver, sender);
        if(c.getUser2().getUsername().equals(receiver)){
            c.setPending2(0);
        }else{
            c.setPending1(0);
        }
        messagingTemplate.convertAndSendToUser(sender, "queue/seenMessage",receiver);
        Crepo.save(c);
    }

    @Transactional
    public void setReachedZero(Long id) {
        Crepo.setReachedZero(id);
        Crepo.setReachedZero2(id);


        List<UserGroup> groups = UGrepo.findAllByUserId(id);

        for(UserGroup user : groups){
            boolean flag = false;
            if(user.getGroup().getMaxReached() > user.getReached()){
                user.setReached(0);
            }else{
                user.setReached(0);
                int maxReached = UGrepo.getMaxReached(user.getGroup().getId(), id);
                user.getGroup().setMaxReached(maxReached);

                messagingTemplate.convertAndSend("/topic/group/"+user.getGroup().getId(),
                        new GroupWebsocketDTO(
                                GroupWebsocketStatus.CHECK_MARK_UPDATE,
                                null,
                                    user.getGroup().getId(),user.getGroup().getMaxPending(),
                                    maxReached
                        ));
            }
        }
    }
    @Transactional
    public GroupMessageDTO saveGroupMessage(String content, List<MultipartFile> files, long groupId, String name) throws IOException {
        Group g = Grepo.findById(groupId).orElseThrow();
        Message m = new Message();
        m.setGroup(g);
        m.setContent(content);
        m.setPostedOn(LocalDateTime.now());
        User u = Urepo.findByUsername(name);

        m.setUser(u);

        if(files!=null){
            for(MultipartFile file: files){
                String uniqueName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                String path = uploadDir + File.separator + uniqueName;

                Multimedia media = new Multimedia();
                media.setFileType(file.getContentType());
                media.setFilePath(path);
                media.setFileName(uniqueName);
                media.setMessage(m);
                media.setGroup(g);
                m.getMedia().add(media);

                if (file.getContentType() != null && file.getContentType().startsWith("image")) {
                    media.setType(MultimediaType.IMAGE);
                }else if(file.getContentType()!=null && file.getContentType().startsWith("video")){
                    media.setType(MultimediaType.VIDEO);
                }else if(file.getContentType()!=null && file.getContentType().startsWith("audio")){
                    media.setType(MultimediaType.AUDIO);
                }else{
                    media.setType(MultimediaType.FILE);
                }

                file.transferTo(new File(path));
            }
        }

        g.setLatest(m);
        UGrepo.incrementPendingAndReached(u.getId(), groupId);
        g.setMaxPending(g.getMaxPending()+1);
        g.setMaxReached(g.getMaxReached()+1);

        GroupMessageDTO response = new GroupMessageDTO(
                m.getContent(),
                m.getPostedOn(),
                m.getMedia()
                        .stream()
                        .map(media->
                            new MultimediaDTO(
                                    media.getId(),
                                    media.getFileName(),
                                    media.getFileType()
                            )
                        )
                        .toList(),
                name,
                u.getProfileImg().getFileName()
        );
        messagingTemplate.convertAndSend("/topic/group/"+groupId, new GroupWebsocketDTO(GroupWebsocketStatus.MESSAGE, response, groupId,0,0));

        return response;
    }

    public ChatContextDTO getGroupMessages(long id, LocalDateTime cursor) {

        System.out.println(id);
        Group g = Grepo.findById(id).orElseThrow();
        List<Message> messages = Mrepo.getGroupMessages(id, cursor,PageRequest.of(0,20));

        List<MessageDTO> messageDTOS = messages.stream()
                .map(message->
                        new MessageDTO(
                                message.getContent(),
                                message.getPostedOn(),
                                message.getMedia().stream()
                                                .map(media->
                                                        new MultimediaDTO(
                                                                media.getId(),
                                                                media.getFileName(),
                                                                media.getFileType()
                                                        )
                                                ).toList(),
                                message.getUser()!=null? message.getUser().getUsername():null,
                                message.getUser()!=null? message.getUser().getProfileImg().getFileName():null
                        )
                ).toList();

        return new ChatContextDTO(messageDTOS, g.getMaxReached(), g.getMaxPending());
    }


    @Transactional
    public void propogateReceived(long groupId, Long id) {
        UserGroup ug = UGrepo.findById(new UserGroupId(groupId, id)).orElseThrow();
        Group g = Grepo.findById(groupId).orElseThrow();



        if(g.getMaxReached() > ug.getReached()){
            ug.setReached(0);
        }else{
            ug.setReached(0);
            int maxReached = UGrepo.getMaxReached(groupId, id);
            if(maxReached < g.getMaxReached()) {
                g.setMaxReached(maxReached);
                messagingTemplate.convertAndSend("/topic/group/" + groupId, new GroupWebsocketDTO(GroupWebsocketStatus.CHECK_MARK_UPDATE, null, groupId, g.getMaxPending(), maxReached));
                }
            }
    }

    @Transactional
    public void propogateReceivedAndPending(long groupId, Long id){
        UserGroup ug = UGrepo.findById(new UserGroupId(groupId, id)).orElseThrow();
        Group g = Grepo.findById(groupId).orElseThrow();



        int maxReached;
        int maxPending;
        boolean flag = false;

        if(g.getMaxReached() > ug.getReached()){
            ug.setReached(0);
        }else{
            ug.setReached(0);
            maxReached = UGrepo.getMaxReached(groupId, id);

            if(maxReached < g.getMaxReached()){
                flag = true;
                g.setMaxReached(maxReached);
            }
        }


        if(g.getMaxPending() > ug.getPending()){
            ug.setPending(0);
        }else{
            ug.setPending(0);
            maxPending = UGrepo.getMaxPending(groupId, id);
            if(maxPending < g.getMaxPending()){
                flag = true;
                g.setMaxPending(maxPending);
            }
        }

        if(flag){
            messagingTemplate.convertAndSend("/topic/group/"+groupId, new GroupWebsocketDTO(GroupWebsocketStatus.CHECK_MARK_UPDATE, null, groupId,g.getMaxPending(),g.getMaxReached()));
        }

    }

    @Transactional
    public void propogatePending(long groupId, long id) {
        UserGroup ug = UGrepo.findById(new UserGroupId(groupId, id)).orElseThrow();
        Group g = Grepo.findById(groupId).orElseThrow();


        if(g.getMaxPending() > ug.getPending()){
            ug.setPending(0);
        }else{
            ug.setPending(0);
            int maxPending = UGrepo.getMaxPending(groupId, id);

            if(maxPending< g.getMaxPending()){
                g.setMaxPending(maxPending);
                messagingTemplate.convertAndSend("/topic/group/"+groupId, new GroupWebsocketDTO(GroupWebsocketStatus.CHECK_MARK_UPDATE, null, groupId,maxPending,g.getMaxReached()));
            }
        }
    }

    public List<MultimediaDTO> getVisualMediaPage(String user1Name, long user2Id, long cursor) {
        User user1 = Urepo.findByUsername(user1Name);
        ConnectionKey key;
        if(user1.getId()< user2Id){
            key = new ConnectionKey(user1.getId(), user2Id);
        }else{
            key = new ConnectionKey(user2Id, user1.getId());
        }


        List<MultimediaDTO> res = MuRepo.findVisualMediaPageByConnectionKey(key, cursor, MultimediaType.FILE,PageRequest.of(0,20));
        return res;
    }

    public List<MultimediaDTO> getDocumentPage(String user1Name, long user2Id, long cursor){
        User user1 = Urepo.findByUsername(user1Name);
        ConnectionKey key;
        if(user1.getId()< user2Id){
            key = new ConnectionKey(user1.getId(), user2Id);
        }else{
            key = new ConnectionKey(user2Id, user1.getId());
        }

        return MuRepo.findDocumentPageByConnectionKey(key , cursor, MultimediaType.FILE, PageRequest.of(0, 20));
    }

    public GroupInfoDTO getGroupData(long id, Long principalId) {
        Group g = Grepo.findById(id).orElseThrow();
        UserGroup ug = UGrepo.findById(new UserGroupId(id, principalId)).orElseThrow();


        return new GroupInfoDTO(g.getCaption(), ug.isAdmin());
    }

    public List<MultimediaDTO> getGroupVisualMedia(long id, long cursor) {
        return MuRepo.findGroupVisualMedia(id, cursor, MultimediaType.FILE,PageRequest.of(0,20));
    }

    public List<MultimediaDTO> getGroupDocumentMedia(long id, long cursor) {
        return MuRepo.findGroupDocumentMedia(id, cursor, MultimediaType.FILE,PageRequest.of(0,20));
    }
}
