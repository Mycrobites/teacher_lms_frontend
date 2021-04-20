import { RiErrorWarningLine } from "react-icons/ri";
import "./Error.css";

const Error = ({ msg }) => {
  return (
    <div className="error">
      <RiErrorWarningLine />
      <p>{msg}</p>
    </div>
  );
};

export default Error;
