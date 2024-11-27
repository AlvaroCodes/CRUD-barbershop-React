import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "xxxxx",
    authDomain: "xxxxx",
    projectId: "xxxxx",
    storageBucket: "xxxxx",
    messagingSenderId: "xxxxx",
    appId: "xxxxx",
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export{firebase}