import React, { useEffect, useRef, useState } from "react";
import { Nav, Navbar, Button, Form, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useDB } from "../Contexts/dbContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Components/Message";
import ModalForm from "../Components/ModalForm";

export default function Chatroom() {
  const history = useHistory();
  const messageRef = useRef();
  const dummy = useRef();
  const { currentUser, logout } = useAuth();
  const { getOneChatRoom, getAllMessages, addMessage, getOneUser } = useDB();
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteUid, setInviteUid] = useState("");
  const [alertDiv, setAlertDiv] = useState("");

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

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setAlertDiv("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertDiv("");
    setLoading(true);
    if (inviteUid === "") {
      setAlertDiv("You must enter an Uid");
      setLoading(false);
      return;
    }
    try {
      const user = await getOneUser(inviteUid);
      if (user.empty) {
        setAlertDiv("Uid doesn't exists");
        return;
      }
      setLoading(false);
      setAlertDiv(
        "Give your invited user this page url and the password for the room"
      );
      setInviteUid("");
    } catch (error) {
      setAlertDiv("There was a problem, please try again");
      setLoading(false);
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
        <Button onClick={handleShowForm} variant="outline-info">
          Invite users
        </Button>
        <ModalForm
          modalTitle="Invite users"
          formLabel="User Email"
          buttonText="Invite"
          showForm={showForm}
          handleCloseForm={handleCloseForm}
          handleSubmit={handleSubmit}
          loading={loading}
          setInputState={setInviteUid}
          alertDiv={alertDiv}
        />
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
