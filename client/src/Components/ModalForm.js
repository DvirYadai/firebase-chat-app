import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function ModalForm({
  modalTitle,
  formLabel,
  buttonText,
  showForm,
  handleCloseForm,
  handleSubmit,
  loading,
  setRoomPassword,
  alertDiv,
  setInputState,
}) {
  const [isRoom, setIsRoom] = useState(true);

  useEffect(() => {
    if (modalTitle === "Invite users") {
      setIsRoom(false);
    }
  }, []);

  return (
    <Modal show={showForm} onHide={handleCloseForm}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group id="name">
            <Form.Label>{formLabel}</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setInputState(e.target.value)}
              required
            />
          </Form.Group>
          {isRoom && (
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setRoomPassword(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <div style={{ textAlign: "center" }}>{alertDiv}</div>
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
            buttonText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
