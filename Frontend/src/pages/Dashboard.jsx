import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [summary, setSummary] = useState({});
  const studentId = "YOUR_LOGGED_IN_USER_ID";

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/progress/dashboard/${studentId}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>

      <div className="stats">
        <p>Total Courses: {summary.totalCourses}</p>
        <p>Completed: {summary.completedCourses}</p>
        <p>In Progress: {summary.inProgressCourses}</p>
      </div>

      <h3>Overall Progress</h3>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${summary.overallPercentage}%` }}
        >
          {summary.overallPercentage}%
        </div>
      </div>
    </div>
  );
}

export default Dashboard;