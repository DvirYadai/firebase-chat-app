import React from "react";
import { useAuth } from "../Contexts/AuthContext";

export default function Message({ messageInfo }) {
  const { currentUser } = useAuth();
  const myMessagesStyle = {
    width: "100%",
    textAlign: "left",
    border: "1px solid lightgrey",
    borderRadius: "15px",
    padding: "0.5rem 1rem 0.5rem 1rem",
    lineHeight: "0",
    marginBottom: "0.5rem",
  };
  const otherMessagesStyle = {
    width: "100%",
    position: "relative",
    left: "0",
    textAlign: "right",
    border: "1px solid lightgrey",
    borderRadius: "15px",
    padding: "0.5rem 1rem 0.5rem 1rem",
    lineHeight: "0",
    marginBottom: "0.5rem",
  };

  return (
    <div
      style={
        currentUser.uid === messageInfo.user_uid
          ? myMessagesStyle
          : otherMessagesStyle
      }
    >
      <p style={{ color: "red" }}>
        {currentUser.uid === messageInfo.user_uid ? (
          "You:"
        ) : (
          <>
            <img
              style={{
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                objectFit: "cover",
              }}
              src={messageInfo.user_img}
              alt="user_img"
            />
            {messageInfo.username + ":"}
          </>
        )}
      </p>
      <p>{messageInfo.message}</p>
    </div>
  );
}
