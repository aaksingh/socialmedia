import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbModel from "./Components/Js/dbModel.js";

//app config     OR       instance of App

const myapp = express();
const port = process.env.PORT || 3030;
const pusher = new Pusher({
  appId: "1132785",
  key: "5e6a72fa1a1872b9d991",
  secret: "1e50e3d799eabd773ac3",
  cluster: "ap2",
  usetls: true,
});

//middlewares

myapp.use(express.json());
myapp.use(cors());

// DB config
const connectionUrl =
  "mongodb+srv://admin:OoMnc6bP43n9L51P@cluster0.ph0ei.mongodb.net/instaDB?retryWrites=true&w=majority";
mongoose.connect(connectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
  const changeStream = mongoose.connection.collection("posts").watch();
  changeStream.on("change", (change) => {
    console.log("change triggered on pusher");
    console.log(change);
    console.log("change ended");
    if (change.operationType === "insert") {
      console.log("Inside");
      const postDetails = change.fullDocument;
      pusher.trigger("posts", "inserted", {
        user: postDetails.user,
        caption: postDetails.caption,
        image: postDetails.image,
      });
    } else {
      console.log("unknow trigger from pusher");
    }
  });
});
// api routes      api end point
myapp.get("/", (req, res) => res.status(200).send("hello Golu"));
myapp.post("/upload", (req, res) => {
  const body = req.body;

  dbModel.create(body, (err, data) => {
    if (err) {
      re.statuss(500).send("error");
    } else {
      res.status(201).send(data);
    }
  });
});

myapp.get("/sync", (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      re.statuss(500).send("error");
    } else {
      res.status(200).send(data);
    }
  });
});
// listen
myapp.listen(port, () => console.log(`listening on localhost:${port}`));

//API end points using to store images comments
