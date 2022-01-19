import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "../lib/context";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

function Navbar({}) {
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Router.push("/");
      } else {
        Router.push("/enter");
      }
    });
  }, [user]);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link href="/" passHref={true} prefetch={true}>
          <button className="btn-logo">
            <i>thalk</i>
          </button>
        </Link>
      </div>
      {user && (
        <div className="welcome-container">
          <h3 className="welcome">WELCOME, {username}</h3>
        </div>
      )}
      <ul>
        {/*user is signed and has username*/}

        {username && (
          <>
            <li className="push-right">
              <Link href="/admin" passHref={true}>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li className="push-right-s">
              <Link href={`/${username}`} passHref={true}>
                <img src={user?.photoURL} alt="IMAGE" className="img" />
              </Link>
            </li>
            <li className="push-right-l">
              <button className="btn-blue" onClick={() => signOut(auth)}>
                Log Out
              </button>
            </li>
          </>
        )}

        {/*user is not signed and has no username*/}

        {!username && (
          <li className="push-right-l">
            <Link href="/enter" passHref={true}>
              <button className="btn-blue">Log In</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
