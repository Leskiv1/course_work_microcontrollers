import express from "express";
import tripRoute from "./src/routes/trip.route.js";
import detailRoute from "./src/routes/detail.route.js";
import serverless from "serverless-http";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = `${req.method} ${req.url} - Status: ${res.statusCode} - ${duration}ms`;

        console.log(logMessage);
    });
    next();
});

app.use('/api/trip', tripRoute);
app.use('/api/detail', detailRoute);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

export const handler = serverless(app);