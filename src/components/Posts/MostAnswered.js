import { useState, useEffect } from "react";
import SinglePost from "./SinglePost";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";

const MostAnswered = ({ uid, tokenkey }) => {
  const [mostAnswered, setMostAnswered] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMostAnswered = async () => {
    let isUnmounted = false;
    try {
      const config = {
        headers: { Authorization: `Bearer ${tokenkey}` },
      };
      if (!mostAnswered) setLoading(true);
      const { data } = await axios.get("/api/forum/mostAnswered", config);
      setLoading(false);
      if (!isUnmounted) {
        // console.log(data);
        setMostAnswered(data);
      }
    } catch (err) {
      console.log(err.message);
    }
    return () => {
      isUnmounted = true;
    };
  };

  useEffect(() => {
    fetchMostAnswered();
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
      {mostAnswered?.map((post) => (
        <SinglePost
          key={post.id}
          {...post}
          uid={uid}
          fetchPosts={fetchMostAnswered}
          posts={mostAnswered}
          setPosts={setMostAnswered}
        />
      ))}
    </>
  );
};

export default MostAnswered;
