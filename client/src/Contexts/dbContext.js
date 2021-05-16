import React, { createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import app from "../firebase";
import "firebase/firestore";

const DbContext = createContext();

export function useDB() {
  return useContext(DbContext);
}

const db = app.firestore();

export function DbProvider({ children }) {
  function getAllChatrooms() {
    return db.collection("ChatRooms").get();
  }

  function getOneChatRoom(id) {
    const docRef = db.collection("ChatRooms").doc(id);
    return docRef.get();
  }

  function addChatRoom(name) {
    return db.collection("ChatRooms").add({
      chat_room_id: uuidv4(),
      chat_room_name: name,
      users_connected: [],
    });
  }

  function getOneUser(uid) {
    return db.collection("Users").where("user_uid", "==", uid).get();
  }

  function addUser(imgUrl, userUid, username) {
    return db.collection("Users").add({
      img_url: imgUrl,
      user_uid: userUid,
      username: username,
    });
  }

  function getAllMessages(roomId) {
    return db.collection("Messages").where("chatroom_id", "==", roomId);
    // .orderBy("time");
  }

  function addMessage(chatRoomId, message, userUid, username, userImg) {
    const messageObj = {
      chatroom_id: chatRoomId,
      message,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      user_uid: userUid,
      username,
      user_img: userImg,
    };
    console.log(messageObj);

    return db.collection("Messages").add(messageObj);
  }

  const value = {
    getAllChatrooms,
    addUser,
    addChatRoom,
    getOneChatRoom,
    getAllMessages,
    addMessage,
    getOneUser,
  };

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}
