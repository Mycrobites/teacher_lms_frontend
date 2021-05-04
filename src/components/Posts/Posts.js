import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/authContext";
import SinglePost from "./SinglePost";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";
import Loader from "../Loader/Loader";
import RecentlyAnswered from "./RecentlyAnswered";
import MostAnswered from "./MostAnswered";
import axios from "../../axios/axios";
import { AiOutlineWarning } from "react-icons/ai";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getCookie } from "./getCookie";
import "./Posts.css";
import "./Sidebar.css";

const Posts = () => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab] = useState(1);
  const [sidebarData, setSidebarData] = useState({ posts: 0, answers: 0 });
  const { userDetails } = useContext(UserContext);

  const csrftoken = getCookie("csrftoken");

  const addPost = async (e) => {
    e.preventDefault();
    setError(false);
    if (!title || !desc) return setError(true);
    try {
      const newPost = {
        title,
        desc,
        userid: userDetails.user_id,
        tags,
      };
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      await axios.post("/api/forum/createPosts", newPost, config);
      setTitle("");
      setDesc("");
      setTags("");
      fetchPosts();
      setShowAddPost(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/forum/getPosts?pageno=${currentPage}`,
        config
      );
      setPosts(data.response);
      setTotalPages(data.no_of_pages);
      setSidebarData({ posts: data.total_posts, answers: data.totalanswers });
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (currentTab === 1 || currentTab === 2) fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePages = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="posts">
      <div className="add-post">
        <div className="add-post-title">
          <h1>Questions</h1>
          <button
            onClick={() => {
              setShowAddPost(!showAddPost);
              setError(false);
            }}
          >
            Ask Question
          </button>
        </div>
        {showAddPost && (
          <div className="post-post">
            <form onSubmit={addPost}>
              <label>
                <p>Title</p>
                <input
                  type="text"
                  placeholder="title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label>
                <p>Description</p>
                <CKEditor
                  editor={ClassicEditor}
                  data={desc}
                  config={{
                    ckfinder: {
                      uploadUrl:
                        "http://lab.progressiveminds.in/api/uploadimages?command=QuickUpload&type=Images&responseType=json",
                      options: {
                        resourceType: "Images",
                      },
                      credentials: "include",
                      headers: {
                        "X-CSRF-TOKEN": csrftoken,
                        csrftoken: csrftoken,
                        csrfmiddlewaretoken: csrftoken,
                      },
                    },
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDesc(data);
                  }}
                />
              </label>
              <label>
                <p>Tags (Enter tags as a comma separated string)</p>
                <textarea
                  placeholder="tags..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </label>
              {error && (
                <p className="post-upload-question">
                  <AiOutlineWarning />
                  Please fill all the fields!
                </p>
              )}
              <div className="add-post-buttons">
                <button onClick={() => setShowAddPost(false)} type="button">
                  Cancel
                </button>
                <button type="submit">Ask</button>
              </div>
            </form>
          </div>
        )}

        <div className="tabs">
          <button
            onClick={() => setCurrentTab(1)}
            className={`tab-btn ${currentTab === 1 ? "active" : null}`}
          >
            All Questions
          </button>
          <button
            onClick={() => {
              setCurrentTab(2);
              setCurrentPage(0);
            }}
            className={`tab-btn ${currentTab === 2 ? "active" : null}`}
          >
            Recent Questions
          </button>
          <button
            onClick={() => setCurrentTab(3)}
            className={`tab-btn ${currentTab === 3 ? "active" : null}`}
          >
            Recently Answered
          </button>
          <button
            onClick={() => setCurrentTab(4)}
            className={`tab-btn ${currentTab === 4 ? "active" : null}`}
          >
            Most Answered
          </button>
        </div>
      </div>

      <div className="forum-content">
        <div className="all-posts">
          {loading ? (
            <div className="forum-loader">
              <Loader />
            </div>
          ) : (
            <>
              {currentTab === 1 &&
                posts?.map((post) => (
                  <SinglePost
                    key={post.id}
                    {...post}
                    uid={userDetails.user_id}
                    fetchPosts={fetchPosts}
                    posts={posts}
                    setPosts={setPosts}
                  />
                ))}
              {currentTab === 2 &&
                posts?.map((post) => (
                  <SinglePost
                    key={post.id}
                    {...post}
                    uid={userDetails.user_id}
                    fetchPosts={fetchPosts}
                    posts={posts}
                    setPosts={setPosts}
                  />
                ))}
              {currentTab === 3 && (
                <RecentlyAnswered
                  uid={userDetails.user_id}
                  tokenkey={userDetails.access}
                />
              )}
              {currentTab === 4 && (
                <MostAnswered
                  uid={userDetails.user_id}
                  tokenkey={userDetails.access}
                />
              )}
            </>
          )}
          {posts && currentTab === 1 && (
            <Pagination
              totalPages={totalPages}
              handlePages={handlePages}
              currentPage={currentPage}
            />
          )}
        </div>
        <Sidebar sidebarData={sidebarData} />
      </div>
    </div>
  );
};

export default Posts;
