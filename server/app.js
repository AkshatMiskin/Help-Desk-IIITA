const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require("./routes/complaintRoutes");
const personnelRoutes = require("./routes/personnelRoutes");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', userRoutes);
app.use("/api", complaintRoutes);
app.use("/api/personnel", personnelRoutes);

// // Serve frontend
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
