import { useState, useEffect, useContext } from "react";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import { MdEdit } from "react-icons/md";
import { HiOutlineCamera } from "react-icons/hi";
import { RiImageAddLine } from "react-icons/ri";
import "./Profile.css";
import UserContext from "../../context/authContext";

const getProfile = () => {
  const data = localStorage.getItem("post-data");
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [showImageEdit, setShowImageEdit] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [postData, setPostData] = useState(getProfile);
  const [editLoading, setEditLoading] = useState(false);
  const [img, setImg] = useState({ preview: "", raw: "" });
  const { userDetails, updateUserProfilePic } = useContext(UserContext);

  const handleProfileSubmit = async () => {
    setEditLoading(true);
    let formData = new FormData();
    formData.append("profile_pic", profilePic);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.key}` },
      };
      const { data } = await axios.patch(
        `/api/editUserProfilePic/${userDetails?.user?.username}`,
        formData , config
      );
      getStudentsDetails();
      console.log(data);
      updateUserProfilePic(data.user_profile_pic);
      setEditLoading(false);
      setImg({ preview: "", raw: "" });
      setProfilePic(null);
    } catch (err) {
      console.log(err.message);
    }
    setShowImageEdit(false);
  };

  const handleProfilePic = (e) => {
    setProfilePic(e.target.files[0]);
    if (e.target.files.length) {
      setImg({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const getStudentsDetails = async () => {
    try {
      if (!postData) setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userDetails.key}` },
      };
      const { data } = await axios.get(
        `/api/getUserDetails/${userDetails?.user?.username}`,config
      );
      setStudentDetails(data?.student_details);
      setUserInfo(data?.user_info);
      // console.log(data);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getStudentsDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPostData({
      dob: studentDetails?.dob,
      Class: studentDetails?.Class,
      gender: studentDetails?.gender,
      category: studentDetails?.category,
      phone_no: studentDetails?.phone_no,
      address: studentDetails?.address,
      state: studentDetails?.state,
      pin_code: studentDetails?.pin_code,
      father_name: studentDetails?.father_name,
      father_email: studentDetails?.father_email,
      father_phone: studentDetails?.father_phone,
      father_profession: "NA",
      mother_name: studentDetails?.mother_name,
      mother_email: studentDetails?.mother_email,
      mother_phone: studentDetails?.mother_phone,
      mother_profession: "NA",
      school_name: studentDetails?.school_name,
      school_address: studentDetails?.school_address,
      school_state: "NA",
      school_pin_code: "NA",
      user: studentDetails?.user,
    });
    localStorage.setItem("user-profile", JSON.stringify(postData));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, studentDetails]);

  const {
    Class,
    address,
    category,
    dob,
    father_email,
    father_name,
    father_phone,
    gender,
    mother_email,
    mother_name,
    mother_phone,
    phone_no,
    pin_code,
    profile_pic,
    school_address,
    school_name,
    state,
  } = studentDetails;
  const { first_name, last_name, email, username } = userInfo;

  const handleEditProfile = async () => {
    setEditLoading(true);
    localStorage.setItem("user-profile", JSON.stringify(postData));
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.key}` },
      };
      await axios.put(`/api/editUserDetails/${username}`, postData ,config);
      console.log(postData);
    } catch (err) {
      console.log(err.message);
    }
    getStudentsDetails();
    setEditLoading(false);
    setShowEdit(!showEdit);
  };

  return (
    <>
      {loading ? (
        <div className="profile-loader">
          <Loader />
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-image">
            <div className="profile-img">
              <img src={profile_pic} alt="" />
              <button
                className="edit-img-btn"
                onClick={(e) => setShowImageEdit(!showImageEdit)}
              >
                <HiOutlineCamera />
              </button>
            </div>

            {showImageEdit && (
              <div className="edit-image">
                <label className="label-profile-img">
                  <input
                    type="file"
                    name="profile pic"
                    accept="image/*"
                    onChange={handleProfilePic}
                  />
                  <RiImageAddLine />
                  {img?.preview && <img src={img.preview} alt="select" />}
                </label>
                <button
                  disabled={!profilePic ? true : false}
                  className="img-upload-btn"
                  onClick={handleProfileSubmit}
                >
                  Upload
                </button>
              </div>
            )}

            <h6>{username}</h6>
            <p>Std {Class}</p>
          </div>
          <div className="profile-details">
            <div className="profile-name">
              <h1>
                {first_name} {last_name}
              </h1>
              <p>Std {Class}</p>
              {!showEdit && (
                <button
                  onClick={(e) => setShowEdit(true)}
                  className="profile-edit-button"
                >
                  <MdEdit />
                </button>
              )}
            </div>

            {editLoading && (
              <div className="edit-loader">
                <Loader />
              </div>
            )}

            {showEdit ? (
              <div className="student-detail edit">
                <div>
                  <p>Birthday</p>
                  <input
                    type="text"
                    value={postData.dob}
                    onChange={(e) =>
                      setPostData({ ...postData, dob: e.target.value })
                    }
                    name="dob"
                  />
                </div>

                <div>
                  <p>Class</p>
                  <input
                    type="text"
                    value={postData.Class}
                    onChange={(e) =>
                      setPostData({ ...postData, Class: e.target.value })
                    }
                    name="Class"
                  />
                </div>

                <div>
                  <p>Gender</p>
                  <input
                    type="text"
                    value={postData.gender}
                    onChange={(e) =>
                      setPostData({ ...postData, gender: e.target.value })
                    }
                    name="gender"
                  />
                </div>

                <div>
                  <p>Category</p>
                  <input
                    type="text"
                    value={postData.category}
                    onChange={(e) =>
                      setPostData({ ...postData, category: e.target.value })
                    }
                    name="category"
                  />
                </div>

                <div>
                  <p>Phone</p>
                  <input
                    type="text"
                    value={postData.phone_no}
                    onChange={(e) =>
                      setPostData({ ...postData, phone_no: e.target.value })
                    }
                    name="phone_no"
                  />
                </div>

                <div>
                  <p>Father Name</p>
                  <input
                    type="text"
                    value={postData.father_name}
                    onChange={(e) =>
                      setPostData({ ...postData, father_name: e.target.value })
                    }
                    name="father_name"
                  />
                </div>

                <div>
                  <p>Father Email</p>
                  <input
                    type="text"
                    value={postData.father_email}
                    onChange={(e) =>
                      setPostData({ ...postData, father_email: e.target.value })
                    }
                    name="father_email"
                  />
                </div>

                <div>
                  <p>Father Phone</p>
                  <input
                    type="text"
                    value={postData.father_phone}
                    onChange={(e) =>
                      setPostData({ ...postData, father_phone: e.target.value })
                    }
                    name="father_phone"
                  />
                </div>

                <div>
                  <p>Mother Name</p>
                  <input
                    type="text"
                    value={postData.mother_name}
                    onChange={(e) =>
                      setPostData({ ...postData, mother_name: e.target.value })
                    }
                    name="mother_name"
                  />
                </div>

                <div>
                  <p>Mother Email</p>
                  <input
                    type="text"
                    value={postData.mother_email}
                    onChange={(e) =>
                      setPostData({ ...postData, mother_email: e.target.value })
                    }
                    name="mother_email"
                  />
                </div>

                <div>
                  <p>Mother Phone</p>
                  <input
                    type="text"
                    value={postData.mother_phone}
                    onChange={(e) =>
                      setPostData({ ...postData, mother_phone: e.target.value })
                    }
                    name="mother_phone"
                  />
                </div>

                <div>
                  <p>Address</p>
                  <input
                    type="text"
                    value={postData.address}
                    onChange={(e) =>
                      setPostData({ ...postData, address: e.target.value })
                    }
                    name="address"
                  />
                </div>

                <div>
                  <p>State</p>
                  <input
                    type="text"
                    value={postData.state}
                    onChange={(e) =>
                      setPostData({ ...postData, state: e.target.value })
                    }
                    name="state"
                  />
                </div>

                <div>
                  <p>Pincode</p>
                  <input
                    type="text"
                    value={postData.pin_code}
                    onChange={(e) =>
                      setPostData({ ...postData, pin_code: e.target.value })
                    }
                    name="pin_code"
                  />
                </div>

                <div>
                  <p>School</p>
                  <input
                    type="text"
                    value={postData.school_name}
                    onChange={(e) =>
                      setPostData({ ...postData, school_name: e.target.value })
                    }
                    name="school_name"
                  />
                </div>

                <div>
                  <p>School Address</p>
                  <input
                    type="text"
                    value={postData.school_address}
                    onChange={(e) =>
                      setPostData({
                        ...postData,
                        school_address: e.target.value,
                      })
                    }
                    name="school_address"
                  />
                </div>
                <div className="button-group">
                  <button onClick={() => setShowEdit(false)}>cancel</button>
                  <button onClick={handleEditProfile}>save</button>
                </div>
              </div>
            ) : (
              <div className="student-detail">
                <div>
                  <p>Birthday</p>
                  <p>
                    <strong>{dob}</strong>
                  </p>
                </div>

                <div>
                  <p>Class</p>
                  <p>
                    <strong>Std {Class}</strong>
                  </p>
                </div>

                <div>
                  <p>Gender</p>
                  <p>
                    <strong>{gender}</strong>
                  </p>
                </div>

                <div>
                  <p>Category</p>
                  <p>
                    <strong>{category}</strong>
                  </p>
                </div>

                <div>
                  <p>Phone</p>
                  <p>
                    <strong>+91 {phone_no}</strong>
                  </p>
                </div>
                <div>
                  <p>Email</p>
                  <p>
                    <strong>{email}</strong>
                  </p>
                </div>

                <div>
                  <p>Father Name</p>
                  <p>
                    <strong>{father_name}</strong>
                  </p>
                </div>

                <div>
                  <p>Father Email</p>
                  <p>
                    <strong>{father_email}</strong>
                  </p>
                </div>

                <div>
                  <p>Father Phone</p>
                  <p>
                    <strong>+91 {father_phone}</strong>
                  </p>
                </div>

                <div>
                  <p>Mother Name</p>
                  <p>
                    <strong>{mother_name}</strong>
                  </p>
                </div>

                <div>
                  <p>Mother Email</p>
                  <p>
                    <strong>{mother_email}</strong>
                  </p>
                </div>

                <div>
                  <p>Mother Phone</p>
                  <p>
                    <strong>+91 {mother_phone}</strong>
                  </p>
                </div>

                <div>
                  <p>Address</p>
                  <p>
                    <strong>{address}</strong>
                  </p>
                </div>

                <div>
                  <p>State</p>
                  <p>
                    <strong>{state}</strong>
                  </p>
                </div>

                <div>
                  <p>Pincode</p>
                  <p>
                    <strong>{pin_code}</strong>
                  </p>
                </div>

                <div>
                  <p>School</p>
                  <p>
                    <strong>{school_name}</strong>
                  </p>
                </div>

                <div>
                  <p>School Address</p>
                  <p>
                    <strong>{school_address}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
