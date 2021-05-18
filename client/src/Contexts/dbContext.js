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

  async function addChatRoom(id, name, userUid, roomPassword) {
    await db
      .collection("ChatRooms")
      .doc(id)
      .set({
        chat_room_id: id,
        room_password: roomPassword,
        chat_room_name: name,
        users: [userUid],
      });
  }

  function getOneUser(uid) {
    return db.collection("Users").where("user_uid", "==", uid).get();
  }

  function addUser(imgUrl, userUid, username, email) {
    return db.collection("Users").add({
      img_url: imgUrl,
      user_uid: userUid,
      username,
      email,
    });
  }

  function getAllMessages(roomId) {
    return db
      .collection("Messages")
      .where("chatroom_id", "==", roomId)
      .orderBy("time");
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

    return db.collection("Messages").add(messageObj);
  }

  function addPermission(chatroomID, userUid) {
    return db
      .collection("ChatRooms")
      .doc(chatroomID)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(userUid),
      });
  }

  const value = {
    getAllChatrooms,
    addUser,
    addChatRoom,
    getOneChatRoom,
    getAllMessages,
    addMessage,
    getOneUser,
    addPermission,
  };

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}
