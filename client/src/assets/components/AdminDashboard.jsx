import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [assignedName, setAssignedName] = useState("");
  const [assignedContact, setAssignedContact] = useState("");
  const [availablePersonnel, setAvailablePersonnel] = useState([]);

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

  const openAssignModal = async (id, complaintType) => {
    setSelectedComplaintId(id);
    setAssignedName("");
    setAssignedContact("");
    setModalOpen(true);

    try {
      const res = await fetch("http://localhost:5000/api/personnel");
      const data = await res.json();
      if (data.success) {
        const filtered = data.data.filter(
          (p) => p.available && p.role.toLowerCase() === complaintType.toLowerCase()
        );
        setAvailablePersonnel(filtered);
      } else {
        notifyError("Failed to fetch personnel");
      }
    } catch (error) {
      console.error("Error fetching personnel", error);
      notifyError("Error fetching personnel");
    }
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
    <div className="min-h-screen w-full overflow-x-hidden  p-8">
      <h2 className="text-4xl font-extrabold text-center text-indigo-400 mb-10">
        Admin Dashboard
      </h2>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-300">No complaints found.</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="relative min-h-[320px] bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition"
            >
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
                <p><span className="font-medium">ID:</span> {complaint.id}</p>
                <p><span className="font-medium">Name:</span> {complaint.name}</p>
                <p><span className="font-medium">Email:</span> {complaint.email}</p>
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
                      className="text-indigo-400 underline"
                    >
                      View
                    </a>
                  </p>
                )}
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs font-semibold ${complaint.status === "Assigned" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {complaint.status}
                  </span>
                </p>
              </div>

              {complaint.assigned_personnel_id ? (
                <div className="text-sm text-green-400 font-medium bg-green-900 p-2 rounded-lg">
                  Assigned 
                </div>
              ) : (
                <button
                  onClick={() => openAssignModal(complaint.id, complaint.type)}
                  className="cursor-pointer w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition"
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
          <div className="relative bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
            <button
              onClick={() => setModalOpen(false)}
              className="cursor-pointer absolute top-2 left-2 text-gray-400 hover:text-red-500 text-xl font-bold"
              title="Close Modal"
            >
              ×
            </button>

            <h3 className="cursor-pointer text-xl font-bold text-indigo-400 mb-4 text-center">
              Assign Personnel
            </h3>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1">
                Select Personnel
              </label>

              <select
                value={assignedName ? availablePersonnel.find(p => p.name === assignedName)?.id || "" : ""}
                onChange={(e) => {
                  const selected = availablePersonnel.find(p => p.id === parseInt(e.target.value));
                  if (selected) {
                    setAssignedName(selected.name);
                    setAssignedContact(selected.contact);
                  }
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Select --</option>
                {availablePersonnel.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.contact}) - {p.role}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="cursor-pointer mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Assign
              </button>

              {availablePersonnel.length === 0 && (
                <p className="text-sm text-red-400 mt-2">
                  No available personnel match this complaint type.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
