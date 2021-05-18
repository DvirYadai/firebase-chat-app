import React, { useState, useRef, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useDB } from "../Contexts/dbContext";
import { Form, Button, Card, Alert } from "react-bootstrap";

export default function PrivateChatroomRoute({
  component: Component,
  ...rest
}) {
  const { getOneChatRoom, addPermission } = useDB();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(false);
  const history = useHistory();

  useEffect(async () => {
    const chatroom = await getOneChatRoom(history.location.pathname.slice(10));
    if (!chatroom.data().users.includes(currentUser.uid)) {
      setPermission(true);
      // history.push("/");
      // alert("Your don't have permissions for this chatroom");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const user = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      setLoading(false);
      const chatroom = await getOneChatRoom(
        history.location.pathname.slice(10)
      );
      if (!chatroom.data().users.includes(user.user.uid)) {
        history.push("/");
        alert("Your don't have permissions for this chatroom");
      }
    } catch (error) {
      setLoading(false);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Email or password are incorrect");
      } else setError("Failed to sign in");
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const chatroom = await getOneChatRoom(
        history.location.pathname.slice(10)
      );
      if (passwordRef.current.value !== chatroom.data().room_password) {
        setLoading(false);
        setError("Password incorrect");
        return;
      }
      await addPermission(history.location.pathname.slice(10), currentUser.uid);
      history.go(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("There was a problem, please try again");
    }
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser && !permission ? (
          <Component {...props} />
        ) : permission ? (
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Chatroom password</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handlePassword}>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Button type="submit" className="w-100 mt-3">
                  {loading ? (
                    <div className="spinner-border text-dark" role="status">
                      <span className="sr-only"></span>
                    </div>
                  ) : (
                    "Enter"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Button type="submit" className="w-100 mt-3">
                  {loading ? (
                    <div className="spinner-border text-dark" role="status">
                      <span className="sr-only"></span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        );
      }}
    ></Route>
  );
}
