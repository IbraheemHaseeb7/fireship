function UserProfile({ user }) {
  return (
    <div className="user-profile-container">
      <img src={user[0].photoURL} className="profile-img" />
      <p className="username-container">
        <i>{user[0].username}</i>
      </p>
      <h1 className="display-name">{user[0].displayName}</h1>
    </div>
  );
}

export default UserProfile;
