package com.chatApp.chatapp.Repo;

import com.chatApp.chatapp.Entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepo extends MongoRepository<Room,String > {
    //get the room by using the room id

    Room findByRoomId(String roomId);
}
