import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZlT9eH41KDPv8n9Jqw56R8WoESJBmOuc",
  authDomain: "fir-813f8.firebaseapp.com",
  projectId: "fir-813f8",
  storageBucket: "fir-813f8.appspot.com",
  messagingSenderId: "725407138607",
  appId: "1:725407138607:web:c748a80dad925307bed7da",
  measurementId: "G-7EXJRLH040",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
export const googleAuthProvider = new GoogleAuthProvider();

//helper function
export async function getUserWithUsername(username) {
  var info;
  const queryResult = query(
    collection(firestore, "users"),
    where("username", "==", username)
  );
  await getDocs(queryResult).then((res) => {
    info = res.docs.map((data) => {
      return data.data();
    });
  });
  return info;
}

export function postsToJSON(doc) {
  const data = doc.data();

  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
