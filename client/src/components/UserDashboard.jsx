import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [activeFeedbackForm, setActiveFeedbackForm] = useState(null);

  const notifyError = (message) =>
    toast.error(message, { position: "top-right", autoClose: 3000 });
  const notifySuccess = (message) =>
    toast.success(message, { position: "top-right", autoClose: 3000 });

  const handleFeedbackSubmit = async (complaint) => {
    const token = localStorage.getItem("token");

    const body = {
      complaint_id: complaint.id,
      user_id: complaint.user_id,
      assigned_personnel_id: complaint.assigned_personnel_id,
      rating: feedback[complaint.id]?.rating,
      comment: feedback[complaint.id]?.comment,
    };

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        notifySuccess("Feedback submitted!");

        setComplaints((prevComplaints) =>
          prevComplaints.map((c) =>
            c.id === complaint.id ? { ...c, feedback_given: true } : c
          )
        );

        setFeedback((prev) => ({ ...prev, [complaint.id]: {} }));
        setActiveFeedbackForm(null);
      } else {
        notifyError("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      notifyError("Error submitting feedback.");
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const res = await fetch(
          `http://localhost:5000/api/complaints/user/${decoded.email}`
        );
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
      <h2 className="text-4xl font-extrabold text-center text-indigo-400 mb-10">
        Your Past Complaints
      </h2>

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
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {complaint.location}
                </p>
                <p>
                  <span className="font-medium">Priority:</span>{" "}
                  {complaint.priority}
                </p>
                <p>
                  <span className="font-medium">Assigned Personnel ID:</span>{" "}
                  {complaint.assigned_personnel_id ?? "N/A"}
                </p>
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Message:</span>{" "}
                  {complaint.message}
                </p>

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

              <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-2">
                <div
                  className={`text-center font-semibold py-2 rounded-xl text-lg ${
                    complaint.status === "Resolved" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {complaint.status}
                </div>
                {complaint.status === "Resolved" && (
                  complaint.feedback_given ? (
                    <div className="text-sm text-green-700 font-semibold text-center">
                      Feedback Submitted
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setActiveFeedbackForm(
                            activeFeedbackForm === complaint.id
                              ? null
                              : complaint.id
                          )
                        }
                        className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                      >
                        {activeFeedbackForm === complaint.id
                          ? "Cancel Feedback"
                          : "Give Feedback"}
                      </button>

                      {activeFeedbackForm === complaint.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="relative bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
                            <button
                              onClick={() => setActiveFeedbackForm(null)}
                              className="cursor-pointer absolute top-2 left-2 text-gray-400 hover:text-red-500 text-xl font-bold"
                              title="Close Modal"
                            >
                              ×
                            </button>

                            <h3 className="text-xl font-bold text-indigo-400 mb-4 text-center cursor-pointer">
                              Leave Feedback
                            </h3>

                            <div className="space-y-4">
                              {/* Rating Section with Stars */}
                              <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                  Rating
                                </label>
                                <div className="flex items-center justify-center space-x-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      onClick={() =>
                                        setFeedback({
                                          ...feedback,
                                          [complaint.id]: {
                                            ...feedback[complaint.id],
                                            rating: star,
                                          },
                                        })
                                      }
                                      className={`w-8 h-8 cursor-pointer ${
                                        feedback[complaint.id]?.rating >= star ? "text-yellow-400" : "text-gray-400"
                                      }`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24" // Adjusting viewBox for better size scaling
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ))}
                                </div>

                              </div>

                              {/* Comment Section */}
                              <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                  Comment
                                </label>
                                <textarea
                                  rows={3}
                                  placeholder="Write your thoughts..."
                                  value={feedback[complaint.id]?.comment || ""}
                                  onChange={(e) =>
                                    setFeedback({
                                      ...feedback,
                                      [complaint.id]: {
                                        ...feedback[complaint.id],
                                        comment: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white outline-none resize-none"
                                />
                              </div>

                              {/* Submit Button */}
                              <button
                                onClick={() => handleFeedbackSubmit(complaint)}
                                className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                              >
                                Submit Feedback
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
