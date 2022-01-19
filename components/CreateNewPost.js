import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../lib/context";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import toast, { Toaster } from "react-hot-toast";

export default function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  let isEdit = true;
  const [user] = useAuthState(auth);
  const db = getFirestore();

  async function getValues() {
    await getDoc(doc(db, `users/${user.uid}/posts`, router.query.slug)).then(
      (res) => {
        setTitle(res.data().title);
        setContent(res.data().content);
        setCheckbox(res.data().published);
      }
    );
  }

  router.query.slug ? (isEdit = false) : null;
  useEffect(() => {
    router.query.slug ? getValues() : null;
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const date = new Date().getTime().toString();
    await setDoc(doc(db, `users/${user.uid}/posts`, date), {
      published: true,
      username: username,
      hearts: 0,
      title: title,
      content: content,
      slug: date,
    });

    setTitle("");
    setContent("");
  }

  async function handleUpdate(e) {
    e.preventDefault();
    await updateDoc(doc(db, `users/${user.uid}/posts`, router.query.slug), {
      title: title,
      content: content,
      published: checkbox,
    })
      .then(() => {
        toast.success("Successfully Updated!");
      })
      .catch((err) => {
        toast.error(`Error ${err}`);
      });
  }

  return (
    <div className="create-new-post-container">
      <Toaster />
      <form className="create-post-container">
        <input
          placeholder="Title goes here"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="username-input title-input"
        />
        <textarea
          name="content"
          placeholder="Your content goes here"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
        {isEdit ? (
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-blue create"
          >
            Create new post
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleUpdate}
            className="btn-blue create"
          >
            Update this post
          </button>
        )}
        <div className="check-box-container">
          {!isEdit && (checkbox ? <h3>Published</h3> : <h3>Not Published</h3>)}
          {!isEdit && (
            <>
              <input
                type="checkbox"
                id="checkbox"
                className="checkbox"
                checked={checkbox}
                onChange={(e) => {
                  setCheckbox(e.target.checked);
                }}
              />
              <label htmlFor="checkbox"></label>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
