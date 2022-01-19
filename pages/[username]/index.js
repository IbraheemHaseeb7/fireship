import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername } from "../../lib/firebase";
import {
  where,
  query,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Loader from "../../components/Loader";

export async function getServerSideProps(context) {
  const username = context.query;
  const userDoc = await getUserWithUsername(username.username);
  let user = null;
  let posts = null;
  let loading = true;

  if (userDoc.length !== 0) {
    user = userDoc;
    const db = getFirestore();
    let uid;
    await getDoc(doc(db, "usernames", username.username)).then((res) => {
      loading = false;
      uid = res.data().uid;
    });
    const postsQuery = query(
      collection(db, `users/${uid}/posts`),
      where("published", "==", true)
    );

    await getDocs(postsQuery).then((res) => {
      posts = res.docs.map((data) => {
        loading = false;
        return data.data();
      });
    });
  } else {
    return {
      notFound: true,
    };
  }

  return {
    props: { user, posts, loading },
  };
}

function UserProfilePage({ user, posts, loading }) {
  return (
    <>
      {loading ? (
        <Loader show={true} />
      ) : (
        <main className="user-profile-main-container">
          <UserProfile user={user} />
          <PostFeed posts={posts} />
        </main>
      )}
    </>
  );
}

export default UserProfilePage;
