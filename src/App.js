import React, { useEffect, useState } from "react";
import "./App.css";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./Components/JS/ImageUpload";
import { db, auth, storage } from "./Components/Firebase/Firebase.js";
import Post from "./Components/JS/Post";
import { Button, Input, makeStyles } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setposts] = useState([]);
  const [opensigin, setopensigin] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log(authuser);
        setUser(authuser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };
  const signin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setopensigin(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signup}>
              Signup
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={opensigin} onClose={() => setopensigin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signin}>
              Signin
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Sign Out</Button>
        ) : (
          <div className="app__logincontainer">
            <Button onClick={setopensigin}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__post">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Login to Upload</h3>
      )}
    </div>
  );
}

export default App;
