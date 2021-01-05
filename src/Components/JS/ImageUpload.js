import { Button } from "@material-ui/core";
import firebase from "firebase";
import React, { useState } from "react";
import { db, auth, storage } from "../Firebase/Firebase";
import "../CSS/ImageUpload.css";
import axios from "./axios.js";
function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const handlechange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleupload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const upload_progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(upload_progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);

            axios.post("/upload", {
              caption: caption,
              user: username,
              image: url,
            });
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageupload">
      <div className="imageupload__upload">
        <progress value={progress} max="100"></progress>
        <input
          type="text"
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
        />
        <input type="file" onChange={handlechange} />
        <Button className="imageupload__button" onClick={handleupload}>
          Upload
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
