import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { collection, getFirestore } from "firebase/firestore";
import CreateNewPost from "../../components/CreateNewPost";

function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <h1 style={{ textAlign: "center", margin: "3rem 0" }}>
          Create a New Post Here
        </h1>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [value] = useCollection(collection(db, `users/${user?.uid}/posts`));

  let posts = value?.docs.map((data) => {
    return data.data();
  });

  return (
    <>
      <h1 className="manage">Manage Your Posts</h1>
      <div className="post-list-container">
        <PostFeed posts={posts} admin={true} />
      </div>
    </>
  );
}

export default AdminPostsPage;
