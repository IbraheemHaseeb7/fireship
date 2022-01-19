import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);
  return (
    <>
      {username ? (
        props.children
      ) : (
        <Link href="/enter" passHref={true}>
          <button className="btn-blue">Go get signed in</button>
        </Link>
      )}
    </>
  );
}
