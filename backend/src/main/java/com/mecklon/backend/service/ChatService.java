package com.mecklon.backend.service;

import com.mecklon.backend.DTO.ChatContextDTO;
import com.mecklon.backend.DTO.MessageDTO;
import com.mecklon.backend.DTO.MultimediaDTO;
import com.mecklon.backend.model.*;
import com.mecklon.backend.repo.ConnectionsRepo;
import com.mecklon.backend.repo.MessageRepo;
import com.mecklon.backend.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.midi.Receiver;
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
                                        media.getFileType(),
                                        media.getFileType()))
                        .toList() ,
                m.getUser().getUsername()
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
                                        media.getFileType(),
                                        media.getFileType()))
                                        .toList() ,
                mess.getUser().getUsername()
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
        Crepo.save(c);
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
    }
}
