import SingleStudent from "./SingleStudent";
import "./EnrolledStudent.css";

const EnrolledStudent = ({ students }) => {
  return (
    <div className="enrolled-student">
      <h2 style={{ fontSize: "22px" }} className="enrolled-student-heading">
        Enrolled Students : {students?.length}
      </h2>
      <div className="enrolled-student-wrapper">
        {students?.map((student) => (
          <SingleStudent key={student.sno} {...student} />
        ))}
      </div>
    </div>
  );
};

export default EnrolledStudent;
