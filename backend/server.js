const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const emissionRoute = require("./routes/emission");
const historyRoute = require('./routes/history');
const vehicleRoutes = require('./routes/vehicle');
const maintenanceRoutes = require('./routes/maintenance');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use("/api", emissionRoute);
app.use('/api', historyRoute); 
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
