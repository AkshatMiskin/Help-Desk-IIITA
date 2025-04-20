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
  const [addPersonnelModal, setAddPersonnelModal] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    name: "",
    contact: "",
    role: "",
  });

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

  const resolve = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "PATCH", // changed from DELETE
      });
  
      const data = await res.json();
  
      if (res.ok && data.success) {
        notifySuccess(data.message || "Complaint marked as resolved");
  
        // Remove the resolved complaint from UI without re-fetch
        setComplaints(prev => prev.filter(c => c.id !== id));
      } else {
        notifyError(data.message || "Failed to mark as resolved");
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
      notifyError("An error occurred while resolving the complaint.");
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

  const handleAddPersonnel = async () => {
    const { name, contact, role } = newPersonnel;
    if (!name || !contact || !role) {
      notifyError("All fields are required");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, role }),
      });
  
      const data = await res.json();
      if (data.success) {
        notifySuccess("Personnel added successfully");
        setAddPersonnelModal(false);
        setNewPersonnel({ name: "", contact: "", role: "" });
      } else {
        notifyError(data.message || "Failed to add personnel");
      }
    } catch (error) {
      console.error("Error adding personnel", error);
      notifyError("Something went wrong while adding personnel");
    }
  };
  
  return (
    <div className="min-h-screen w-full overflow-x-hidden  p-8">
      <div className="flex items-center mb-10 w-full">
        <h2 className="text-4xl font-extrabold text-indigo-400">Admin Dashboard</h2>
      </div>
      <div className="flex justify-end mb-4">
        <button
            onClick={() => setAddPersonnelModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 ml-auto rounded-lg transition"
          >
            + Add Personnel
          </button>
      </div>

      {complaints.filter(c => c.status !== "Resolved").length === 0 ? (
        <p className="text-center text-gray-300">No complaints found.</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints
            .filter((complaint) => complaint.status !== "Resolved")
            .map((complaint) => (
              <div
                key={complaint.id}
                className="relative min-h-[320px] bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center justify-between">
                  <span>{complaint.complaint_type}</span>
                  <span
                    className={`ml-2 text-sm font-medium px-2 py-1 rounded-full ${
                      complaint.priority === "High"
                        ? "bg-red-500/20 text-red-400"
                        : complaint.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {complaint.priority}
                  </span>
                </h3>


                <div className="text-sm text-gray-300 space-y-4 mb-4">
                  {/* User Info */}
                  <div className="space-y-1 bg-gray-700/50 p-4 rounded-xl shadow-sm">
                    <h4 className="text-indigo-300 text-base font-semibold mb-1 flex items-center gap-2">
                      <i className="fas fa-user"></i> User Info
                    </h4>
                    <p><span className="font-medium text-gray-200">Name:</span> {complaint.name}</p>
                    <p><span className="font-medium text-gray-200">Email:</span> {complaint.email}</p>
                    <p><span className="font-medium text-gray-200">Location:</span> {complaint.location}</p>
                  </div>

                    {/* Complaint Details */}
                    <div className="space-y-1 bg-gray-700/50 p-4 rounded-xl shadow-sm">
                      <h4 className="text-indigo-300 text-base font-semibold mb-1 flex items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i> Message
                      </h4>
                      <p><span className="font-medium text-gray-200">Message:</span> {complaint.message}</p>
                      {complaint.attachments && (
                        <p>
                          <span className="font-medium text-gray-200">Attachment:</span>{" "}
                          <a
                            href={`http://localhost:5000/uploads/${complaint.attachments}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 underline hover:text-indigo-300 transition"
                          >
                            View
                          </a>
                        </p>
                      )}
                    </div>

                    {/* Assignment Info */}
                    <div className="space-y-1 bg-gray-700/50 p-4 rounded-xl shadow-sm">
                      <h4 className="text-indigo-300 text-base font-semibold mb-1 flex items-center gap-2">
                        <i className="fas fa-user-check"></i> Assigned Personnel
                      </h4>
                      <p><span className="font-medium text-gray-200">Name:</span> {complaint.assigned_name ?? "N/A"}</p>
                      <p><span className="font-medium text-gray-200">Contact:</span> {complaint.assigned_contact ?? "N/A"}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-1 bg-gray-700/50 p-4 rounded-xl shadow-sm">
                      <h4 className="text-indigo-300 text-base font-semibold mb-1 flex items-center gap-2">
                        <i className="fas fa-clock"></i> Meta Info
                      </h4>
                      <p>
                        <span className="font-medium text-gray-200">Created At:</span>{" "}
                        {new Date(complaint.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-200">Status:</span>
                        <span
                          className={`ml-2 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            complaint.status === "Assigned"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </p>
                    </div>
                  </div>


                {complaint.assigned_personnel_id ? (
                  <button
                    onClick={() => resolve(complaint.id)}
                    className="cursor-pointer text-green-400 w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition"
                  >
                    Resolve
                  </button>
                ) : (
                  <button
                    onClick={() => openAssignModal(complaint.id, complaint.complaint_type)}
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

      {addPersonnelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
            <button
              onClick={() => setAddPersonnelModal(false)}
              className="cursor-pointer absolute top-2 left-2 text-gray-400 hover:text-red-500 text-xl font-bold"
              title="Close Modal"
            >
              ×
            </button>

            <h3 className="text-xl cursor pointer font-bold text-indigo-400 mb-4 text-center">Add Personnel</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newPersonnel.name}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Contact"
                value={newPersonnel.contact}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, contact: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white outline-none"
              />
              <select
                value={newPersonnel.role}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white outline-none"
              >
                <option value="">Select Role</option>
                <option value="Network">Network</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Carpentry">Carpentry</option>
                <option value="PC Maintenance">PC Maintenance</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electricity">Electricity</option>
              </select>


              <button
                onClick={handleAddPersonnel}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Add Personnel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
