import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC5k91XCqW_VOl_oo4rL6ziMFKjxm6_Ngc",
  authDomain: "instagram-clone-22bdf.firebaseapp.com",
  databaseURL: "https://instagram-clone-22bdf-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-22bdf",
  storageBucket: "instagram-clone-22bdf.appspot.com",
  messagingSenderId: "353969930351",
  appId: "1:353969930351:web:16ab04902f26415f1d4d9a",
  measurementId: "G-0RE5SLR7R3",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
