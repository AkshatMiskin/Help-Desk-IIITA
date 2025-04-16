import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [assignedName, setAssignedName] = useState("");
  const [assignedContact, setAssignedContact] = useState("");

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess("Complaint deleted!");
        fetchComplaints(); 
      } else {
        notifyError("Failed to delete complaint");
      }
    } catch (error) {
      console.error("Error deleting complaint", error);
      notifyError("Error deleting complaint");
    }
  };

  
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/complaints");
      const data = await res.json();
      if (data.success) {
        setComplaints(data.data);
      } else {
        notifyError("Failed to fetch complaints");
      }
    } catch (error) {
      console.error("Error fetching complaints", error);
      notifyError("Failed to fetch complaints");
    }
  };

  const openAssignModal = (id) => {
    setSelectedComplaintId(id);
    setAssignedName("");
    setAssignedContact("");
    setModalOpen(true);
  };

  const handleAssign = async () => {
    if (!assignedName || !assignedContact) {
      notifyError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/complaints/${selectedComplaintId}/assign`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignedName, assignedContact }),
        }
      );

      const data = await res.json();
      if (data.success) {
        notifySuccess("Personnel assigned!");
        fetchComplaints();
        setModalOpen(false);
      } else {
        notifyError("Failed to assign");
      }
    } catch (error) {
      console.error("Error assigning personnel", error);
      notifyError("Error assigning personnel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h2 className="text-4xl font-extrabold text-center text-indigo-400 mb-10">
        Admin Dashboard
      </h2>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-300">No complaints found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="relative bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition"
            >
              {/* Cross button */}
              <button
                onClick={() => handleDelete(complaint.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold"
                title="Delete Complaint"
              >
                ×
              </button>

              <h3 className="text-xl font-semibold text-indigo-400 mb-2">
                {complaint.type}
              </h3>

              <div className="text-sm text-gray-300 space-y-1 mb-4">
                <p>
                  <span className="font-medium">Roll No:</span> {complaint.rollNumber}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {complaint.email}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {complaint.building} - {complaint.room}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === "Assigned"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Description:</span> {complaint.description}
                </p>
              </div>

              {complaint.assignedName ? (
                <div className="text-sm text-green-400 font-medium bg-green-900 p-2 rounded-lg">
                  Assigned to {complaint.assignedName} ({complaint.assignedContact})
                </div>
              ) : (
                <button
                  onClick={() => openAssignModal(complaint.id)}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition"
                >
                  Assign Personnel
                </button>
              )}
            </div>
          ))}

        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-indigo-400 mb-4 text-center">
              Assign Personnel
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={assignedName}
                  onChange={(e) => setAssignedName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={assignedContact}
                  onChange={(e) => setAssignedContact(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
