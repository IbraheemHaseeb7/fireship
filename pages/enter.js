import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";
import {
  doc,
  getFirestore,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import Router from "next/router";

function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <div className="enter-container">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </div>
  );
}

const db = getFirestore();
function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      Sign In With Google
    </button>
  );
}

function SignOutButton() {
  const { user, username } = useContext(UserContext);

  async function fetcher() {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      username: username,
    });
    await setDoc(doc(db, "usernames", username), {
      uid: user.uid,
    });
  }

  fetcher();

  return (
    <button className="btn-google" onClick={() => signOut(auth)}>
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [inputValue, setInputValue] = useState();
  const [isExp, setIsExp] = useState(false);
  const [available, setAvailable] = useState(false);
  const { user, setUsername } = useContext(UserContext);

  function handleChange(e) {
    setInputValue(e.target.value);
    if (reg.test(e.target.value)) {
      setIsExp(true);
    } else {
      setIsExp(false);
    }
    setAvailable(false);
  }

  const reg = /^(&{1})([a-zA-Z]{1})([a-zA-Z0-9_]{3,20}$)/g;

  const db = getFirestore();
  async function handleSubmit(e) {
    e.preventDefault();

    const queryResult = query(
      collection(db, "users"),
      where("username", "==", inputValue)
    );
    await getDocs(queryResult).then((res) => {
      if (res.docs.length === 0 && isExp) {
        setAvailable(true);
        setIsExp(true);
      } else {
        setAvailable(false);
      }
    });
  }
  console.log(available);

  function handleEnter(e) {
    e.preventDefault();
    setDoc(doc(db, "users", user.uid), {
      username: inputValue,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }).then(() => {
      Router.push("/");
    });

    setInputValue("");
    setAvailable(false);
    setUsername(inputValue);
  }

  return (
    <div className="username-form-container">
      <form className="username-form">
        <input
          type="text"
          name="username"
          onChange={handleChange}
          className="username-input"
          value={inputValue}
          maxLength={20}
          required={true}
        />
        {isExp ? (
          <p style={{ color: "green" }}>Correct Expression</p>
        ) : (
          <p style={{ color: "red" }}>InCorrect Expression</p>
        )}
        {available ? (
          <p style={{ color: "green" }}>Available</p>
        ) : (
          <p style={{ color: "red" }}>Unavailable</p>
        )}
        <button onClick={handleSubmit} className="btn-blue">
          Check Availablity
        </button>
        {available && (
          <button className="btn-blue" type="submit" onClick={handleEnter}>
            Set Username
          </button>
        )}
      </form>
    </div>
  );
}

export default EnterPage;
