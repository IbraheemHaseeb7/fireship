import Link from "next/link";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  const [user] = useAuthState(auth);
  async function deleteFunc() {
    const db = getFirestore();
    await deleteDoc(doc(db, `users/${user.uid}/posts`, post.slug));
  }

  return (
    <div className="posts-main-container">
      <div className="posts-container">
        <Link href={`/${post.username}`} passHref={true}>
          <p className="post-by">By {post.username}</p>
        </Link>

        <Link href={`/${post.username}/${post.slug}`} passHref={true}>
          <h2 className="post-title">{post.title}</h2>
        </Link>
        <h3 className="post-content">{post.content}</h3>

        <footer>
          <span>
            {wordCount} words. {minutesToRead} min read
          </span>
          <span className="hearts">💗 {post.hearts} Hearts</span>
        </footer>
      </div>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <div className="post-admin-container">
          <Link href={`/admin/${post.slug}`} passHref={true}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>
          <button className="btn-blue" onClick={deleteFunc}>
            Delete
          </button>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </div>
      )}
    </div>
  );
}
