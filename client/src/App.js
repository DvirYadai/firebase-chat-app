import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./Contexts/AuthContext";
import { DbProvider } from "./Contexts/dbContext";
import PrivateRoute from "./Components/PrivateRoute";
import PrivateChatroomRoute from "./Components/PrivateChatroomRoute";
import Chatroom from "./Pages/Chatroom";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <DbProvider>
          <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <Router>
              <Switch>
                <PrivateRoute exact path="/" component={Main} />
                <PrivateChatroomRoute
                  exact
                  path="/chatroom/:id"
                  component={Chatroom}
                />
                <Route exact path="/signup">
                  <SignUp />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
              </Switch>
            </Router>
          </Container>
        </DbProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
