import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../Contexts/AuthContext";
import { useDB } from "../Contexts/dbContext";
import { Link, useHistory } from "react-router-dom";
import app from "../firebase";
import "firebase/storage";

export default function SignUp() {
  const storage = app.storage();
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const imgRef = useRef();
  const { signup } = useAuth();
  const { addUser } = useDB();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      imgRef.current.files[0] &&
      imgRef.current.files[0].type !== "image/png"
    ) {
      setError("The image must be '.png' file");
      setLoading(false);
      return;
    }

    setError("");
    try {
      const { user } = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (!imgRef.current.files[0]) {
        console.log("no img");
        await addUser(null, user.uid, usernameRef.current.value);
        setLoading(false);
        history.push("/");
        return;
      } else {
        const storageResults = await storage
          .ref(`users_images/${user.uid}.png`)
          .put(imgRef.current.files[0]);
        const downloadUrl = await storage
          .ref()
          .child(storageResults._delegate.metadata.fullPath)
          .getDownloadURL();
        await addUser(downloadUrl, user.uid, usernameRef.current.value);
        setLoading(false);
        history.push("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="img">
              <Form.Label>Your image</Form.Label>
              <Form.File ref={imgRef} />
            </Form.Group>
            <Button type="submit" className="w-100 mt-3">
              {loading ? (
                <div className="spinner-border text-dark" role="status">
                  <span className="sr-only"></span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}
