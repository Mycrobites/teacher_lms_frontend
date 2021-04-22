import { useState, useEffect } from "react";
import SinglePost from "./SinglePost";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";

const RecentLyAnswered = ({ uid, tokenkey }) => {
  const [recentlyAnswered, setRecentlyAnswered] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecentlyAnswered = async () => {
    let isUnmounted = false;
    try {
      const config = {
        headers: { Authorization: `Bearer ${tokenkey}` },
      };
      if (!recentlyAnswered) setLoading(true);
      const { data } = await axios.get("/api/forum/recentAnswered", config);
      setLoading(false);
      if (!isUnmounted) {
        console.log(data);
        setRecentlyAnswered(data);
      }
    } catch (err) {
      console.log(err.message);
    }
    return () => {
      isUnmounted = true;
    };
  };

  useEffect(() => {
    fetchRecentlyAnswered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="forum-loader">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {recentlyAnswered?.map((post) => (
        <SinglePost
          key={post.id}
          {...post}
          uid={uid}
          fetchPosts={fetchRecentlyAnswered}
          posts={recentlyAnswered}
          setPosts={setRecentlyAnswered}
        />
      ))}
    </>
  );
};

export default RecentLyAnswered;
