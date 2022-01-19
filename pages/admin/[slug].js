import AuthCheck from "../../components/AuthCheck";
import CreateNewPost from "../../components/CreateNewPost";

function AdminPostEdit({}) {
  return (
    <main>
      <h1 style={{ textAlign: "center", margin: "3rem 0" }}>Edit Post Here</h1>
      <AuthCheck>
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

export default AdminPostEdit;
