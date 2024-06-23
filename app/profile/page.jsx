"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Profile from "@components/Profile";

const UserProfile = ({ params }) => {

  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user?.id}/posts`);
      const data = await response.json();
      console.log(data);
      setUserPosts(data);
    };

    if (session?.user?.id) fetchPosts();
  }, [session?.user?.id]);
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  }
  const handleDelete = async (post) => {
    const sure = confirm("Are you sure ?")
    if (sure) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE'
        });

        const remPost = userPosts.filter((p) => p._id !== post._id)
        setUserPosts(remPost);
      }
      catch (err) {
        console.log(err);
      }
    }
  }
  return (
    <Profile
      name={session?.user.name}
      desc={`Welcome to ${session?.user.name}'s personalized profile page. Explore ${session?.user.name}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default UserProfile;
