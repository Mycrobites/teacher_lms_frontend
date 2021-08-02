import SideBar from "../../components/SideBar/SideBar";
import Posts from "../../components/Posts/Posts";
import "./Forum.css";

const Forum = () => {
  return (
    <>
      <SideBar active="forum" />
      <div className="Forum">
        <Posts />
      </div>
    </>
  );
};

export default Forum;
