import {
  collectionGroup,
  collection,
  getFirestore,
  getDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getUserWithUsername } from "../../lib/firebase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export async function getStaticProps(context) {
  const { username, slug } = context.params;
  const userDoc = await getUserWithUsername(username);

  let post = null;
  let path = null;
  let id = null;
  let hearts = null;

  if (userDoc) {
    const db = getFirestore();
    await getDoc(doc(db, "usernames", username)).then((res) => {
      id = res.data();
    });
    await getDoc(doc(db, `users/${id.uid}/posts`, slug)).then((res) => {
      post = res.data();
    });
    await getDocs(
      collection(db, `users/${id.uid}/posts/${post.slug}/hearters`)
    ).then((res) => {
      hearts = res.docs.map((data) => {
        return data.data();
      });
    });
    path = post.slug;
  }

  return {
    props: {
      id,
      hearts,
      post,
      path,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const db = getFirestore();
  const querySnapshot = getDocs(collectionGroup(db, "posts"));
  let paths = null;
  await querySnapshot.then((res) => {
    paths = res.docs.map((data) => {
      const { slugger, username } = data.data();
      const slug = toString(slugger);
      return {
        params: { username, slug },
      };
    });
  });

  return {
    paths,
    fallback: "blocking",
  };
}

function PostPage({ hearts, post, id }) {
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const router = useRouter();
  let [heart, setHeart] = useState();

  for (let counter = 0; counter < hearts?.length; counter++) {
    if (hearts[counter].uid === user?.uid) {
      heart = true;
      break;
    } else {
      heart = false;
    }
  }

  let mainUser;

  async function increaseHeart() {
    if (!heart) {
      await getDoc(doc(db, "users", user.uid)).then((res) => {
        mainUser = res.data().username;
      });
      await setDoc(
        doc(
          db,
          `users/${id.uid}/posts/${router.query.slug}/hearters`,
          mainUser
        ),
        {
          uid: user.uid,
          username: mainUser,
        }
      );
      await updateDoc(doc(db, `users/${id.uid}/posts`, router.query.slug), {
        hearts: hearts?.length + 1,
      });
      toast.success("You liked!");
      setHeart(true);
    }
  }

  return (
    <main className="post-page-main-container">
      <div className="post-page-container">
        <Link href={`/${post.username}`} passHref={true}>
          <p className="post-page-username post-page">{post.username}</p>
        </Link>
        <h1 className="post-page-title post-page">{post.title}</h1>
        <h3 className="post-page-content post-page">{post.content}</h3>
      </div>
      <div className="post-page-heart-container">
        {heart ? (
          <h3 className="page-post-hearts">Heart: {post.hearts}</h3>
        ) : (
          <h3 className="page-post-hearts">Hearts: {post.hearts}</h3>
        )}
        <button className="btn-blue" disabled={heart} onClick={increaseHeart}>
          💗
        </button>
      </div>
    </main>
  );
}

export default PostPage;
