import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { auth } from "../lib/firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    let unsubscribe;
    if (user) {
      unsubscribe = onSnapshot(doc(db, "users", user.uid), (data) => {
        if (data.data() == undefined) {
          setUsername(null);
        } else {
          setUsername(data.data().username);
        }
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, setUsername };
}
