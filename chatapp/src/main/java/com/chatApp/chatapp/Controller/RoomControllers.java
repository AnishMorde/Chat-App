package com.chatApp.chatapp.Controller;


import com.chatApp.chatapp.Entity.Message;
import com.chatApp.chatapp.Entity.Room;
import com.chatApp.chatapp.Repo.RoomRepo;
import com.chatApp.chatapp.config.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(AppConstants.FRONT_END_BASE_URL)
public class RoomControllers {
    @Autowired
    private RoomRepo roomRepo;

    public RoomControllers(RoomRepo roomRepo) {
        this.roomRepo = roomRepo;
    }

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        //if room exists with that roomId you cannot create new room with that roomId
        if(roomRepo.findByRoomId(roomId)!=null){
             return ResponseEntity.badRequest().body("Room Already Exists ");
        }

        //create the new room
        Room room = new Room();
        room.setRoomId(roomId);
      Room savedRoom =   roomRepo.save(room);
      return ResponseEntity.status(HttpStatus.CREATED).body(room);

    }

    //get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
        Room rooms = roomRepo.findByRoomId(roomId);
        if(rooms==null){
            return ResponseEntity.badRequest().body("Room Not found");
        }
        return ResponseEntity.ok(rooms);
    }



    //get messages of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMsg(
            @PathVariable String roomId  ,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size" , defaultValue = "20" , required = false) int size

            )

    {
        Room room = roomRepo.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
        }

        List<Message> message = room.getMessages();
        int start = Math.max(0, message.size()-(page+1)*size);
        int end = Math.min(message.size() , start + size);
        List<Message> PaginatedMsg = message.subList(start, end);
        return ResponseEntity.ok(PaginatedMsg);

    }

}
