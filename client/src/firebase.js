import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAg_AzmxM3B4-ysVqjGXWuxQe9xWa-pwzY",
  authDomain: "chat-app-90456.firebaseapp.com",
  projectId: "chat-app-90456",
  storageBucket: "chat-app-90456.appspot.com",
  messagingSenderId: "953953202969",
  appId: "1:953953202969:web:657b9fd48a28f973958b88",
});

export const auth = app.auth();
export default app;
