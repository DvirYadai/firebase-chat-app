import React, { useEffect, useRef, useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useDB } from "../Contexts/dbContext";
import { v4 as uuidv4 } from "uuid";
import ModalForm from "../Components/ModalForm";

export default function Main() {
  const history = useHistory();
  const { logout, currentUser } = useAuth();
  const { getAllChatrooms, addChatRoom, getOneChatRoom } = useDB();
  const [chatRooms, setChatRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertDiv, setAlertDiv] = useState("");
  const [chatRoomName, setChatRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  useEffect(async () => {
    const temp = [];
    try {
      const allChatrooms = await getAllChatrooms();
      allChatrooms.forEach((doc) => {
        const data = doc.data();
        for (const uid of data.users) {
          if (uid === currentUser.uid) {
            temp.push(doc.data());
          }
        }
      });
      setChatRooms([...temp]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const id = uuidv4();
    try {
      await addChatRoom(id, chatRoomName, currentUser.uid, roomPassword);
      const res = await getOneChatRoom(id);
      setLoading(false);
      setShowForm(false);
      const roomInfo = res.data();
      history.push(`/chatroom/${roomInfo.chat_room_id}`);
    } catch (error) {
      setLoading(false);
      setAlertDiv("There was a problem, please try again");
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
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
    <div>
      <Button className="mx-3" onClick={handleLogOut}>
        Log Out
      </Button>
      <Button onClick={handleShowForm}>Create new chatroom</Button>
      <ModalForm
        modalTitle="Create new chatroom"
        formLabel="Name"
        buttonText="Create room"
        showForm={showForm}
        handleCloseForm={handleCloseForm}
        handleSubmit={handleSubmit}
        loading={loading}
        setInputState={setChatRoomName}
        setRoomPassword={setRoomPassword}
        alertDiv={alertDiv}
      />
      <div className="mt-4">
        <h4>Your chatrooms:</h4>
        <ListGroup>
          {chatRooms.map((room, index) => (
            <ListGroup.Item key={index}>
              <Link to={`/chatroom/${room.chat_room_id}`}>
                {room.chat_room_name}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}
