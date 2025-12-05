package com.mecklon.backend;

import com.mecklon.backend.DTO.Contact;
import com.mecklon.backend.repo.ConnectionsRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class TodoApplicationTests {

	@Test
	void contextLoads() {
	}


    @Autowired
    ConnectionsRepo crepo;
    @Test
    void test(){
        List<Contact> list = crepo.findLatestMessagePerConnection((long)1);
        list.addAll(crepo.findLatestMessagePerConnection2((long)1));

        for(Contact c: list){
            System.out.println(c);
        }

        System.out.println("hello world");
    }

}
