import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const TicketForm = () => {
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    priority: "Low",
    location: "",
    type: "",
    message: "",
  });
  const location = useLocation();
  const categoryFromState = location.state?.category || "";
  const notifyError = (message) => {
    toast.error(message, { position: "top-right", autoClose: 3000 });
  };
  const notifySuccess = (message) => {
    toast.success(message, { position: "top-right", autoClose: 3000 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([file]);
      setFileName(file.name);
    }
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const email = decoded.email;

        const res = await fetch(`http://localhost:5000/api/users/${email}`);
        const data = await res.json();

        if (data.success && data.user) {
          setFormData(prev => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
            type: categoryFromState || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching user info", err);
      }
    };

    fetchUserDetails();
  }, [categoryFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, priority, location, type, message } = formData;
    if (!name || !email || !priority || !location || !type || !message) {
      notifyError("Please fill all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    if (files.length > 0) {
      files.forEach(file => form.append("attachments", file));
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
  
      const data = await res.json();
      if (data.success) {
        notifySuccess("Ticket submitted! Check your email for your 4-digit code.");
        setFormData({
          name: "",
          email: "",
          type: "",
          priority: "Low",
          location: "",
          message: "",
        });
        setFiles([]);
      } else {
        notifyError("Failed to submit ticket");
      }      
    } catch (err) {
      console.error(err);
      notifyError("Error submitting ticket");
    }
  };

  return (
    <div className="w-full max-w-7xl bg-gray-800 p-12 rounded-3xl shadow-2xl border border-gray-700">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-indigo-400">IIITA Help Desk</h1>
        <h2 className="text-2xl font-medium text-gray-300 mt-4">Submit a Ticket</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          {[

            ["Type", "type", "text"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="block text-base font-medium text-gray-300 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  readOnly={["type"].includes(name)} 
                  className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                />
            </div>
          ))}

        <div>
          <label className="block text-base font-medium text-gray-300 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-300 mb-1">Location</label>
          
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          >
            <option value="">-- Click to Select --</option>
            {[
              "Admin Building",
              "LT",
              "CC-1",
              "CC-2",
              "CC-3",
              "Library",
              "RSA",
              "Main Auditorium",
              "Director's Residence",
              "Residential (A-Block)",
              "Residential (B-Block)",
              "Residential (C-Block)",
              "Residential (D-Block)",
              "Residential (E-Block)",
              "Residential (F-Block)",
              "Residential (G-Block)",
              "Residential (H-Block)",
              "Residential (I-Block)",
              "Residential (J-Block)",
              "BH-1",
              "BH-2",
              "BH-3",
              "BH-4",
              "BH-5",
              "GH-1",
              "GH-2",
              "GH-3",
              "V. Hostel 1",
              "V. Hostel 2",
              "V. Hostel 3",
              "Health Center",
              "SAC",
              "Shopping Complex",
              "Cafateria",
              "Gate 1",
              "Gate 2",
              "Gate 3",
              "Gate 4",
              "Mini Gate",
              "Pumping Station",
              "Electric Sub-Station",
            ].map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
        </select>

        </div>

        <div>
          <label className="block text-base font-medium text-gray-300 mb-1">Message</label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-lg font-semibold mb-2">Attachments</label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="attachment"
              className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Choose File
            </label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <span className="text-white">{fileName || "No file chosen"}</span>
          </div>
        </div>



        <button
          type="submit"
          className="w-full bg-indigo-600 cursor-pointer text-white font-semibold py-3 text-lg rounded-xl hover:bg-indigo-700 transition duration-200"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
