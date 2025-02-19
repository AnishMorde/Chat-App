package com.chatApp.chatapp.Controller;


import com.chatApp.chatapp.Entity.Message;
import com.chatApp.chatapp.Entity.Room;
import com.chatApp.chatapp.PayLoad.MessageRequest;
import com.chatApp.chatapp.Repo.RoomRepo;
import com.chatApp.chatapp.config.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(AppConstants.FRONT_END_BASE_URL)
public class ChatController {

    @Autowired
    private RoomRepo roomRepo;

    public ChatController(RoomRepo roomRepo) {
        this.roomRepo = roomRepo;
    }


    //send message /app/sendMessage/{roomId}
    @MessageMapping("/sendMessage/{roomId}")
    //subscribers get the msg
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId ,
            @RequestBody MessageRequest request
    )
    {
        Room room = roomRepo.findByRoomId(request.getRoomId());
        Message msg = new Message();
        msg.setContent(request.getContent());
        msg.setSender(request.getSender());
        msg.setTimeStamp(LocalDateTime.now());

        if(room != null ){
            room.getMessages().add(msg);
            roomRepo.save(room);
        }else{
            throw new RuntimeException("Room not found");
        }

        return msg;

    }



}
