import React, { useState } from "react";

function Track() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    setError("");
    setStatus(null);

    if (!email || !code) {
      setError("Please enter both email and ticket ID.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/complaints/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      } else {
        setError(data.message || "Ticket not found.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching status.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Track Your Ticket</h2>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white"
        />
        <input
          type="text"
          placeholder="Ticket ID"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white"
        />
        <button
          onClick={handleTrack}
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
        >
          Track Ticket
        </button>

        {status && (
          <div className="mt-4 text-lg text-white text-center">
            <strong>Status:</strong> <span className="text-indigo-400">{status}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center font-medium">{error}</div>
        )}
      </div>
    </div>
  );
}

export default Track;
