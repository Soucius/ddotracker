import express from "express";
import cors from "cors";
import { ENV } from "./libs/env.js";
import { connectDB } from "./libs/db.js";
import userRoutes from "./routes/user.routes.js";
import measureRoutes from "./routes/measure.routes.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use("/api/users", userRoutes);
app.use("/api/measures", measureRoutes);

connectDB().then(() => {
    app.listen(ENV.PORT, () => {
        console.log(`Server started on: http://localhost:${ENV.PORT}`);
    });
});