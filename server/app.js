const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require("./routes/complaintRoutes");
const personnelRoutes = require("./routes/personnelRoutes");
const feedbackRoutes = require("./routes/feedbackRoute");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', authRoutes);
app.use("/api", complaintRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/feedback", feedbackRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
