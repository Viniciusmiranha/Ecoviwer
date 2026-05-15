import express from "express"
import cors from "cors";
import {routes} from "./routes/plant.routes"

const app = express();
app.use(cors())
app.use(express.json())

app.use("/api/", routes); // prefixo de rota

export default app