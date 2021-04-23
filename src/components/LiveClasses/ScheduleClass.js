import React from "react";

const ScheduleClass = ({ setShowScheduleClass }) => {
  return (
    <div>
      scheduleclass
      <button onClick={() => setShowScheduleClass(false)}>&times;</button>
    </div>
  );
};

export default ScheduleClass;
