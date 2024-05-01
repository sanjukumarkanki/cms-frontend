import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyD-3A6vmHqUZc9VuB_Kf97y0DR_PSAKcRg",
  authDomain: "leadapp-cms.firebaseapp.com",
  projectId: "leadapp-cms",
  storageBucket: "leadapp-cms.appspot.com",
  messagingSenderId: "943062810205",
  appId: "1:943062810205:web:4cf11b026dfeba0cef57b4",
  measurementId: "G-779VQ4Y1QT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}