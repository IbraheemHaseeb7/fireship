import Head from "next/head";
import Link from "next/link";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  collectionGroup,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import PostFeed from "../components/PostFeed";

export async function getServerSideProps(context) {
  const db = getFirestore();
  const postsQuery = query(
    collectionGroup(db, "posts"),
    where("published", "==", true)
  );
  let post;
  await getDocs(postsQuery).then((res) => {
    post = res.docs.map((data) => {
      return data.data();
    });
  });

  return {
    props: {
      post,
    },
  };
}

export default function Home({ post }) {
  const [posts, setPosts] = useState(post);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  // async function getMorePosts() {
  //   setLoading(true);
  //   const last =
  // }

  return (
    <div className="home-container">
      <PostFeed posts={posts} />

      {/* {!loading && !postsEnd && (
        <button onClick={getMorePosts} className="btn-blue">
          Load More
        </button>
      )} */}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </div>
  );
}
