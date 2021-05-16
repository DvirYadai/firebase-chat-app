import React, { useEffect, useRef, useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useDB } from "../Contexts/dbContext";

export default function Main() {
  const history = useHistory();
  const { logout } = useAuth();
  const { getAllChatrooms, addChatRoom, getOneChatRoom } = useDB();
  const [chatRooms, setChatRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatRoomNameRef = useRef();

  useEffect(async () => {
    const temp = [];
    try {
      const allChatrooms = await getAllChatrooms();
      allChatrooms.forEach((doc) => temp.push(doc.data()));
      setChatRooms([...temp]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const room = await addChatRoom(chatRoomNameRef.current.value);
      const res = await getOneChatRoom(room.id);
      setLoading(false);
      setShowForm(false);
      const roomInfo = res.data();
      history.push(`/chatroom/${roomInfo.chat_room_id}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
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
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header>
          <Modal.Title>Create new chatroom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={chatRoomNameRef} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {loading ? (
              <div className="spinner-border text-dark" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              "Create room"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="mt-4">
        <h4>Current chatrooms:</h4>
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
