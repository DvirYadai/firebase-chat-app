import React, { useEffect, useRef, useState } from "react";
import { Nav, Navbar, Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useDB } from "../Contexts/dbContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Components/Message";

export default function Chatroom() {
  const history = useHistory();
  const messageRef = useRef();
  const dummy = useRef();
  const { currentUser, logout } = useAuth();
  const { getOneChatRoom, getAllMessages, addMessage, getOneUser } = useDB();
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");

  const [messages] = useCollectionData(getAllMessages(chatRoomId));

  useEffect(async () => {
    try {
      const res = await getOneChatRoom(history.location.pathname.slice(10));
      setChatRoomId(res.data().chat_room_id);
      setChatRoomName(res.data().chat_room_name);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageRef.current.value === "") {
      alert("Message can't be empty");
      return;
    }
    try {
      const res = await getOneUser(currentUser.uid);
      let user = {};
      res.forEach(
        (doc) => (
          (user.username = doc.data().username),
          (user.imgUrl = doc.data().img_url)
        )
      );
      await addMessage(
        chatRoomId,
        messageRef.current.value,
        currentUser.uid,
        user.username,
        user.imgUrl
      );
      messageRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logout();
      history.push("/login");
    } catch (error) {
      console.log("There was a problem while logging you out");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        borderLeft: "1px solid lightgray",
        borderRight: "1px solid lightgray",
      }}
    >
      <Navbar style={{ width: "100%" }} bg="primary" variant="dark">
        <Navbar.Brand>{chatRoomName}</Navbar.Brand>
        <Nav className="mr-auto">
          <Link style={{ color: "lightgray", textDecoration: "none" }} to="/">
            Home
          </Link>
        </Nav>
        <Button onClick={handleLogOut} variant="outline-info">
          Log Out
        </Button>
      </Navbar>
      <div
        className="messages"
        style={{ height: "400px", padding: "1rem", overflowY: "scroll" }}
      >
        {messages &&
          messages.map((message, index) => (
            <Message key={index} messageInfo={message} />
          ))}
        <div ref={dummy}></div>
      </div>
      <Form className="d-flex" onSubmit={sendMessage}>
        <Form.Control type="text" required ref={messageRef} />
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
}
