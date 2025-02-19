import axios from "axios";
import { httpClient } from "../Config/AxiosHelper"; // Add `.js` if needed

 const createRoomApi = async (roomDetail) => {
  const respone = await httpClient.post(`/api/v1/rooms`, roomDetail, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return respone.data;
};

export  { createRoomApi };

 const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export {joinChatApi};

 const getMessagessApi = async (roomId , size =50 , page =0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};

export { getMessagessApi };