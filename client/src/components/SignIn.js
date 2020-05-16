import React, {useEffect, useState} from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "../styles/App.css";
import Modal from "react-bootstrap/Modal";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {checkUserAndPw, createUserInDb} from "../utils";
import Alert from "react-bootstrap/Alert";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [signedIn, setsignedIn] = useState(false);
  const [signInFail, setsignInFail] = useState(false);


  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function alphanumeric() {
      var code, i, len;
      for (i = 0, len = username.length; i < len; i++) {
          code = username.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
              return false;
          }
      }
      return true;
  }

  function validateConfirmPassword() {
      return password === confirmPassword;
    }

  const validateFormSignUp = () => {
    return validateForm() && password === confirmPassword;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      // username and password stored in state
      console.log("submitting sign in..");
      const response = await checkUserAndPw(username, password);
      if (response.signedIn) {
        // alert("welcome, "+response.username);
        setsignedIn(true);
        props.onUsernameChange(response.signedIn, response.username);

        handleClose();
      } else {
        setsignedIn(false);
        setsignInFail(true);
      }

      // call POST api with username and password payload
      // if they match, send back good message and user is signed in. else, fail message
      console.log(JSON.stringify(response, null, 2));


    } else {
      console.log("err");
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (validateFormSignUp() && validateConfirmPassword() && alphanumeric()) {

      console.log("username:" +username);
      console.log("password:" +password);
      const response = await createUserInDb(username, password);
      if (response.signedIn) {
        setsignedIn(true);
        // here: send username to parent
        // make fun that calls onSelect from props
        props.onUsernameChange(response.signedIn, response.username);
      } else {
        setsignedIn(false);
      }

    } else {
        if(!alphanumeric()) alert("Username must be alphanumeric");
        if(!validateConfirmPassword()) alert("Passwords did not match, please try again.");
        console.log("errr");
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // need to send signedIn and username up to App.js, then down to P5Board for db saving

  return (
  <>
    <button className="nonSelected" onClick={handleShow}>{signedIn ? username : "Sign In"}</button>

    <Modal show={show} onHide={handleClose}>
      {signedIn ? <Alert variant="primary">{"Welcome, "+username}</Alert> : null}
      {signInFail ? <Alert variant="danger">{"Error: Sign In Failed"}</Alert> : null}
      <Modal.Body>
        <Tabs defaultActiveKey="signin" id="signin-ex">
          <Tab eventKey="signin" title="Sign In">
            <form onSubmit={handleSubmit}>
              <FormGroup controlId="username" bssize="large">
                <FormLabel>Username</FormLabel>
                <FormControl
                    autoFocus
                    type="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
              </FormGroup>
              <FormGroup controlId="password" bssize="large">
                <FormLabel>Password</FormLabel>
                <FormControl
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                />
              </FormGroup>
              <Button block bssize="large" disabled={!validateForm()} type="submit" onClick={null}>{"Login"}</Button>
            </form>
          </Tab>
          <Tab eventKey="signup" title="Sign Up">
            <form onSubmit={handleSignUp}>
              <FormGroup controlId="userSignUp" bssize="large">
                <FormLabel>Username</FormLabel>
                <FormControl
                    autoFocus
                    type="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
              </FormGroup>
              <FormGroup controlId="passwordSignUp" bssize="large">
                <FormLabel>Password</FormLabel>
                <FormControl
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                />
              </FormGroup>
              <FormGroup controlId="passwordConfirm" bssize="large">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                    value={confirmPassword}
                    onChange={e => setconfirmPassword(e.target.value)}
                    type="password"
                />
              </FormGroup>
              <Button block bssize="large" disabled={!validateForm()} type="submit" onClick={handleClose}>{"Login"}</Button>
            </form>
          </Tab>
        </Tabs>

      </Modal.Body>
    </Modal>
  </>
  );
}