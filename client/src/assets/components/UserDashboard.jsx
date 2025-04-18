import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const res = await fetch(`http://localhost:5000/api/complaints/user/${decoded.email}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        }
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);


  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-4xl font-extrabold text-center text-indigo-400 mb-10">Your Past Complaints</h2>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-gray-400">No complaints found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div
            key={complaint.id}
            className={`relative min-h-[280px] shadow-md rounded-2xl p-6 border transition ${
              complaint.status === "Resolved"
                ? "bg-green-100 border-green-400"
                : "bg-red-100 border-red-400"
            }`}
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              {complaint.type}
            </h3>
          
            <div className="text-sm text-gray-800 space-y-1 mb-4">
              <p><span className="font-medium">Location:</span> {complaint.location}</p>
              <p><span className="font-medium">Priority:</span> {complaint.priority}</p>
              <p><span className="font-medium">Assigned Personnel ID:</span> {complaint.assigned_personnel_id ?? "N/A"}</p>
              <p><span className="font-medium">Created At:</span> {new Date(complaint.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Message:</span> {complaint.message}</p>
          
              {complaint.attachments && (
                <p>
                  <span className="font-medium">Attachment:</span>{" "}
                  <a
                    href={`http://localhost:5000/uploads/${complaint.attachments}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    View
                  </a>
                </p>
              )}
            </div>
          
            {/* Status Badge */}
            <div className="absolute bottom-4 left-6 right-6">
              <div
                className={`text-center font-semibold py-2 rounded-xl text-sm ${
                  complaint.status === "Resolved"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {complaint.status === "Resolved" ? "Resolved" : "Pending"}
              </div>
            </div>
          </div>
          
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
